import React, { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Gamepad2, Calendar, Eye, Bell,
  MessageSquare, QrCode, CreditCard,
  Image, Layout, Settings, Users,
  AlertCircle, CheckCircle, PlayCircle, Send,
  Edit2, Save, X, ExternalLink,
  Settings as SettingsIcon,
  MapPin, Minus, Plus, Book
} from 'lucide-react'
import ResultManagement from '../ResultManagement/ResultManagement'
import SiteSetting from '../SiteSetting/SiteSetting'
import SetAmount from '../SetAmount/SetAmount'
import './Dashboard.css'
import { dashboardAPI, gamesAPI } from '../../services/api'
import { useAuth } from '../../context/AuthContext'

// ============= STATS ICONS =============
const UsersIcon = () => (
  <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
  </svg>
)
const GamesIcon = () => (
  <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="6" width="20" height="12" rx="2"/><circle cx="8" cy="12" r="2"/><circle cx="16" cy="12" r="2"/>
    <path d="M18 8v2"/><path d="M18 14v2"/>
  </svg>
)
const DepositIcon = () => (
  <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 2v4"/><path d="M12 18v4"/><path d="M4.93 4.93l2.83 2.83"/><path d="M16.24 16.24l2.83 2.83"/>
    <path d="M2 12h4"/><path d="M18 12h4"/><path d="M4.93 19.07l2.83-2.83"/><path d="M16.24 7.76l2.83-2.83"/>
  </svg>
)
const WithdrawIcon = () => (
  <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 2v4"/><path d="M12 18v4"/><path d="M4.93 4.93l2.83 2.83"/><path d="M16.24 16.24l2.83 2.83"/>
    <path d="M2 12h4"/><path d="M18 12h4"/><path d="M4.93 19.07l2.83-2.83"/><path d="M16.24 7.76l2.83-2.83"/>
  </svg>
)

// ============= QUICK ACTIONS =============
const quickActions = [
  { icon: Gamepad2, label: 'Games', path: '/games/all' },
  { icon: Calendar, label: 'Schedules', path: '/games/schedules' },
  { icon: Eye, label: 'Bet Activity', path: '/games/bet/report' },
  { icon: AlertCircle, label: 'Submissions', path: '/games/submissions' },
  { icon: Bell, label: 'Notifications', path: '/notification' },
  { icon: MessageSquare, label: 'Messages', path: '/enquiry' },
  { icon: QrCode, label: 'Payment QR', path: '/payment-qr' },
  { icon: CreditCard, label: 'Deposits', path: '/wallet/AddWallet/points' },
  { icon: Image, label: 'Banners', path: '/app-banners' },
  { icon: Layout, label: 'Carousel', path: '/app-banners' },
  { icon: Settings, label: 'Settings', path: '/site-setting' },
  { icon: Users, label: 'Contacts', path: '/users/all' },
]

// ============= GREETING HELPER =============
const getGreeting = () => {
  const hour = new Date().getHours()
  if (hour < 12) return 'Good morning'
  if (hour < 17) return 'Good afternoon'
  if (hour < 21) return 'Good evening'
  return 'Good night'
}

