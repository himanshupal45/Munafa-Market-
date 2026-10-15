const mongoose = require('mongoose')

const roleSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Role name is required'],
    unique: true,
    trim: true,
  },
  permissions: {
    dashboard: { type: Boolean, default: false },
    users: { type: Boolean, default: false },
    games: { type: Boolean, default: false },
    wallet: { type: Boolean, default: false },
    notifications: { type: Boolean, default: false },
    enquiry: { type: Boolean, default: false },
    siteSetting: { type: Boolean, default: false },
    banners: { type: Boolean, default: false },
    paymentQR: { type: Boolean, default: false },
    resultManagement: { type: Boolean, default: false },
    reports: { type: Boolean, default: false },
  },
  status: {
    type: String,
    enum: ['Active', 'Inactive'],
    default: 'Active',
  },
}, { timestamps: true })

module.exports = mongoose.model('Role', roleSchema)
