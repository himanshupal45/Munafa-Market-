import React, { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  ChevronLeft,
  List,
  ArrowDownLeft,
  ArrowUpRight,
  Wallet,
  Gamepad2,
  Trophy,
  ShieldCheck,
  Gift,
  RefreshCw,
} from 'lucide-react'
import { apiCall } from '../../../context/AuthContext'
import './WalletHistory.css'

const TABS = [
  { value: 'all', label: 'All' },
  { value: 'credit', label: 'Credit' },
  { value: 'debit', label: 'Debit' },
]

const fmtDate = (v) =>
  v
    ? new Date(v).toLocaleString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
      })
    : ''

const getSourceMeta = (source) => {
  switch (source) {
    case 'bet':
      return { Icon: Gamepad2, label: 'Bet Placed', cls: 'wh-tag-bet' }
    case 'win':
      return { Icon: Trophy, label: 'Win Payout', cls: 'wh-tag-win' }
    case 'admin':
      return { Icon: ShieldCheck, label: 'Admin', cls: 'wh-tag-admin' }
    case 'deposit':
      return { Icon: ArrowDownLeft, label: 'Deposit', cls: 'wh-tag-win' }
    case 'withdraw':
      return { Icon: ArrowUpRight, label: 'Withdraw', cls: 'wh-tag-bet' }
    case 'refund':
      return { Icon: RefreshCw, label: 'Refund', cls: 'wh-tag-warn' }
    default:
      return { Icon: Gift, label: 'Transaction', cls: 'wh-tag-default' }
  }
}

const WalletHistory = () => {
  const navigate = useNavigate()

  const [tab, setTab] = useState('all')
  const [items, setItems] = useState([])
  const [balance, setBalance] = useState(null)
  const [summary, setSummary] = useState({ credit: 0, debit: 0, betTotal: 0 })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const load = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const params = tab === 'all' ? '' : `?type=${tab}`
      const res = await apiCall(`/ledger/me${params}`)

      if (res?.success) {
        const txns = res.transactions || []
        setItems(txns)
        setBalance(res.balance)

        if (tab === 'all') {
          const c = txns
            .filter((t) => t.type === 'credit')
            .reduce((s, t) => s + Number(t.points || 0), 0)
          const d = txns
            .filter((t) => t.type === 'debit')
            .reduce((s, t) => s + Number(t.points || 0), 0)
          const bet = txns
            .filter((t) => t.source === 'bet')
            .reduce((s, t) => s + Number(t.points || 0), 0)
          setSummary({ credit: c, debit: d, betTotal: bet })
        }
      } else {
        setItems([])
        setError(res?.message || 'History load nahi hui')
      }
    } catch (err) {
      setError(err.message || 'History load nahi hui')
      setItems([])
    } finally {
      setLoading(false)
    }
  }, [tab])

  useEffect(() => {
    load()
  }, [load])

  return (
    <div className="wh-page">
      {/* Header */}
      <div className="wh-header">
        <button
          className="wh-back-btn"
          onClick={() => navigate(-1)}
          aria-label="Back"
          type="button"
        >
          <ChevronLeft size={26} strokeWidth={2.2} />
        </button>
        <h1 className="wh-title">Wallet History</h1>
        <div className="wh-header-spacer" />
      </div>

      {/* Hero (Balance) */}
      <div className="wh-hero">
        <div className="wh-hero-icon-wrap">
          <Wallet size={48} strokeWidth={1.8} className="wh-hero-icon" />
        </div>
        <h2 className="wh-balance-value">
          {balance == null ? '--' : Number(balance).toLocaleString('en-IN')}
        </h2>
        <p className="wh-balance-label">Current Wallet Points</p>

        {/* Summary */}
        <div className="wh-summary">
          <div className="wh-summary-item">
            <ArrowDownLeft size={16} className="wh-summary-icon" />
            <span className="wh-summary-label">Credit</span>
            <span className="wh-summary-value">
              +{summary.credit.toLocaleString('en-IN')}
            </span>
          </div>
          <div className="wh-summary-item">
            <ArrowUpRight size={16} className="wh-summary-icon" />
            <span className="wh-summary-label">Debit</span>
            <span className="wh-summary-value">
              -{summary.debit.toLocaleString('en-IN')}
            </span>
          </div>
          <div className="wh-summary-item">
            <Gamepad2 size={16} className="wh-summary-icon" />
            <span className="wh-summary-label">Bets</span>
            <span className="wh-summary-value">
              -{summary.betTotal.toLocaleString('en-IN')}
            </span>
          </div>
        </div>
      </div>

      {/* Panel */}
      <div className="wh-panel">
        {/* Tabs */}
        <div className="wh-tabs">
          {TABS.map((t) => (
            <button
              key={t.value}
              type="button"
              className={`wh-tab ${tab === t.value ? 'active' : ''}`}
              onClick={() => setTab(t.value)}
            >
              {t.label}
              {tab === t.value && items.length > 0 && (
                <span className="wh-tab-count">{items.length}</span>
              )}
            </button>
          ))}
        </div>

        <div className="wh-content">
          {/* Loading */}
          {loading && (
            <div className="wh-state">
              <div className="wh-spinner" />
              <p>Loading...</p>
            </div>
          )}

          {/* Error */}
          {!loading && error && (
            <div className="wh-state wh-error">
              <p>⚠ {error}</p>
              <button className="wh-retry-btn" onClick={load} type="button">
                ↺ Retry
              </button>
            </div>
          )}

          {/* Empty */}
          {!loading && !error && items.length === 0 && (
            <div className="wh-state">
              <List size={40} strokeWidth={1.5} style={{ opacity: 0.3 }} />
              <p>Abhi koi transaction nahi hai.</p>
            </div>
          )}

          {/* List */}
          {!loading && !error && items.length > 0 && (
            <div className="wh-list">
              {items.map((t) => {
                const credit = t.type === 'credit'
                const meta = getSourceMeta(t.source)
                const { Icon } = meta
                const isBet = t.source === 'bet'

                return (
                  <div
                    className={`wh-item ${isBet ? 'wh-item-bet' : ''}`}
                    key={t._id}
                  >
                    <span className={`wh-item-icon ${meta.cls}`}>
                      <Icon size={18} />
                    </span>

                    <div className="wh-item-body">
                      <div className="wh-item-note">
                        {t.note || (credit ? 'Credit' : 'Debit')}
                      </div>
                      <div className="wh-item-date">
                        <span className={`wh-item-tag ${meta.cls}`}>
                          {meta.label}
                        </span>
                        {fmtDate(t.createdAt)}
                      </div>
                    </div>

                    <div className="wh-item-amount">
                      <div
                        className={`wh-amount ${credit ? 'credit' : 'debit'}`}
                      >
                        {credit ? '+' : '-'}
                        {Number(t.points).toLocaleString('en-IN')}
                      </div>
                      {t.balanceAfter != null && (
                        <div className="wh-item-balance">
                          Bal: {Number(t.balanceAfter).toLocaleString('en-IN')}
                        </div>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default WalletHistory