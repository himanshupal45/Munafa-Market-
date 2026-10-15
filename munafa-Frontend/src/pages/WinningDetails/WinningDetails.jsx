import React, { useState, useEffect, useCallback, useMemo } from 'react'
import { Home as HomeIcon, Minus, X, Award } from 'lucide-react'
import { gamesAPI } from '../../services/api'
import {
  Banner, exporter, useNotify, usePagedSearch,
} from '../../utils/adminTable.jsx'
import './WinningDetails.css'

const todayStr = () => {
  const d = new Date()
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

const STATUS_STYLE = {
  Won: { bg: '#dcfce7', color: '#166534' },
  Lost: { bg: '#fee2e2', color: '#991b1b' },
  Pending: { bg: '#fef3c7', color: '#b45309' },
  Refunded: { bg: '#e0e7ff', color: '#3730a3' },
}

const num = (v) => Number(v || 0).toLocaleString('en-IN')

// ============================================
// Ek list card (toolbar + search + table + pagination) — wd- classes wahi purani
// ============================================
function ListCard({ title, rows, loading, showStatus, exportName, notify }) {
  const { search, setSearch, page, setPage, filtered, pageRows, totalPages } = usePagedSearch(
    rows,
    (r) => `${r.userName} ${r.userMobile} ${r.gameName} ${r.typeLabel || r.type} ${r.betNumber} ${r.date} ${r.status}`
  )

  const ex = exporter(
    filtered.map((r, i) => ({
      '#': i + 1,
      'User Name': r.userName,
      Mobile: r.userMobile,
      'Bid Points': r.betAmount,
      'Winning Points': r.status === 'Won' ? r.winAmount : 0,
      'Market Name': r.gameName,
      'Game Name': r.typeLabel || r.type,
      'Bid number': r.betNumber,
      Date: r.date,
      Status: r.status,
    })),
    exportName,
    title,
    notify
  )

  const cols = showStatus ? 9 : 8

  return (
    <div className="wd-card wd-table-card">
      <h3 className="wd-table-title">{title} <span style={{ opacity: 0.6, fontWeight: 400 }}>({filtered.length})</span></h3>

      <div className="wd-toolbar">
        <div className="wd-toolbar-buttons">
          <button className="wd-toolbar-btn" onClick={ex.copy} type="button">Copy</button>
          <button className="wd-toolbar-btn" onClick={ex.csv} type="button">CSV</button>
          <button className="wd-toolbar-btn" onClick={ex.excel} type="button">Excel</button>
          <button className="wd-toolbar-btn" onClick={ex.print} type="button">PDF</button>
          <button className="wd-toolbar-btn" onClick={ex.print} type="button">Print</button>
        </div>
        <div className="wd-toolbar-search">
          <label>Search:</label>
          <input type="text" className="wd-search-input" value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
      </div>

      <div className="wd-table-wrapper">
        <table className="wd-table">
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
              {showStatus && <th>Status</th>}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={cols} className="wd-table-empty">Loading...</td></tr>
            ) : pageRows.length === 0 ? (
              <tr><td colSpan={cols} className="wd-table-empty">No data available in table</td></tr>
            ) : (
              pageRows.map((r, i) => {
                const st = STATUS_STYLE[r.status] || STATUS_STYLE.Pending
                return (
                  <tr key={r._id} style={r.status === 'Won' ? { background: '#f0fdf4' } : undefined}>
                    <td>{(page - 1) * 10 + i + 1}</td>
                    <td>
                      {r.userName}
                      {r.userMobile && <div style={{ fontSize: 12, opacity: 0.7 }}>{r.userMobile}</div>}
                    </td>
                    <td>{num(r.betAmount)}</td>
                    <td style={r.status === 'Won' ? { color: '#16a34a', fontWeight: 700 } : undefined}>
                      {r.status === 'Won' ? num(r.winAmount) : 0}
                    </td>
                    <td>{r.gameName}</td>
                    <td>
                      {r.typeLabel || r.type || '-'}
                      {r.session && <span style={{ fontSize: 12, opacity: 0.7 }}> ({r.session.toUpperCase()})</span>}
                    </td>
                    <td>{r.betNumber}</td>
                    <td>{r.date}</td>
                    {showStatus && (
                      <td>
                        <span style={{ padding: '3px 10px', borderRadius: 999, fontSize: 12, fontWeight: 700, background: st.bg, color: st.color }}>
                          {r.status}
                        </span>
                      </td>
                    )}
                  </tr>
                )
              })
            )}
          </tbody>
        </table>
      </div>

      <div className="wd-pagination">
        <button className="wd-page-btn" type="button" disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>‹</button>
        <span style={{ padding: '0 10px', fontSize: 13 }}>{page} / {totalPages}</span>
        <button className="wd-page-btn" type="button" disabled={page >= totalPages} onClick={() => setPage((p) => p + 1)}>›</button>
      </div>
    </div>
  )
}

