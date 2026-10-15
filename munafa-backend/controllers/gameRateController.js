const GameRate = require('../models/GameRate')

const list = () => GameRate.find().sort({ order: 1, createdAt: 1 }).lean()

// GET /api/game-rates
exports.getRates = async (req, res) => {
  try {
    res.json({ success: true, rates: await list() })
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
}

// POST /api/game-rates
exports.createRate = async (req, res) => {
  try {
    const { key, label, value1, value2 } = req.body
    if (!key || !label || value1 == null || value2 == null)
      return res.status(400).json({ success: false, message: 'All fields required' })

    if (await GameRate.findOne({ key }))
      return res.status(409).json({ success: false, message: 'Ye game already exist karta hai' })

    const order = await GameRate.countDocuments()
    await GameRate.create({ key, label, value1: Number(value1), value2: Number(value2), order })
    res.status(201).json({ success: true, rates: await list() })
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
}

// PUT /api/game-rates
exports.updateRates = async (req, res) => {
  try {
    const { rates } = req.body
    if (!Array.isArray(rates))
      return res.status(400).json({ success: false, message: 'rates array required' })

    if (rates.length) {
      await GameRate.bulkWrite(
        rates.map(r => ({
          updateOne: {
            filter: { key: r.key },
            update: { $set: { label: r.label, value1: Number(r.value1), value2: Number(r.value2) } },
          },
        }))
      )
    }
    res.json({ success: true, rates: await list() })
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
}

// DELETE /api/game-rates/:key
exports.deleteRate = async (req, res) => {
  try {
    await GameRate.deleteOne({ key: req.params.key })
    res.json({ success: true, rates: await list() })
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
}