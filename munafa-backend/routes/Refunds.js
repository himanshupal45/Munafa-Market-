const express = require('express')
const mongoose = require('mongoose')
const router = express.Router()

const { protect, adminOnly } = require('../middleware/auth')
const User = require('../models/User')
const Game = require('../models/Game')
const Bet = require('../models/Bet')
const Refund = require('../models/Refund')
const WalletTransaction = require('../models/WalletTransaction')

const WALLET_FIELD = 'wallet' // ⚠️ wahi field

// ---------- GET /api/refunds  (ADMIN) ----------
router.get('/', protect, adminOnly, async (req, res) => {
  try {
    const refunds = await Refund.find().sort({ createdAt: -1 }).limit(500).lean()
    res.json({ success: true, refunds })
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
})

// ---------- POST /api/refunds/game  (ADMIN) ----------
// body: { gameId, date: 'YYYY-MM-DD' } — us game ki us din ki saari PENDING bets ka paisa wapas
router.post('/game', protect, adminOnly, async (req, res) => {
  const session = await mongoose.startSession()
  try {
    const { gameId, date } = req.body
    if (!mongoose.isValidObjectId(gameId))
      return res.status(400).json({ success: false, message: 'Game galat hai' })
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date || ''))
      return res.status(400).json({ success: false, message: 'Date sahi daalo' })

    const game = await Game.findById(gameId).lean()
    if (!game) return res.status(404).json({ success: false, message: 'Game nahi mila' })

    const start = new Date(`${date}T00:00:00+05:30`)
    const end = new Date(start.getTime() + 24 * 3600 * 1000)

    let refundedBets = 0
    let totalAmount = 0
    let usersCount = 0

    await session.withTransaction(async () => {
      const bets = await Bet.find({
        game: game._id,
        status: 'Pending',
        $or: [{ date }, { betDate: { $gte: start, $lt: end } }],
      }).session(session)
      if (!bets.length) throw new Error('NO_BETS')

      // User ke hisaab se jod lo
      const byUser = new Map()
      bets.forEach((b) => {
        const k = String(b.user)
        const e = byUser.get(k) || { user: b.user, total: 0 }
        e.total += b.betAmount
        byUser.set(k, e)
      })

      const okUsers = new Map() // user id -> user doc
      for (const [k, e] of byUser) {
        const user = await User.findByIdAndUpdate(e.user, { $inc: { [WALLET_FIELD]: e.total } }, { new: true, session })
        if (!user) continue
        okUsers.set(k, user)
        await WalletTransaction.create(
          [{
            user: user._id, type: 'credit', points: e.total, balanceAfter: user[WALLET_FIELD],
            note: `Refund: ${game.name} (${date})`, source: 'refund', createdBy: req.user._id,
          }],
          { session }
        )
      }

      const refundBets = bets.filter((b) => okUsers.has(String(b.user)))
      await Refund.insertMany(
        refundBets.map((b) => {
          const u = okUsers.get(String(b.user))
          return {
            user: b.user, userName: b.userName || u.name, userMobile: b.userMobile || u.mobile,
            game: game._id, gameName: game.name, bet: b._id, amount: b.betAmount, date, refundedBy: req.user._id,
          }
        }),
        { session }
      )
      await Bet.updateMany({ _id: { $in: refundBets.map((b) => b._id) } }, { status: 'Refunded' }, { session })

      refundedBets = refundBets.length
      totalAmount = refundBets.reduce((s, b) => s + b.betAmount, 0)
      usersCount = okUsers.size
    })

    res.status(201).json({ success: true, refundedBets, totalAmount, usersCount })
  } catch (err) {
    if (err.message === 'NO_BETS')
      return res.status(404).json({ success: false, message: 'Is game / din ki koi pending bet nahi mili' })
    console.error(err)
    res.status(500).json({ success: false, message: err.message || 'Server error' })
  } finally {
    session.endSession()
  }
})

module.exports = router