// ============================================
// MAIN
// ============================================
export default function WinningDetails() {
  const { message, notify } = useNotify()

  const [filtersOpen, setFiltersOpen] = useState(true)
  const [fromDate, setFromDate] = useState(todayStr())
  const [bets, setBets] = useState([])
  const [loading, setLoading] = useState(true)

  // from = us din se aaj tak ki saari bets (sab users ki)
  const load = useCallback(async (from) => {
    setLoading(true)
    try {
      const res = await gamesAPI.getAllBets({ from })
      if (res?.success) setBets(res.bets || [])
    } catch (err) {
      notify('err', err.message || 'Data load nahi hua')
      setBets([])
    } finally {
      setLoading(false)
    }
  }, [notify])

  useEffect(() => { load(fromDate) }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const handleFilter = () => {
    if (!fromDate) return notify('err', 'From Date select karo')
    load(fromDate)
  }

  const handleReset = () => {
    const t = todayStr()
    setFromDate(t)
    load(t)
  }

  // Jeetne wale alag
  const winners = useMemo(
    () => bets.filter((b) => b.status === 'Won').sort((a, b) => b.winAmount - a.winAmount),
    [bets]
  )

  // Summary
  const stats = useMemo(() => {
    const users = new Set(bets.map((b) => String(b.userId)))
    const winUsers = new Set(winners.map((b) => String(b.userId)))
    return {
      users: users.size,
      bets: bets.length,
      bid: bets.reduce((s, b) => s + Number(b.betAmount || 0), 0),
      winUsers: winUsers.size,
      winBets: winners.length,
      payout: winners.reduce((s, b) => s + Number(b.winAmount || 0), 0),
    }
  }, [bets, winners])

  const statBox = (label, value, color) => (
    <div style={{ flex: '1 1 140px', padding: '12px 14px', borderRadius: 10, border: '1px solid rgba(128,128,128,0.25)' }}>
      <div style={{ fontSize: 12, opacity: 0.7 }}>{label}</div>
      <div style={{ fontSize: 20, fontWeight: 700, color }}>{value}</div>
    </div>
  )

  return (
    <div className="wd-page">
      <div className="wd-breadcrumb">
        <HomeIcon size={14} />
        <span>Home</span>
        <span className="wd-breadcrumb-sep">/</span>
        <span>Win History</span>
      </div>

      <div className="wd-page-title-wrapper">
        <Award size={26} className="wd-page-title-icon" />
        <h1 className="wd-page-title">Winning History</h1>
      </div>

      <Banner message={message} />

      {filtersOpen && (
        <div className="wd-card wd-filters-card">
          <div className="wd-filters-header">
            <h3 className="wd-filters-title">Filters</h3>
            <div className="wd-filters-actions">
              <button className="wd-icon-btn" onClick={() => setFiltersOpen(false)} title="Minimize" type="button">
                <Minus size={16} />
              </button>
              <button className="wd-icon-btn" onClick={() => setFiltersOpen(false)} title="Close" type="button">
                <X size={16} />
              </button>
            </div>
          </div>

          <div className="wd-filters-body">
            <div className="wd-filters-row">
              <div className="wd-form-group">
                <label className="wd-label">From Date</label>
                <input type="date" className="wd-input" value={fromDate} onChange={(e) => setFromDate(e.target.value)} />
              </div>

              <div className="wd-form-group wd-form-btn-group">
                <button className="wd-filter-btn" onClick={handleFilter} type="button">Filter</button>
                <button className="wd-reset-btn" onClick={handleReset} type="button">Reset Filter</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {!filtersOpen && (
        <button className="wd-toolbar-btn" type="button" onClick={() => setFiltersOpen(true)} style={{ marginBottom: 12 }}>
          Show Filters
        </button>
      )}

      {/* Summary */}
      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', margin: '0 0 16px' }}>
        {statBox('Bet lagane wale users', num(stats.users))}
        {statBox('Total bets', num(stats.bets))}
        {statBox('Total bid points', num(stats.bid))}
        {statBox('Jeetne wale users', num(stats.winUsers), '#16a34a')}
        {statBox('Jeet ki bets', num(stats.winBets), '#16a34a')}
        {statBox('Total payout', num(stats.payout), '#16a34a')}
      </div>

      {/* 1) Jeetne walon ki list */}
      <ListCard
        title="Winning List (Jeetne wale)"
        rows={winners}
        loading={loading}
        showStatus={false}
        exportName="winning_list"
        notify={notify}
      />

      {/* 2) Bet lagane wale sab users */}
      <ListCard
        title="All Bets (Bet lagane wale sab users)"
        rows={bets}
        loading={loading}
        showStatus
        exportName="all_bets"
        notify={notify}
      />
    </div>
  )
}