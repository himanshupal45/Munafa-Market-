import React, { useState } from 'react'
import { Home as HomeIcon, Award, Minus, X, ChevronLeft, ChevronRight } from 'lucide-react'
import './WinningReport.css'

export default function WinningReport() {
  const [filtersOpen, setFiltersOpen] = useState(true)
  const [fromDate, setFromDate] = useState('2026-09-24')
  const [searchTerm, setSearchTerm] = useState('')

  // Table data (empty per screenshot)
  const [data] = useState([])

  // ============= HANDLERS =============
  const handleFilter = (e) => {
    e.preventDefault()
    alert(`Filter applied: From Date - ${fromDate}`)
  }

  const handleResetFilter = () => {
    setFromDate('2026-09-24')
    setSearchTerm('')
    alert('Filters reset')
  }

  // ============= TOOLBAR ACTIONS =============
  const handleCopy = () => {
    if (data.length === 0) { alert('No data to copy'); return }
    const text = data.map(row => Object.values(row).join('\t')).join('\n')
    navigator.clipboard.writeText(text).then(() => alert('✅ Copied!'))
  }

  const handleCSV = () => {
    if (data.length === 0) { alert('No data to export'); return }
    const headers = ['#', 'User Name', 'Bid Points', 'Winning Points', 'Market Name', 'Game Name', 'Bid number', 'Date']
    const rows = data.map((r, i) =>
      `${i + 1},${r.userName},${r.bidPoints},${r.winningPoints},${r.marketName},${r.gameName},${r.bidNumber},${r.date}`
    ).join('\n')
    const blob = new Blob([`${headers.join(',')}\n${rows}`], { type: 'text/csv' })
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.download = `winning_history_${Date.now()}.csv`
    link.click()
  }

  const handleExcel = () => {
    if (data.length === 0) { alert('No data to export'); return }
    let html = '<table><thead><tr><th>#</th><th>User Name</th><th>Bid Points</th><th>Winning Points</th><th>Market Name</th><th>Game Name</th><th>Bid number</th><th>Date</th></tr></thead><tbody>'
    data.forEach((r, i) => {
      html += `<tr><td>${i + 1}</td><td>${r.userName}</td><td>${r.bidPoints}</td><td>${r.winningPoints}</td><td>${r.marketName}</td><td>${r.gameName}</td><td>${r.bidNumber}</td><td>${r.date}</td></tr>`
    })
    html += '</tbody></table>'
    const blob = new Blob([html], { type: 'application/vnd.ms-excel' })
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.download = `winning_history_${Date.now()}.xls`
    link.click()
  }

  const handlePrint = () => {
    if (data.length === 0) { alert('No data to print'); return }
    const w = window.open('', '_blank')
    let html = `<html><head><title>Disawar Winning History</title>
      <style>body{font-family:Arial;padding:20px}table{width:100%;border-collapse:collapse}
      th,td{border:1px solid #ddd;padding:8px}th{background:#f5f5f5}</style></head><body>
      <h2>Disawar Winning History</h2>
      <table><thead><tr><th>#</th><th>User Name</th><th>Bid Points</th><th>Winning Points</th><th>Market Name</th><th>Game Name</th><th>Bid number</th><th>Date</th></tr></thead><tbody>`
    data.forEach((r, i) => {
      html += `<tr><td>${i + 1}</td><td>${r.userName}</td><td>${r.bidPoints}</td><td>${r.winningPoints}</td><td>${r.marketName}</td><td>${r.gameName}</td><td>${r.bidNumber}</td><td>${r.date}</td></tr>`
    })
    html += `</tbody></table></body></html>`
    w.document.write(html)
    w.document.close()
    w.focus()
    setTimeout(() => { w.print(); w.close() }, 250)
  }

  return (
    <div className="dwh-page">
      {/* ✅ Breadcrumb */}
      <div className="dwh-breadcrumb">
        <HomeIcon size={14} />
        <span>Home</span>
        <span className="dwh-breadcrumb-sep">/</span>
        <span>Disawar Winning History</span>
      </div>

      {/* ✅ Page Title with Icon */}
      <div className="dwh-page-title-wrapper">
        <Award size={26} className="dwh-page-title-icon" />
        <h1 className="dwh-page-title">Disawar Winning History</h1>
      </div>

      {/* ✅ Filters Card */}
      {filtersOpen && (
        <div className="dwh-card dwh-filters-card">
          <div className="dwh-filters-header">
            <h3 className="dwh-filters-title">Filters</h3>
            <div className="dwh-filters-actions">
              <button
                className="dwh-icon-btn"
                onClick={() => setFiltersOpen(false)}
                title="Minimize"
                type="button"
              >
                <Minus size={16} />
              </button>
              <button
                className="dwh-icon-btn"
                onClick={() => setFiltersOpen(false)}
                title="Close"
                type="button"
              >
                <X size={16} />
              </button>
            </div>
          </div>

          <div className="dwh-filters-body">
            <form onSubmit={handleFilter} className="dwh-filters-row">
              <div className="dwh-form-group">
                <label className="dwh-label">From Date</label>
                <input
                  type="date"
                  className="dwh-input"
                  value={fromDate}
                  onChange={(e) => setFromDate(e.target.value)}
                />
              </div>

              <div className="dwh-form-group dwh-form-btn-group">
                <button type="submit" className="dwh-filter-btn">
                  Filter
                </button>
                <button type="button" className="dwh-reset-btn" onClick={handleResetFilter}>
                  Reset Filter
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ✅ Table Card */}
      <div className="dwh-card dwh-table-card">
        <h3 className="dwh-table-title">Details</h3>

        {/* Toolbar */}
        <div className="dwh-toolbar">
          <div className="dwh-toolbar-buttons">
            <button className="dwh-toolbar-btn" onClick={handleCopy} type="button">Copy</button>
            <button className="dwh-toolbar-btn" onClick={handleCSV} type="button">CSV</button>
            <button className="dwh-toolbar-btn" onClick={handleExcel} type="button">Excel</button>
            <button className="dwh-toolbar-btn" onClick={handlePrint} type="button">PDF</button>
            <button className="dwh-toolbar-btn" onClick={handlePrint} type="button">Print</button>
          </div>
          <div className="dwh-toolbar-search">
            <label>Search:</label>
            <input
              type="text"
              className="dwh-search-input"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Table */}
        <div className="dwh-table-wrapper">
          <table className="dwh-table">
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
              {data.length === 0 ? (
                <tr>
                  <td colSpan="8" className="dwh-table-empty">
                    No data available in table
                  </td>
                </tr>
              ) : (
                data.map((row, i) => (
                  <tr key={i}>
                    <td>{i + 1}</td>
                    <td>{row.userName}</td>
                    <td>{row.bidPoints}</td>
                    <td>{row.winningPoints}</td>
                    <td>{row.marketName}</td>
                    <td>{row.gameName}</td>
                    <td>{row.bidNumber}</td>
                    <td>{row.date}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="dwh-pagination">
          <button className="dwh-page-btn" type="button">
            <ChevronLeft size={16} />
          </button>
          <button className="dwh-page-btn" type="button">
            <ChevronRight size={16} />
          </button>
        </div>
      </div>
    </div>
  )
}