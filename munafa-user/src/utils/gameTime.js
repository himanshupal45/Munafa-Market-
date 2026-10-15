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

// Browser kisi bhi timezone me ho, IST ka time milega
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

// 'open' | 'upcoming' | 'closed' | 'unknown'
export const getBettingState = (game) => {
  const open = toMinutes(game?.openTime)
  const close = toMinutes(game?.closeTime)
  if (open === null || close === null) return 'unknown'
  const now = nowMinutesIST()
  const inside = open <= close ? now >= open && now < close : now >= open || now < close
  if (inside) return 'open'
  if (open <= close && now < open) return 'upcoming'
  return 'closed'
}

// "13:05" -> "01:05 PM"
export const formatTime = (t) => {
  const mins = toMinutes(t)
  if (mins === null) return t || '--:--'
  const h24 = Math.floor(mins / 60)
  const m = String(mins % 60).padStart(2, '0')
  const ap = h24 >= 12 ? 'PM' : 'AM'
  const h12 = h24 % 12 === 0 ? 12 : h24 % 12
  return `${String(h12).padStart(2, '0')}:${m} ${ap}`
}