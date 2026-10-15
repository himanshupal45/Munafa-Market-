const jwt = require('jsonwebtoken')
const User = require('../models/User')
const SiteSetting = require('../models/SiteSetting') // apni file wala path rakhna

const MOBILE_REGEX = /^[6-9]\d{9}$/
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

// Generate JWT token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || '7d',
  })
}

const userResponse = (user) => ({
  _id: user._id,
  userId: user.userId,
  name: user.name,
  mobile: user.mobile,
  email: user.email,
  role: user.role,
  wallet: user.wallet,
  status: user.status,
  profileImage: user.profileImage,
})

// @desc  Register user
// @route POST /api/auth/register
// @access Public
exports.register = async (req, res) => {
  try {
    const { name, mobile, password, referralCode } = req.body
    const email = (req.body.email || '').trim().toLowerCase()

    // Validation (frontend bypass ho sakta hai, isliye yahan bhi)
    if (!name || !name.trim()) {
      return res.status(400).json({ success: false, message: 'Naam daalo' })
    }
    if (!MOBILE_REGEX.test(mobile || '')) {
      return res.status(400).json({ success: false, message: 'Valid 10 digit mobile number daalo' })
    }
    if (!EMAIL_REGEX.test(email)) {
      return res.status(400).json({ success: false, message: 'Valid email daalo' })
    }
    if (!password || password.length < 6) {
      return res.status(400).json({ success: false, message: 'Password 6+ characters ka hona chahiye' })
    }

    // Check if mobile or email already exists
    const existingMobile = await User.findOne({ mobile })
    if (existingMobile) {
      return res.status(400).json({ success: false, message: 'Yeh mobile number pehle se registered hai' })
    }
    const existingEmail = await User.findOne({ email })
    if (existingEmail) {
      return res.status(400).json({ success: false, message: 'Yeh email pehle se registered hai' })
    }

    // Get registration bonus from site settings
    let settings = await SiteSetting.findOne()
    const registrationBonus = settings ? settings.registrationBonus : 20
    const referralBonus = settings ? settings.referralBonus : 50

    // Check referral
    let referredByUser = null
    if (referralCode) {
      referredByUser = await User.findOne({ referralCode })
    }

    const user = await User.create({
      name: name.trim(),
      mobile,
      email,
      password,
      wallet: registrationBonus,
      referredBy: referralCode || null,
    })

    // Give referral bonus to referrer
    if (referredByUser) {
      referredByUser.wallet += referralBonus
      await referredByUser.save()
    }

    const token = generateToken(user._id)

    res.status(201).json({
      success: true,
      message: 'Registration successful',
      token,
      user: userResponse(user),
    })
  } catch (error) {
    // Race condition me unique index error
    if (error.code === 11000) {
      const field = Object.keys(error.keyPattern || {})[0]
      const msg = field === 'email'
        ? 'Yeh email pehle se registered hai'
        : 'Yeh mobile number pehle se registered hai'
      return res.status(400).json({ success: false, message: msg })
    }
    res.status(500).json({ success: false, message: error.message })
  }
}

// @desc  Login user
// @route POST /api/auth/login
// @access Public
exports.login = async (req, res) => {
  try {
    const { mobile, password } = req.body

    if (!mobile || !password) {
      return res.status(400).json({ success: false, message: 'Mobile aur password daalein' })
    }

    const user = await User.findOne({ mobile }).select('+password')
    if (!user) {
      return res.status(401).json({ success: false, message: 'Mobile ya password galat hai' })
    }

    const isMatch = await user.matchPassword(password)
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Mobile ya password galat hai' })
    }

    if (user.status === 'Blocked') {
      return res.status(403).json({ success: false, message: 'Aapka account block kar diya gaya hai' })
    }

    const token = generateToken(user._id)

    res.json({
      success: true,
      message: 'Login successful',
      token,
      user: userResponse(user),
    })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

// @desc  Get current logged-in user
// @route GET /api/auth/me
// @access Private
exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate('assignedRole')
    res.json({ success: true, user })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

// @desc  Update profile
// @route PUT /api/auth/update-profile
// @access Private
exports.updateProfile = async (req, res) => {
  try {
    const { name } = req.body
    const updateData = {}

    if (name && name.trim()) updateData.name = name.trim()

    if (req.body.email !== undefined) {
      const email = req.body.email.trim().toLowerCase()
      if (!EMAIL_REGEX.test(email)) {
        return res.status(400).json({ success: false, message: 'Valid email daalo' })
      }
      const taken = await User.findOne({ email, _id: { $ne: req.user._id } })
      if (taken) {
        return res.status(400).json({ success: false, message: 'Yeh email pehle se registered hai' })
      }
      updateData.email = email
    }

    if (req.file) {
      updateData.profileImage = `/uploads/${req.file.filename}`
    }

    const user = await User.findByIdAndUpdate(req.user._id, updateData, { new: true })

    res.json({ success: true, message: 'Profile updated', user })
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ success: false, message: 'Yeh email pehle se registered hai' })
    }
    res.status(500).json({ success: false, message: error.message })
  }
}

// @desc  Change password
// @route PUT /api/auth/change-password
// @access Private
exports.changePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body

    const user = await User.findById(req.user._id).select('+password')
    const isMatch = await user.matchPassword(oldPassword)

    if (!isMatch) {
      return res.status(400).json({ success: false, message: 'Purana password galat hai' })
    }

    user.password = newPassword
    await user.save()

    res.json({ success: true, message: 'Password change ho gaya' })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}