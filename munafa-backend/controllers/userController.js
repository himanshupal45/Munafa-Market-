const User = require('../models/User')
const Role = require('../models/Role')

// @desc  Get all users
// @route GET /api/users
// @access Admin/Subadmin
exports.getAllUsers = async (req, res) => {
  try {
    const { page = 1, limit = 20, search = '', status = '' } = req.query

    const query = { role: 'user' }
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { mobile: { $regex: search, $options: 'i' } },
        { userId: { $regex: search, $options: 'i' } },
      ]
    }
    if (status) query.status = status

    const total = await User.countDocuments(query)
    const users = await User.find(query)
      .populate('assignedRole', 'name')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit))

    res.json({
      success: true,
      total,
      page: Number(page),
      pages: Math.ceil(total / limit),
      users,
    })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

// @desc  Get single user
// @route GET /api/users/:id
// @access Admin/Subadmin
exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).populate('assignedRole')
    if (!user) return res.status(404).json({ success: false, message: 'User nahi mila' })
    res.json({ success: true, user })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

// @desc  Update user status
// @route PUT /api/users/:id/status
// @access Admin
exports.updateUserStatus = async (req, res) => {
  try {
    const { status } = req.body
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    )
    if (!user) return res.status(404).json({ success: false, message: 'User nahi mila' })
    res.json({ success: true, message: `User ${status} kar diya`, user })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

// @desc  Assign role to user
// @route PUT /api/users/:id/assign-role
// @access Admin
exports.assignRole = async (req, res) => {
  try {
    const { roleId, userRole } = req.body
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { assignedRole: roleId || null, role: userRole || 'user' },
      { new: true }
    ).populate('assignedRole')
    res.json({ success: true, message: 'Role assign ho gaya', user })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

// @desc  Update user wallet (add/deduct)
// @route PUT /api/users/:id/wallet
// @access Admin
exports.updateWallet = async (req, res) => {
  try {
    const { amount, type, note } = req.body // type: 'add' | 'deduct'
    const user = await User.findById(req.params.id)
    if (!user) return res.status(404).json({ success: false, message: 'User nahi mila' })

    if (type === 'add') {
      user.wallet += Number(amount)
    } else {
      if (user.wallet < amount) {
        return res.status(400).json({ success: false, message: 'Insufficient balance' })
      }
      user.wallet -= Number(amount)
    }

    await user.save()
    res.json({ success: true, message: `Wallet ${type === 'add' ? 'add' : 'deduct'} ho gaya`, wallet: user.wallet })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

// @desc  Delete user
// @route DELETE /api/users/:id
// @access Admin
exports.deleteUser = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id)
    res.json({ success: true, message: 'User delete ho gaya' })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

// ==================== ROLES ====================

// @desc  Get all roles
// @route GET /api/users/roles
exports.getRoles = async (req, res) => {
  try {
    const roles = await Role.find().sort({ createdAt: -1 })
    res.json({ success: true, roles })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

// @desc  Create role
// @route POST /api/users/roles
exports.createRole = async (req, res) => {
  try {
    const role = await Role.create(req.body)
    res.status(201).json({ success: true, message: 'Role create ho gaya', role })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

// @desc  Update role
// @route PUT /api/users/roles/:id
exports.updateRole = async (req, res) => {
  try {
    const role = await Role.findByIdAndUpdate(req.params.id, req.body, { new: true })
    res.json({ success: true, message: 'Role update ho gaya', role })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

// @desc  Delete role
// @route DELETE /api/users/roles/:id
exports.deleteRole = async (req, res) => {
  try {
    await Role.findByIdAndDelete(req.params.id)
    res.json({ success: true, message: 'Role delete ho gaya' })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}
