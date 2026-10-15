const express = require('express')
const mongoose = require('mongoose')
const router = express.Router()

const { protect, adminOnly } = require('../middleware/auth')
const Game = require('../models/Game')
const GameRate = require('../models/GameRate')
const User = require('../models/User')
const Bet = require('../models/Bet')
const WalletTransaction = require('../models/WalletTransaction')
const { checkBetting } = require('../utils/gameTime') // ✅ naya

// ⚠️ Aapke User model me wallet ka field jo bhi ho wahi likho (wallet / walletBalance / balance)
const WALLET_FIELD = 'wallet'
const MAX_BETS_PER_REQUEST = 100

// ---------- Validation (server par bhi, client par bharosa nahi) ----------
const VALID_PANAS = (() => {
  const rank = (d) => (d === 0 ? 10 : d)
  const out = []
  for (let a = 0; a <= 9; a++)
    for (let b = 0; b <= 9; b++)
      for (let c = 0; c <= 9; c++)
        if (rank(a) <= rank(b) && rank(b) <= rank(c)) out.push(`${a}${b}${c}`)
  return new Set(out)
})()

const panaKind = (p) => {
  const u = new Set(p).size
  return u === 1 ? 'triple' : u === 2 ? 'double' : 'single'
}

const getRule = (rate) => {
  const t = `${rate.key || ''} ${rate.label || ''}`.toLowerCase()
  if (t.includes('panel') || t.includes('group')) return { len: 3, kind: 'panel' }
  if (t.includes('triple')) return { len: 3, kind: 'triple' }
  if (t.includes('double')) return { len: 3, kind: 'double' }
  if (t.includes('pana') || t.includes('patti') || t.includes('panna')) return { len: 3, kind: 'single' }
  if (t.includes('jodi')) return { len: 2, kind: 'jodi' }
  return { len: 1, kind: 'digit' }
}

const digitError = (digit, rule) => {
  if (typeof digit !== 'string' || !/^\d+$/.test(digit) || digit.length !== rule.len)
    return `${rule.len} ank ka number chahiye`
  if (['single', 'double', 'triple'].includes(rule.kind)) {
    if (!VALID_PANAS.has(digit)) return `${digit} valid pana nahi hai`
    if (panaKind(digit) !== rule.kind) return `${digit} ${rule.kind} pana nahi hai`
  }
  return null
}

const todayIST = () => new Date(Date.now() + 5.5 * 3600 * 1000).toISOString().slice(0, 10)

// ---------- POST /api/games/bets  (user ki bet save) ----------
router.post('/', protect, async (req, res) => {
  const session = await mongoose.startSession()
  try {
    const { gameId, session: sess, type, bets } = req.body

    if (!mongoose.isValidObjectId(gameId))
      return res.status(400).json({ success: false, message: 'Game galat hai' })
    if (!['open', 'close'].includes(sess))
      return res.status(400).json({ success: false, message: 'Session galat hai' })
    if (!Array.isArray(bets) || bets.length === 0)
      return res.status(400).json({ success: false, message: 'Koi bet nahi mili' })
    if (bets.length > MAX_BETS_PER_REQUEST)
      return res.status(400).json({ success: false, message: `Ek baar me max ${MAX_BETS_PER_REQUEST} bets` })

    const [game, rate] = await Promise.all([
      Game.findById(gameId).lean(),
      GameRate.findOne({ key: type }).lean(),
    ])
    if (!game) return res.status(404).json({ success: false, message: 'Game nahi mila' })
    if (!rate) return res.status(404).json({ success: false, message: 'Ye game option nahi mila' })
    if (sess === 'close' && !game.closeTime)
      return res.status(400).json({ success: false, message: 'Is game me close session nahi hai' })

    // ✅ TIME CHECK: wallet kaatne se pehle
    if (game.status === 'Inactive')
      return res.status(400).json({ success: false, message: 'Game abhi band hai' })
    const timeCheck = checkBetting(game)
    if (!timeCheck.ok)
      return res.status(400).json({ success: false, message: timeCheck.message })

    const rule = getRule(rate)
    let total = 0
    for (const b of bets) {
      const err = digitError(String(b.digit), rule)
      if (err) return res.status(400).json({ success: false, message: err })
      const pts = Number(b.points)
      if (!Number.isInteger(pts) || pts <= 0)
        return res.status(400).json({ success: false, message: 'Points galat hain' })
      total += pts
    }

    const date = todayIST()
    // User ke naam/mobile ke saath docs — wallet kaatne ke baad jo user mila, usse liye jate hain
    const makeDocs = (u) => bets.map((b) => ({
      user: u._id,
      userName: u.name,
      userMobile: u.mobile,
      game: game._id,
      gameName: game.name,
      betNumber: String(b.digit),        // user ka number
      betAmount: Number(b.points),       // user ke points
      status: 'Pending',
      betDate: new Date(),
      session: sess,
      type: rate.key,
      typeLabel: rate.label,
      rate: { bet: rate.value1, win: rate.value2 },
      date,
    }))

    // Wallet kam karna + bets save — ek saath (dono hon ya koi nahi)
    let newBalance
    await session.withTransaction(async () => {
      const user = await User.findOneAndUpdate(
        { _id: req.user._id, [WALLET_FIELD]: { $gte: total } },
        { $inc: { [WALLET_FIELD]: -total } },
        { new: true, session }
      )
      if (!user) throw new Error('INSUFFICIENT_BALANCE')
      newBalance = user[WALLET_FIELD]
      await Bet.insertMany(makeDocs(user), { session })

      // Wallet history me entry (debit)
      await WalletTransaction.create(
        [{
          user: user._id,
          type: 'debit',
          points: total,
          balanceAfter: newBalance,
          note: `Bet: ${game.name} - ${rate.label} (${bets.length} bet${bets.length > 1 ? 's' : ''})`,
          source: 'bet',
        }],
        { session }
      )
    })

    res.status(201).json({
      success: true,
      message: 'Bet lag gayi',
      count: bets.length,
      totalPoints: total,
      balance: newBalance,
    })
  } catch (err) {
    if (err.message === 'INSUFFICIENT_BALANCE')
      return res.status(400).json({ success: false, message: 'Wallet balance kam hai' })
    console.error(err)
    res.status(500).json({ success: false, message: err.message || 'Server error' })
  } finally {
    session.endSession()
  }
})

