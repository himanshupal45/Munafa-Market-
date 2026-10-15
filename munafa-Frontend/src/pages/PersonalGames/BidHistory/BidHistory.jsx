import React, { useState } from 'react'
import { Home as HomeIcon, History, Minus, X, ChevronLeft, ChevronRight } from 'lucide-react'
import './BidHistory.css'

export default function BidHistory() {
  const [filtersOpen, setFiltersOpen] = useState(true)
  const [date, setDate] = useState('2026-09-24')
  const [gameName, setGameName] = useState('')
  const [gameType, setGameType] = useState('')
  const [amount, setAmount] = useState('')
  const [searchTerm, setSearchTerm] = useState('')

  // Table data (empty per screenshot)
  const [data] = useState([])

  // Filter options
  const gameNameOptions = ['DISAWAR', 'KALYAN', 'MILAN', 'RAJDHANI', 'TIME BAZAR']
  const gameTypeOptions = ['Single Digit', 'Jodi Digit', 'Single Pana', 'Double Pana', 'Triple Pana', 'Half Sangam', 'Full Sangam']

  // ============= HANDLERS =============
  const handleSave = (e) => {
    e.preventDefault()
    alert(`Filters applied:\nDate: ${date}\nGame: ${gameName}\nType: ${gameType}\nAmount: ${amount}`)
  }

  // ============= TOOLBAR ACTIONS =============
  const handleCopy = () => {
    if (data.length === 0) { alert('No data to copy'); return }
    const text = data.map(row => Object.values(row).join('\t')).join('\n')
    navigator.clipboard.writeText(text).then(() => alert('✅ Copied!'))
  }

  const handleCSV = () => {
    if (data.length === 0) { alert('No data to export'); return }
    const headers = ['#', 'User Name', 'Mobile Number', 'Game Name', 'Game Type', 'Digits', 'Points', 'Date', 'Placed on']
    const rows = data.map((r, i) =>
      `${i + 1},${r.userName},${r.mobile},${r.gameName},${r.gameType},${r.digits},${r.points},${r.date},${r.placedOn}`
    ).join('\n')
    const blob = new Blob([`${headers.join(',')}\n${rows}`], { type: 'text/csv' })
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.download = `bid_history_${Date.now()}.csv`
    link.click()
  }

  const handleExcel = () => {
    if (data.length === 0) { alert('No data to export'); return }
    let html = '<table><thead><tr><th>#</th><th>User Name</th><th>Mobile Number</th><th>Game Name</th><th>Game Type</th><th>Digits</th><th>Points</th><th>Date</th><th>Placed on</th></tr></thead><tbody>'
    data.forEach((r, i) => {
      html += `<tr><td>${i + 1}</td><td>${r.userName}</td><td>${r.mobile}</td><td>${r.gameName}</td><td>${r.gameType}</td><td>${r.digits}</td><td>${r.points}</td><td>${r.date}</td><td>${r.placedOn}</td></tr>`
    })
    html += '</tbody></table>'
    const blob = new Blob([html], { type: 'application/vnd.ms-excel' })
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.download = `bid_history_${Date.now()}.xls`
    link.click()
  }

  const handlePrint = () => {
    if (data.length === 0) { alert('No data to print'); return }
    const w = window.open('', '_blank')
    let html = `<html><head><title>Bid History</title>
      <style>body{font-family:Arial;padding:20px}table{width:100%;border-collapse:collapse}
      th,td{border:1px solid #ddd;padding:8px}th{background:#f5f5f5}</style></head><body>
      <h2>Bid History</h2>
      <table><thead><tr><th>#</th><th>User Name</th><th>Mobile Number</th><th>Game Name</th><th>Game Type</th><th>Digits</th><th>Points</th><th>Date</th><th>Placed on</th></tr></thead><tbody>`
    data.forEach((r, i) => {
      html += `<tr><td>${i + 1}</td><td>${r.userName}</td><td>${r.mobile}</td><td>${r.gameName}</td><td>${r.gameType}</td><td>${r.digits}</td><td>${r.points}</td><td>${r.date}</td><td>${r.placedOn}</td></tr>`
    })
    html += `</tbody></table></body></html>`
    w.document.write(html)
    w.document.close()
    w.focus()
    setTimeout(() => { w.print(); w.close() }, 250)
  }

  return (
    <div className="bh-page">
      {/* ✅ Breadcrumb */}
      <div className="bh-breadcrumb">
        <HomeIcon size={14} />
        <span>Home</span>
        <span className="bh-breadcrumb-sep">/</span>
        <span>Bid History</span>
      </div>

      {/* ✅ Page Title with Icon */}
      <div className="bh-page-title-wrapper">
        <History size={26} className="bh-page-title-icon" />
        <h1 className="bh-page-title">Bid History</h1>
      </div>

      {/* ✅ Filters Card */}
      {filtersOpen && (
        <div className="bh-card bh-filters-card">
          <div className="bh-filters-header">
            <h3 className="bh-filters-title">Filters</h3>
            <div className="bh-filters-actions">
              <button
                className="bh-icon-btn"
                onClick={() => setFiltersOpen(false)}
                title="Minimize"
                type="button"
              >
                <Minus size={16} />
              </button>
              <button
                className="bh-icon-btn"
                onClick={() => setFiltersOpen(false)}
                title="Close"
                type="button"
              >
                <X size={16} />
              </button>
            </div>
          </div>

          <div className="bh-filters-body">
            <form onSubmit={handleSave} className="bh-filters-row">
              <div className="bh-form-group">
                <label className="bh-label">Date</label>
                <input
                  type="date"
                  className="bh-input"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                />
              </div>

              <div className="bh-form-group">
                <label className="bh-label">Game Name</label>
                <select
                  className="bh-select"
                  value={gameName}
                  onChange={(e) => setGameName(e.target.value)}
                >
                  <option value="">Select Game</option>
                  {gameNameOptions.map(g => <option key={g} value={g}>{g}</option>)}
                </select>
              </div>

              <div className="bh-form-group">
                <label className="bh-label">Game Type</label>
                <select
                  className="bh-select"
                  value={gameType}
                  onChange={(e) => setGameType(e.target.value)}
                >
                  <option value="">Select Game Type</option>
                  {gameTypeOptions.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>

              <div className="bh-form-group">
                <label className="bh-label">Amount</label>
                <input
                  type="text"
                  className="bh-input"
                  placeholder="Enter Amount"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                />
              </div>

              <div className="bh-form-group bh-form-btn-group">
                <button type="submit" className="bh-save-btn">
                  SAVE
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ✅ Table Card */}
      <div className="bh-card bh-table-card">
        <h3 className="bh-table-title">Details</h3>

        {/* Toolbar */}
        <div className="bh-toolbar">
          <div className="bh-toolbar-buttons">
            <button className="bh-toolbar-btn" onClick={handleCopy} type="button">Copy</button>
            <button className="bh-toolbar-btn" onClick={handleCSV} type="button">CSV</button>
            <button className="bh-toolbar-btn" onClick={handleExcel} type="button">Excel</button>
            <button className="bh-toolbar-btn" onClick={handlePrint} type="button">PDF</button>
            <button className="bh-toolbar-btn" onClick={handlePrint} type="button">Print</button>
          </div>
          <div className="bh-toolbar-search">
            <label>Search:</label>
            <input
              type="text"
              className="bh-search-input"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Table */}
        <div className="bh-table-wrapper">
          <table className="bh-table">
            <thead>
              <tr>
                <th>S. No.</th>
                <th>User Name</th>
                <th>Mobile Number</th>
                <th>Game Name</th>
                <th>Game Type</th>
                <th>Digits</th>
                <th>Points</th>
                <th>Date</th>
                <th>Placed on</th>
                <th>Edit</th>
              </tr>
            </thead>
            <tbody>
              {data.length === 0 ? (
                <tr>
                  <td colSpan="10" className="bh-table-empty">
                    No data available in table
                  </td>
                </tr>
              ) : (
                data.map((row, i) => (
                  <tr key={i}>
                    <td>{i + 1}</td>
                    <td>{row.userName}</td>
                    <td>{row.mobile}</td>
                    <td>{row.gameName}</td>
                    <td>{row.gameType}</td>
                    <td>{row.digits}</td>
                    <td>{row.points}</td>
                    <td>{row.date}</td>
                    <td>{row.placedOn}</td>
                    <td>
                      <button className="bh-edit-btn" type="button">Edit</button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="bh-pagination">
          <button className="bh-page-btn" type="button">
            <ChevronLeft size={16} />
          </button>
          <button className="bh-page-btn" type="button">
            <ChevronRight size={16} />
          </button>
        </div>
      </div>
    </div>
  )
}