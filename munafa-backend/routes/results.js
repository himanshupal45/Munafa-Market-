const express = require('express')
const mongoose = require('mongoose')
const router = express.Router()

const { protect, adminOnly } = require('../middleware/auth')
const Game = require('../models/Game')
const DeclaredResult = require('../models/DeclaredResult')
const { settleBets } = require('../utils/settleBets')

// ---------- Helpers ----------
const VALID_PANAS = (() => {
  const rank = (d) => (d === 0 ? 10 : d)
  const out = []
  for (let a = 0; a <= 9; a++)
    for (let b = 0; b <= 9; b++)
      for (let c = 0; c <= 9; c++)
        if (rank(a) <= rank(b) && rank(b) <= rank(c)) out.push(`${a}${b}${c}`)
  return new Set(out)
})()

// Pana ke teeno ank ka sum, aakhri ank
const digitOf = (pana) =>
  pana ? String([...pana].reduce((s, n) => s + Number(n), 0) % 10) : null

// "123-65-456"  (open pana - open digit + close digit - close pana)
const formatResult = (openPana, closePana) => {
  if (!openPana && !closePana) return ''
  const oD = digitOf(openPana) ?? '*'
  const cD = digitOf(closePana) ?? '*'
  return `${openPana || '***'}-${oD}${cD}-${closePana || '***'}`
}

const todayIST = () => new Date(Date.now() + 5.5 * 3600 * 1000).toISOString().slice(0, 10)

// ---------- GET /api/games/results  (PUBLIC — sirf published) ----------
router.get('/', async (req, res) => {
  try {
    const limit = Math.min(Number(req.query.limit) || 50, 500)
    const docs = await DeclaredResult.find({ isPublished: true })
      .sort({ updatedAt: -1 })
      .limit(limit)
      .lean()

    const results = docs.map((d) => ({ ...d, gameId: d.game }))
    res.json({ success: true, results })
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
})

// ---------- POST /api/games/results  (ADMIN — result declare) ----------
// body: { gameId, session: 'open'|'close', pana, date? }
router.post('/', protect, adminOnly, async (req, res) => {
  try {
    const { gameId, session, pana, date } = req.body

    if (!mongoose.isValidObjectId(gameId))
      return res.status(400).json({ success: false, message: 'Game galat hai' })
    if (!['open', 'close'].includes(session))
      return res.status(400).json({ success: false, message: 'Session galat hai' })
    if (!VALID_PANAS.has(String(pana)))
      return res.status(400).json({ success: false, message: 'Ye valid pana nahi hai' })

    const game = await Game.findById(gameId).lean()
    if (!game) return res.status(404).json({ success: false, message: 'Game nahi mila' })

    const day = /^\d{4}-\d{2}-\d{2}$/.test(date || '') ? date : todayIST()

    // Us game + din ka document dhundo, na mile to naya banao
    let doc = await DeclaredResult.findOne({ game: game._id, date: day })
    if (!doc) doc = new DeclaredResult({ game: game._id, gameName: game.name, date: day })

    // Ek session ka result sirf ek baar (warna bets do baar settle ho jayengi)
    if (session === 'open' && doc.openPana)
      return res.status(409).json({ success: false, message: 'Is din ka OPEN result pehle hi declare ho chuka hai' })
    if (session === 'close' && doc.closePana)
      return res.status(409).json({ success: false, message: 'Is din ka CLOSE result pehle hi declare ho chuka hai' })

    if (session === 'open') {
      doc.openPana = String(pana)
      doc.openDigit = digitOf(String(pana))
    } else {
      doc.closePana = String(pana)
      doc.closeDigit = digitOf(String(pana))
    }

    doc.result = formatResult(doc.openPana, doc.closePana)
    doc.isPublished = true // declare karte hi users ko dikhne lage
    await doc.save()

    // ✅ Bets ka hisaab: jeete / haare, aur jeetne walon ko paisa
    let settled = null
    try {
      settled = await settleBets({ game, date: day, doc, adminId: req.user._id })
    } catch (e) {
      console.error('settleBets error:', e)
    }

    res.status(201).json({ success: true, result: doc, settled })
  } catch (err) {
    console.error(err)
    res.status(500).json({ success: false, message: err.message })
  }
})

// ---------- PUT /api/games/results/:id/publish  (ADMIN) ----------
router.put('/:id/publish', protect, adminOnly, async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id))
      return res.status(400).json({ success: false, message: 'Galat id' })
    const doc = await DeclaredResult.findByIdAndUpdate(
      req.params.id,
      { isPublished: true },
      { new: true }
    )
    if (!doc) return res.status(404).json({ success: false, message: 'Result nahi mila' })
    res.json({ success: true, result: doc })
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
})

module.exports = router