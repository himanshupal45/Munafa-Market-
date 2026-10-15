import React, { useState } from 'react'
import { Home as HomeIcon, Minus, X, TrendingDown } from 'lucide-react'
import './ProfitLoss.css'

export default function ProfitLoss() {
  const [filtersOpen, setFiltersOpen] = useState(true)
  const [fromDate, setFromDate] = useState('2026-09-23')
  const [toDate, setToDate] = useState('2026-09-23')
  const [searchTerm, setSearchTerm] = useState('')

  // ✅ Stats
  const [stats] = useState({
    deposit: 0,
    withdrawal: 0,
    totalProfitLoss: 0,
  })

  // ✅ Table data
  const [data] = useState([])

  // ============= TOOLBAR ACTIONS =============
  const handleCopy = () => {
    if (data.length === 0) { alert('No data to copy'); return }
    const text = data.map(row => Object.values(row).join('\t')).join('\n')
    navigator.clipboard.writeText(text).then(() => alert('✅ Copied!'))
  }

  const handleCSV = () => {
    if (data.length === 0) { alert('No data to export'); return }
    const headers = Object.keys(data[0]).join(',')
    const rows = data.map(row => Object.values(row).join(',')).join('\n')
    const blob = new Blob([`${headers}\n${rows}`], { type: 'text/csv' })
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.download = `profit_loss_${Date.now()}.csv`
    link.click()
  }

  const handleExcel = () => {
    if (data.length === 0) { alert('No data to export'); return }
    let html = '<table><thead><tr>'
    Object.keys(data[0]).forEach(k => html += `<th>${k}</th>`)
    html += '</tr></thead><tbody>'
    data.forEach(row => {
      html += '<tr>'
      Object.values(row).forEach(v => html += `<td>${v}</td>`)
      html += '</tr>'
    })
    html += '</tbody></table>'
    const blob = new Blob([html], { type: 'application/vnd.ms-excel' })
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.download = `profit_loss_${Date.now()}.xls`
    link.click()
  }

  const handlePrint = () => {
    if (data.length === 0) { alert('No data to print'); return }
    const w = window.open('', '_blank')
    w.document.write(`<html><head><title>Profit Loss</title>
      <style>body{font-family:Arial;padding:20px}table{width:100%;border-collapse:collapse}
      th,td{border:1px solid #ddd;padding:8px}th{background:#f5f5f5}</style></head><body>
      <h2>Profit Loss</h2>
      <table><thead><tr>${Object.keys(data[0]).map(k => `<th>${k}</th>`).join('')}</tr></thead>
      <tbody>${data.map(row => `<tr>${Object.values(row).map(v => `<td>${v}</td>`).join('')}</tr>`).join('')}</tbody>
      </table></body></html>`)
    w.document.close()
    w.focus()
    setTimeout(() => { w.print(); w.close() }, 250)
  }

  const handleSave = () => {
    alert(`Filters applied:\nFrom: ${fromDate}\nTo: ${toDate}`)
  }

  return (
    <div className="pl-page">
      {/* ✅ Breadcrumb */}
      <div className="pl-breadcrumb">
        <HomeIcon size={14} />
        <span>Home</span>
        <span className="pl-breadcrumb-sep">/</span>
        <span>Deposit/Withdraw Transactions</span>
      </div>

      {/* ✅ Page Title with Icon */}
      <div className="pl-page-title-wrapper">
        <TrendingDown size={26} className="pl-page-title-icon" />
        <h1 className="pl-page-title">Deposit/Withdraw Transactions</h1>
      </div>

      {/* ✅ Filters Card */}
      {filtersOpen && (
        <div className="pl-card pl-filters-card">
          <div className="pl-filters-header">
            <h3 className="pl-filters-title">Filters</h3>
            <div className="pl-filters-actions">
              <button
                className="pl-icon-btn"
                onClick={() => setFiltersOpen(false)}
                title="Minimize"
                type="button"
              >
                <Minus size={16} />
              </button>
              <button
                className="pl-icon-btn"
                onClick={() => setFiltersOpen(false)}
                title="Close"
                type="button"
              >
                <X size={16} />
              </button>
            </div>
          </div>

          <div className="pl-filters-body">
            <div className="pl-filters-row">
              <div className="pl-form-group">
                <label className="pl-label">From Date</label>
                <input
                  type="date"
                  className="pl-input"
                  value={fromDate}
                  onChange={(e) => setFromDate(e.target.value)}
                />
              </div>

              <div className="pl-form-group">
                <label className="pl-label">To Date</label>
                <input
                  type="date"
                  className="pl-input"
                  value={toDate}
                  onChange={(e) => setToDate(e.target.value)}
                />
              </div>

              <div className="pl-form-group pl-form-btn-group">
                <button className="pl-save-btn" onClick={handleSave} type="button">
                  SAVE
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ✅ Stats Cards */}
      <div className="pl-stats-grid">
        <div className="pl-stat-card pl-stat-purple">
          <div className="pl-stat-content">
            <div className="pl-stat-value">{stats.deposit}</div>
            <div className="pl-stat-label">DEPOSIT</div>
          </div>
          <div className="pl-stat-icon">🛍️</div>
        </div>

        <div className="pl-stat-card pl-stat-yellow">
          <div className="pl-stat-content">
            <div className="pl-stat-value">{stats.withdrawal}</div>
            <div className="pl-stat-label">WITHDRAWAL</div>
          </div>
          <div className="pl-stat-icon">👤</div>
        </div>

        <div className="pl-stat-card pl-stat-green">
          <div className="pl-stat-content">
            <div className="pl-stat-value">
              {stats.totalProfitLoss}
              <span className="pl-stat-currency">₹</span>
            </div>
            <div className="pl-stat-label">Total No Profit or Loss</div>
          </div>
          <div className="pl-stat-icon">📊</div>
        </div>
      </div>

      {/* ✅ Table Card */}
      <div className="pl-card pl-table-card">
        <div className="pl-toolbar">
          <div className="pl-toolbar-buttons">
            <button className="pl-toolbar-btn" onClick={handleCopy} type="button">Copy</button>
            <button className="pl-toolbar-btn" onClick={handleCSV} type="button">CSV</button>
            <button className="pl-toolbar-btn" onClick={handleExcel} type="button">Excel</button>
            <button className="pl-toolbar-btn" onClick={handlePrint} type="button">PDF</button>
            <button className="pl-toolbar-btn" onClick={handlePrint} type="button">Print</button>
          </div>
          <div className="pl-toolbar-search">
            <label>Search:</label>
            <input
              type="text"
              className="pl-search-input"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="pl-table-wrapper">
          <table className="pl-table">
            <thead>
              <tr>
                <th>#</th>
                <th>User Name</th>
                <th>User Mobile</th>
                <th>Type</th>
                <th>Amount</th>
              </tr>
            </thead>
            <tbody>
              {data.length === 0 ? (
                <tr>
                  <td colSpan="5" className="pl-table-empty">
                    No data available in table
                  </td>
                </tr>
              ) : (
                data.map((row, i) => (
                  <tr key={i}>
                    <td>{i + 1}</td>
                    <td>{row.userName}</td>
                    <td>{row.userMobile}</td>
                    <td>{row.type}</td>
                    <td>{row.amount}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="pl-pagination">
          <button className="pl-page-btn" type="button">‹</button>
          <button className="pl-page-btn" type="button">›</button>
        </div>
      </div>
    </div>
  )
}