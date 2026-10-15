const Game = require('../models/Game')
const GameResult = require('../models/GameResult')
const Bet = require('../models/Bet')
const User = require('../models/User')
const { checkBetting, checkResultDeclare } = require('../utils/gameTime') // ✅ naya

const todayIST = () => new Date(Date.now() + 5.5 * 3600 * 1000).toISOString().slice(0, 10)

// @desc  Get all games
// @route GET /api/games
exports.getAllGames = async (req, res) => {
  try {
    const games = await Game.find().sort({ createdAt: -1 })
    res.json({ success: true, games })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

// @desc  Create game  (resultTime Game model me hai, to req.body se save ho jayega)
// @route POST /api/games
exports.createGame = async (req, res) => {
  try {
    const game = await Game.create(req.body)
    res.status(201).json({ success: true, message: 'Game create ho gaya', game })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

// @desc  Update game
// @route PUT /api/games/:id
exports.updateGame = async (req, res) => {
  try {
    const game = await Game.findByIdAndUpdate(req.params.id, req.body, { new: true })
    if (!game) return res.status(404).json({ success: false, message: 'Game nahi mila' })
    res.json({ success: true, message: 'Game update ho gaya', game })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

// @desc  Delete game
// @route DELETE /api/games/:id
exports.deleteGame = async (req, res) => {
  try {
    await Game.findByIdAndDelete(req.params.id)
    res.json({ success: true, message: 'Game delete ho gaya' })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

// ==================== RESULTS ====================

// @desc  Get all results
// @route GET /api/games/results
exports.getResults = async (req, res) => {
  try {
    const { page = 1, limit = 20, gameId } = req.query
    const query = gameId ? { game: gameId } : {}

    const total = await GameResult.countDocuments(query)
    const results = await GameResult.find(query)
      .populate('game', 'name code')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit))

    res.json({ success: true, total, results })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

// @desc  Add result
// @route POST /api/games/results
exports.addResult = async (req, res) => {
  try {
    const { gameId, result } = req.body

    const game = await Game.findById(gameId)
    if (!game) return res.status(404).json({ success: false, message: 'Game nahi mila' })

    // ✅ TIME CHECK: result close time/result time se pehle nahi
    const timeCheck = checkResultDeclare(game, 'close', todayIST())
    if (!timeCheck.ok) {
      return res.status(400).json({ success: false, message: timeCheck.message })
    }

    const gameResult = await GameResult.create({
      game: gameId,
      gameName: game.name,
      result,
    })

    res.status(201).json({ success: true, message: 'Result add ho gaya', gameResult })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

// @desc  Publish result (and settle bets)
// @route PUT /api/games/results/:id/publish
exports.publishResult = async (req, res) => {
  try {
    const gameResult = await GameResult.findById(req.params.id).populate('game')
    if (!gameResult) return res.status(404).json({ success: false, message: 'Result nahi mila' })

    // Mark result as published
    gameResult.isPublished = true
    gameResult.publishedAt = new Date()
    await gameResult.save()

    // Settle pending bets for this game on this date
    const todayStart = new Date()
    todayStart.setHours(0, 0, 0, 0)

    const pendingBets = await Bet.find({
      game: gameResult.game._id,
      status: 'Pending',
      betDate: { $gte: todayStart },
    })

    for (const bet of pendingBets) {
      if (bet.betNumber === gameResult.result) {
        // Winner
        const winAmount = bet.betAmount * (gameResult.game.winMultiplier || 9)
        bet.status = 'Won'
        bet.winAmount = winAmount
        await bet.save()

        // Credit wallet
        await User.findByIdAndUpdate(bet.user, { $inc: { wallet: winAmount } })
      } else {
        bet.status = 'Lost'
        await bet.save()
      }
    }

    res.json({ success: true, message: 'Result publish ho gaya aur bets settle ho gaye', gameResult })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

// ==================== BETS ====================

// @desc  Get bet report
// @route GET /api/games/bets
exports.getBetReport = async (req, res) => {
  try {
    const { page = 1, limit = 20, gameId, status, userId } = req.query
    const query = {}
    if (gameId) query.game = gameId
    if (status) query.status = status
    if (userId) query.user = userId

    const total = await Bet.countDocuments(query)
    const bets = await Bet.find(query)
      .populate('user', 'name mobile userId')
      .populate('game', 'name code')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit))

    res.json({ success: true, total, bets })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

// @desc  Place a bet (user)  — purana route, naya route routes/Bets.js hai
// @route POST /api/games/bets/place
exports.placeBet = async (req, res) => {
  try {
    const { gameId, betNumber, betAmount } = req.body
    const amount = Number(betAmount)

    if (!Number.isFinite(amount) || amount <= 0) {
      return res.status(400).json({ success: false, message: 'Bet amount galat hai' })
    }

    const game = await Game.findById(gameId)
    if (!game || game.status !== 'Active') {
      return res.status(400).json({ success: false, message: 'Game available nahi hai' })
    }

    // ✅ TIME CHECK: wallet kaatne se pehle
    const timeCheck = checkBetting(game)
    if (!timeCheck.ok) {
      return res.status(400).json({ success: false, message: timeCheck.message })
    }

    // ✅ Wallet atomic kaato (do request ek saath aaye to balance minus me na jaye)
    const user = await User.findOneAndUpdate(
      { _id: req.user._id, wallet: { $gte: amount } },
      { $inc: { wallet: -amount } },
      { new: true }
    )
    if (!user) {
      return res.status(400).json({ success: false, message: 'Wallet mein balance nahi hai' })
    }

    const bet = await Bet.create({
      user: user._id,
      game: gameId,
      gameName: game.name,
      betNumber,
      betAmount: amount,
    })

    res.status(201).json({ success: true, message: 'Bet laga di gayi', bet })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}