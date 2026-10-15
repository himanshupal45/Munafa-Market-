const mongoose = require('mongoose')

const paymentQRSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    upiId: { type: String, required: true },
    qrImage: { type: String, required: true },
    status: {
      type: String,
      enum: ['Active', 'Inactive'],
      default: 'Active',
    },
  },
  { timestamps: true }
)

module.exports = mongoose.model('PaymentQR', paymentQRSchema)