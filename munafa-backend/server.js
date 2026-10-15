const express = require('express')
const cors = require('cors')
const path = require('path')
require('dotenv').config()

const connectDB = require('./config/db')

// ─── Connect to MongoDB ─────────────────────────────
connectDB()

const app = express()

// ─── CORS ───────────────────────────────────────────
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:5174',
  'http://localhost:5175',   // extra safety
  'http://localhost:3000',
  process.env.FRONTEND_URL,
].filter(Boolean)

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (mobile apps, Postman, curl)
      if (!origin) return callback(null, true)
      if (allowedOrigins.includes(origin)) return callback(null, true)
      console.warn('❌ CORS blocked:', origin)
      callback(new Error(`CORS blocked: ${origin}`))
    },
    credentials: true,
  })
)

// ─── Body Parsers ───────────────────────────────────
app.use(express.json({ limit: '5mb' }))
app.use(express.urlencoded({ extended: true, limit: '5mb' }))

// ─── Static Files ───────────────────────────────────
app.use('/uploads', express.static(path.join(__dirname, 'uploads')))

// ─── ROUTES ─────────────────────────────────────────
app.use('/api/auth', require('./routes/auth'))
app.use('/api/users', require('./routes/users'))
app.use('/api/games/bets', require('./routes/bets'))
app.use('/api/games/results', require('./routes/results'))
app.use('/api/ledger', require('./routes/ledger'))
app.use('/api/deposit-requests', require('./routes/deposits'))
app.use('/api/payments', require('./routes/payments'))
app.use('/api/games', require('./routes/games'))

// ✅ Withdraw routes /api/wallet se PEHLE hona zaroori hai
app.use('/api/wallet/withdrawals', require('./routes/withdrawRoutes'))
app.use('/api/wallet', require('./routes/wallet'))

app.use('/api/game-rates', require('./routes/gameRates'))
app.use('/api', require('./routes/misc'))
app.use('/api/payment-qr', require('./routes/paymentQR'))

// ─── Health Check ───────────────────────────────────
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'Munafa Backend chal raha hai ✅',
    timestamp: new Date(),
    env: process.env.NODE_ENV || 'development',
  })
})

// ─── 404 Handler ────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route nahi mila: ${req.method} ${req.originalUrl}`,
  })
})

// ─── Global Error Handler ───────────────────────────
app.use((err, req, res, next) => {
  console.error('❌ Error:', err.message)
  console.error(err.stack)

  // CORS error
  if (err.message && err.message.startsWith('CORS blocked')) {
    return res.status(403).json({
      success: false,
      message: err.message,
    })
  }

  // Multer error (file bahut badi / galat type)
  if (err.name === 'MulterError') {
    return res.status(400).json({
      success: false,
      message: err.code === 'LIMIT_FILE_SIZE' ? 'Image 5MB se choti honi chahiye' : err.message,
    })
  }

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    return res.status(400).json({
      success: false,
      message: 'Validation error',
      errors: Object.values(err.errors).map((e) => e.message),
    })
  }

  // Mongoose duplicate key error
  if (err.code === 11000) {
    const field = Object.keys(err.keyPattern || {})[0] || 'field'
    return res.status(409).json({
      success: false,
      message: `Duplicate value for ${field}`,
    })
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({
      success: false,
      message: 'Invalid token',
    })
  }
  if (err.name === 'TokenExpiredError') {
    return res.status(401).json({
      success: false,
      message: 'Token expired — dobara login karein',
    })
  }

  // Default
  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || 'Server error',
  })
})

// ─── Start Server ───────────────────────────────────
const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
  console.log('')
  console.log('═══════════════════════════════════════════════')
  console.log(`🚀 Munafa Server PORT ${PORT} par chal raha hai`)
  console.log(`📡 API:      http://localhost:${PORT}/api`)
  console.log(`❤️  Health:   http://localhost:${PORT}/api/health`)
  console.log(`🌍 Env:      ${process.env.NODE_ENV || 'development'}`)
  console.log(`✅ CORS:     ${allowedOrigins.join(', ')}`)
  console.log('═══════════════════════════════════════════════')
  console.log('')
})