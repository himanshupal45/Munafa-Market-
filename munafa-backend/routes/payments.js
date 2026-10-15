const express = require('express')
const mongoose = require('mongoose')
const crypto = require('crypto')
const router = express.Router()

const { protect } = require('../middleware/auth')
const User = require('../models/User')
const WalletTransaction = require('../models/WalletTransaction')

// ⚠️ Wahi field jo bets.js / ledger.js me hai
const WALLET_FIELD = 'wallet'

// ---------- Razorpay config ----------
const RAZORPAY_KEY_ID = process.env.RAZORPAY_KEY_ID || ''
const RAZORPAY_KEY_SECRET = process.env.RAZORPAY_KEY_SECRET || ''

let Razorpay = null
try { Razorpay = require('razorpay') } catch (e) { /* not installed */ }

const razorpay =
  Razorpay && RAZORPAY_KEY_ID && RAZORPAY_KEY_SECRET
    ? new Razorpay({ key_id: RAZORPAY_KEY_ID, key_secret: RAZORPAY_KEY_SECRET })
    : null

const POINTS_PER_RUPEE = 1
const MIN_AMOUNT = 10
const MAX_AMOUNT = 50000

// ---------- GET /api/payments/config ----------
router.get('/config', protect, (req, res) => {
  res.json({
    success: true,
    testMode: !razorpay,
    key: RAZORPAY_KEY_ID || 'test_mode',
    minAmount: MIN_AMOUNT,
    maxAmount: MAX_AMOUNT,
    pointsPerRupee: POINTS_PER_RUPEE,
  })
})

// ---------- POST /api/payments/create-order ----------
router.post('/create-order', protect, async (req, res) => {
  try {
    const amount = Number(req.body.amount)
    if (!Number.isFinite(amount) || amount < MIN_AMOUNT || amount > MAX_AMOUNT) {
      return res.status(400).json({
        success: false,
        message: `Amount ₹${MIN_AMOUNT} se ₹${MAX_AMOUNT} ke beech hona chahiye`,
      })
    }

    const points = Math.floor(amount * POINTS_PER_RUPEE)

    // TEST MODE (bina Razorpay keys)
    if (!razorpay) {
      const fakeOrderId = `test_order_${Date.now()}_${Math.floor(Math.random() * 9999)}`
      return res.json({
        success: true,
        testMode: true,
        order: {
          id: fakeOrderId,
          amount: amount * 100,
          currency: 'INR',
        },
        key: 'test_mode',
        points,
      })
    }

    // REAL RAZORPAY
    const order = await razorpay.orders.create({
      amount: amount * 100,
      currency: 'INR',
      receipt: `rcpt_${Date.now()}`,
      notes: { userId: String(req.user._id) },
    })

    res.json({
      success: true,
      testMode: false,
      order,
      key: RAZORPAY_KEY_ID,
      points,
    })
  } catch (err) {
    console.error('create-order error:', err)
    res.status(500).json({ success: false, message: err.message || 'Server error' })
  }
})

// ---------- POST /api/payments/verify ----------
router.post('/verify', protect, async (req, res) => {
  const session = await mongoose.startSession()
  try {
    const { orderId, paymentId, signature } = req.body
    const amount = Number(req.body.amount)

    if (!orderId || !Number.isFinite(amount) || amount < MIN_AMOUNT || amount > MAX_AMOUNT) {
      return res.status(400).json({ success: false, message: 'Details adhuri hain' })
    }

    const isTestMode =
      !razorpay || orderId.startsWith('test_order_') || signature === 'test_mode'

    // REAL MODE signature verify
    if (!isTestMode) {
      if (!paymentId || !signature) {
        return res.status(400).json({ success: false, message: 'Payment details missing' })
      }
      const expected = crypto
        .createHmac('sha256', RAZORPAY_KEY_SECRET)
        .update(`${orderId}|${paymentId}`)
        .digest('hex')

      if (expected !== signature) {
        return res.status(400).json({ success: false, message: 'Payment verify nahi hui' })
      }
    }

    // Duplicate check
    if (paymentId) {
      const exists = await WalletTransaction.findOne({ paymentId, user: req.user._id })
      if (exists) {
        const u = await User.findById(req.user._id).select(WALLET_FIELD).lean()
        return res.json({
          success: true,
          alreadyPaid: true,
          balance: u[WALLET_FIELD],
          points: exists.points,
        })
      }
    }

    const points = Math.floor(amount * POINTS_PER_RUPEE)

    let newBalance
    let tx
    await session.withTransaction(async () => {
      const user = await User.findByIdAndUpdate(
        req.user._id,
        { $inc: { [WALLET_FIELD]: points } },
        { new: true, session }
      )
      if (!user) throw new Error('USER_NOT_FOUND')
      newBalance = user[WALLET_FIELD]

      const [created] = await WalletTransaction.create(
        [{
          user: user._id,
          type: 'credit',
          points,
          balanceAfter: newBalance,
          note: isTestMode
            ? `Test payment deposit ₹${amount}`
            : `Razorpay deposit ₹${amount}`,
          source: 'deposit',
          paymentId: paymentId || `test_pay_${Date.now()}`,
          orderId,
          amount,
          method: isTestMode ? 'test' : 'razorpay',
        }],
        { session }
      )
      tx = created
    })

    res.json({
      success: true,
      balance: newBalance,
      points,
      transaction: tx,
    })
  } catch (err) {
    if (err.message === 'USER_NOT_FOUND') {
      return res.status(404).json({ success: false, message: 'User nahi mila' })
    }
    console.error('verify error:', err)
    res.status(500).json({ success: false, message: err.message || 'Server error' })
  } finally {
    session.endSession()
  }
})

module.exports = router