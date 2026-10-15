const mongoose = require('mongoose')

const transactionSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    type: {
      type: String,
      enum: ['Deposit', 'Withdrawal', 'Bet', 'Win', 'Refund', 'Bonus'],
      required: true,
    },
    amount: {
      type: Number,
      required: true,
      min: 0,
    },
    // ✅ UTR / Transaction ID (UPI ka unique number)
    transactionId: {
      type: String,
      uppercase: true,
      trim: true,
      default: '',
      index: true,
    },
    upiId: {
      type: String,
      default: '',
    },
    method: {
      type: String, // 'phonepe' | 'gpay' | 'paytm' | 'qr'
      default: '',
    },
    bankDetails: {
      type: Object,
      default: {},
    },
    screenshot: {
      type: String,
      default: null,
    },
    status: {
      type: String,
      enum: ['Pending', 'Approved', 'Rejected'],
      default: 'Pending',
      index: true,
    },
    note: {
      type: String,
      default: '',
    },
    processedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    processedAt: {
      type: Date,
    },
  },
  { timestamps: true }
)

// Compound unique index — same UTR do baar deposit me nahi
transactionSchema.index(
  { transactionId: 1, type: 1 },
  {
    unique: true,
    partialFilterExpression: {
      transactionId: { $exists: true, $ne: '' },
      type: 'Deposit',
    },
  }
)

module.exports = mongoose.model('Transaction', transactionSchema)