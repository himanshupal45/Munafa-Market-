const express = require('express')
const router = express.Router()
const { getRates, createRate, updateRates, deleteRate } = require('../controllers/gameRateController')
const { protect, adminOnly } = require('../middleware/auth')

router.get('/',        getRates)                       // public (site-settings jaisa)
router.post('/',       protect, adminOnly, createRate)
router.put('/',        protect, adminOnly, updateRates)
router.delete('/:key', protect, adminOnly, deleteRate)

module.exports = router