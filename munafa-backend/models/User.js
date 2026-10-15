const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')

const userSchema = new mongoose.Schema({
  userId: {
    type: String,
    unique: true,
  },
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
  },
  mobile: {
    type: String,
    required: [true, 'Mobile number is required'],
    unique: true,
    trim: true,
    match: [/^[6-9]\d{9}$/, 'Valid 10 digit mobile number daalo'],
  },
  email: {
    type: String,
    trim: true,
    lowercase: true,
    match: [/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/, 'Valid email daalo'],
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: 6,
    select: false,
  },
  role: {
    type: String,
    enum: ['admin', 'subadmin', 'user'],
    default: 'user',
  },
  assignedRole: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Role',
  },
  wallet: {
    type: Number,
    default: 0,
  },
  status: {
    type: String,
    enum: ['Active', 'Inactive', 'Blocked'],
    default: 'Active',
  },
  profileImage: {
    type: String,
    default: '',
  },
  referralCode: {
    type: String,
  },
  referredBy: {
    type: String,
  },
}, { timestamps: true })

// Email unique, lekin purane users (jinke email nahi / khaali hai) ko ignore karo
userSchema.index(
  { email: 1 },
  { unique: true, partialFilterExpression: { email: { $type: 'string', $gt: '' } } }
)

// Auto-generate userId before save
userSchema.pre('save', async function (next) {
  // Hash password if modified
  if (this.isModified('password')) {
    const salt = await bcrypt.genSalt(10)
    this.password = await bcrypt.hash(this.password, salt)
  }

  // Generate userId if new user
  if (this.isNew && !this.userId) {
    const count = await mongoose.model('User').countDocuments()
    this.userId = `DA${1000 + count}`
  }

  next()
})

// Match password
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password)
}

module.exports = mongoose.model('User', userSchema)