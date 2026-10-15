const express = require('express')
const mongoose = require('mongoose')
const router = express.Router()

const { protect, adminOnly } = require('../../middleware/auth')
const User = require('../models/User')
const WithdrawRequest = require('../../models/WithdrawRequest')
const WalletTransaction = require('../../models/WalletTransaction')

const WALLET_FIELD = 'wallet' // ⚠️ wahi field
const MIN_WITHDRAW = 500
const METHODS = ['paytm', 'phonepe', 'gpay', 'bank', 'upi']

const makeNo = () => 'REQ-' + Math.random().toString(36).slice(2, 10).toUpperCase()

const resolveUserId = async (param) => {
  if (mongoose.isValidObjectId(param)) return param
  const u = await User.findOne({ userId: String(param) }).select('_id').lean()
  return u ? u._id : null
}

// ---------- POST /api/withdraw-requests  (USER) ----------
// Points request ke time hi wallet se kat jate hain; reject hui to wapas mil jate hain.
router.post('/', protect, async (req, res) => {
  const session = await mongoose.startSession()
  try {
    const points = Number(req.body.points)
    const method = String(req.body.method || '')
    const details = String(req.body.details || '').trim().slice(0, 200)

    if (!Number.isInteger(points) || points < MIN_WITHDRAW)
      return res.status(400).json({ success: false, message: `Minimum withdraw ${MIN_WITHDRAW} points hai` })
    if (!METHODS.includes(method))
      return res.status(400).json({ success: false, message: 'Withdraw method galat hai' })
    if (details.length < 3)
      return res.status(400).json({ success: false, message: 'Payment details daalo (UPI ID / number / bank details)' })

    let doc, balance
    await session.withTransaction(async () => {
      const user = await User.findOneAndUpdate(
        { _id: req.user._id, [WALLET_FIELD]: { $gte: points } },
        { $inc: { [WALLET_FIELD]: -points } },
        { new: true, session }
      )
      if (!user) throw new Error('INSUFFICIENT_BALANCE')
      balance = user[WALLET_FIELD]

      const [created] = await WithdrawRequest.create(
        [{ user: user._id, userName: user.name, userMobile: user.mobile, points, requestNo: makeNo(), method, details }],
        { session }
      )
      doc = created
      await WalletTransaction.create(
        [{ user: user._id, type: 'debit', points, balanceAfter: balance, note: `Withdraw request ${created.requestNo}`, source: 'withdraw' }],
        { session }
      )
    })
    res.status(201).json({ success: true, message: 'Withdraw request bhej di gayi', request: doc, balance })
  } catch (err) {
    if (err.message === 'INSUFFICIENT_BALANCE')
      return res.status(400).json({ success: false, message: 'Wallet balance kam hai' })
    console.error(err)
    res.status(500).json({ success: false, message: err.message || 'Server error' })
  } finally {
    session.endSession()
  }
})

// ---------- GET /api/withdraw-requests/mine  (USER) ----------
router.get('/mine', protect, async (req, res) => {
  try {
    const requests = await WithdrawRequest.find({ user: req.user._id }).sort({ createdAt: -1 }).limit(50).lean()
    res.json({ success: true, requests })
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
})

// ---------- GET /api/withdraw-requests  (ADMIN) ?status=&userId= ----------
router.get('/', protect, adminOnly, async (req, res) => {
  try {
    const q = {}
    if (['pending', 'approved', 'rejected'].includes(req.query.status)) q.status = req.query.status
    if (req.query.userId) {
      const uid = await resolveUserId(req.query.userId)
      q.user = uid || new mongoose.Types.ObjectId()
    }
    const requests = await WithdrawRequest.find(q).sort({ createdAt: -1 }).limit(500).lean()
    res.json({ success: true, requests })
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
})

// ---------- PUT /api/withdraw-requests/:id  (ADMIN approve / reject) ----------
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
      const wr = await WithdrawRequest.findOneAndUpdate(
        { _id: req.params.id, status: 'pending' },
        { status, note: note || '', processedBy: req.user._id, processedAt: new Date() },
        { new: true, session }
      )
      if (!wr) throw new Error('ALREADY_PROCESSED')

      if (status === 'rejected') {
        // Reject: kate hue points wapas
        const user = await User.findByIdAndUpdate(wr.user, { $inc: { [WALLET_FIELD]: wr.points } }, { new: true, session })
        if (user) {
          await WalletTransaction.create(
            [{
              user: user._id, type: 'credit', points: wr.points, balanceAfter: user[WALLET_FIELD],
              note: `Withdraw rejected - refund (${wr.requestNo})`, source: 'withdraw', createdBy: req.user._id,
            }],
            { session }
          )
        }
      }
      result = wr
    })
    res.json({ success: true, request: result })
  } catch (err) {
    if (err.message === 'ALREADY_PROCESSED')
      return res.status(409).json({ success: false, message: 'Ye request pehle hi process ho chuki hai' })
    console.error(err)
    res.status(500).json({ success: false, message: err.message || 'Server error' })
  } finally {
    session.endSession()
  }
})

module.exports = router