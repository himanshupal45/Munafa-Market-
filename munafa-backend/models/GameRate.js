const mongoose = require('mongoose')

const gameRateSchema = new mongoose.Schema(
  {
    key:    { type: String, required: true, unique: true, trim: true },
    label:  { type: String, required: true, trim: true },
    value1: { type: Number, required: true }, // Bet ₹
    value2: { type: Number, required: true }, // Win ₹
    order:  { type: Number, default: 0 },
  },
  { timestamps: true, collection: 'gamerate' } // Atlas wali same collection
)

module.exports = mongoose.model('GameRate', gameRateSchema)