const mongoose = require('mongoose')
const User = require('../models/User')
const Bet = require('../models/Bet')
const WalletTransaction = require('../models/WalletTransaction')

const WALLET_FIELD = 'wallet' // ⚠️ wahi field jo baaki files me hai

// Bet ka type nikalna. null = abhi settle nahi hota (Panel Group, Sangam waghera)
const kindOf = (bet) => {
  const t = `${bet.type || ''} ${bet.typeLabel || ''}`.toLowerCase()
  if (!t.trim()) return null
  if (t.includes('panel') || t.includes('group') || t.includes('sangam')) return null
  if (t.includes('triple')) return 'triple'
  if (t.includes('double')) return 'double'
  if (t.includes('pana') || t.includes('patti') || t.includes('panna')) return 'single'
  if (t.includes('jodi')) return 'jodi'
  return 'digit'
}

// 'won' | 'lost' | null (null = result abhi poora nahi / type support nahi)
const evaluateBet = (bet, doc) => {
  const kind = kindOf(bet)
  if (!kind) return null

  const num = String(bet.betNumber)
  const sess = bet.session === 'close' ? 'close' : 'open'

  if (kind === 'jodi') {
    if (!doc.openPana || !doc.closePana) return null // jodi ke liye dono chahiye
    return num === `${doc.openDigit}${doc.closeDigit}` ? 'won' : 'lost'
  }

  const pana = sess === 'open' ? doc.openPana : doc.closePana
  if (!pana) return null

  if (kind === 'digit') {
    return num === (sess === 'open' ? doc.openDigit : doc.closeDigit) ? 'won' : 'lost'
  }
  return num === pana ? 'won' : 'lost' // single / double / triple pana
}

// Win amount = bet points x (rate.win / rate.bet)  — bet lagte waqt ka rate
const winAmountOf = (bet) => {
  const rb = Number(bet.rate?.bet) || 0
  const rw = Number(bet.rate?.win) || 0
  return rb > 0 && rw > 0 ? (Number(bet.betAmount) * rw) / rb : 0
}

// Result declare hone par us game + din ki PENDING bets ka hisaab
async function settleBets({ game, date, doc, adminId }) {
  const start = new Date(`${date}T00:00:00+05:30`)
  const end = new Date(start.getTime() + 24 * 3600 * 1000)
  const out = { won: 0, lost: 0, payout: 0 }

  const session = await mongoose.startSession()
  try {
    await session.withTransaction(async () => {
      out.won = 0; out.lost = 0; out.payout = 0 // transaction dobara chale to reset

      const bets = await Bet.find({
        game: game._id,
        status: 'Pending', // sirf pending — dobara settle nahi hoga
        $or: [{ date }, { betDate: { $gte: start, $lt: end } }],
      }).session(session)

      const ops = []
      const winsByUser = new Map()

      for (const b of bets) {
        const result = evaluateBet(b, doc)
        if (!result) continue

        if (result === 'won') {
          const amt = winAmountOf(b)
          if (amt <= 0) continue // rate save nahi hai (purani bet) — pending hi rehne do
          ops.push({
            updateOne: {
              filter: { _id: b._id, status: 'Pending' },
              update: { $set: { status: 'Won', winAmount: amt } },
            },
          })
          const k = String(b.user)
          winsByUser.set(k, (winsByUser.get(k) || 0) + amt)
          out.won += 1
          out.payout += amt
        } else {
          ops.push({
            updateOne: {
              filter: { _id: b._id, status: 'Pending' },
              update: { $set: { status: 'Lost', winAmount: 0 } },
            },
          })
          out.lost += 1
        }
      }

      if (ops.length) await Bet.bulkWrite(ops, { session })

      // Jeetne walon ke wallet me paisa + history entry
      for (const [uid, total] of winsByUser) {
        const user = await User.findByIdAndUpdate(uid, { $inc: { [WALLET_FIELD]: total } }, { new: true, session })
        if (!user) continue
        await WalletTransaction.create(
          [{
            user: user._id,
            type: 'credit',
            points: total,
            balanceAfter: user[WALLET_FIELD],
            note: `Win: ${game.name} (${date})`,
            source: 'win',
            createdBy: adminId,
          }],
          { session }
        )
      }
    })
  } finally {
    session.endSession()
  }
  return out
}

module.exports = { settleBets, evaluateBet, kindOf, winAmountOf }