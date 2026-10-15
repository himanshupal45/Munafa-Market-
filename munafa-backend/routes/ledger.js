const express = require('express')
const mongoose = require('mongoose')
const router = express.Router()

const { protect, adminOnly } = require('../middleware/auth')
const User = require('../models/User')
const WalletTransaction = require('../models/WalletTransaction')

// Aapke User model me wallet ka field (Atlas me `wallet` hai)
const WALLET_FIELD = 'wallet'

const typeFilter = (type) => (['credit', 'debit'].includes(type) ? { type } : {})

// URL me ObjectId bhi chalega aur custom userId (jaise "DA1001") bhi
const resolveUserId = async (param) => {
  if (mongoose.isValidObjectId(param)) return param
  const u = await User.findOne({ userId: String(param) }).select('_id').lean()
  return u ? u._id : null
}

// ---------- GET /api/ledger/me  (USER — apni wallet history) ----------
router.get('/me', protect, async (req, res) => {
  try {
    const q = { user: req.user._id, ...typeFilter(req.query.type) }
    const [transactions, user] = await Promise.all([
      WalletTransaction.find(q).sort({ createdAt: -1 }).limit(500).lean(),
      User.findById(req.user._id).select(WALLET_FIELD).lean(),
    ])
    res.json({ success: true, balance: Number(user?.[WALLET_FIELD] ?? 0), transactions })
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
})

// ---------- GET /api/ledger/user/:id  (ADMIN — kisi user ki wallet history) ----------
router.get('/user/:id', protect, adminOnly, async (req, res) => {
  try {
    const uid = await resolveUserId(req.params.id)
    if (!uid) return res.status(404).json({ success: false, message: 'User nahi mila' })
    const q = { user: uid, ...typeFilter(req.query.type) }
    const transactions = await WalletTransaction.find(q).sort({ createdAt: -1 }).limit(500).lean()
    res.json({ success: true, transactions })
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
})

// ---------- GET /api/ledger/user/:id/profile  (ADMIN — user ki details) ----------
router.get('/user/:id/profile', protect, adminOnly, async (req, res) => {
  try {
    const uid = await resolveUserId(req.params.id)
    if (!uid) return res.status(404).json({ success: false, message: 'User nahi mila' })
    const u = await User.findById(uid).lean()
    if (!u) return res.status(404).json({ success: false, message: 'User nahi mila' })

    // Payment fields (user document me ho to aayengi, warna khali)
    const pay = u.paymentDetails || u.bankDetails || u.payment || {}
    const get = (k) => pay[k] ?? u[k] ?? ''

    res.json({
      success: true,
      user: {
        id: u._id,
        userCode: u.userId || '',
        fullName: u.name || u.fullName || '',
        email: u.email || '',
        mobile: u.mobile || u.phone || '',
        registrationDate: u.createdAt,
        userStatus: u.status != null ? String(u.status).toLowerCase() === 'active' : (u.isActive ?? true),
        bettingStatus: u.bettingStatus ?? u.isBettingEnabled ?? true,
        walletBalance: Number(u[WALLET_FIELD] ?? 0),
        accountHolderName: get('accountHolderName'),
        accountNumber: get('accountNumber'),
        ifscCode: get('ifscCode'),
        upi: get('upi'),
        paytm: get('paytm'),
        phonepe: get('phonepe'),
        gpay: get('gpay'),
      },
    })
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
})

// ---------- POST /api/ledger/user/:id/adjust  (ADMIN — points add / withdraw) ----------
// body: { points: 500, type: 'credit' | 'debit', note? }
router.post('/user/:id/adjust', protect, adminOnly, async (req, res) => {
  const session = await mongoose.startSession()
  try {
    const { type, note } = req.body
    const points = Number(req.body.points)

    if (!['credit', 'debit'].includes(type))
      return res.status(400).json({ success: false, message: 'Type galat hai' })
    if (!Number.isFinite(points) || points <= 0)
      return res.status(400).json({ success: false, message: 'Points sahi daalo' })

    const uid = await resolveUserId(req.params.id)
    if (!uid) return res.status(404).json({ success: false, message: 'User nahi mila' })

    let newBalance
    let tx
    await session.withTransaction(async () => {
      const filter = { _id: uid }
      if (type === 'debit') filter[WALLET_FIELD] = { $gte: points } // balance se zyada nahi kaat sakte

      const user = await User.findOneAndUpdate(
        filter,
        { $inc: { [WALLET_FIELD]: type === 'credit' ? points : -points } },
        { new: true, session }
      )
      if (!user) throw new Error(type === 'debit' ? 'INSUFFICIENT_BALANCE' : 'USER_NOT_FOUND')

      newBalance = user[WALLET_FIELD]
      const [created] = await WalletTransaction.create(
        [{
          user: user._id,
          type,
          points,
          balanceAfter: newBalance,
          note: (note && String(note).trim()) || (type === 'credit' ? 'Points added by admin' : 'Points withdrawn by admin'),
          source: 'admin',
          createdBy: req.user._id,
        }],
        { session }
      )
      tx = created
    })

    res.status(201).json({ success: true, balance: newBalance, transaction: tx })
  } catch (err) {
    if (err.message === 'INSUFFICIENT_BALANCE')
      return res.status(400).json({ success: false, message: 'User ke wallet me itne points nahi hain' })
    if (err.message === 'USER_NOT_FOUND')
      return res.status(404).json({ success: false, message: 'User nahi mila' })
    console.error(err)
    res.status(500).json({ success: false, message: err.message || 'Server error' })
  } finally {
    session.endSession()
  }
})

module.exports = router