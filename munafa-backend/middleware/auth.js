const jwt = require('jsonwebtoken')
const User = require('../models/User')

// Protect routes - JWT check
exports.protect = async (req, res, next) => {
  let token

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1]
  }

  if (!token) {
    return res.status(401).json({ success: false, message: 'Login karein, access nahi hai' })
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    req.user = await User.findById(decoded.id)

    if (!req.user) {
      return res.status(401).json({ success: false, message: 'User nahi mila' })
    }

    if (req.user.status === 'Blocked') {
      return res.status(403).json({ success: false, message: 'Aapka account block kar diya gaya hai' })
    }

    next()
  } catch (error) {
    return res.status(401).json({ success: false, message: 'Token invalid hai' })
  }
}

// Admin only
exports.adminOnly = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ success: false, message: 'Sirf admin ke liye' })
  }
  next()
}

// Admin or subadmin
exports.adminOrSubadmin = (req, res, next) => {
  if (req.user.role !== 'admin' && req.user.role !== 'subadmin') {
    return res.status(403).json({ success: false, message: 'Access nahi hai' })
  }
  next()
}
