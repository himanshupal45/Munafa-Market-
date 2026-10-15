const express = require('express')
const mongoose = require('mongoose')
const router = express.Router()

const { protect, adminOnly } = require('../middleware/auth')
const User = require('../models/User')
const DepositRequest = require('../models/DepositRequest')
const WalletTransaction = require('../models/WalletTransaction')

// ⚠️ Wahi field jo bets.js / ledger.js me hai
const WALLET_FIELD = 'wallet'

const MIN_AMOUNT = 100
const MAX_AMOUNT = 50000
const MAX_PENDING_PER_USER = 5
const PAYMENT_APPS = ['phonepe', 'gpay', 'paytm', 'upi-qr']

// ---------- GET /api/deposit-requests/ping  (DEBUG — route load hua ya nahi) ----------
router.get('/ping', async (req, res) => {
  try {
    const total = await DepositRequest.countDocuments()
    const pending = await DepositRequest.countDocuments({ status: 'pending' })
    res.json({ success: true, message: 'deposit-requests route chal raha hai ✅', total, pending })
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
})

// ---------- POST /api/deposit-requests  (USER) ----------
// body: { amount, utr, paymentApp? }
router.post('/', protect, async (req, res) => {
  try {
    console.log('💰 DEPOSIT REQUEST aayi:', { user: req.user?._id, body: req.body })
    const amount = Number(req.body.amount)
    const utr = String(req.body.utr || '').trim().toUpperCase()
    const paymentApp = PAYMENT_APPS.includes(req.body.paymentApp) ? req.body.paymentApp : ''

    if (!Number.isFinite(amount) || amount < MIN_AMOUNT || amount > MAX_AMOUNT)
      return res.status(400).json({
        success: false,
        message: `Amount ${MIN_AMOUNT} se ${MAX_AMOUNT} ke beech me daalo`,
      })

    // ✅ 8 se 22 akshar (aapka form bhi 8 se allow karta hai)
    if (!/^[A-Z0-9]{8,22}$/.test(utr))
      return res.status(400).json({
        success: false,
        message: 'UTR / Transaction ID sahi daalo (8 se 22 akshar)',
      })

    const pending = await DepositRequest.countDocuments({
      user: req.user._id,
      status: 'pending',
    })
    if (pending >= MAX_PENDING_PER_USER)
      return res.status(429).json({
        success: false,
        message: 'Pehle ki pending requests approve hone do',
      })

    const doc = await DepositRequest.create({
      user: req.user._id,
      userName: req.user.name,
      userMobile: req.user.mobile,
      amount,
      utr,
      method: 'upi',
      paymentApp,
    })

    console.log('✅ DEPOSIT REQUEST save hui:', doc._id.toString())

    res.status(201).json({
      success: true,
      message: 'Request bhej di gayi. Admin approve karega to points mil jayenge.',
      request: doc,
    })
  } catch (err) {
    if (err.code === 11000)
      return res.status(409).json({
        success: false,
        message: 'Ye UTR pehle hi use ho chuka hai',
      })
    console.error(err)
    res.status(500).json({ success: false, message: err.message || 'Server error' })
  }
})

// ---------- GET /api/deposit-requests/mine  (USER) ----------
router.get('/mine', protect, async (req, res) => {
  try {
    const requests = await DepositRequest.find({ user: req.user._id })
      .sort({ createdAt: -1 })
      .limit(50)
      .lean()
    res.json({ success: true, requests })
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
})

// ---------- GET /api/deposit-requests  (ADMIN) ?status=&method= ----------
router.get('/', protect, adminOnly, async (req, res) => {
  try {
    const q = {}
    if (['pending', 'approved', 'rejected'].includes(req.query.status))
      q.status = req.query.status

    // Purani requests me `method` field nahi hai — wo UPI hi maani jayengi
    if (req.query.method === 'upi')
      q.$or = [{ method: 'upi' }, { method: { $exists: false } }]
    else if (req.query.method === 'qr')
      q.method = 'qr'

    const requests = await DepositRequest.find(q)
      .sort({ createdAt: -1 })
      .limit(500)
      .lean()

    res.json({ success: true, requests })
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
})

// ---------- PUT /api/deposit-requests/:id  (ADMIN — approve/reject) ----------
router.put('/:id', protect, adminOnly, async (req, res) => {
  const session = await mongoose.startSession()
  try {
    const { status, note } = req.body

    if (!mongoose.isValidObjectId(req.params.id))
      return res.status(400).json({ success: false, message: 'Galat id' })

    if (!['approved', 'rejected'].includes(status))
      return res.status(400).json({ success: false, message: 'Status galat hai' })

    let result
    await session.withTransaction(async () => {
      // Sirf PENDING request hi process hogi
      const dep = await DepositRequest.findOneAndUpdate(
        { _id: req.params.id, status: 'pending' },
        {
          status,
          note: note || '',
          processedBy: req.user._id,
          processedAt: new Date(),
        },
        { new: true, session }
      )
      if (!dep) throw new Error('ALREADY_PROCESSED')

      if (status === 'approved') {
        const user = await User.findByIdAndUpdate(
          dep.user,
          { $inc: { [WALLET_FIELD]: dep.amount } },
          { new: true, session }
        )
        if (!user) throw new Error('USER_NOT_FOUND')

        await WalletTransaction.create(
          [{
            user: user._id,
            type: 'credit',
            points: dep.amount,
            balanceAfter: user[WALLET_FIELD],
            note: `Deposit approved (UTR ${dep.utr})`,
            source: 'deposit',
            amount: dep.amount,
            method: 'upi',
            paymentId: dep.utr,
            createdBy: req.user._id,
          }],
          { session }
        )
      }

      result = dep
    })

    res.json({ success: true, request: result })
  } catch (err) {
    if (err.message === 'ALREADY_PROCESSED')
      return res.status(409).json({
        success: false,
        message: 'Ye request pehle hi process ho chuki hai',
      })
    if (err.message === 'USER_NOT_FOUND')
      return res.status(404).json({ success: false, message: 'User nahi mila' })
    console.error(err)
    res.status(500).json({ success: false, message: err.message || 'Server error' })
  } finally {
    session.endSession()
  }
})

module.exports = router