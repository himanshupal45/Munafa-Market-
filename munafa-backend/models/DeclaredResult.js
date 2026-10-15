const mongoose = require('mongoose')

// Ek game ka ek din ka result — open aur close pana dono ek hi document me
const declaredResultSchema = new mongoose.Schema(
  {
    game:       { type: mongoose.Schema.Types.ObjectId, ref: 'Game' },
    gameName:   { type: String, index: true },
    date:       { type: String, index: true },   // YYYY-MM-DD (IST)

    openPana:   { type: String },                // jaise "123"
    openDigit:  { type: String },                // pana ke ank ka sum % 10
    closePana:  { type: String },
    closeDigit: { type: String },

    result:     { type: String },                // dikhane wala: "123-65-456"
    isPublished:{ type: Boolean, default: false },
  },
  { timestamps: true, collection: 'gameresults' } // Atlas ki wahi purani collection
)

module.exports = mongoose.model('DeclaredResult', declaredResultSchema)