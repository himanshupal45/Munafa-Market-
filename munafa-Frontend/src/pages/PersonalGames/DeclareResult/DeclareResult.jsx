import React, { useState } from 'react'
import { Home as HomeIcon, Edit3, Minus, X, ChevronLeft, ChevronRight, Calendar } from 'lucide-react'
import './DeclareResult.css'

export default function DeclareResult() {
  const [filtersOpen, setFiltersOpen] = useState(true)
  const [date, setDate] = useState('2026-09-24')
  const [game, setGame] = useState('')
  const [digit, setDigit] = useState('')
  const [tableDate, setTableDate] = useState('2026-09-24')
  const [searchTerm, setSearchTerm] = useState('')

  // Table data (empty per screenshot)
  const [data] = useState([])

  // Filter options
  const gameOptions = ['DISAWAR', 'KALYAN', 'MILAN', 'RAJDHANI', 'TIME BAZAR']
  const digitOptions = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9']

  // ============= HANDLERS =============
  const handleSave = (e) => {
    e.preventDefault()
    alert(`Filters applied:\nDate: ${date}\nGame: ${game}\nDigit: ${digit}`)
  }

  // ============= TOOLBAR ACTIONS =============
  const handleCopy = () => {
    if (data.length === 0) { alert('No data to copy'); return }
    const text = data.map(row => Object.values(row).join('\t')).join('\n')
    navigator.clipboard.writeText(text).then(() => alert('✅ Copied!'))
  }

  const handleCSV = () => {
    if (data.length === 0) { alert('No data to export'); return }
    const headers = ['#', 'Game Name', 'Result Date', 'Pana', 'Action']
    const rows = data.map((r, i) =>
      `${i + 1},${r.gameName},${r.resultDate},${r.pana},${r.action}`
    ).join('\n')
    const blob = new Blob([`${headers.join(',')}\n${rows}`], { type: 'text/csv' })
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.download = `declare_result_${Date.now()}.csv`
    link.click()
  }

  const handleExcel = () => {
    if (data.length === 0) { alert('No data to export'); return }
    let html = '<table><thead><tr><th>#</th><th>Game Name</th><th>Result Date</th><th>Pana</th><th>Action</th></tr></thead><tbody>'
    data.forEach((r, i) => {
      html += `<tr><td>${i + 1}</td><td>${r.gameName}</td><td>${r.resultDate}</td><td>${r.pana}</td><td>${r.action}</td></tr>`
    })
    html += '</tbody></table>'
    const blob = new Blob([html], { type: 'application/vnd.ms-excel' })
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.download = `declare_result_${Date.now()}.xls`
    link.click()
  }

  const handlePrint = () => {
    if (data.length === 0) { alert('No data to print'); return }
    const w = window.open('', '_blank')
    let html = `<html><head><title>Declare Disawar Result</title>
      <style>body{font-family:Arial;padding:20px}table{width:100%;border-collapse:collapse}
      th,td{border:1px solid #ddd;padding:8px}th{background:#f5f5f5}</style></head><body>
      <h2>Declare Disawar Result</h2>
      <table><thead><tr><th>#</th><th>Game Name</th><th>Result Date</th><th>Pana</th><th>Action</th></tr></thead><tbody>`
    data.forEach((r, i) => {
      html += `<tr><td>${i + 1}</td><td>${r.gameName}</td><td>${r.resultDate}</td><td>${r.pana}</td><td>${r.action}</td></tr>`
    })
    html += `</tbody></table></body></html>`
    w.document.write(html)
    w.document.close()
    w.focus()
    setTimeout(() => { w.print(); w.close() }, 250)
  }

  return (
    <div className="ddr-page">
      {/* ✅ Breadcrumb */}
      <div className="ddr-breadcrumb">
        <HomeIcon size={14} />
        <span>Home</span>
        <span className="ddr-breadcrumb-sep">/</span>
        <span>Declare Disawar Result</span>
      </div>

      {/* ✅ Page Title with Icon */}
      <div className="ddr-page-title-wrapper">
        <Edit3 size={26} className="ddr-page-title-icon" />
        <h1 className="ddr-page-title">Declare Disawar Result</h1>
      </div>

      {/* ✅ Filters Card */}
      {filtersOpen && (
        <div className="ddr-card ddr-filters-card">
          <div className="ddr-filters-header">
            <h3 className="ddr-filters-title">Filters</h3>
            <div className="ddr-filters-actions">
              <button
                className="ddr-icon-btn"
                onClick={() => setFiltersOpen(false)}
                title="Minimize"
                type="button"
              >
                <Minus size={16} />
              </button>
              <button
                className="ddr-icon-btn"
                onClick={() => setFiltersOpen(false)}
                title="Close"
                type="button"
              >
                <X size={16} />
              </button>
            </div>
          </div>

          <div className="ddr-filters-body">
            <form onSubmit={handleSave} className="ddr-filters-row">
              <div className="ddr-form-group">
                <label className="ddr-label">Date</label>
                <input
                  type="date"
                  className="ddr-input"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                />
              </div>

              <div className="ddr-form-group">
                <label className="ddr-label">Game</label>
                <select
                  className="ddr-select"
                  value={game}
                  onChange={(e) => setGame(e.target.value)}
                >
                  <option value="">Select Game</option>
                  {gameOptions.map(g => <option key={g} value={g}>{g}</option>)}
                </select>
              </div>

              <div className="ddr-form-group">
                <label className="ddr-label">Digit</label>
                <select
                  className="ddr-select"
                  value={digit}
                  onChange={(e) => setDigit(e.target.value)}
                >
                  <option value="">Select Digit</option>
                  {digitOptions.map(d => <option key={d} value={d}>{d}</option>)}
                </select>
              </div>

              <div className="ddr-form-group ddr-form-btn-group">
                <button type="submit" className="ddr-save-btn">
                  SAVE
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ✅ Table Card */}
      <div className="ddr-card ddr-table-card">
        {/* Date Selector */}
        <div className="ddr-date-selector">
          <div className="ddr-date-input-wrapper">
            <input
              type="date"
              className="ddr-date-input"
              value={tableDate}
              onChange={(e) => setTableDate(e.target.value)}
            />
            <Calendar size={16} className="ddr-date-icon" />
          </div>
        </div>

        {/* Toolbar */}
        <div className="ddr-toolbar">
          <div className="ddr-toolbar-buttons">
            <button className="ddr-toolbar-btn" onClick={handleCopy} type="button">Copy</button>
            <button className="ddr-toolbar-btn" onClick={handleCSV} type="button">CSV</button>
            <button className="ddr-toolbar-btn" onClick={handleExcel} type="button">Excel</button>
            <button className="ddr-toolbar-btn" onClick={handlePrint} type="button">PDF</button>
            <button className="ddr-toolbar-btn" onClick={handlePrint} type="button">Print</button>
          </div>
          <div className="ddr-toolbar-search">
            <label>Search:</label>
            <input
              type="text"
              className="ddr-search-input"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Table */}
        <div className="ddr-table-wrapper">
          <table className="ddr-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Game Name</th>
                <th>Result Date</th>
                <th>Pana</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {data.length === 0 ? (
                <tr>
                  <td colSpan="5" className="ddr-table-empty">
                    No data available in table
                  </td>
                </tr>
              ) : (
                data.map((row, i) => (
                  <tr key={i}>
                    <td>{i + 1}</td>
                    <td>{row.gameName}</td>
                    <td>{row.resultDate}</td>
                    <td>{row.pana}</td>
                    <td>{row.action}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="ddr-pagination">
          <button className="ddr-page-btn" type="button">
            <ChevronLeft size={16} />
          </button>
          <button className="ddr-page-btn" type="button">
            <ChevronRight size={16} />
          </button>
        </div>
      </div>
    </div>
  )
}