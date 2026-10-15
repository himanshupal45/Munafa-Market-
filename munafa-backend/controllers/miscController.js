const Notification = require('../models/Notification')
const Enquiry = require('../models/Enquiry')
const Banner = require('../models/Banner')
const PaymentQR = require('../models/PaymentQR')
const SiteSetting = require('../models/SiteSetting')
const User = require('../models/User')
const Bet = require('../models/Bet')
const Transaction = require('../models/Transaction')
const Game = require('../models/Game')  // ✅ Top pe move kiya

// ─── Helper ───────────────────────────────────────────────────────
const getOrCreateSettings = async () => {
  let s = await SiteSetting.findOne()
  if (!s) s = await SiteSetting.create({})
  return s
}

// ==================== NOTIFICATIONS ====================

exports.getNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find()
      .populate('targetUser', 'name mobile')
      .sort({ createdAt: -1 })
    res.json({ success: true, notifications })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

exports.createNotification = async (req, res) => {
  try {
    const { title, message, type, targetUser } = req.body
    const notification = await Notification.create({
      title, message, type,
      targetUser: type === 'Individual' ? targetUser : null,
      image: req.file ? `/uploads/${req.file.filename}` : null,
    })
    res.status(201).json({ success: true, message: 'Notification bhej di gayi', notification })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

exports.deleteNotification = async (req, res) => {
  try {
    await Notification.findByIdAndDelete(req.params.id)
    res.json({ success: true, message: 'Notification delete ho gayi' })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

// ==================== ENQUIRY ====================

exports.getEnquiries = async (req, res) => {
  try {
    const { status } = req.query
    const query = status ? { status } : {}
    const enquiries = await Enquiry.find(query)
      .populate('user', 'name mobile')
      .sort({ createdAt: -1 })
    res.json({ success: true, enquiries })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

exports.createEnquiry = async (req, res) => {
  try {
    const enquiry = await Enquiry.create({
      ...req.body,
      user: req.user ? req.user._id : null,
    })
    res.status(201).json({ success: true, message: 'Enquiry bhej di gayi', enquiry })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

exports.replyEnquiry = async (req, res) => {
  try {
    const { reply } = req.body
    const enquiry = await Enquiry.findByIdAndUpdate(
      req.params.id,
      { reply, status: 'Resolved', repliedAt: new Date() },
      { new: true }
    )
    res.json({ success: true, message: 'Reply bhej di gayi', enquiry })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

exports.deleteEnquiry = async (req, res) => {
  try {
    await Enquiry.findByIdAndDelete(req.params.id)
    res.json({ success: true, message: 'Enquiry delete ho gayi' })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

// ==================== BANNERS ====================

exports.getBanners = async (req, res) => {
  try {
    const { type } = req.query
    const query = type ? { type } : {}
    const banners = await Banner.find(query).sort({ order: 1, createdAt: -1 })
    res.json({ success: true, banners })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

exports.createBanner = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ success: false, message: 'Image upload karein' })
    const banner = await Banner.create({ ...req.body, image: `/uploads/${req.file.filename}` })
    res.status(201).json({ success: true, message: 'Banner add ho gaya', banner })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

exports.updateBanner = async (req, res) => {
  try {
    const updateData = { ...req.body }
    if (req.file) updateData.image = `/uploads/${req.file.filename}`
    const banner = await Banner.findByIdAndUpdate(req.params.id, updateData, { new: true })
    res.json({ success: true, message: 'Banner update ho gaya', banner })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

exports.deleteBanner = async (req, res) => {
  try {
    await Banner.findByIdAndDelete(req.params.id)
    res.json({ success: true, message: 'Banner delete ho gaya' })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

// ==================== PAYMENT QR ====================

exports.getPaymentQRs = async (req, res) => {
  try {
    const qrs = await PaymentQR.find().sort({ createdAt: -1 })
    res.json({ success: true, qrs })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

exports.createPaymentQR = async (req, res) => {
  try {
    const qr = await PaymentQR.create({
      ...req.body,
      qrImage: req.file ? `/uploads/${req.file.filename}` : null,
    })
    res.status(201).json({ success: true, message: 'Payment QR add ho gaya', qr })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

exports.updatePaymentQR = async (req, res) => {
  try {
    const updateData = { ...req.body }
    if (req.file) updateData.qrImage = `/uploads/${req.file.filename}`
    const qr = await PaymentQR.findByIdAndUpdate(req.params.id, updateData, { new: true })
    res.json({ success: true, message: 'QR update ho gaya', qr })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

exports.deletePaymentQR = async (req, res) => {
  try {
    await PaymentQR.findByIdAndDelete(req.params.id)
    res.json({ success: true, message: 'QR delete ho gaya' })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

// ==================== SITE SETTINGS ====================

exports.getSiteSettings = async (req, res) => {
  try {
    const settings = await getOrCreateSettings()
    res.json({ success: true, settings })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

exports.updateSiteSettings = async (req, res) => {
  try {
    const updateData = { ...req.body }
    if (req.file) updateData.logo = `/uploads/${req.file.filename}`
    let settings = await SiteSetting.findOne()
    if (!settings) {
      settings = await SiteSetting.create(updateData)
    } else {
      settings = await SiteSetting.findByIdAndUpdate(settings._id, updateData, { new: true })
    }
    res.json({ success: true, message: 'Settings save ho gayi', settings })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

// ==================== GAME RATES ✅ UPDATED ====================

// PUT /api/game-rates — save all rates
exports.updateGameRates = async (req, res) => {
  try {
    const { rates } = req.body
    if (!Array.isArray(rates))
      return res.status(400).json({ success: false, message: 'rates array required' })

    const settings = await getOrCreateSettings()

    const cleanRates = rates.map(r => ({
      key:    String(r.key),
      label:  String(r.label),
      value1: Number(r.value1),
      value2: Number(r.value2),
    }))

    settings.set('gameRates', cleanRates, { strict: false })
    settings.markModified('gameRates')
    await settings.save()

    res.json({ success: true, message: 'Rates save ho gaye ✅', settings })
  } catch (error) {
    console.error('updateGameRates error:', error)
    res.status(500).json({ success: false, message: error.message })
  }
}

// POST /api/game-rates — add one rate
exports.addGameRate = async (req, res) => {
  try {
    const { key, label, value1, value2 } = req.body
    if (!key || !label || value1 == null || value2 == null)
      return res.status(400).json({ success: false, message: 'key, label, value1, value2 required' })

    const settings = await getOrCreateSettings()

    if (!Array.isArray(settings.gameRates)) {
      settings.set('gameRates', [], { strict: false })
    }

    if (settings.gameRates.find(r => r.key === key))
      return res.status(400).json({ success: false, message: 'Ye rate already exists' })

    settings.gameRates.push({
      key:    String(key),
      label:  String(label),
      value1: Number(value1),
      value2: Number(value2),
    })
    settings.markModified('gameRates')
    await settings.save()

    res.status(201).json({ success: true, message: 'Rate add ho gaya ✅', settings })
  } catch (error) {
    console.error('addGameRate error:', error)
    res.status(500).json({ success: false, message: error.message })
  }
}

// DELETE /api/game-rates/:key — delete one rate
exports.deleteGameRate = async (req, res) => {
  try {
    const settings = await getOrCreateSettings()

    if (!Array.isArray(settings.gameRates)) {
      return res.json({ success: true, message: 'Koi rate nahi tha', settings })
    }

    const filtered = settings.gameRates.filter(r => r.key !== req.params.key)
    settings.set('gameRates', filtered, { strict: false })
    settings.markModified('gameRates')
    await settings.save()

    res.json({ success: true, message: 'Rate delete ho gaya ✅', settings })
  } catch (error) {
    console.error('deleteGameRate error:', error)
    res.status(500).json({ success: false, message: error.message })
  }
}

// ==================== DASHBOARD STATS ====================

exports.getDashboardStats = async (req, res) => {
  try {
    const [totalUsers, activeUsers, pendingDeposits, pendingWithdrawals, totalGames, totalBets] =
      await Promise.all([
        User.countDocuments({ role: 'user' }),
        User.countDocuments({ role: 'user', status: 'Active' }),
        Transaction.countDocuments({ type: 'Deposit', status: 'Pending' }),
        Transaction.countDocuments({ type: 'Withdrawal', status: 'Pending' }),
        Game.countDocuments(),
        Bet.countDocuments(),
      ])

    const recentUsers = await User.find({ role: 'user' })
      .sort({ createdAt: -1 })
      .limit(10)
      .select('name mobile userId wallet status createdAt')

    res.json({
      success: true,
      stats: { totalUsers, activeUsers, pendingDeposits, pendingWithdrawals, totalGames, totalBets },
      recentUsers,
    })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}