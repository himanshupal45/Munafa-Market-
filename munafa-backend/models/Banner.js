const mongoose = require('mongoose')

const bannerSchema = new mongoose.Schema({
  title: {
    type: String,
    trim: true,
  },
  image: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    enum: ['App Banner', 'Carousel'],
    default: 'App Banner',
  },
  link: String,
  status: {
    type: String,
    enum: ['Active', 'Inactive'],
    default: 'Active',
  },
  order: {
    type: Number,
    default: 0,
  },
}, { timestamps: true })

module.exports = mongoose.model('Banner', bannerSchema)
