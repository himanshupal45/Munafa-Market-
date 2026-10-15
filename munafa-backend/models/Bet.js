const mongoose = require('mongoose')

const betSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  game: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Game',
    required: true,
  },
  gameName: String,

  // ✅ User ki details (bet ke waqt ki copy) — user ki id upar `user` field me hai
  userName:   { type: String },
  userMobile: { type: String },  betNumber: {
    type: String,
    required: true,
  },
  betAmount: {
    type: Number,
    required: true,
    min: 1,
  },
  winAmount: {
    type: Number,
    default: 0,
  },
  status: {
    type: String,
    enum: ['Pending', 'Won', 'Lost'],
    default: 'Pending',
  },
  betDate: {
    type: Date,
    default: Date.now,
  },

  // ✅ NAYE FIELDS (purane documents me nahi honge, isliye required nahi hain)
  session:   { type: String, enum: ['open', 'close'] },   // open / close market
  type:      { type: String },                            // game-rate key (jodi, single-pana...)
  typeLabel: { type: String },                            // dikhane wala naam
  rate:      { bet: Number, win: Number },                // bet ke waqt ka rate (snapshot)
  date:      { type: String },                            // YYYY-MM-DD (IST) — din ke hisaab se filter ke liye
}, { timestamps: true })

betSchema.index({ user: 1, createdAt: -1 })
betSchema.index({ game: 1, date: 1 })

module.exports = mongoose.model('Bet', betSchema)