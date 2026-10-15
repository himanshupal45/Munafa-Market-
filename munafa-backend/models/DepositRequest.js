const mongoose = require('mongoose')

const depositRequestSchema = new mongoose.Schema(
  {
    user:        { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    userName:    { type: String, default: '' },
    userMobile:  { type: String, default: '' },
    amount:      { type: Number, required: true, min: 1 },
    utr:         { type: String, required: true, unique: true, uppercase: true, trim: true },
    method:      { type: String, enum: ['upi', 'qr'], default: 'upi' },      // ✅ naya
    paymentApp:  { type: String, default: '' },                              // ✅ naya: phonepe / gpay / paytm / upi-qr
    status:      { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending', index: true },
    note:        { type: String, default: '' },
    processedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    processedAt: { type: Date },
  },
  { timestamps: true } // collection ka naam default hi rakha hai, taaki purani requests na ghayab hon
)

module.exports = mongoose.model('DepositRequest', depositRequestSchema)