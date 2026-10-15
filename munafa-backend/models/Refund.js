const mongoose = require('mongoose')

const refundSchema = new mongoose.Schema(
  {
    user:       { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    userName:   { type: String },
    userMobile: { type: String },
    game:       { type: mongoose.Schema.Types.ObjectId, ref: 'Game' },
    gameName:   { type: String },
    bet:        { type: mongoose.Schema.Types.ObjectId, ref: 'Bet' },
    amount:     { type: Number, required: true, min: 0 },
    date:       { type: String },                     // kis din ki bet thi (YYYY-MM-DD)
    refundedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true, collection: 'refunds' }
)

module.exports = mongoose.model('Refund', refundSchema)