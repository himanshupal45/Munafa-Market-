const express = require('express')
const router = express.Router()
const {
  getNotifications, createNotification, deleteNotification,
  getEnquiries, createEnquiry, replyEnquiry, deleteEnquiry,
  getBanners, createBanner, updateBanner, deleteBanner,
  getPaymentQRs, createPaymentQR, updatePaymentQR, deletePaymentQR,
  getSiteSettings, updateSiteSettings,
  getDashboardStats,
} = require('../controllers/miscController')
const { protect, adminOnly, adminOrSubadmin } = require('../middleware/auth')
const upload = require('../middleware/upload')

// Dashboard
router.get('/dashboard/stats', protect, adminOrSubadmin, getDashboardStats)

// Notifications
router.get('/notifications', protect, adminOrSubadmin, getNotifications)
router.post('/notifications', protect, adminOrSubadmin, upload.single('image'), createNotification)
router.delete('/notifications/:id', protect, adminOnly, deleteNotification)

// Enquiry
router.get('/enquiries', protect, adminOrSubadmin, getEnquiries)
router.post('/enquiries', createEnquiry)
router.put('/enquiries/:id/reply', protect, adminOrSubadmin, replyEnquiry)
router.delete('/enquiries/:id', protect, adminOnly, deleteEnquiry)

// Banners
router.get('/banners', getBanners)
router.post('/banners', protect, adminOnly, upload.single('image'), createBanner)
router.put('/banners/:id', protect, adminOnly, upload.single('image'), updateBanner)
router.delete('/banners/:id', protect, adminOnly, deleteBanner)

// Payment QR
router.get('/payment-qr', getPaymentQRs)
router.post('/payment-qr', protect, adminOnly, upload.single('qrImage'), createPaymentQR)
router.put('/payment-qr/:id', protect, adminOnly, upload.single('qrImage'), updatePaymentQR)
router.delete('/payment-qr/:id', protect, adminOnly, deletePaymentQR)

// Site Settings
router.get('/site-settings', getSiteSettings)
router.put('/site-settings', protect, adminOnly, upload.single('logo'), updateSiteSettings)

// Game Rates ab routes/gameRates.js me hain (gamerate collection)

module.exports = router