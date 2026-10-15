import React, { useState } from 'react'
import { Home as HomeIcon, QrCode, Check, X } from 'lucide-react'
import './QRUPIVerification.css'

export default function QRUPIVerification() {
  const [searchTerm, setSearchTerm] = useState('')

  // ✅ Sample data (from screenshot)
  const [data] = useState([
    {
      id: 1,
      mobile: '6269975457',
      name: 'Rajkumar1433',
      amount: '1000',
      paymentScreenshot:
        'https://matka.techizebuilder.com/public/payment_screenshot/1785565093.png',
      createdAt: '2026-08-01 11:48:13',
    },
  ])

  // ============= HANDLERS =============
  const handleApprove = (id) => {
    if (window.confirm('Approve this deposit?')) {
      alert(`✅ Deposit approved: ID ${id}`)
    }
  }

  const handleReject = (id) => {
    if (window.confirm('Reject this deposit?')) {
      alert(`❌ Deposit rejected: ID ${id}`)
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
    const headers = ['#', 'Mobile', 'Name', 'Amount', 'Payment Screenshot', 'Created at']
    const rows = data.map((row, i) =>
      `${i + 1},${row.mobile},${row.name},${row.amount},${row.paymentScreenshot},${row.createdAt}`
    ).join('\n')
    const blob = new Blob([`${headers.join(',')}\n${rows}`], { type: 'text/csv' })
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.download = `qr_deposit_${Date.now()}.csv`
    link.click()
  }

  const handleExcel = () => {
    if (data.length === 0) { alert('No data to export'); return }
    let html = '<table><thead><tr><th>#</th><th>Mobile</th><th>Name</th><th>Amount</th><th>Payment Screenshot</th><th>Created at</th></tr></thead><tbody>'
    data.forEach((row, i) => {
      html += `<tr><td>${i + 1}</td><td>${row.mobile}</td><td>${row.name}</td><td>${row.amount}</td><td>${row.paymentScreenshot}</td><td>${row.createdAt}</td></tr>`
    })
    html += '</tbody></table>'
    const blob = new Blob([html], { type: 'application/vnd.ms-excel' })
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.download = `qr_deposit_${Date.now()}.xls`
    link.click()
  }

  const handlePrint = () => {
    if (data.length === 0) { alert('No data to print'); return }
    const w = window.open('', '_blank')
    let html = `<html><head><title>QR Code Deposit Points Request</title>
      <style>body{font-family:Arial;padding:20px}table{width:100%;border-collapse:collapse}
      th,td{border:1px solid #ddd;padding:8px}th{background:#f5f5f5}</style></head><body>
      <h2>QR Code Deposit Points Request</h2>
      <table><thead><tr><th>#</th><th>Mobile</th><th>Name</th><th>Amount</th><th>Payment Screenshot</th><th>Created at</th></tr></thead><tbody>`
    data.forEach((row, i) => {
      html += `<tr><td>${i + 1}</td><td>${row.mobile}</td><td>${row.name}</td><td>${row.amount}</td><td>${row.paymentScreenshot}</td><td>${row.createdAt}</td></tr>`
    })
    html += `</tbody></table></body></html>`
    w.document.write(html)
    w.document.close()
    w.focus()
    setTimeout(() => { w.print(); w.close() }, 250)
  }

  return (
    <div className="qr-page">
      {/* ✅ Breadcrumb */}
      <div className="qr-breadcrumb">
        <HomeIcon size={14} />
        <span>Home</span>
        <span className="qr-breadcrumb-sep">/</span>
        <span>QR Deposit Request</span>
      </div>

      {/* ✅ Page Title with Icon */}
      <div className="qr-page-title-wrapper">
        <QrCode size={26} className="qr-page-title-icon" />
        <h1 className="qr-page-title">QR Code Deposit Points Request</h1>
      </div>

      {/* ✅ Main Card */}
      <div className="qr-card">
        {/* Top Button */}
        <div className="qr-card-top">
          <button className="qr-deposit-btn" type="button">
            Deposit Points
          </button>
        </div>

        {/* Toolbar */}
        <div className="qr-toolbar">
          <div className="qr-toolbar-buttons">
            <button className="qr-toolbar-btn" onClick={handleCopy} type="button">Copy</button>
            <button className="qr-toolbar-btn" onClick={handleCSV} type="button">CSV</button>
            <button className="qr-toolbar-btn" onClick={handleExcel} type="button">Excel</button>
            <button className="qr-toolbar-btn" onClick={handlePrint} type="button">PDF</button>
            <button className="qr-toolbar-btn" onClick={handlePrint} type="button">Print</button>
          </div>
          <div className="qr-toolbar-search">
            <label>Search:</label>
            <input
              type="text"
              className="qr-search-input"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Table */}
        <div className="qr-table-wrapper">
          <table className="qr-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Mobile</th>
                <th>Name</th>
                <th>Amount</th>
                <th>Payment Screenshot</th>
                <th>Created at</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {data.length === 0 ? (
                <tr>
                  <td colSpan="7" className="qr-table-empty">
                    No data available in table
                  </td>
                </tr>
              ) : (
                data.map((row, i) => (
                  <tr key={row.id}>
                    <td>{i + 1}</td>
                    <td>{row.mobile}</td>
                    <td>{row.name}</td>
                    <td>{row.amount}</td>
                    <td>
                      <div className="qr-screenshot-cell">
                        <div className="qr-screenshot-wrapper">
                          <img
                            src={row.paymentScreenshot}
                            alt="Payment Screenshot"
                            className="qr-screenshot-img"
                          />
                        </div>
                      </div>
                    </td>
                    <td>{row.createdAt}</td>
                    <td>
                      <div className="qr-action-buttons">
                        <button
                          className="qr-action-btn qr-approve-btn"
                          onClick={() => handleApprove(row.id)}
                          title="Approve"
                          type="button"
                        >
                          <Check size={16} />
                        </button>
                        <button
                          className="qr-action-btn qr-reject-btn"
                          onClick={() => handleReject(row.id)}
                          title="Reject"
                          type="button"
                        >
                          <X size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="qr-pagination">
          <button className="qr-page-btn" type="button">‹</button>
          <button className="qr-page-btn active" type="button">1</button>
          <button className="qr-page-btn" type="button">›</button>
        </div>
      </div>
    </div>
  )
}