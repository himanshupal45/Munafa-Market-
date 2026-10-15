const express = require('express')
const router = express.Router()
const {
  getAllQR,
  getActiveQR,
  createQR,
  updateQR,
  deleteQR,
} = require('../controllers/paymentQRController')
const { protect, adminOrSubadmin } = require('../middleware/auth')
const upload = require('../middleware/upload')

// Public
router.get('/active', getActiveQR)

// Admin
router.get('/', protect, adminOrSubadmin, getAllQR)
router.post('/', protect, adminOrSubadmin, upload.single('qrImage'), createQR)
router.put('/:id', protect, adminOrSubadmin, upload.single('qrImage'), updateQR)
router.delete('/:id', protect, adminOrSubadmin, deleteQR)

module.exports = router