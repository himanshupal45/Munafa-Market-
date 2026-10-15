const mongoose = require('mongoose')
const User = require('../models/User')
const WithdrawRequest = require('../models/Withdrawrequest')
const WalletTransaction = require('../models/WalletTransaction')

const METHODS = ['phonepe', 'gpay', 'paytm', 'qr']

// @route POST /api/wallet/withdrawals   (user)
exports.createWithdrawal = async (req, res) => {
  const session = await mongoose.startSession()
  try {
    const amount = Number(req.body.amount)
    const method = String(req.body.method || '')
    const accountDetails = String(req.body.accountDetails || '').trim()

    if (!Number.isInteger(amount) || amount <= 0)
      return res.status(400).json({ success: false, message: 'Amount galat hai' })
    if (!METHODS.includes(method))
      return res.status(400).json({ success: false, message: 'Method galat hai' })
    if (method === 'qr' && !req.file)
      return res.status(400).json({ success: false, message: 'QR code upload karein' })
    if (method !== 'qr' && !accountDetails)
      return res.status(400).json({ success: false, message: 'UPI ID / Mobile daalein' })

    // Ek user ki ek hi pending request (spam rokne ke liye)
    const pending = await WithdrawRequest.findOne({ user: req.user._id, status: 'Pending' }).lean()
    if (pending)
      return res.status(400).json({ success: false, message: 'Aapki ek request pehle se pending hai' })

    let doc
    await session.withTransaction(async () => {
      // Balance kam ho tabhi paisa kate
      const user = await User.findOneAndUpdate(
        { _id: req.user._id, wallet: { $gte: amount } },
        { $inc: { wallet: -amount } },
        { new: true, session }
      )
      if (!user) throw new Error('INSUFFICIENT_BALANCE')

      ;[doc] = await WithdrawRequest.create(
        [{
          user: user._id,
          amount,
          method,
          accountDetails: method === 'qr' ? '' : accountDetails,
          qrImage: req.file ? `/uploads/${req.file.filename}` : '',
          status: 'Pending',
        }],
        { session }
      )

      await WalletTransaction.create(
        [{
          user: user._id,
          type: 'debit',
          points: amount,
          balanceAfter: user.wallet,
          note: `Withdraw request (${method})`,
          source: 'withdraw',
        }],
        { session }
      )
    })

    res.status(201).json({ success: true, message: 'Request bhej di gayi', request: doc })
  } catch (err) {
    if (err.message === 'INSUFFICIENT_BALANCE')
      return res.status(400).json({ success: false, message: 'Wallet balance kam hai' })
    console.error(err)
    res.status(500).json({ success: false, message: err.message })
  } finally {
    session.endSession()
  }
}