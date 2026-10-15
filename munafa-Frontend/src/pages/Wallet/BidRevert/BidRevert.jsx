import React, { useState } from 'react'
import { Home as HomeIcon, RotateCcw, Minus, X } from 'lucide-react'
import './BidRevert.css'

export default function BidRevert() {
  const [filtersOpen, setFiltersOpen] = useState(true)
  const [date, setDate] = useState('2026-09-24')
  const [game, setGame] = useState('')
  const [searchTerm, setSearchTerm] = useState('')

  // Table data
  const [data] = useState([])

  // ✅ Game options
  const gameOptions = [
    'KALYAN MORNING',
    'MADHUR MORNING',
    'SRIDEVI DAY',
    'TIME BAZAR',
    'MILAN DAY',
    'KALYAN',
    'SRIDEVI NIGHT',
    'KALYAN NIGHT',
  ]

  // ============= HANDLERS =============
  const handleSubmit = (e) => {
    e.preventDefault()
    if (!date || !game) {
      alert('Please select Date and Game')
      return
    }
    alert(`Filters applied:\nDate: ${date}\nGame: ${game}`)
  }

  const handleClearAndRefundAll = () => {
    if (data.length === 0) {
      alert('No data to refund')
      return
    }
    if (window.confirm('Are you sure you want to Clear & Refund All?')) {
      alert('✅ All bids cleared and refunded!')
    }
  }

  // ============= TOOLBAR ACTIONS =============
  const handleCopy = () => {
    if (data.length === 0) { alert('No data to copy'); return }
    const text = data.map(row => Object.values(row).join('\t')).join('\n')
    navigator.clipboard.writeText(text).then(() => alert('✅ Copied!'))
  }

  const handleCSV = () => {
    if (data.length === 0) { alert('No data to export'); return }
    const headers = ['#', 'User Name', 'Points', 'Game Name', 'Number', 'Created at']
    const rows = data.map((row, i) =>
      `${i + 1},${row.userName},${row.points},${row.gameName},${row.number},${row.createdAt}`
    ).join('\n')
    const blob = new Blob([`${headers.join(',')}\n${rows}`], { type: 'text/csv' })
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.download = `bid_revert_${Date.now()}.csv`
    link.click()
  }

  const handleExcel = () => {
    if (data.length === 0) { alert('No data to export'); return }
    let html = '<table><thead><tr><th>#</th><th>User Name</th><th>Points</th><th>Game Name</th><th>Number</th><th>Created at</th></tr></thead><tbody>'
    data.forEach((row, i) => {
      html += `<tr><td>${i + 1}</td><td>${row.userName}</td><td>${row.points}</td><td>${row.gameName}</td><td>${row.number}</td><td>${row.createdAt}</td></tr>`
    })
    html += '</tbody></table>'
    const blob = new Blob([html], { type: 'application/vnd.ms-excel' })
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.download = `bid_revert_${Date.now()}.xls`
    link.click()
  }

  const handlePrint = () => {
    if (data.length === 0) { alert('No data to print'); return }
    const w = window.open('', '_blank')
    let html = `<html><head><title>Bid Revert</title>
      <style>body{font-family:Arial;padding:20px}table{width:100%;border-collapse:collapse}
      th,td{border:1px solid #ddd;padding:8px}th{background:#f5f5f5}</style></head><body>
      <h2>Bid Revert</h2>
      <table><thead><tr><th>#</th><th>User Name</th><th>Points</th><th>Game Name</th><th>Number</th><th>Created at</th></tr></thead><tbody>`
    data.forEach((row, i) => {
      html += `<tr><td>${i + 1}</td><td>${row.userName}</td><td>${row.points}</td><td>${row.gameName}</td><td>${row.number}</td><td>${row.createdAt}</td></tr>`
    })
    html += `</tbody></table></body></html>`
    w.document.write(html)
    w.document.close()
    w.focus()
    setTimeout(() => { w.print(); w.close() }, 250)
  }

  return (
    <div className="br-page">
      {/* ✅ Breadcrumb */}
      <div className="br-breadcrumb">
        <HomeIcon size={14} />
        <span>Home</span>
        <span className="br-breadcrumb-sep">/</span>
        <span>Bid Revert</span>
      </div>

      {/* ✅ Page Title with Icon */}
      <div className="br-page-title-wrapper">
        <RotateCcw size={26} className="br-page-title-icon" />
        <h1 className="br-page-title">Bid Revert</h1>
      </div>

      {/* ✅ Filters Card */}
      {filtersOpen && (
        <div className="br-card br-filters-card">
          <div className="br-filters-header">
            <h3 className="br-filters-title">Filters</h3>
            <div className="br-filters-actions">
              <button
                className="br-icon-btn"
                onClick={() => setFiltersOpen(false)}
                title="Minimize"
                type="button"
              >
                <Minus size={16} />
              </button>
              <button
                className="br-icon-btn"
                onClick={() => setFiltersOpen(false)}
                title="Close"
                type="button"
              >
                <X size={16} />
              </button>
            </div>
          </div>

          <div className="br-filters-body">
            <form onSubmit={handleSubmit} className="br-filters-row">
              <div className="br-form-group">
                <label className="br-label">Date</label>
                <input
                  type="date"
                  className="br-input"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                />
              </div>

              <div className="br-form-group">
                <label className="br-label">Game</label>
                <select
                  className="br-select"
                  value={game}
                  onChange={(e) => setGame(e.target.value)}
                >
                  <option value="">Select Game</option>
                  {gameOptions.map(g => (
                    <option key={g} value={g}>{g}</option>
                  ))}
                </select>
              </div>

              <div className="br-form-group br-form-btn-group">
                <button type="submit" className="br-submit-btn">
                  Submit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ✅ Clear & Refund All Button */}
      <div className="br-action-bar">
        <button
          className="br-clear-btn"
          onClick={handleClearAndRefundAll}
          type="button"
        >
          Clear & Refund All
        </button>
      </div>

      {/* ✅ Table Card */}
      <div className="br-card br-table-card">
        {/* Toolbar */}
        <div className="br-toolbar">
          <div className="br-toolbar-buttons">
            <button className="br-toolbar-btn" onClick={handleCopy} type="button">Copy</button>
            <button className="br-toolbar-btn" onClick={handleCSV} type="button">CSV</button>
            <button className="br-toolbar-btn" onClick={handleExcel} type="button">Excel</button>
            <button className="br-toolbar-btn" onClick={handlePrint} type="button">PDF</button>
            <button className="br-toolbar-btn" onClick={handlePrint} type="button">Print</button>
          </div>
          <div className="br-toolbar-search">
            <label>Search:</label>
            <input
              type="text"
              className="br-search-input"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Table */}
        <div className="br-table-wrapper">
          <table className="br-table">
            <thead>
              <tr>
                <th>#</th>
                <th>User Name</th>
                <th>Points</th>
                <th>Game Name</th>
                <th>Number</th>
                <th>Created at</th>
              </tr>
            </thead>
            <tbody>
              {data.length === 0 ? (
                <tr>
                  <td colSpan="6" className="br-table-empty">
                    No data available in table
                  </td>
                </tr>
              ) : (
                data.map((row, i) => (
                  <tr key={i}>
                    <td>{i + 1}</td>
                    <td>{row.userName}</td>
                    <td>{row.points}</td>
                    <td>{row.gameName}</td>
                    <td>{row.number}</td>
                    <td>{row.createdAt}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="br-pagination">
          <button className="br-page-btn" type="button">‹</button>
          <button className="br-page-btn" type="button">›</button>
        </div>
      </div>
    </div>
  )
}