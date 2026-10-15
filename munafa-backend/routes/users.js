const express = require('express')
const router = express.Router()
const {
  getAllUsers, getUserById, updateUserStatus,
  assignRole, updateWallet, deleteUser,
  getRoles, createRole, updateRole, deleteRole,
} = require('../controllers/userController')
const { protect, adminOnly, adminOrSubadmin } = require('../middleware/auth')

// User routes
router.get('/', protect, adminOrSubadmin, getAllUsers)
router.get('/:id', protect, adminOrSubadmin, getUserById)
router.put('/:id/status', protect, adminOnly, updateUserStatus)
router.put('/:id/assign-role', protect, adminOnly, assignRole)
router.put('/:id/wallet', protect, adminOnly, updateWallet)
router.delete('/:id', protect, adminOnly, deleteUser)

// Role routes
router.get('/roles/all', protect, adminOrSubadmin, getRoles)
router.post('/roles/create', protect, adminOnly, createRole)
router.put('/roles/:id', protect, adminOnly, updateRole)
router.delete('/roles/:id', protect, adminOnly, deleteRole)

module.exports = router
