const mongoose = require('mongoose')

const walletTransactionSchema = new mongoose.Schema(
  {
    user:         { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    type:         { type: String, enum: ['credit', 'debit'], required: true },
    points:       { type: Number, required: true, min: 0 },
    balanceAfter: { type: Number },
    note:         { type: String, default: '' },
    source:       { type: String, enum: ['bet', 'admin', 'deposit', 'withdraw', 'win', 'refund', 'other'], default: 'other' },
    createdBy:    { type: mongoose.Schema.Types.ObjectId, ref: 'User' },

    // 🆕 Payment tracking
    paymentId:    { type: String, default: '' },
    orderId:      { type: String, default: '' },
    amount:       { type: Number, default: 0 },
    method:       { type: String, default: '' },
  },
  { timestamps: true, collection: 'wallet_history' }
)

walletTransactionSchema.index({ user: 1, createdAt: -1 })

module.exports = mongoose.model('WalletTransaction', walletTransactionSchema)