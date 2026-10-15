const mongoose = require('mongoose')

const rateSchema = new mongoose.Schema({
  key:    { type: String, required: true },
  label:  { type: String, required: true },
  value1: { type: Number, required: true },
  value2: { type: Number, required: true },
}, { _id: false })

const siteSettingSchema = new mongoose.Schema({
  siteName:         { type: String, default: 'Munafa' },
  logo:             { type: String, default: '' },
  contactNumber:    { type: String, default: '' },
  whatsappNumber:   { type: String, default: '' },
  telegramLink:     { type: String, default: '' },
  youtubeLink:      { type: String, default: '' },
  minDeposit:       { type: Number, default: 100 },
  maxDeposit:       { type: Number, default: 50000 },
  minWithdraw:      { type: Number, default: 200 },
  maxWithdraw:      { type: Number, default: 50000 },
  registrationBonus:{ type: Number, default: 20 },
  referralBonus:    { type: Number, default: 50 },
  maintenanceMode:  { type: Boolean, default: false },
  aboutUs:          { type: String, default: '' },
  privacyPolicy:    { type: String, default: '' },
  gameRules:        { type: String, default: '' },
  notes:            { type: String, default: '' },

  // ✅ Game Rates — khaali array, koi default nahi
  gameRates: {
    type: [rateSchema],
    default: [],
  },
}, { timestamps: true, strict: false })

module.exports = mongoose.model('SiteSetting', siteSettingSchema)