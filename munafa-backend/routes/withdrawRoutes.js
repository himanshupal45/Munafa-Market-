const express = require('express')
const crypto = require('crypto')
const mongoose = require('mongoose')
const router = express.Router()

const { protect, adminOrSubadmin } = require('../middleware/auth')
const upload = require('../middleware/upload')
const User = require('../models/User')
const WithdrawRequest = require('../models/Withdrawrequest')
const WalletTransaction = require('../models/WalletTransaction')

const METHODS = ['phonepe', 'gpay', 'paytm', 'qr']
const cap = (s) => (s ? s.charAt(0).toUpperCase() + s.slice(1) : s)
const newRequestNo = () => `REQ-${crypto.randomBytes(4).toString('hex').toUpperCase()}`

// Frontend ko purane shape me bhejne ke liye (amount, Pending/Approved/Rejected, accountDetails)
const toClient = (d) => {
  const o = d.toObject ? d.toObject() : d
  return {
    ...o,
    amount: o.points,
    status: cap(o.status),
    accountDetails: o.details || '',
    user: o.user && o.user.name ? o.user : { _id: o.user, name: o.userName, mobile: o.userMobile },
  }
}

// ---------- POST /api/wallet/withdrawals  (USER) ----------
// Yahan paisa NAHI katta. Sirf request save hoti hai.
router.post('/', protect, upload.single('qrImage'), async (req, res) => {
  try {
    const points = Number(req.body.amount)
    const method = String(req.body.method || '')
    const details = String(req.body.accountDetails || '').trim()

    if (!Number.isInteger(points) || points <= 0)
      return res.status(400).json({ success: false, message: 'Amount galat hai' })
    if (!METHODS.includes(method))
      return res.status(400).json({ success: false, message: 'Method galat hai' })
    if (method === 'qr' && !req.file)
      return res.status(400).json({ success: false, message: 'QR code upload karein' })
    if (method !== 'qr' && !details)
      return res.status(400).json({ success: false, message: 'UPI ID / Mobile daalein' })

    const user = await User.findById(req.user._id).select('name mobile wallet')
    if (!user) return res.status(404).json({ success: false, message: 'User nahi mila' })
    if (Number(user.wallet) < points)
      return res.status(400).json({ success: false, message: 'Wallet balance kam hai' })

    const pending = await WithdrawRequest.findOne({ user: user._id, status: 'pending' }).lean()
    if (pending)
      return res.status(400).json({ success: false, message: 'Aapki ek request pehle se pending hai' })

    const doc = await WithdrawRequest.create({
      user: user._id,
      userName: user.name,
      userMobile: user.mobile,
      points,
      requestNo: newRequestNo(),
      method,
      details: method === 'qr' ? '' : details,
      qrImage: req.file ? `/uploads/${req.file.filename}` : '',
      status: 'pending',
    })

    res.status(201).json({ success: true, message: 'Request bhej di gayi', request: toClient(doc) })
  } catch (err) {
    console.error('Withdraw create error:', err)
    res.status(500).json({ success: false, message: err.message })
  }
})

// ---------- GET /api/wallet/withdrawals/mine  (USER) ----------
router.get('/mine', protect, async (req, res) => {
  try {
    const list = await WithdrawRequest.find({ user: req.user._id }).sort({ createdAt: -1 }).limit(50).lean()
    res.json({ success: true, requests: list.map(toClient) })
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
})

// ---------- GET /api/wallet/withdrawals  (ADMIN) ----------
router.get('/', protect, adminOrSubadmin, async (req, res) => {
  try {
    const page = Math.max(1, Number(req.query.page) || 1)
    const limit = Math.min(100, Number(req.query.limit) || 20)
    const search = String(req.query.search || '').trim()
    const q = {}

    if (['pending', 'approved', 'rejected'].includes(String(req.query.status).toLowerCase()))
      q.status = String(req.query.status).toLowerCase()

    if (search) {
      const safe = search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
      const or = [
        { userMobile: { $regex: safe } },
        { requestNo: { $regex: safe, $options: 'i' } },
      ]
      if (/^\d+$/.test(search)) or.push({ points: Number(search) })
      q.$or = or
    }

    const [total, list] = await Promise.all([
      WithdrawRequest.countDocuments(q),
      WithdrawRequest.find(q)
        .populate('user', 'name mobile')
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .lean(),
    ])

    res.json({ success: true, total, requests: list.map(toClient) })
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
})

// ---------- PUT /api/wallet/withdrawals/:id  (ADMIN: approve / reject) ----------
// Approve par paisa katega. Reject par kuch nahi katega.
router.put('/:id', protect, adminOrSubadmin, async (req, res) => {
  const session = await mongoose.startSession()
  try {
    if (!mongoose.isValidObjectId(req.params.id))
      return res.status(400).json({ success: false, message: 'Galat id' })

    const status = String(req.body.status || '').toLowerCase()
    if (!['approved', 'rejected'].includes(status))
      return res.status(400).json({ success: false, message: 'Status galat hai' })

    let doc
    await session.withTransaction(async () => {
      // Sirf pending wali request badlegi (dobara approve/reject nahi hoga)
      doc = await WithdrawRequest.findOneAndUpdate(
        { _id: req.params.id, status: 'pending' },
        {
          $set: {
            status,
            note: String(req.body.note || ''),
            processedBy: req.user._id,
            processedAt: new Date(),
          },
        },
        { new: true, session }
      )
      if (!doc) throw new Error('NOT_PENDING')

      if (status === 'approved') {
        // Balance kaafi ho tabhi kato. Nahi to poora transaction wapas (status pending hi rahega)
        const user = await User.findOneAndUpdate(
          { _id: doc.user, wallet: { $gte: doc.points } },
          { $inc: { wallet: -doc.points } },
          { new: true, session }
        )
        if (!user) throw new Error('INSUFFICIENT_BALANCE')

        await WalletTransaction.create(
          [{
            user: user._id,
            type: 'debit',
            points: doc.points,
            balanceAfter: user.wallet,
            note: `Withdraw ${doc.requestNo} approved (${doc.method})`,
            source: 'withdraw',
            createdBy: req.user._id,
          }],
          { session }
        )
      }
    })

    res.json({ success: true, message: `Request ${status}`, request: toClient(doc) })
  } catch (err) {
    if (err.message === 'NOT_PENDING')
      return res.status(400).json({ success: false, message: 'Ye request pehle hi process ho chuki hai' })
    if (err.message === 'INSUFFICIENT_BALANCE')
      return res.status(400).json({ success: false, message: 'User ke wallet me ab itna balance nahi hai. Approve nahi ho sakta, Reject kar do.' })
    console.error('Withdraw update error:', err)
    res.status(500).json({ success: false, message: err.message })
  } finally {
    session.endSession()
  }
})

module.exports = router