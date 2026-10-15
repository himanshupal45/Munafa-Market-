const express = require('express')
const router = express.Router()
const {
  getAllGames, createGame, updateGame, deleteGame,
  getResults, addResult, publishResult,
  getBetReport, placeBet,
} = require('../controllers/gameController')
const { protect, adminOnly, adminOrSubadmin } = require('../middleware/auth')

// Games
router.get('/', protect, getAllGames)
router.post('/', protect, adminOnly, createGame)
router.put('/:id', protect, adminOnly, updateGame)
router.delete('/:id', protect, adminOnly, deleteGame)

// Results
router.get('/results', protect, adminOrSubadmin, getResults)
router.post('/results', protect, adminOrSubadmin, addResult)
router.put('/results/:id/publish', protect, adminOrSubadmin, publishResult)

// Bets
router.get('/bets', protect, adminOrSubadmin, getBetReport)
router.post('/bets/place', protect, placeBet)

module.exports = router