export default function Dashboard({ dark }) {
  const { user } = useAuth()
  const navigate = useNavigate()

  const [apiStats, setApiStats] = useState(null)
  const [games, setGames] = useState([])
  const [recentUsers, setRecentUsers] = useState([])
  const [editingGame, setEditingGame] = useState(null)
  const [editResult, setEditResult] = useState('')
  const [publishingGame, setPublishingGame] = useState(null)
  const [showResultManagement, setShowResultManagement] = useState(false)
  const [showSiteSetting, setShowSiteSetting] = useState(false)
  const [showSetAmount, setShowSetAmount] = useState(false)

  const [marketGame, setMarketGame] = useState('')
  const [marketDate, setMarketDate] = useState(new Date().toISOString().split('T')[0])
  const [marketBidVisible, setMarketBidVisible] = useState(true)
  const [totalBidsVisible, setTotalBidsVisible] = useState(true)
  const [bidsGame, setBidsGame] = useState('')
  const [bidsSession, setBidsSession] = useState('')
  const [showAnkCards, setShowAnkCards] = useState(false)
  const [ankCardsData, setAnkCardsData] = useState([])
  const [depositSearch, setDepositSearch] = useState('')
  const [qrDepositSearch, setQrDepositSearch] = useState('')

  const [qrDepositData, setQrDepositData] = useState([
    {
      id: 1,
      mobile: '6269975457',
      name: 'Rajkumar1433',
      amount: '1000',
      paymentId: 'Screenshot',
      paymentImg: 'https://via.placeholder.com/100x60/f5f5f5/666?text=Paytm',
      createdAt: '2026-08-01 11:48:13',
    },
  ])

  const marketDateInputRef = useRef(null)

  const stats = [
    { icon: UsersIcon, label: 'Users', value: apiStats ? String(apiStats.totalUsers) : '...', change: '↑ 12%', up: true, path: '/users/all' },
    { icon: GamesIcon, label: 'Games', value: apiStats ? String(apiStats.totalGames) : '...', change: '→ Stable', up: null, path: '/games/all' },
    { icon: DepositIcon, label: 'Total Bid Amount', value: apiStats ? String(apiStats.pendingDeposits) : '...', change: '↑ 5%', up: true, path: '/personal-games/disawar/bid-history' },
    { icon: WithdrawIcon, label: 'Deposit/Withdraw', value: apiStats ? String(apiStats.pendingWithdrawals) : '...', change: '↓ 2%', up: false, path: '/profit-loss' },
  ]

  const fetchData = async () => {
    try {
      const [statsRes, gamesRes] = await Promise.all([
        dashboardAPI.getStats(),
        gamesAPI.getAll()
      ])
      if (statsRes.success) {
        setApiStats(statsRes.stats)
        setRecentUsers(statsRes.recentUsers || [])
      }
      if (gamesRes.success) {
        const mapped = gamesRes.games.map(g => ({
          id: g._id, name: g.name, code: g.code, time: g.openTime,
          status: g.status, result: '00', published: false, resultId: null,
        }))
        setGames(mapped)
      }
    } catch (err) {
      console.error('Dashboard fetch error:', err)
    }
  }

  useEffect(() => { fetchData() }, [])

  const handleEditResult = (game) => { setEditingGame(game.id); setEditResult(game.result) }
  const handleSaveResult = (gameId) => {
    setGames(games.map(g => g.id === gameId ? { ...g, result: editResult } : g))
    setEditingGame(null); setEditResult('')
  }
  const handleCancelEdit = () => { setEditingGame(null); setEditResult('') }

  const handlePublishResult = async (gameId) => {
    const game = games.find(g => g.id === gameId)
    if (!game || game.result === '00') return
    setPublishingGame(gameId)
    try {
      const addRes = await gamesAPI.addResult(gameId, game.result)
      if (addRes.success) {
        const publishRes = await gamesAPI.publishResult(addRes.gameResult._id)
        if (publishRes.success) {
          setGames(games.map(g => g.id === gameId ? { ...g, published: true, status: 'Published' } : g))
          alert(`✅ Result published! ${game.name} - ${game.result}`)
        }
      }
    } catch (err) {
      alert('❌ Publish nahi hua: ' + err.message)
    } finally { setPublishingGame(null) }
  }

  const handleQrApprove = (id) => {
    if (window.confirm('Approve this deposit?')) {
      setQrDepositData(prev => prev.filter(d => d.id !== id))
      alert(`✅ Deposit approved: ID ${id}`)
    }
  }
  const handleQrReject = (id) => {
    if (window.confirm('Reject this deposit?')) {
      setQrDepositData(prev => prev.filter(d => d.id !== id))
      alert(`❌ Deposit rejected: ID ${id}`)
    }
  }

  const handleGetBidsDetails = () => {
    if (!bidsGame || !bidsSession) {
      alert('Please select Game Name and Session')
      return
    }
    const generatedAnkData = [0,1,2,3,4,5,6,7,8,9].map(ank => ({
      ank,
      totalBidAmount: Math.floor(Math.random() * 5000),
    }))
    setAnkCardsData(generatedAnkData)
    setShowAnkCards(true)
  }

  const handleStatsClick = (path) => { if (path) navigate(path) }

  const handleOpenDatePicker = () => {
    if (marketDateInputRef.current) {
      if (typeof marketDateInputRef.current.showPicker === 'function') {
        marketDateInputRef.current.showPicker()
      } else {
        marketDateInputRef.current.click()
      }
    }
  }

  // ============ TOOLBAR ACTIONS ============
  const handleCopy = (data, headers) => {
    if (!data || data.length === 0) { alert('No data to copy'); return }
    const headerRow = headers.join('\t')
    const rows = data.map(row =>
      headers.map(h => {
        const key = h.toLowerCase().replace(/\s+/g, '')
        if (key === '#') return row.id
        if (key === 'mobile') return row.mobile
        if (key === 'name') return row.name
        if (key === 'amount') return row.amount
        if (key === 'paymentid') return row.paymentId
        if (key === 'createdat') return row.createdAt
        return ''
      }).join('\t')
    ).join('\n')
    navigator.clipboard.writeText(`${headerRow}\n${rows}`)
      .then(() => alert('✅ Copied!')).catch(() => alert('❌ Copy failed'))
  }

  const handleCSV = (data, headers) => {
    if (!data || data.length === 0) { alert('No data to export'); return }
    const headerRow = headers.join(',')
    const rows = data.map(row =>
      headers.map(h => {
        const key = h.toLowerCase().replace(/\s+/g, '')
        if (key === '#') return row.id
        if (key === 'mobile') return row.mobile
        if (key === 'name') return row.name
        if (key === 'amount') return row.amount
        if (key === 'paymentid') return row.paymentId
        if (key === 'createdat') return row.createdAt
        return ''
      }).join(',')
    ).join('\n')
    const blob = new Blob([`${headerRow}\n${rows}`], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.download = `export_${Date.now()}.csv`
    link.click()
  }

  const handleExcel = (data, headers) => {
    if (!data || data.length === 0) { alert('No data to export'); return }
    let html = '<table><thead><tr>'
    headers.forEach(h => { html += `<th>${h}</th>` })
    html += '</tr></thead><tbody>'
    data.forEach(row => {
      html += '<tr>'
      headers.forEach(h => {
        const key = h.toLowerCase().replace(/\s+/g, '')
        let val = ''
        if (key === '#') val = row.id
        else if (key === 'mobile') val = row.mobile
        else if (key === 'name') val = row.name
        else if (key === 'amount') val = row.amount
        else if (key === 'paymentid') val = row.paymentId
        else if (key === 'createdat') val = row.createdAt
        html += `<td>${val}</td>`
      })
      html += '</tr>'
    })
    html += '</tbody></table>'
    const blob = new Blob([html], { type: 'application/vnd.ms-excel' })
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.download = `export_${Date.now()}.xls`
    link.click()
  }

  const handlePrint = (title, data, headers) => {
    if (!data || data.length === 0) { alert('No data to print'); return }
    const w = window.open('', '_blank')
    let html = `<html><head><title>${title}</title>
      <style>body{font-family:Arial;padding:20px}table{width:100%;border-collapse:collapse}
      th,td{border:1px solid #ddd;padding:8px}th{background:#f5f5f5}</style></head><body>
      <h2>${title}</h2><table><thead><tr>${headers.map(h => `<th>${h}</th>`).join('')}</tr></thead><tbody>`
    data.forEach(row => {
      html += '<tr>'
      headers.forEach(h => {
        const key = h.toLowerCase().replace(/\s+/g, '')
        let val = ''
        if (key === '#') val = row.id
        else if (key === 'mobile') val = row.mobile
        else if (key === 'name') val = row.name
        else if (key === 'amount') val = row.amount
        else if (key === 'paymentid') val = row.paymentId
        else if (key === 'createdat') val = row.createdAt
        html += `<td>${val}</td>`
      })
      html += '</tr>'
    })
    html += `</tbody></table></body></html>`
    w.document.write(html)
    w.document.close()
    w.focus()
    setTimeout(() => { w.print(); w.close() }, 250)
  }

  const handlePDF = (title, data, headers) => handlePrint(title, data, headers)

  if (showResultManagement) return <ResultManagement dark={dark} onClose={() => setShowResultManagement(false)} />
  if (showSiteSetting) return <SiteSetting dark={dark} onClose={() => setShowSiteSetting(false)} />
  if (showSetAmount) return <SetAmount dark={dark} onClose={() => setShowSetAmount(false)} />

  return (
    <div className={`AD-dashboard-container ${dark ? 'dark' : 'light'}`}>
      {/* ============ HEADER ============ */}
      <div className="AD-dashboard-header">
        <div>
          <h1 className="AD-dashboard-title">
            {getGreeting()}, {user?.name || user?.username || 'admin'}
          </h1>
          <p className="AD-dashboard-subtitle">
            Here is what is happening across Munafa Matka today.
          </p>
        </div>
        <div className="AD-dashboard-header-actions">
          <button className="AD-header-btn AD-header-btn-manage" onClick={() => setShowResultManagement(true)}>
            <SettingsIcon size={16} /> Manage Result
          </button>
          <button className="AD-header-btn AD-header-btn-client" onClick={() => navigate('/coming-soon')}>
            <ExternalLink size={16} /> Open Client App
          </button>
          <div className="AD-dashboard-date">{new Date().toDateString()}</div>
        </div>
      </div>

      {/* ============ STATS ============ */}
      <div className="AD-stats-grid">
        {stats.map((s, idx) => (
          <div key={s.label} className="AD-stats-card AD-stats-card-clickable"
            style={{ animationDelay: `${idx * 0.05}s` }}
            onClick={() => handleStatsClick(s.path)}
            role="button" tabIndex={0}
            onKeyPress={(e) => e.key === 'Enter' && handleStatsClick(s.path)}
          >
            <div className="AD-stats-icon"><s.icon /></div>
            <div className="AD-stats-content">
              <span className="AD-stats-label">{s.label}</span>
              <span className="AD-stats-value">{s.value}</span>
              <span className={`AD-stats-change ${s.up === true ? 'up' : s.up === false ? 'down' : 'stable'}`}>{s.change}</span>
            </div>
          </div>
        ))}
      </div>

      {/* ============ MARKET BID DETAILS ============ */}
      <div className="AD-market-bid-details">
        <div className="AD-market-bid-header">
          <div className="AD-market-bid-title">
            <MapPin size={18} />
            <span>Market Bid Details</span>
          </div>
          <div className="AD-market-bid-actions">
            <button className="AD-market-btn-icon AD-market-btn-calendar" onClick={handleOpenDatePicker} title="Select Date" type="button">
              <Calendar size={16} />
            </button>
            <input ref={marketDateInputRef} type="date" value={marketDate}
              onChange={(e) => setMarketDate(e.target.value)}
              style={{ position: 'absolute', opacity: 0, pointerEvents: 'none', width: 0, height: 0 }} />
            <button className="AD-market-btn-icon AD-market-btn-minus" onClick={() => setMarketBidVisible(v => !v)}
              title={marketBidVisible ? 'Hide' : 'Show'} type="button">
              {marketBidVisible ? <Minus size={16} /> : <Plus size={16} />}
            </button>
          </div>
        </div>

        {marketBidVisible && (
          <div className="AD-market-bid-body">
            <label className="AD-market-form-label">Game Name</label>
            <select className="AD-market-select" value={marketGame} onChange={(e) => setMarketGame(e.target.value)}>
              <option value="">Select Game</option>
              <option value="kalyan-morning">KALYAN MORNING</option>
              <option value="worli-mumbai-day">WORLI MUMBAI DAY</option>
              <option value="main-bazar">MAIN BAZAR</option>
            </select>
            <div className="AD-market-amount-display">
              <div className="AD-market-amount-badge">0</div>
              <div className="AD-market-amount-text">Market Amount</div>
            </div>
            {marketDate && (
              <div style={{ textAlign: 'center', marginTop: '8px', fontSize: '12px', color: 'var(--text-muted)' }}>
                Date: {new Date(marketDate).toLocaleDateString('en-IN')}
              </div>
            )}
          </div>
        )}
      </div>

      {/* ============ TOTAL BIDS ============ */}
      <div className="AD-total-bids-section">
        <div className="AD-total-bids-header">
          <div className="AD-total-bids-title">
            <MapPin size={18} />
            <span>Total Bids On Single Ank Of{' '}{new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }).replace(/ /g, '-')}</span>
          </div>
          <button className="AD-market-btn-icon AD-market-btn-minus" onClick={() => setTotalBidsVisible(v => !v)}
            title={totalBidsVisible ? 'Hide' : 'Show'} type="button">
            {totalBidsVisible ? <Minus size={16} /> : <Plus size={16} />}
          </button>
        </div>

        {totalBidsVisible && (
          <div className="AD-total-bids-body">
            <div className="AD-total-bids-form-row">
              <div className="AD-total-bids-form-group">
                <label className="AD-total-bids-label">Game Name</label>
                <select className="AD-total-bids-select" value={bidsGame} onChange={(e) => setBidsGame(e.target.value)}>
                  <option value="">Select Game</option>
                  <option value="worli-mumbai-day">WORLI MUMBAI DAY</option>
                  <option value="kalyan-morning">KALYAN MORNING</option>
                  <option value="main-bazar">MAIN BAZAR</option>
                </select>
              </div>
              <div className="AD-total-bids-form-group">
                <label className="AD-total-bids-label">Session</label>
                <select className="AD-total-bids-select" value={bidsSession} onChange={(e) => setBidsSession(e.target.value)}>
                  <option value="">Select Session</option>
                  <option value="open-market">Open Market</option>
                  <option value="close-market">Close Market</option>
                </select>
              </div>
              <div className="AD-total-bids-form-group AD-total-bids-form-btn">
                <button className="AD-total-bids-get-btn" onClick={handleGetBidsDetails}>Get Details</button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ============ ANK CARDS ============ */}
      {showAnkCards && (
        <div className="AD-ank-cards-grid">
          {ankCardsData.map((item) => (
            <div key={item.ank} className="AD-ank-card">
              <div className="AD-ank-card-header">
                <Book size={16} />
                <span>Total Bid</span>
              </div>
              <div className="AD-ank-card-body">
                <div className="AD-ank-card-label">Total Bid Amount</div>
                <div className="AD-ank-card-value">{item.totalBidAmount}</div>
              </div>
              <div className="AD-ank-card-footer">Ank {item.ank}</div>
            </div>
          ))}
        </div>
      )}

      {/* ============ DEPOSIT POINTS TABLE ============ */}
      <div className="AD-deposit-table-section">
        <button className="AD-deposit-table-title-btn">Deposit Points</button>
        <div className="AD-table-toolbar">
          <div className="AD-table-toolbar-buttons">
            <button className="AD-toolbar-btn" onClick={() => handleCopy([], ['#','Mobile','Name','Amount','Payment ID','Created at'])}>Copy</button>
            <button className="AD-toolbar-btn" onClick={() => handleCSV([], ['#','Mobile','Name','Amount','Payment ID','Created at'])}>CSV</button>
            <button className="AD-toolbar-btn" onClick={() => handleExcel([], ['#','Mobile','Name','Amount','Payment ID','Created at'])}>Excel</button>
            <button className="AD-toolbar-btn" onClick={() => handlePDF('Deposit Points', [], ['#','Mobile','Name','Amount','Payment ID','Created at'])}>PDF</button>
            <button className="AD-toolbar-btn" onClick={() => handlePrint('Deposit Points', [], ['#','Mobile','Name','Amount','Payment ID','Created at'])}>Print</button>
          </div>
          <div className="AD-table-toolbar-search">
            <label>Search:</label>
            <input type="text" className="AD-toolbar-search-input" value={depositSearch} onChange={(e) => setDepositSearch(e.target.value)} />
          </div>
        </div>
        <div className="AD-data-table-wrapper">
          <table className="AD-data-table">
            <thead>
              <tr><th>#</th><th>Mobile</th><th>Name</th><th>Amount</th><th>Payment ID</th><th>Created at</th><th>Action</th></tr>
            </thead>
            <tbody>
              <tr><td colSpan="7" className="AD-data-table-empty">No data available in table</td></tr>
            </tbody>
          </table>
        </div>
        <div className="AD-data-table-pagination">
          <button className="AD-pagination-btn">‹</button>
          <button className="AD-pagination-btn">›</button>
        </div>
      </div>

      {/* ============ QR PAY DEPOSIT POINTS TABLE ============ */}
      <div className="AD-deposit-table-section">
        <button className="AD-deposit-table-title-btn">Qr Pay Deposit Points</button>
        <div className="AD-table-toolbar">
          <div className="AD-table-toolbar-buttons">
            <button className="AD-toolbar-btn" onClick={() => handleCopy(qrDepositData, ['#','Mobile','Name','Amount','Payment ID','Created at'])}>Copy</button>
            <button className="AD-toolbar-btn" onClick={() => handleCSV(qrDepositData, ['#','Mobile','Name','Amount','Payment ID','Created at'])}>CSV</button>
            <button className="AD-toolbar-btn" onClick={() => handleExcel(qrDepositData, ['#','Mobile','Name','Amount','Payment ID','Created at'])}>Excel</button>
            <button className="AD-toolbar-btn" onClick={() => handlePDF('Qr Pay Deposit Points', qrDepositData, ['#','Mobile','Name','Amount','Payment ID','Created at'])}>PDF</button>
            <button className="AD-toolbar-btn" onClick={() => handlePrint('Qr Pay Deposit Points', qrDepositData, ['#','Mobile','Name','Amount','Payment ID','Created at'])}>Print</button>
          </div>
          <div className="AD-table-toolbar-search">
            <label>Search:</label>
            <input type="text" className="AD-toolbar-search-input" value={qrDepositSearch} onChange={(e) => setQrDepositSearch(e.target.value)} />
          </div>
        </div>
        <div className="AD-data-table-wrapper">
          <table className="AD-data-table">
            <thead>
              <tr><th>#</th><th>Mobile</th><th>Name</th><th>Amount</th><th>Payment ID</th><th>Created at</th><th>Action</th></tr>
            </thead>
            <tbody>
              {qrDepositData.length === 0 ? (
                <tr><td colSpan="7" className="AD-data-table-empty">No data available in table</td></tr>
              ) : (
                qrDepositData.map((row) => (
                  <tr key={row.id}>
                    <td>{row.id}</td>
                    <td>{row.mobile}</td>
                    <td>{row.name}</td>
                    <td>{row.amount}</td>
                    <td>
                      <div className="AD-payment-id-cell">
                        <span className="AD-payment-id-text">{row.paymentId}</span>
                        <img src={row.paymentImg} alt="payment" className="AD-payment-screenshot" />
                      </div>
                    </td>
                    <td>{row.createdAt}</td>
                    <td>
                      <div className="AD-action-buttons">
                        <button className="AD-action-btn AD-action-approve" onClick={() => handleQrApprove(row.id)} title="Approve" type="button">
                          <CheckCircle size={16} />
                        </button>
                        <button className="AD-action-btn AD-action-reject" onClick={() => handleQrReject(row.id)} title="Reject" type="button">
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
        <div className="AD-data-table-pagination">
          <button className="AD-pagination-btn">‹</button>
          <button className="AD-pagination-btn active">1</button>
          <button className="AD-pagination-btn">›</button>
        </div>
      </div>

      {/* ============ RECENT USERS ============ */}
      <div className="AD-recent-users">
        <div className="AD-recent-users-header">
          <h2 className="AD-section-title">Recent Users</h2>
          <span className="AD-user-count">{apiStats ? `${apiStats.totalUsers} total users` : 'Loading...'}</span>
        </div>
        <div className="AD-table-wrapper">
          <table className="AD-users-table">
            <thead>
              <tr><th>User</th><th>User ID</th><th>Mobile</th><th>Wallet</th><th>Joined</th><th>Status</th></tr>
            </thead>
            <tbody>
              {recentUsers.length === 0 ? (
                <tr><td colSpan="6" style={{ textAlign: 'center', padding: '20px', color: 'var(--text-muted)' }}>Koi user nahi hai abhi</td></tr>
              ) : recentUsers.map((u, idx) => (
                <tr key={idx}>
                  <td className="AD-user-name">{u.name}</td>
                  <td className="AD-user-id">{u.userId}</td>
                  <td>{u.mobile}</td>
                  <td className="AD-wallet-amount">₹ {u.wallet?.toFixed(2)}</td>
                  <td className="AD-joined-date">{new Date(u.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</td>
                  <td><span className={`AD-status-badge ${u.status === 'Active' ? 'AD-status-active' : 'AD-status-inactive'}`}><CheckCircle size={12} />{u.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ============ QUICK ACTIONS ============ */}
      <div className="AD-quick-actions-section">
        <h2 className="AD-section-title">Quick Actions</h2>
        <div className="AD-quick-actions-grid">
          {quickActions.map(({ icon: Icon, label, path }, idx) => (
            <button key={idx} className="AD-quick-action-btn" style={{ animationDelay: `${idx * 0.02}s` }} onClick={() => navigate(path)}>
              <Icon size={18} /><span>{label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}