// ---------- GET /api/games/bets/mine  (user ki apni bets) ----------
router.get('/mine', protect, async (req, res) => {
  try {
    const { gameId, type, today } = req.query
    const q = { user: req.user._id }
    if (gameId && mongoose.isValidObjectId(gameId)) q.game = gameId
    if (type) q.type = type
    if (today === '1') q.date = todayIST()

    const bets = await Bet.find(q).sort({ createdAt: -1 }).limit(200).lean()
    res.json({ success: true, bets })
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
})

// ---------- GET /api/games/bets/all  (ADMIN — sab users ki bets) ----------
// Query: date=YYYY-MM-DD, gameId, session=open|close
router.get('/all', protect, adminOnly, async (req, res) => {
  try {
    const { date, gameId, session } = req.query
    const q = {}

    const and = []
    if (date) {
      // naye docs me `date` field hai; purane me sirf betDate — dono chalein
      const start = new Date(`${date}T00:00:00+05:30`)
      const end = new Date(start.getTime() + 24 * 3600 * 1000)
      and.push({ $or: [{ date }, { betDate: { $gte: start, $lt: end } }] })
    }
    if (/^\d{4}-\d{2}-\d{2}$/.test(req.query.from || '')) {
      // from = us din se aaj tak
      const from = req.query.from
      and.push({ $or: [{ date: { $gte: from } }, { betDate: { $gte: new Date(`${from}T00:00:00+05:30`) } }] })
    }
    if (['Pending', 'Won', 'Lost', 'Refunded'].includes(req.query.status)) q.status = req.query.status
    if (and.length) q.$and = and
    if (gameId && mongoose.isValidObjectId(gameId)) q.game = gameId
    if (['open', 'close'].includes(session)) q.session = session
    if (req.query.userId) {
      // ObjectId ya custom userId (jaise "DA1001") — dono chalenge
      let uid = mongoose.isValidObjectId(req.query.userId) ? req.query.userId : null
      if (!uid) {
        const u = await User.findOne({ userId: String(req.query.userId) }).select('_id').lean()
        uid = u ? u._id : null
      }
      q.user = uid || new mongoose.Types.ObjectId() // user na mile to khali list
    }

    const list = await Bet.find(q)
      .populate('user', 'name mobile')
      .sort({ createdAt: -1 })
      .limit(2000)
      .lean()

    const bets = list.map((b) => ({
      _id: b._id,
      userId: b.user?._id || b.user,
      userName: b.userName || b.user?.name || '-',
      userMobile: b.userMobile || b.user?.mobile || '',
      gameId: b.game,
      gameName: b.gameName,
      type: b.type,
      typeLabel: b.typeLabel,
      session: b.session,
      betNumber: b.betNumber,
      betAmount: b.betAmount,
      rate: b.rate,
      status: b.status,
      winAmount: b.winAmount || 0,
      placedAt: b.createdAt,
      date: b.date || (b.betDate ? new Date(b.betDate).toISOString().slice(0, 10) : ''),
    }))

    res.json({ success: true, bets })
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
})

module.exports = router