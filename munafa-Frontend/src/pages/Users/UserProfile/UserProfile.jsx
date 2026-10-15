import React, { useState, useEffect, useMemo, useCallback } from 'react'
import { useNavigate, useParams, useLocation, useSearchParams } from 'react-router-dom'
import { Home as HomeIcon, X } from 'lucide-react'
import { ledgerAPI, gamesAPI, walletAPI } from '../../../services/api'
import './UserProfile.css'

// ============================================
// HELPERS
// ============================================
const PAGE_SIZE = 10

const fmtDateTime = (v) =>
  v
    ? new Date(v).toLocaleString('en-IN', {
        day: '2-digit', month: '2-digit', year: 'numeric',
        hour: '2-digit', minute: '2-digit', hour12: true,
      })
    : '-'

const fmtDay = (v) => (v ? new Date(v).toLocaleDateString('en-GB').replace(/\//g, '-') : '-')

const csvCell = (v) => `"${String(v ?? '').replace(/"/g, '""')}"`

const downloadBlob = (content, type, filename) => {
  const blob = new Blob([content], { type })
  const link = document.createElement('a')
  link.href = URL.createObjectURL(blob)
  link.download = filename
  link.click()
  URL.revokeObjectURL(link.href)
}

const tableHtml = (data) =>
  '<table><thead><tr>' +
  Object.keys(data[0]).map((k) => `<th>${k}</th>`).join('') +
  '</tr></thead><tbody>' +
  data.map((r) => '<tr>' + Object.values(r).map((v) => `<td>${v}</td>`).join('') + '</tr>').join('') +
  '</tbody></table>'

// ============================================
// REUSABLE TABLE CARD (toolbar + search + table + pagination)
// ============================================
function TableCard({ title, tabs, columns, rows, loading, exportName, notify }) {
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    if (!q) return rows
    return rows.filter((r) => columns.some((c) => String(c.get(r)).toLowerCase().includes(q)))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rows, search])

  useEffect(() => { setPage(1) }, [search, rows])

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const pageRows = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  const exportRows = filtered.map((r, i) => ({
    'S. No.': i + 1,
    ...Object.fromEntries(columns.filter((c) => !c.noExport).map((c) => [c.label, c.get(r)])),
  }))

  const needData = (msg) => {
    if (!exportRows.length) { notify('err', msg); return false }
    return true
  }

  const doCopy = () => {
    if (!needData('Copy karne ke liye data nahi hai')) return
    const text = exportRows.map((r) => Object.values(r).join('\t')).join('\n')
    navigator.clipboard.writeText(text).then(() => notify('ok', 'Copied ✅'))
  }
  const doCSV = () => {
    if (!needData('Export ke liye data nahi hai')) return
    const head = Object.keys(exportRows[0]).map(csvCell).join(',')
    const body = exportRows.map((r) => Object.values(r).map(csvCell).join(',')).join('\n')
    downloadBlob(`${head}\n${body}`, 'text/csv;charset=utf-8;', `${exportName}_${Date.now()}.csv`)
  }
  const doExcel = () => {
    if (!needData('Export ke liye data nahi hai')) return
    downloadBlob(tableHtml(exportRows), 'application/vnd.ms-excel', `${exportName}_${Date.now()}.xls`)
  }
  const doPrint = () => {
    if (!needData('Print ke liye data nahi hai')) return
    const w = window.open('', '_blank')
    if (!w) return notify('err', 'Popup block hai, allow karo')
    w.document.write(`<html><head><title>${title}</title>
      <style>body{font-family:Arial;padding:20px}table{width:100%;border-collapse:collapse;margin-top:20px}
      th,td{border:1px solid #ddd;padding:8px;text-align:left}th{background:#f5f5f5}</style></head><body>
      <h2>${title}</h2>${tableHtml(exportRows)}</body></html>`)
    w.document.close()
    w.focus()
    setTimeout(() => { w.print(); w.close() }, 250)
  }

  return (
    <div className="up-card up-table-card">
      {tabs ? (
        <div className="up-ledger-tabs">
          {tabs.items.map((t) => (
            <button
              key={t.value}
              className={`up-ledger-tab ${tabs.value === t.value ? 'active' : ''}`}
              onClick={() => tabs.onChange(t.value)}
              type="button"
            >
              {t.label}
            </button>
          ))}
        </div>
      ) : (
        <h3 className="up-card-title-plain">{title}</h3>
      )}

      <div className="up-toolbar">
        <div className="up-toolbar-buttons">
          <button className="up-toolbar-btn" onClick={doCopy} type="button">Copy</button>
          <button className="up-toolbar-btn" onClick={doCSV} type="button">CSV</button>
          <button className="up-toolbar-btn" onClick={doExcel} type="button">Excel</button>
          <button className="up-toolbar-btn" onClick={doPrint} type="button">PDF</button>
          <button className="up-toolbar-btn" onClick={doPrint} type="button">Print</button>
        </div>
        <div className="up-toolbar-search">
          <label>Search:</label>
          <input
            type="text"
            className="up-search-input"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="up-table-wrapper">
        <table className="up-data-table">
          <thead>
            <tr>
              <th>S. No.</th>
              {columns.map((c) => <th key={c.label}>{c.label}</th>)}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={columns.length + 1} className="up-table-empty">Loading...</td></tr>
            ) : pageRows.length === 0 ? (
              <tr><td colSpan={columns.length + 1} className="up-table-empty">No data available in table</td></tr>
            ) : (
              pageRows.map((r, i) => (
                <tr key={r._id || i}>
                  <td>{(page - 1) * PAGE_SIZE + i + 1}</td>
                  {columns.map((c) => (
                    <td key={c.label}>{c.render ? c.render(r) : c.get(r)}</td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="up-pagination">
        <button className="up-page-btn" type="button" disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>‹</button>
        <button className="up-page-btn active" type="button">{page} / {totalPages}</button>
        <button className="up-page-btn" type="button" disabled={page >= totalPages} onClick={() => setPage((p) => p + 1)}>›</button>
      </div>
    </div>
  )
}

// ============================================
// MAIN
// ============================================
export default function UserProfile({ dark }) {
  const navigate = useNavigate()
  const params = useParams()
  const location = useLocation()
  const [searchParams] = useSearchParams()

  // User ki id: URL ke kisi bhi param se, ya state se, ya ?id= se
  const uid =
    params.id ||
    params.userId ||
    params.uid ||
    Object.values(params)[0] ||
    location.state?.userId ||
    location.state?.id ||
    location.state?.user?._id ||
    location.state?.user?.id ||
    searchParams.get('id') ||
    searchParams.get('userId') ||
    null

  const [profile, setProfile] = useState(null)
  const [ledger, setLedger] = useState([])
  const [bids, setBids] = useState([])
  const [withdrawals, setWithdrawals] = useState([])

  const [loadingProfile, setLoadingProfile] = useState(true)
  const [loadingTables, setLoadingTables] = useState(true)
  const [error, setError] = useState(null)
  const [message, setMessage] = useState(null)

  const [ledgerTab, setLedgerTab] = useState('all')

  // Modal (add / withdraw points)
  const [modal, setModal] = useState(null) // null | 'credit' | 'debit'
  const [modalValue, setModalValue] = useState('')
  const [modalNote, setModalNote] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const notify = useCallback((type, text) => {
    setMessage({ type, text })
    setTimeout(() => setMessage(null), 4000)
  }, [])

  // ---------- Load everything ----------
  const loadAll = useCallback(async () => {
    if (!uid) { setError(`User id nahi mili. Is URL me id nahi hai: ${location.pathname}`); setLoadingProfile(false); setLoadingTables(false); return }
    setLoadingProfile(true)
    setLoadingTables(true)
    setError(null)

    const [pRes, lRes, bRes, wRes] = await Promise.allSettled([
      ledgerAPI.profile(uid),
      ledgerAPI.ofUser(uid),
      gamesAPI.getAllBets({ userId: uid }),
      walletAPI.getWithdrawals({ userId: uid }),
    ])

    if (pRes.status === 'fulfilled' && pRes.value?.success) setProfile(pRes.value.user)
    else setError(pRes.reason?.message || 'User ki details load nahi hui')
    setLoadingProfile(false)

    if (lRes.status === 'fulfilled' && lRes.value?.success) setLedger(lRes.value.transactions || [])
    if (bRes.status === 'fulfilled' && bRes.value?.success) setBids(bRes.value.bets || [])

    // Withdraw requests: backend ka shape alag ho sakta hai, isliye tolerant
    if (wRes.status === 'fulfilled') {
      const v = wRes.value || {}
      const list = v.withdrawals || v.requests || v.data || []
      setWithdrawals(
        list.filter((r) => !r.user || String(r.user?._id || r.user) === String(uid))
      )
    }
    setLoadingTables(false)
  }, [uid, location.pathname])

  useEffect(() => { loadAll() }, [loadAll])

  // ESC se modal band
  useEffect(() => {
    const onEsc = (e) => { if (e.key === 'Escape') closeModal() }
    window.addEventListener('keydown', onEsc)
    return () => window.removeEventListener('keydown', onEsc)
  }, [])

  const openModal = (type) => { setModal(type); setModalValue(''); setModalNote('') }
  const closeModal = () => { setModal(null); setModalValue(''); setModalNote('') }

  // ---------- Add / Withdraw points ----------
  const submitModal = async () => {
    const points = Number(modalValue)
    if (!points || points <= 0) return notify('err', 'Sahi points daalo')
    setSubmitting(true)
    try {
      const res = await ledgerAPI.adjust(uid, { points, type: modal, note: modalNote })
      if (res?.success === false) throw new Error(res.message)
      notify('ok', modal === 'credit' ? `${points} points add ho gaye ✅` : `${points} points kat gaye ✅`)
      closeModal()
      await loadAll()
    } catch (err) {
      notify('err', err.message || 'Kaam nahi hua')
    } finally {
      setSubmitting(false)
    }
  }

  // ---------- Withdraw request approve / reject ----------
  // ⚠️ status ke naam ('approved' / 'rejected') aapke wallet controller ke hisaab se badalne pad sakte hain
  const handleWithdrawAction = async (row, status) => {
    try {
      await walletAPI.processWithdrawal(row._id, status, '')
      notify('ok', `Request ${status} ho gayi`)
      await loadAll()
    } catch (err) {
      notify('err', err.message || 'Request process nahi hui')
    }
  }

  // ---------- Table rows ----------
  const ledgerRows = useMemo(
    () =>
      ledger
        .filter((t) => ledgerTab === 'all' || t.type === ledgerTab)
        .map((t) => ({
          ...t,
          pointsText: `${t.type === 'credit' ? '+' : '-'}${t.points}`,
        })),
    [ledger, ledgerTab]
  )

  const ledgerColumns = [
    {
      label: 'Points',
      get: (r) => r.pointsText,
      render: (r) => (
        <span className={`up-points-badge ${r.type === 'credit' ? 'up-points-credit' : 'up-points-debit'}`}>
          {r.pointsText}
        </span>
      ),
    },
    { label: 'Transaction Note', get: (r) => r.note || '-' },
    { label: 'Date', get: (r) => fmtDateTime(r.createdAt) },
  ]

  const bidColumns = [
    { label: 'Game Name', get: (r) => r.gameName || '-' },
    { label: 'Game Type', get: (r) => `${r.typeLabel || r.type || '-'}${r.session ? ` (${r.session.toUpperCase()})` : ''}` },
    { label: 'Digits', get: (r) => r.betNumber },
    { label: 'Points', get: (r) => r.betAmount },
    { label: 'Date', get: (r) => fmtDay(r.date) },
    { label: 'Placed on', get: (r) => fmtDateTime(r.placedAt) },
  ]

  const withdrawColumns = [
    { label: 'Points', get: (r) => r.points ?? r.amount ?? '' },
    { label: 'Request No.', get: (r) => r.requestNo || String(r._id || '').slice(-6).toUpperCase() },
    { label: 'Date', get: (r) => fmtDateTime(r.createdAt || r.date) },
    { label: 'Status', get: (r) => r.status || '-' },
    {
      label: 'Action',
      noExport: true,
      get: () => '',
      render: (r) =>
        String(r.status || '').toLowerCase() === 'pending' ? (
          <span style={{ display: 'inline-flex', gap: 6 }}>
            <button className="up-btn up-btn-green" type="button" onClick={() => handleWithdrawAction(r, 'approved')}>
              Approve
            </button>
            <button className="up-btn up-btn-red" type="button" onClick={() => handleWithdrawAction(r, 'rejected')}>
              Reject
            </button>
          </span>
        ) : (
          '-'
        ),
    },
  ]

  // ---------- Contact ----------
  const handleWhatsApp = () => window.open(`https://wa.me/91${profile.mobile}`, '_blank')
  const handleCall = () => window.open(`tel:${profile.mobile}`, '_blank')

  // ============================================
  // RENDER
  // ============================================
  const P = profile || {}

  return (
    <div className={`up-page ${dark ? 'dark' : 'light'}`}>
      <div className="up-breadcrumb">
        <HomeIcon size={14} />
        <span>Home</span>
        <span className="up-breadcrumb-sep">/</span>
        <span>User Profile</span>
      </div>

      <h1 className="up-page-title">User Profile</h1>

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

      {loadingProfile && <p style={{ padding: 20 }}>Loading...</p>}

      {!loadingProfile && error && (
        <div style={{ padding: 20, color: '#c00' }}>
          <p>⚠ {error}</p>
          <button className="up-toolbar-btn" onClick={loadAll} type="button">↺ Retry</button>{' '}
          <button className="up-toolbar-btn" onClick={() => navigate(-1)} type="button">← Back</button>
        </div>
      )}

      {!loadingProfile && profile && (
        <>
          {/* ROW 1 */}
          <div className="up-row-top">
            <div className="up-card up-user-details-card">
              <h3 className="up-card-title">USER DETAILS</h3>

              <div className="up-detail-row">
                <span className="up-detail-label">User Status</span>
                <span className={`up-badge ${P.userStatus ? 'up-badge-yes' : 'up-badge-no'}`}>
                  {P.userStatus ? 'Yes' : 'No'}
                </span>
              </div>

              <div className="up-detail-row">
                <span className="up-detail-label">Betting Status</span>
                <span className={`up-badge ${P.bettingStatus ? 'up-badge-yes' : 'up-badge-no'}`}>
                  {P.bettingStatus ? 'Yes' : 'No'}
                </span>
              </div>

              <div className="up-wallet-section">
                <div className="up-wallet-label">Wallet Balance</div>
                <div className="up-wallet-value">
                  {Number(P.walletBalance || 0).toLocaleString('en-IN')}
                  <span className="up-wallet-unit">Points</span>
                </div>
              </div>

              <div className="up-wallet-actions">
                <button className="up-btn up-btn-green" onClick={() => openModal('credit')} type="button">
                  Add Points
                </button>
                <button className="up-btn up-btn-red" onClick={() => openModal('debit')} type="button">
                  Withdraw Points
                </button>
              </div>
            </div>

            <div className="up-card up-personal-card">
              <h3 className="up-card-title-plain">Personal Information</h3>

              <div className="up-info-row">
                <span className="up-info-label">Full Name</span>
                <span className="up-info-value">{P.fullName}</span>
              </div>
              <div className="up-info-row">
                <span className="up-info-label">Email</span>
                <span className="up-info-value">{P.email}</span>
              </div>
              <div className="up-info-row">
                <span className="up-info-label">Mobile Number</span>
                <span className="up-info-value">{P.mobile}</span>
              </div>
              <div className="up-info-row">
                <span className="up-info-label">Registration Date</span>
                <span className="up-info-value">{fmtDay(P.registrationDate)}</span>
              </div>

              <div className="up-contact-actions">
                <button className="up-btn up-btn-whatsapp" onClick={handleWhatsApp} type="button">WhatsApp</button>
                <button className="up-btn up-btn-red" onClick={handleCall} type="button">Call</button>
              </div>
            </div>
          </div>

          {/* ROW 2: Payment */}
          <div className="up-card up-payment-card">
            <h3 className="up-card-title-plain">Payment Information</h3>

            <div className="up-payment-grid">
              <div className="up-payment-cell"><div className="up-payment-header">Account Holder Name</div><div className="up-payment-value">{P.accountHolderName}</div></div>
              <div className="up-payment-cell"><div className="up-payment-header">Account Number</div><div className="up-payment-value">{P.accountNumber}</div></div>
              <div className="up-payment-cell"><div className="up-payment-header">IFSC Code</div><div className="up-payment-value">{P.ifscCode}</div></div>
            </div>
            <div className="up-payment-grid">
              <div className="up-payment-cell"><div className="up-payment-header">UPI</div><div className="up-payment-value">{P.upi}</div></div>
              <div className="up-payment-cell"><div className="up-payment-header">PayTM</div><div className="up-payment-value">{P.paytm}</div></div>
            </div>
            <div className="up-payment-grid">
              <div className="up-payment-cell"><div className="up-payment-header">PhonePe</div><div className="up-payment-value">{P.phonepe}</div></div>
              <div className="up-payment-cell"><div className="up-payment-header">GPay</div><div className="up-payment-value">{P.gpay}</div></div>
            </div>
          </div>

          {/* ROW 3: Withdraw requests */}
          <TableCard
            title="Withdraw Points Requests"
            columns={withdrawColumns}
            rows={withdrawals}
            loading={loadingTables}
            exportName="withdraw_requests"
            notify={notify}
          />

          {/* ROW 4: Bid history */}
          <TableCard
            title="Bid History"
            columns={bidColumns}
            rows={bids}
            loading={loadingTables}
            exportName="bid_history"
            notify={notify}
          />

          {/* ROW 5: Wallet ledger */}
          <TableCard
            title="Wallet Ledger"
            tabs={{
              value: ledgerTab,
              onChange: setLedgerTab,
              items: [
                { value: 'all', label: 'All' },
                { value: 'credit', label: 'Credit' },
                { value: 'debit', label: 'Debit' },
              ],
            }}
            columns={ledgerColumns}
            rows={ledgerRows}
            loading={loadingTables}
            exportName="ledger"
            notify={notify}
          />
        </>
      )}

      {/* ============ ADD / WITHDRAW POINTS MODAL ============ */}
      {modal && (
        <div className="up-modal-overlay" onClick={closeModal}>
          <div className="up-modal" onClick={(e) => e.stopPropagation()}>
            <div className="up-modal-header">
              <h2 className="up-modal-title">{modal === 'credit' ? 'Add Points' : 'Withdraw Points'}</h2>
              <button className="up-modal-close" onClick={closeModal} type="button" aria-label="Close">
                <X size={20} />
              </button>
            </div>

            <div className="up-modal-body">
              <label className="up-modal-label">{modal === 'credit' ? 'Add Points' : 'Withdraw Points'}</label>
              <input
                type="number"
                className="up-modal-input"
                placeholder="Enter Points Here"
                value={modalValue}
                onChange={(e) => setModalValue(e.target.value)}
                autoFocus
              />
              <label className="up-modal-label" style={{ marginTop: 12 }}>Note (optional)</label>
              <input
                type="text"
                className="up-modal-input"
                placeholder="Jaise: Deposited Amount"
                value={modalNote}
                onChange={(e) => setModalNote(e.target.value)}
              />
            </div>

            <div className="up-modal-footer">
              <button
                className="up-modal-btn up-modal-btn-submit"
                onClick={submitModal}
                disabled={submitting}
                type="button"
              >
                {submitting ? 'Please wait...' : 'Submit'}
              </button>
              <button className="up-modal-btn up-modal-btn-close" onClick={closeModal} type="button">
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}