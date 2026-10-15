import React, { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { Home as HomeIcon, ShieldCheck, Eye, Check, X } from 'lucide-react'
import { depositRequestsAPI } from '../../../services/api.js'
import {
  Banner, DetailsModal, exporter, fmtDateTime, useNotify, usePagedSearch,
} from '../../../utils/adminTable.jsx'
import './UPIVerification.css'

const ADD_POINTS_ROUTE = '/add-point-request' // ⚠️ apne "Add Points (User Wallet)" page ka route

const APP_LABEL = { phonepe: 'PhonePe', gpay: 'Google Pay', paytm: 'Paytm', 'upi-qr': 'UPI QR' }

export default function UPIVerification() {
  const navigate = useNavigate()
  const { message, notify } = useNotify()

  const [status, setStatus] = useState('pending')
  const [rows, setRows] = useState([])
  const [loading, setLoading] = useState(true)
  const [busyId, setBusyId] = useState(null)
  const [view, setView] = useState(null)

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const res = await depositRequestsAPI.getAll({ method: 'upi', ...(status ? { status } : {}) })
      if (res?.success) setRows(res.requests || [])
    } catch (err) {
      notify('err', err.message || 'Requests load nahi hui')
      setRows([])
    } finally {
      setLoading(false)
    }
  }, [status, notify])

  useEffect(() => { load() }, [load])

  const { search, setSearch, page, setPage, filtered, pageRows, totalPages } = usePagedSearch(
    rows,
    (r) => `${r.userMobile} ${r.userName} ${r.amount} ${r.utr} ${r.status}`
  )

  const act = async (row, next) => {
    let note = ''
    if (next === 'approved') {
      if (!window.confirm(`Pehle apne bank / UPI app me check karo ki ₹${row.amount} aaye hain (UTR: ${row.utr}).\n\nWallet me ${row.amount} points jod dein?`)) return
    } else {
      note = window.prompt('Reject ka reason (optional):', '')
      if (note === null) return
    }
    setBusyId(row._id)
    try {
      const res = await depositRequestsAPI.process(row._id, next, note)
      if (res?.success === false) throw new Error(res.message)
      notify('ok', next === 'approved' ? 'Approve ho gaya, points jud gaye ✅' : 'Reject ho gaya')
      await load()
    } catch (err) {
      notify('err', err.message || 'Kaam nahi hua')
    } finally {
      setBusyId(null)
    }
  }

  const ex = exporter(
    filtered.map((r, i) => ({
      '#': i + 1, Mobile: r.userMobile, Name: r.userName, Amount: r.amount,
      'Payment ID': r.utr, 'Payment App': APP_LABEL[r.paymentApp] || '', 'Created at': fmtDateTime(r.createdAt), Status: r.status,
    })),
    'deposit_points', 'Deposit Points Request', notify
  )

  return (
    <div className="uv-page">
      <div className="uv-breadcrumb">
        <HomeIcon size={14} />
        <span>Home</span>
        <span className="uv-breadcrumb-sep">/</span>
        <span>Deposit Request</span>
      </div>

      <div className="uv-page-title-wrapper">
        <ShieldCheck size={26} className="uv-page-title-icon" />
        <h1 className="uv-page-title">Deposit Points Request</h1>
      </div>

      <Banner message={message} />

      <div className="uv-card">
        <div className="uv-card-top">
          <button className="uv-deposit-btn" type="button" onClick={() => navigate(ADD_POINTS_ROUTE)}>
            Deposit Points
          </button>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            style={{ marginLeft: 12, padding: '8px 10px', borderRadius: 6 }}
          >
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
            <option value="">All</option>
          </select>
        </div>

        <div className="uv-toolbar">
          <div className="uv-toolbar-buttons">
            <button className="uv-toolbar-btn" onClick={ex.copy} type="button">Copy</button>
            <button className="uv-toolbar-btn" onClick={ex.csv} type="button">CSV</button>
            <button className="uv-toolbar-btn" onClick={ex.excel} type="button">Excel</button>
            <button className="uv-toolbar-btn" onClick={ex.print} type="button">PDF</button>
            <button className="uv-toolbar-btn" onClick={ex.print} type="button">Print</button>
          </div>
          <div className="uv-toolbar-search">
            <label>Search:</label>
            <input type="text" className="uv-search-input" value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
        </div>

        <div className="uv-table-wrapper">
          <table className="uv-table">
            <thead>
              <tr>
                <th>#</th><th>Mobile</th><th>Name</th><th>Amount</th>
                <th>Payment ID</th><th>Payment App</th><th>Created at</th><th>Status</th><th>Action</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="9" className="uv-table-empty">Loading...</td></tr>
              ) : pageRows.length === 0 ? (
                <tr><td colSpan="9" className="uv-table-empty">No data available in table</td></tr>
              ) : (
                pageRows.map((r, i) => (
                  <tr key={r._id}>
                    <td>{(page - 1) * 10 + i + 1}</td>
                    <td>{r.userMobile}</td>
                    <td>{r.userName}</td>
                    <td>{r.amount}</td>
                    <td style={{ fontFamily: 'monospace' }}>{r.utr}</td>
                    <td>{APP_LABEL[r.paymentApp] || '-'}</td>
                    <td>{fmtDateTime(r.createdAt)}</td>
                    <td>{r.status}</td>
                    <td>
                      <div className="uv-action-buttons">
                        <button className="uv-action-btn uv-view-btn" title="View" type="button" onClick={() => setView(r)}>
                          <Eye size={14} />
                        </button>
                        {r.status === 'pending' && (
                          <>
                            <button className="uv-action-btn uv-approve-btn" title="Approve" type="button"
                              disabled={busyId === r._id} onClick={() => act(r, 'approved')}>
                              <Check size={14} />
                            </button>
                            <button className="uv-action-btn uv-reject-btn" title="Reject" type="button"
                              disabled={busyId === r._id} onClick={() => act(r, 'rejected')}>
                              <X size={14} />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="uv-pagination">
          <button className="uv-page-btn" type="button" disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>‹</button>
          <button className="uv-page-btn active" type="button">{page} / {totalPages}</button>
          <button className="uv-page-btn" type="button" disabled={page >= totalPages} onClick={() => setPage((p) => p + 1)}>›</button>
        </div>
      </div>

      {view && (
        <DetailsModal
          title="Deposit Request"
          onClose={() => setView(null)}
          rows={[
            ['Name', view.userName], ['Mobile', view.userMobile], ['Amount', `₹${view.amount}`],
            ['Payment ID (UTR)', view.utr], ['Payment App', APP_LABEL[view.paymentApp]], ['Status', view.status], ['Created', fmtDateTime(view.createdAt)],
            ['Processed', view.processedAt ? fmtDateTime(view.processedAt) : ''], ['Note', view.note],
          ]}
        />
      )}
    </div>
  )
}