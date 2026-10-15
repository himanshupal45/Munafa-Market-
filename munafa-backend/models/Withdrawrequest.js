const mongoose = require('mongoose')

const withdrawRequestSchema = new mongoose.Schema(
  {
    user:        { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    userName:    { type: String },
    userMobile:  { type: String },
    points:      { type: Number, required: true, min: 1 },
    requestNo:   { type: String, required: true, unique: true }, // REQ-XXXXXXXX
    method:      { type: String, enum: ['phonepe', 'gpay', 'paytm', 'qr', 'bank', 'upi'], default: 'qr' },
    details:     { type: String, default: '', trim: true },      // UPI ID / number (QR me khali)
    qrImage:     { type: String, default: '' },
    status:      { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending', index: true },
    note:        { type: String, default: '' },
    processedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    processedAt: { type: Date },
  },
  { timestamps: true, collection: 'withdraw_requests' }
)

module.exports = mongoose.models.WithdrawRequest || mongoose.model('WithdrawRequest', withdrawRequestSchema)