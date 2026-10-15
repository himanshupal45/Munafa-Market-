const Transaction = require('../models/Transaction')
const User = require('../models/User')

// ============================================
// ADMIN: Get all wallet transactions
// GET /api/wallet/transactions
// ============================================
exports.getAllTransactions = async (req, res) => {
  try {
    const { page = 1, limit = 20, type, status, userId } = req.query
    const query = {}
    if (type) query.type = type
    if (status) query.status = status
    if (userId) query.user = userId

    const total = await Transaction.countDocuments(query)
    const transactions = await Transaction.find(query)
      .populate('user', 'name mobile userId')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit))

    res.json({ success: true, total, transactions })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

// ============================================
// ADMIN: Get deposit requests
// GET /api/wallet/deposits
// ============================================
exports.getDepositRequests = async (req, res) => {
  try {
    const { page = 1, limit = 20, status } = req.query
    const query = { type: 'Deposit' }
    if (status) query.status = status

    const total = await Transaction.countDocuments(query)
    const requests = await Transaction.find(query)
      .populate('user', 'name mobile userId wallet')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit))

    res.json({ success: true, total, requests })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

// ============================================
// ADMIN: Get withdraw requests
// GET /api/wallet/withdrawals
// ============================================
exports.getWithdrawRequests = async (req, res) => {
  try {
    const { page = 1, limit = 20, status } = req.query
    const query = { type: 'Withdrawal' }
    if (status) query.status = status

    const total = await Transaction.countDocuments(query)
    const requests = await Transaction.find(query)
      .populate('user', 'name mobile userId wallet')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit))

    res.json({ success: true, total, requests })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

// ============================================
// ADMIN: Approve/Reject deposit
// PUT /api/wallet/deposits/:id
// ============================================
exports.processDeposit = async (req, res) => {
  try {
    const { status, note } = req.body // 'Approved' or 'Rejected'

    if (!['Approved', 'Rejected'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Status "Approved" ya "Rejected" hona chahiye',
      })
    }

    const transaction = await Transaction.findById(req.params.id).populate('user')
    if (!transaction) {
      return res.status(404).json({ success: false, message: 'Request nahi mila' })
    }

    if (transaction.status !== 'Pending') {
      return res.status(400).json({
        success: false,
        message: `Yeh request already ${transaction.status} hai`,
      })
    }

    transaction.status = status
    transaction.note = note || ''
    transaction.processedBy = req.user._id
    transaction.processedAt = new Date()
    await transaction.save()

    // If approved, credit user wallet
    if (status === 'Approved') {
      const user = await User.findByIdAndUpdate(
        transaction.user._id,
        { $inc: { wallet: transaction.amount } },
        { new: true }
      )

      return res.json({
        success: true,
        message: `Deposit Approved — ₹${transaction.amount} wallet me add ho gaye`,
        transaction,
        newBalance: user?.wallet || 0,
      })
    }

    res.json({
      success: true,
      message: 'Deposit Rejected',
      transaction,
    })
  } catch (error) {
    console.error('processDeposit error:', error)
    res.status(500).json({ success: false, message: error.message })
  }
}

// ============================================
// ADMIN: Approve/Reject withdrawal
// PUT /api/wallet/withdrawals/:id
// ============================================
exports.processWithdrawal = async (req, res) => {
  try {
    const { status, note } = req.body

    if (!['Approved', 'Rejected'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Status "Approved" ya "Rejected" hona chahiye',
      })
    }

    const transaction = await Transaction.findById(req.params.id).populate('user')
    if (!transaction) {
      return res.status(404).json({ success: false, message: 'Request nahi mila' })
    }

    if (transaction.status !== 'Pending') {
      return res.status(400).json({
        success: false,
        message: `Yeh request already ${transaction.status} hai`,
      })
    }

    // If rejected, refund wallet
    if (status === 'Rejected') {
      await User.findByIdAndUpdate(transaction.user._id, {
        $inc: { wallet: transaction.amount },
      })
    }

    transaction.status = status
    transaction.note = note || ''
    transaction.processedBy = req.user._id
    transaction.processedAt = new Date()
    await transaction.save()

    res.json({ success: true, message: `Withdrawal ${status}`, transaction })
  } catch (error) {
    console.error('processWithdrawal error:', error)
    res.status(500).json({ success: false, message: error.message })
  }
}

