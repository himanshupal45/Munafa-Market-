import React, { useState } from 'react'
import { Home as HomeIcon, Receipt } from 'lucide-react'
import './AllRefunds.css'

export default function AllRefunds() {
  const [searchTerm, setSearchTerm] = useState('')

  // ✅ Sample data (from screenshot)
  const [data] = useState([
    {
      id: 1,
      userName: 'Rajkumar1433',
      gameName: 'MADHUR MORNING',
      refundAmount: '500',
      refundDate: '12:00 AM 01-08-2026',
    },
  ])

  // ============= TOOLBAR ACTIONS =============
  const handleCopy = () => {
    if (data.length === 0) { alert('No data to copy'); return }
    const text = data.map(row => Object.values(row).join('\t')).join('\n')
    navigator.clipboard.writeText(text).then(() => alert('✅ Copied!'))
  }

  const handleCSV = () => {
    if (data.length === 0) { alert('No data to export'); return }
    const headers = ['#', 'User Name', 'Game Name', 'Refund Amount', 'Refund Date']
    const rows = data.map((row, i) =>
      `${i + 1},${row.userName},${row.gameName},${row.refundAmount},${row.refundDate}`
    ).join('\n')
    const blob = new Blob([`${headers.join(',')}\n${rows}`], { type: 'text/csv' })
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.download = `all_refunds_${Date.now()}.csv`
    link.click()
  }

  const handleExcel = () => {
    if (data.length === 0) { alert('No data to export'); return }
    let html = '<table><thead><tr><th>#</th><th>User Name</th><th>Game Name</th><th>Refund Amount</th><th>Refund Date</th></tr></thead><tbody>'
    data.forEach((row, i) => {
      html += `<tr><td>${i + 1}</td><td>${row.userName}</td><td>${row.gameName}</td><td>${row.refundAmount}</td><td>${row.refundDate}</td></tr>`
    })
    html += '</tbody></table>'
    const blob = new Blob([html], { type: 'application/vnd.ms-excel' })
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.download = `all_refunds_${Date.now()}.xls`
    link.click()
  }

  const handlePrint = () => {
    if (data.length === 0) { alert('No data to print'); return }
    const w = window.open('', '_blank')
    let html = `<html><head><title>All Refunds</title>
      <style>body{font-family:Arial;padding:20px}table{width:100%;border-collapse:collapse}
      th,td{border:1px solid #ddd;padding:8px}th{background:#f5f5f5}</style></head><body>
      <h2>All Refunds</h2>
      <table><thead><tr><th>#</th><th>User Name</th><th>Game Name</th><th>Refund Amount</th><th>Refund Date</th></tr></thead><tbody>`
    data.forEach((row, i) => {
      html += `<tr><td>${i + 1}</td><td>${row.userName}</td><td>${row.gameName}</td><td>${row.refundAmount}</td><td>${row.refundDate}</td></tr>`
    })
    html += `</tbody></table></body></html>`
    w.document.write(html)
    w.document.close()
    w.focus()
    setTimeout(() => { w.print(); w.close() }, 250)
  }

  return (
    <div className="ar-page">
      {/* ✅ Breadcrumb */}
      <div className="ar-breadcrumb">
        <HomeIcon size={14} />
        <span>Home</span>
        <span className="ar-breadcrumb-sep">/</span>
        <span>All Refunds</span>
      </div>

      {/* ✅ Page Title with Icon */}
      <div className="ar-page-title-wrapper">
        <Receipt size={26} className="ar-page-title-icon" />
        <h1 className="ar-page-title">All Refunds</h1>
      </div>

      {/* ✅ Main Card */}
      <div className="ar-card">
        <h3 className="ar-card-title">Details</h3>

        {/* Toolbar */}
        <div className="ar-toolbar">
          <div className="ar-toolbar-buttons">
            <button className="ar-toolbar-btn" onClick={handleCopy} type="button">Copy</button>
            <button className="ar-toolbar-btn" onClick={handleCSV} type="button">CSV</button>
            <button className="ar-toolbar-btn" onClick={handleExcel} type="button">Excel</button>
            <button className="ar-toolbar-btn" onClick={handlePrint} type="button">PDF</button>
            <button className="ar-toolbar-btn" onClick={handlePrint} type="button">Print</button>
          </div>
          <div className="ar-toolbar-search">
            <label>Search:</label>
            <input
              type="text"
              className="ar-search-input"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Table */}
        <div className="ar-table-wrapper">
          <table className="ar-table">
            <thead>
              <tr>
                <th>#</th>
                <th>User Name</th>
                <th>Game Name</th>
                <th>Refund Amount</th>
                <th>Refund Date</th>
              </tr>
            </thead>
            <tbody>
              {data.length === 0 ? (
                <tr>
                  <td colSpan="5" className="ar-table-empty">
                    No data available in table
                  </td>
                </tr>
              ) : (
                data.map((row, i) => (
                  <tr key={row.id}>
                    <td>{i + 1}</td>
                    <td className="ar-user-name">{row.userName}</td>
                    <td>{row.gameName}</td>
                    <td className="ar-refund-amount">{row.refundAmount}</td>
                    <td className="ar-refund-date">{row.refundDate}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="ar-pagination">
          <button className="ar-page-btn" type="button">‹</button>
          <button className="ar-page-btn active" type="button">1</button>
          <button className="ar-page-btn" type="button">›</button>
        </div>
      </div>
    </div>
  )
}