// "09:46" (24h) aur "09:46 AM" (12h) dono formats chalenge
const toMinutes = (t) => {
  if (!t) return null
  const m = String(t).trim().match(/^(\d{1,2}):(\d{2})\s*(AM|PM)?$/i)
  if (!m) return null
  let h = Number(m[1])
  const min = Number(m[2])
  const ap = m[3] && m[3].toUpperCase()
  if (ap === 'PM' && h < 12) h += 12
  if (ap === 'AM' && h === 12) h = 0
  return h * 60 + min
}

// Server UTC me ho tab bhi IST ka time milega
const nowMinutesIST = () => {
  const parts = new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Asia/Kolkata',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).formatToParts(new Date())
  const h = Number(parts.find((p) => p.type === 'hour').value) % 24
  const m = Number(parts.find((p) => p.type === 'minute').value)
  return h * 60 + m
}

const todayIST = () =>
  new Date(Date.now() + 5.5 * 3600 * 1000).toISOString().slice(0, 10)

const isInsideWindow = (open, close, now) =>
  open <= close ? now >= open && now < close : now >= open || now < close // raat wale games

// Bet sirf open time se close time ke beech
exports.checkBetting = (game) => {
  const open = toMinutes(game.openTime)
  const close = toMinutes(game.closeTime)
  if (open === null || close === null) return { ok: true }

  const now = nowMinutesIST()
  if (isInsideWindow(open, close, now)) return { ok: true }

  if (open <= close && now >= close) {
    return { ok: false, message: 'Is game ka time khatam ho gaya hai' }
  }
  return { ok: false, message: `Bet ${game.openTime} ke baad hi laga sakte ho` }
}

// Result declare: session 'open' | 'close', day = 'YYYY-MM-DD'
exports.checkResultDeclare = (game, session, day) => {
  const today = todayIST()

  if (day > today) {
    return { ok: false, message: 'Aane wale din ka result declare nahi ho sakta' }
  }
  if (day < today) return { ok: true } // purane din ka result

  const open = toMinutes(game.openTime)
  const close = toMinutes(game.closeTime)

  // Raat wale (overnight) games me time check skip
  if (open !== null && close !== null && open > close) return { ok: true }

  const needTime =
    session === 'open' ? game.openTime : game.resultTime || game.closeTime
  const t = toMinutes(needTime)
  if (t === null) return { ok: true }

  if (nowMinutesIST() >= t) return { ok: true }
  return {
    ok: false,
    message: `${session === 'open' ? 'OPEN' : 'CLOSE'} result ${needTime} se pehle declare nahi ho sakta`,
  }
}
