const express = require('express')
const router = express.Router()
const {
  getAllTransactions,
  getDepositRequests,
  getWithdrawRequests,
  processDeposit,
  processWithdrawal,
  depositRequest,
  withdrawRequest,
  getWalletSummary,
  getMyBalance,
  addPointsToUser,   // ✅ NEW
} = require('../controllers/walletController')
const { protect, adminOnly, adminOrSubadmin } = require('../middleware/auth')
const upload = require('../middleware/upload')
const { createWithdrawal } = require('../controllers/withdrawController')

// ---------- Admin routes ----------
router.get('/transactions', protect, adminOrSubadmin, getAllTransactions)
router.get('/deposits', protect, adminOrSubadmin, getDepositRequests)
router.get('/withdrawals', protect, adminOrSubadmin, getWithdrawRequests)
router.put('/deposits/:id', protect, adminOrSubadmin, processDeposit)
router.put('/withdrawals/:id', protect, adminOrSubadmin, processWithdrawal)
router.get('/summary', protect, adminOrSubadmin, getWalletSummary)

// ✅ NEW — Admin: Add points to user wallet
router.post('/add-points', protect, adminOrSubadmin, addPointsToUser)

// ---------- User routes ----------
router.get('/balance', protect, getMyBalance)
router.post('/deposit-request', protect, upload.single('screenshot'), depositRequest)
router.post('/withdraw-request', protect, withdrawRequest)
router.post('/withdrawals', protect, upload.single('qrImage'), createWithdrawal)

module.exports = router