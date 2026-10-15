import React, { useState, useEffect, useMemo, useCallback } from 'react'
import { Home as HomeIcon, Minus, X, Trophy } from 'lucide-react'
import { gamesAPI } from '../../services/api'
import './WinnerPrediction.css'

// ============================================
// HELPERS
// ============================================
const todayStr = () => {
  const d = new Date()
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

// Saari valid 3-digit panna (220)
const PANA_OPTIONS = (() => {
  const rank = (d) => (d === 0 ? 10 : d)
  const list = []
  for (let a = 0; a <= 9; a++)
    for (let b = 0; b <= 9; b++)
      for (let c = 0; c <= 9; c++)
        if (rank(a) <= rank(b) && rank(b) <= rank(c)) list.push(`${a}${b}${c}`)
  return list.sort((x, y) => Number(x) - Number(y))
})()

const digitOf = (pana) =>
  pana && pana.length === 3
    ? String([...pana].reduce((s, n) => s + Number(n), 0) % 10)
    : null

const panaKind = (p) => {
  const u = new Set(p).size
  return u === 1 ? 'triple' : u === 2 ? 'double' : 'single'
}

// Bet ke type (key/label) se kind
const kindOf = (bet) => {
  const t = `${bet.type || ''} ${bet.typeLabel || ''}`.toLowerCase()
  if (t.includes('panel') || t.includes('group') || t.includes('sangam')) return 'other'
  if (t.includes('triple')) return 'triple'
  if (t.includes('double')) return 'double'
  if (t.includes('pana') || t.includes('patti') || t.includes('panna')) return 'single'
  if (t.includes('jodi')) return 'jodi'
  return 'digit'
}

// Chune hue pana par is bet ka winning amount (0 = nahi jeeta / hisaab possible nahi)
const winningPoints = (bet, openPana, closePana) => {
  if (!openPana && !closePana) return 0
  const kind = kindOf(bet)
  const oD = digitOf(openPana)
  const cD = digitOf(closePana)
  let target = null

  if (kind === 'digit') target = bet.session === 'close' ? cD : oD
  else if (kind === 'jodi') target = oD && cD ? `${oD}${cD}` : null
  else if (['single', 'double', 'triple'].includes(kind)) {
    const p = bet.session === 'close' ? closePana : openPana
    target = p && panaKind(p) === kind ? p : null
  }

  if (target == null || String(bet.betNumber) !== String(target)) return 0
  const rb = Number(bet.rate?.bet) || 0
  const rw = Number(bet.rate?.win) || 0
  return rb > 0 ? (Number(bet.betAmount) * rw) / rb : 0
}

const PAGE_SIZE = 10

// ============================================
// MAIN
// ============================================
export default function WinnerPrediction() {
  const [filtersOpen, setFiltersOpen] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')

  // Filters (form)
  const [date, setDate] = useState(todayStr())
  const [gameId, setGameId] = useState('')
  const [session, setSession] = useState('')
  const [openPana, setOpenPana] = useState('')
  const [closePana, setClosePana] = useState('')

  // API data
  const [games, setGames] = useState([])
  const [bets, setBets] = useState([])
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState(null)
  const [page, setPage] = useState(1)

  const showMsg = (type, text) => {
    setMessage({ type, text })
    setTimeout(() => setMessage(null), 4000)
  }

  // ---------- Games dropdown ----------
  useEffect(() => {
    ;(async () => {
      try {
        const res = await gamesAPI.getAll()
        if (res?.success) setGames(res.games || [])
      } catch (err) {
        showMsg('err', err.message || 'Games load nahi hue')
      }
    })()
  }, [])

  // ---------- Bets (sab users ki) ----------
  const fetchBets = useCallback(async () => {
    setLoading(true)
    try {
      const params = { date }
      if (gameId) params.gameId = gameId
      if (session) params.session = session
      const res = await gamesAPI.getAllBets(params)
      if (res?.success) setBets(res.bets || [])
    } catch (err) {
      showMsg('err', err.message || 'Bets load nahi hui')
      setBets([])
    } finally {
      setLoading(false)
    }
  }, [date, gameId, session])

  // Page khulte hi aaj ki saari bets dikhein
  useEffect(() => { fetchBets() }, []) // eslint-disable-line react-hooks/exhaustive-deps

  // ---------- Rows (winning points ke saath) ----------
  const rows = useMemo(
    () =>
      bets.map((b) => ({
        ...b,
        win: winningPoints(b, openPana, closePana),
      })),
    [bets, openPana, closePana]
  )

  const filteredRows = useMemo(() => {
    const q = searchTerm.trim().toLowerCase()
    if (!q) return rows
    return rows.filter((r) =>
      [r.userName, r.userMobile, r.gameName, r.typeLabel, r.betNumber, r.date]
        .join(' ')
        .toLowerCase()
        .includes(q)
    )
  }, [rows, searchTerm])

  const totalPages = Math.max(1, Math.ceil(filteredRows.length / PAGE_SIZE))
  const pageRows = filteredRows.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)
  useEffect(() => { setPage(1) }, [searchTerm, bets])

  const totalBid = filteredRows.reduce((s, r) => s + Number(r.betAmount || 0), 0)
  const totalWin = filteredRows.reduce((s, r) => s + r.win, 0)
  const winnersCount = filteredRows.filter((r) => r.win > 0).length
  const uniqueUsers = new Set(filteredRows.map((r) => String(r.userId))).size

  // ---------- Submit ----------
  const handleSubmit = () => {
    if ((openPana || closePana) && !gameId)
      showMsg('err', 'Winning dekhne ke liye pehle Game select karo')
    fetchBets()
  }

  // ---------- Export ----------
  const exportData = filteredRows.map((r, i) => ({
    '#': i + 1,
    'User Name': r.userName,
    Mobile: r.userMobile,
    'Bid Points': r.betAmount,
    'Winning Points': r.win,
    'Market Name': r.gameName,
    'Game Name': r.typeLabel || r.type,
    'Bid number': r.betNumber,
    Date: r.date,
  }))

  const handleCopy = () => {
    if (!exportData.length) return showMsg('err', 'Copy karne ke liye data nahi hai')
    const text = exportData.map((row) => Object.values(row).join('\t')).join('\n')
    navigator.clipboard.writeText(text).then(() => showMsg('ok', 'Copied ✅'))
  }

  const handleCSV = () => {
    if (!exportData.length) return showMsg('err', 'Export ke liye data nahi hai')
    const headers = Object.keys(exportData[0]).join(',')
    const body = exportData
      .map((row) => Object.values(row).map((v) => `"${String(v).replace(/"/g, '""')}"`).join(','))
      .join('\n')
    const blob = new Blob([`${headers}\n${body}`], { type: 'text/csv' })
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.download = `winner_prediction_${Date.now()}.csv`
    link.click()
    URL.revokeObjectURL(link.href)
  }

  const handleExcel = () => {
    if (!exportData.length) return showMsg('err', 'Export ke liye data nahi hai')
    let html = '<table><thead><tr>'
    Object.keys(exportData[0]).forEach((k) => (html += `<th>${k}</th>`))
    html += '</tr></thead><tbody>'
    exportData.forEach((row) => {
      html += '<tr>' + Object.values(row).map((v) => `<td>${v}</td>`).join('') + '</tr>'
    })
    html += '</tbody></table>'
    const blob = new Blob([html], { type: 'application/vnd.ms-excel' })
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.download = `winner_prediction_${Date.now()}.xls`
    link.click()
    URL.revokeObjectURL(link.href)
  }

  const handlePrint = () => {
    if (!exportData.length) return showMsg('err', 'Print ke liye data nahi hai')
    const w = window.open('', '_blank')
    if (!w) return showMsg('err', 'Popup block hai, allow karo')
    w.document.write(`<html><head><title>Winner Prediction</title>
      <style>body{font-family:Arial;padding:20px}table{width:100%;border-collapse:collapse}
      th,td{border:1px solid #ddd;padding:8px}th{background:#f5f5f5}</style></head><body>
      <h2>Winner Prediction</h2>
      <table><thead><tr>${Object.keys(exportData[0]).map((k) => `<th>${k}</th>`).join('')}</tr></thead>
      <tbody>${exportData.map((row) => `<tr>${Object.values(row).map((v) => `<td>${v}</td>`).join('')}</tr>`).join('')}</tbody>
      </table></body></html>`)
    w.document.close()
    w.focus()
    setTimeout(() => { w.print(); w.close() }, 250)
  }

  const gameLabel = (g) =>
    g.closeTime ? `${g.name} (${g.openTime} - ${g.closeTime})` : `${g.name} (${g.openTime || '--'})`

  // ============================================
  // RENDER
  // ============================================
  return (
    <div className="wp-page">
      <div className="wp-breadcrumb">
        <HomeIcon size={14} />
        <span>Home</span>
        <span className="wp-breadcrumb-sep">/</span>
        <span>Winning prediction</span>
      </div>

      <div className="wp-page-title-wrapper">
        <Trophy size={26} className="wp-page-title-icon" />
        <h1 className="wp-page-title">Winning prediction</h1>
      </div>

      {message && (
        <div
          role="status"
          style={{
            margin: '0 0 12px',
            padding: '10px 14px',
            borderRadius: 8,
            fontSize: 14,
            background: message.type === 'ok' ? '#dcfce7' : '#fee2e2',
            color: message.type === 'ok' ? '#166534' : '#991b1b',
          }}
        >
          {message.text}
        </div>
      )}

      {filtersOpen && (
        <div className="wp-card wp-filters-card">
          <div className="wp-filters-header">
            <h3 className="wp-filters-title">Filters</h3>
            <div className="wp-filters-actions">
              <button className="wp-icon-btn" onClick={() => setFiltersOpen(false)} title="Minimize" type="button">
                <Minus size={16} />
              </button>
              <button className="wp-icon-btn" onClick={() => setFiltersOpen(false)} title="Close" type="button">
                <X size={16} />
              </button>
            </div>
          </div>

          <div className="wp-filters-body">
            <div className="wp-filters-row">
              <div className="wp-form-group">
                <label className="wp-label">Date</label>
                <input type="date" className="wp-input" value={date} onChange={(e) => setDate(e.target.value)} />
              </div>

              <div className="wp-form-group">
                <label className="wp-label">Game</label>
                <select className="wp-select" value={gameId} onChange={(e) => setGameId(e.target.value)}>
                  <option value="">All Games</option>
                  {games.map((g) => (
                    <option key={g._id} value={g._id}>{gameLabel(g)}</option>
                  ))}
                </select>
              </div>

              <div className="wp-form-group">
                <label className="wp-label">Session</label>
                <select className="wp-select" value={session} onChange={(e) => setSession(e.target.value)}>
                  <option value="">All Sessions</option>
                  <option value="open">Open Market</option>
                  <option value="close">Close Market</option>
                </select>
              </div>

              <div className="wp-form-group">
                <label className="wp-label">Open Pana</label>
                <select className="wp-select" value={openPana} onChange={(e) => setOpenPana(e.target.value)}>
                  <option value="">Select Pana</option>
                  {PANA_OPTIONS.map((p) => (
                    <option key={p} value={p}>{p}</option>
                  ))}
                </select>
              </div>

              <div className="wp-form-group">
                <label className="wp-label">Close Pana</label>
                <select className="wp-select" value={closePana} onChange={(e) => setClosePana(e.target.value)}>
                  <option value="">Select Pana</option>
                  {PANA_OPTIONS.map((p) => (
                    <option key={p} value={p}>{p}</option>
                  ))}
                </select>
              </div>
            </div>

            <button className="wp-submit-btn" onClick={handleSubmit} type="button" disabled={loading}>
              {loading ? 'Loading...' : 'Submit'}
            </button>
          </div>
        </div>
      )}

      <div className="wp-card wp-table-card">
        {/* Summary */}
        <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap', padding: '4px 0 12px', fontSize: 14 }}>
          <span><b>{uniqueUsers}</b> users</span>
          <span><b>{filteredRows.length}</b> bets</span>
          <span>Total bid: <b>{totalBid.toLocaleString('en-IN')}</b></span>
          {(openPana || closePana) && (
            <>
              <span>Winners: <b style={{ color: '#16a34a' }}>{winnersCount}</b></span>
              <span>Total winning: <b style={{ color: '#16a34a' }}>{totalWin.toLocaleString('en-IN')}</b></span>
            </>
          )}
          {!filtersOpen && (
            <button className="wp-toolbar-btn" type="button" onClick={() => setFiltersOpen(true)}>
              Show Filters
            </button>
          )}
        </div>

        <div className="wp-toolbar">
          <div className="wp-toolbar-buttons">
            <button className="wp-toolbar-btn" onClick={handleCopy} type="button">Copy</button>
            <button className="wp-toolbar-btn" onClick={handleCSV} type="button">CSV</button>
            <button className="wp-toolbar-btn" onClick={handleExcel} type="button">Excel</button>
            <button className="wp-toolbar-btn" onClick={handlePrint} type="button">PDF</button>
            <button className="wp-toolbar-btn" onClick={handlePrint} type="button">Print</button>
          </div>
          <div className="wp-toolbar-search">
            <label>Search:</label>
            <input
              type="text"
              className="wp-search-input"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="wp-table-wrapper">
          <table className="wp-table">
            <thead>
              <tr>
                <th>#</th>
                <th>User Name</th>
                <th>Bid Points</th>
                <th>Winning Points</th>
                <th>Market Name</th>
                <th>Game Name</th>
                <th>Bid number</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="8" className="wp-table-empty">Loading...</td></tr>
              ) : pageRows.length === 0 ? (
                <tr><td colSpan="8" className="wp-table-empty">No data available in table</td></tr>
              ) : (
                pageRows.map((row, i) => (
                  <tr key={row._id} style={row.win > 0 ? { background: '#f0fdf4' } : undefined}>
                    <td>{(page - 1) * PAGE_SIZE + i + 1}</td>
                    <td>
                      {row.userName}
                      {row.userMobile && (
                        <div style={{ fontSize: 12, opacity: 0.7 }}>{row.userMobile}</div>
                      )}
                    </td>
                    <td>{row.betAmount}</td>
                    <td style={row.win > 0 ? { color: '#16a34a', fontWeight: 600 } : undefined}>
                      {row.win > 0 ? row.win.toLocaleString('en-IN') : 0}
                    </td>
                    <td>{row.gameName}</td>
                    <td>
                      {row.typeLabel || row.type}
                      {row.session && (
                        <span style={{ fontSize: 12, opacity: 0.7 }}> ({row.session.toUpperCase()})</span>
                      )}
                    </td>
                    <td>{row.betNumber}</td>
                    <td>{row.date}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="wp-pagination">
          <button className="wp-page-btn" type="button" disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>‹</button>
          <span style={{ padding: '0 10px', fontSize: 13 }}>{page} / {totalPages}</span>
          <button className="wp-page-btn" type="button" disabled={page >= totalPages} onClick={() => setPage((p) => p + 1)}>›</button>
        </div>
      </div>
    </div>
  )
}