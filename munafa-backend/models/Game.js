const mongoose = require('mongoose')

const gameSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Game name is required'],
    trim: true,
    uppercase: true,
  },
  code: {
    type: String,
    required: true,
    trim: true,
    uppercase: true,
  },
  openTime: {
    type: String,
    required: true,
  },
  closeTime: {
    type: String,
  },
  status: {
    type: String,
    enum: ['Active', 'Inactive', 'Upcoming', 'Awaiting result'],
    default: 'Active',
  },
  minBet: {
    type: Number,
    default: 10,
  },
  maxBet: {
    type: Number,
    default: 10000,
  },
  winMultiplier: {
    type: Number,
    default: 9,
  },
  isPublished: {
    type: Boolean,
    default: false,
  },
}, { timestamps: true })

module.exports = mongoose.model('Game', gameSchema)