// ============================================
// USER: Submit deposit request (with UTR)
// POST /api/wallet/deposit-request
// ============================================
exports.depositRequest = async (req, res) => {
  try {
    const { amount, transactionId, upiId, method } = req.body

    // ---------- Validation ----------
    if (!amount || !transactionId) {
      return res.status(400).json({
        success: false,
        message: 'Amount aur UTR/Transaction ID dono required hain',
      })
    }

    const amtNum = Number(amount)
    const utrStr = String(transactionId).trim().toUpperCase()

    if (!Number.isFinite(amtNum) || amtNum <= 0) {
      return res.status(400).json({ success: false, message: 'Valid amount daalein' })
    }
    if (amtNum < 10) {
      return res.status(400).json({ success: false, message: 'Minimum deposit ₹10 hai' })
    }
    if (utrStr.length < 8 || utrStr.length > 22) {
      return res.status(400).json({
        success: false,
        message: 'UTR 8-22 characters ka hona chahiye',
      })
    }
    if (!/^[A-Z0-9]+$/.test(utrStr)) {
      return res.status(400).json({
        success: false,
        message: 'UTR sirf letters aur numbers ka hona chahiye',
      })
    }

    // ---------- Duplicate UTR check ----------
    const existing = await Transaction.findOne({
      transactionId: utrStr,
      type: 'Deposit',
    })
    if (existing) {
      return res.status(409).json({
        success: false,
        message: 'Yeh UTR already submit ho chuka hai',
      })
    }

    // ---------- Create deposit request ----------
    const transaction = await Transaction.create({
      user: req.user._id,
      type: 'Deposit',
      amount: amtNum,
      transactionId: utrStr,
      upiId: upiId || '',
      method: method || '',
      status: 'Pending',
      screenshot: req.file ? `/uploads/${req.file.filename}` : null,
    })

    res.status(201).json({
      success: true,
      message: 'Deposit request submit ho gayi. Verification ke baad wallet me add hoga.',
      transaction: {
        _id: transaction._id,
        amount: transaction.amount,
        transactionId: transaction.transactionId,
        status: transaction.status,
        createdAt: transaction.createdAt,
      },
    })
  } catch (error) {
    console.error('depositRequest error:', error)

    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: 'Yeh UTR already submit ho chuka hai',
      })
    }

    res.status(500).json({ success: false, message: error.message })
  }
}

// ============================================
// USER: Submit withdrawal request
// POST /api/wallet/withdraw-request
// ============================================
exports.withdrawRequest = async (req, res) => {
  try {
    const { amount, bankDetails, upiId, method } = req.body

    const amtNum = Number(amount)
    if (!Number.isFinite(amtNum) || amtNum <= 0) {
      return res.status(400).json({ success: false, message: 'Valid amount daalein' })
    }

    const user = await User.findById(req.user._id)
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' })
    }
    if (user.wallet < amtNum) {
      return res.status(400).json({ success: false, message: 'Balance insufficient hai' })
    }

    // Deduct immediately, refund if rejected
    user.wallet -= amtNum
    await user.save()

    const transaction = await Transaction.create({
      user: req.user._id,
      type: 'Withdrawal',
      amount: amtNum,
      bankDetails: bankDetails || {},
      upiId: upiId || '',
      method: method || '',
      status: 'Pending',
    })

    res.status(201).json({
      success: true,
      message: 'Withdrawal request bhej di gayi',
      transaction,
      newBalance: user.wallet,
    })
  } catch (error) {
    console.error('withdrawRequest error:', error)
    res.status(500).json({ success: false, message: error.message })
  }
}

// ============================================
// USER: Get my wallet balance
// GET /api/wallet/balance
// ============================================
exports.getMyBalance = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('wallet')
    res.json({ success: true, balance: user?.wallet || 0 })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

// ============================================
// ADMIN: Wallet summary
// GET /api/wallet/summary
// ============================================
exports.getWalletSummary = async (req, res) => {
  try {
    const pendingDeposits = await Transaction.countDocuments({
      type: 'Deposit',
      status: 'Pending',
    })
    const pendingWithdrawals = await Transaction.countDocuments({
      type: 'Withdrawal',
      status: 'Pending',
    })

    const depositTotal = await Transaction.aggregate([
      { $match: { type: 'Deposit', status: 'Approved' } },
      { $group: { _id: null, total: { $sum: '$amount' } } },
    ])
    const withdrawTotal = await Transaction.aggregate([
      { $match: { type: 'Withdrawal', status: 'Approved' } },
      { $group: { _id: null, total: { $sum: '$amount' } } },
    ])

    res.json({
      success: true,
      pendingDeposits,
      pendingWithdrawals,
      totalDeposits: depositTotal[0]?.total || 0,
      totalWithdrawals: withdrawTotal[0]?.total || 0,
    })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

// ============================================
// ✅ NEW — ADMIN: Add points to a specific user's wallet
// POST /api/wallet/add-points
// Body: { userId, points }
// ============================================
exports.addPointsToUser = async (req, res) => {
  try {
    const { userId, points } = req.body

    // ---------- Validation ----------
    if (!userId) {
      return res.status(400).json({
        success: false,
        message: 'userId required hai',
      })
    }

    const ptsNum = Number(points)
    if (!Number.isFinite(ptsNum) || ptsNum <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Valid points daalein (0 se zyada)',
      })
    }

    // ---------- Find user ----------
    const user = await User.findById(userId)
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User nahi mila',
      })
    }

    // ---------- Update wallet ----------
    user.wallet = (user.wallet || 0) + ptsNum
    await user.save()

    // ---------- Optional: Transaction log ----------
    try {
      await Transaction.create({
        user: user._id,
        type: 'Deposit',
        amount: ptsNum,
        status: 'Approved',
        note: `Admin added ${ptsNum} points`,
        processedBy: req.user._id,
        processedAt: new Date(),
      })
    } catch (logErr) {
      console.warn('Transaction log fail:', logErr.message)
      // Not fatal — wallet already updated
    }

    res.json({
      success: true,
      message: `${ptsNum} points added to ${user.name || 'user'}`,
      wallet: user.wallet,
      user: {
        _id: user._id,
        name: user.name,
        mobile: user.mobile,
        wallet: user.wallet,
      },
    })
  } catch (error) {
    console.error('addPointsToUser error:', error)
    res.status(500).json({ success: false, message: error.message })
  }
}