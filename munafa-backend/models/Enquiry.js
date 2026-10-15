const mongoose = require('mongoose')

const enquirySchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  name: String,
  mobile: String,
  message: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ['Pending', 'Resolved', 'Closed'],
    default: 'Pending',
  },
  reply: String,
  repliedAt: Date,
}, { timestamps: true })

module.exports = mongoose.model('Enquiry', enquirySchema)
