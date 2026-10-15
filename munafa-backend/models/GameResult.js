const mongoose = require('mongoose')

const gameResultSchema = new mongoose.Schema({
  game: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Game',
    required: true,
  },
  gameName: String,
  result: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  isPublished: {
    type: Boolean,
    default: false,
  },
  publishedAt: Date,
}, { timestamps: true })

module.exports = mongoose.model('GameResult', gameResultSchema)
