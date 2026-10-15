import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { 
  Plus, UserCog, BarChart2, Clock, 
  Gamepad2, Calendar, Eye, Bell, 
  MessageSquare, QrCode, CreditCard, 
  Image, Layout, Settings, Users,
  TrendingUp, Wallet, AlertCircle,
  CheckCircle, PlayCircle, Send,
  Edit2, Save, X, ExternalLink,
  Settings as SettingsIcon, DollarSign,
  Sparkles, Coins, IndianRupee, TrendingUp as TrendingUpIcon,
  Gift, Award, Zap, Star, Crown, Flame
} from 'lucide-react'
import ResultManagement from '../ResultManagement/ResultManagement'
import SiteSetting from '../SiteSetting/SiteSetting'
import SetAmount from '../SetAmount/SetAmount'
import './Dashboard.css'

// SVG Icons as components
const UsersIcon = () => (
  <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
    <circle cx="12" cy="7" r="4"/>
  </svg>
)

const GamesIcon = () => (
  <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="6" width="20" height="12" rx="2"/>
    <circle cx="8" cy="12" r="2"/>
    <circle cx="16" cy="12" r="2"/>
    <path d="M18 8v2"/>
    <path d="M18 14v2"/>
  </svg>
)

const DepositIcon = () => (
  <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 2v4"/>
    <path d="M12 18v4"/>
    <path d="M4.93 4.93l2.83 2.83"/>
    <path d="M16.24 16.24l2.83 2.83"/>
    <path d="M2 12h4"/>
    <path d="M18 12h4"/>
    <path d="M4.93 19.07l2.83-2.83"/>
    <path d="M16.24 7.76l2.83-2.83"/>
  </svg>
)

const WithdrawIcon = () => (
  <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 2v4"/>
    <path d="M12 18v4"/>
    <path d="M4.93 4.93l2.83 2.83"/>
    <path d="M16.24 16.24l2.83 2.83"/>
    <path d="M2 12h4"/>
    <path d="M18 12h4"/>
    <path d="M4.93 19.07l2.83-2.83"/>
    <path d="M16.24 7.76l2.83-2.83"/>
  </svg>
)

const stats = [
  { icon: UsersIcon, label: 'Users', value: '801', change: '↑ 12%', up: true },
  { icon: GamesIcon, label: 'Games', value: '4', change: '→ Stable', up: null },
  { icon: DepositIcon, label: 'Pending Deposits', value: '16', change: '↑ 5%', up: true },
  { icon: WithdrawIcon, label: 'Pending Withdrawals', value: '1', change: '↓ 2%', up: false },
]

const initialGames = [
  { id: 1, name: 'FARIDABAD', code: 'FB', time: '06:30 PM', status: 'Upcoming', result: '00', published: false },
  { id: 2, name: 'GHAZIABAD', code: 'GB', time: '09:45 PM', status: 'Upcoming', result: '00', published: false },
  { id: 3, name: 'GALI', code: 'GL', time: '11:45 PM', status: 'Upcoming', result: '00', published: false },
  { id: 4, name: 'DISAWAR', code: 'DW', time: '05:30 AM', status: 'Awaiting result', result: '00', published: false },
]

const users = [
  { name: 'bachi', id: 'DA945', mobile: '8708605575', wallet: '₹ 20.00', joined: '22 Jul, 2026 02:45 PM', status: 'Active' },
  { name: 'Sachin', id: 'DA944', mobile: '7004711842', wallet: '₹ 930.00', joined: '18 Jul, 2026 08:07 PM', status: 'Active' },
  { name: 'Gautam Rishi', id: 'DA938', mobile: '8789115995', wallet: '₹ 1,020.00', joined: '12 Jul, 2026 01:36 PM', status: 'Active' },
  { name: 'Learning Demo', id: 'DA937', mobile: '9000000001', wallet: '₹ 100.00', joined: '12 Jul, 2026 01:16 PM', status: 'Active' },
  { name: 'Rukesh', id: 'DA936', mobile: '8800693777', wallet: '₹ 2,940.00', joined: '12 Jul, 2026 11:07 AM', status: 'Active' },
  { name: 'Rukesh', id: 'DA935', mobile: '7250081571', wallet: '₹ 20.00', joined: '12 Jul, 2026 10:54 AM', status: 'Active' },
  { name: 'Azmal', id: 'DA934', mobile: '7982035317', wallet: '₹ 20.00', joined: '29 Aug, 2025 12:21 PM', status: 'Active' },
  { name: 'Manvendra Singh', id: 'DA933', mobile: '9149300713', wallet: '₹ 0.00', joined: '28 Aug, 2025 11:01 PM', status: 'Active' },
]

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

export default function Dashboard({ dark }) {
  const navigate = useNavigate()
  const [games, setGames] = useState(initialGames)
  const [editingGame, setEditingGame] = useState(null)
  const [editResult, setEditResult] = useState('')
  const [publishingGame, setPublishingGame] = useState(null)
  const [showResultManagement, setShowResultManagement] = useState(false)
  const [showSiteSetting, setShowSiteSetting] = useState(false)
  const [showSetAmount, setShowSetAmount] = useState(false)
  const [showAnimation, setShowAnimation] = useState(() => {
    // Check if animation has been shown before
    return !sessionStorage.getItem('dashboardAnimationShown')
  })

  useEffect(() => {
    if (showAnimation) {
      const timer = setTimeout(() => {
        setShowAnimation(false)
        // Mark animation as shown
        sessionStorage.setItem('dashboardAnimationShown', 'true')
      }, 3500)
      return () => clearTimeout(timer)
    }
  }, [showAnimation])

  const handleEditResult = (game) => {
    setEditingGame(game.id)
    setEditResult(game.result)
  }

  const handleSaveResult = (gameId) => {
    setGames(games.map(game => 
      game.id === gameId 
        ? { ...game, result: editResult }
        : game
    ))
    setEditingGame(null)
    setEditResult('')
  }

  const handleCancelEdit = () => {
    setEditingGame(null)
    setEditResult('')
  }

  const handlePublishResult = (gameId) => {
    setPublishingGame(gameId)
    setTimeout(() => {
      setGames(games.map(game => 
        game.id === gameId 
          ? { ...game, published: true, status: 'Published' }
          : game
      ))
      setPublishingGame(null)
      const gameName = games.find(g => g.id === gameId)?.name
      alert(`✅ Result published successfully for ${gameName}`)
    }, 1000)
  }

  const handleManageResult = () => {
    setShowResultManagement(true)
  }

  const handleSiteSetting = () => {
    setShowSiteSetting(true)
  }

  const handleSetAmount = () => {
    setShowSetAmount(true)
  }

  const handleOpenClientApp = () => {
    navigate('/coming-soon')
  }

  const handleQuickAction = (path) => {
    navigate(path)
  }

  // If Result Management is open, show it
  if (showResultManagement) {
    return (
      <ResultManagement 
        dark={dark} 
        onClose={() => setShowResultManagement(false)} 
      />
    )
  }

  // If Site Setting is open, show it
  if (showSiteSetting) {
    return (
      <SiteSetting 
        dark={dark} 
        onClose={() => setShowSiteSetting(false)} 
      />
    )
  }

  // If Set Amount is open, show it
  if (showSetAmount) {
    return (
      <SetAmount 
        dark={dark} 
        onClose={() => setShowSetAmount(false)} 
      />
    )
  }

  // Show Flash Splash Animation only once
  if (showAnimation) {
    return (
      <div className={`dashboard-splash ${dark ? 'dark' : 'light'}`}>
        <div className="splash-container">
          {/* Flash Effect */}
          <div className="splash-flash"></div>
          
          {/* Background Particles */}
          <div className="splash-particles">
            {[...Array(30)].map((_, i) => (
              <div key={i} className={`splash-particle particle-${i}`}></div>
            ))}
          </div>
          
          {/* Main Content */}
          <div className="splash-content">
            <div className="splash-logo-wrapper">
              <div className="splash-logo-ring">
                <div className="splash-logo-ring-inner"></div>
                <div className="splash-logo-icon">
                  <IndianRupee size={56} className="splash-money" />
                </div>
              </div>
            </div>
            
            <div className="splash-text">
              <h1 className="splash-title">
                <span className="splash-title-word">Munafa</span>
                <span className="splash-title-word">Market</span>
              </h1>
              <p className="splash-subtitle">Loading your dashboard...</p>
            </div>
            
            <div className="splash-progress">
              <div className="splash-progress-bar">
                <div className="splash-progress-fill"></div>
              </div>
            </div>
            
            <div className="splash-loading-dots">
              <span className="dot"></span>
              <span className="dot"></span>
              <span className="dot"></span>
            </div>
          </div>
          
          {/* Floating Coins */}
          <div className="splash-coins">
            <Coins size={24} className="splash-coin coin-1" />
            <Coins size={20} className="splash-coin coin-2" />
            <Coins size={28} className="splash-coin coin-3" />
            <Coins size={18} className="splash-coin coin-4" />
            <Coins size={22} className="splash-coin coin-5" />
            <Coins size={16} className="splash-coin coin-6" />
          </div>
          
          {/* Sparkle Effects */}
          <div className="splash-sparkles">
            <Sparkles size={18} className="splash-sparkle sp-1" />
            <Sparkles size={22} className="splash-sparkle sp-2" />
            <Sparkles size={14} className="splash-sparkle sp-3" />
            <Sparkles size={20} className="splash-sparkle sp-4" />
            <Sparkles size={16} className="splash-sparkle sp-5" />
            <Sparkles size={24} className="splash-sparkle sp-6" />
            <Sparkles size={12} className="splash-sparkle sp-7" />
            <Sparkles size={18} className="splash-sparkle sp-8" />
          </div>
          
          <div className="splash-footer">
            <span>Munafa Market v2.0</span>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className={`dashboard-container ${dark ? 'dark' : 'light'}`}>
      {/* Page header with buttons */}
      <div className="dashboard-header">
        <div>
          <h1 className="dashboard-title">Good afternoon, admin</h1>
          <p className="dashboard-subtitle">Here is what is happening across Hindustan Matka today.</p>
        </div>
        <div className="dashboard-header-actions">
          <button className="header-btn header-btn-manage" onClick={handleManageResult}>
            <SettingsIcon size={16} />
            Manage Result
          </button>
          <button className="header-btn header-btn-client" onClick={handleOpenClientApp}>
            <ExternalLink size={16} />
            Open Client App
          </button>
          <div className="dashboard-date">
            {new Date().toDateString()}
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="stats-grid">
        {stats.map((s, idx) => (
          <div key={s.label} className="stats-card" style={{ animationDelay: `${idx * 0.05}s` }}>
            <div className="stats-icon">
              <s.icon />
            </div>
            <div className="stats-content">
              <span className="stats-label">{s.label}</span>
              <span className="stats-value">{s.value}</span>
              <span className={`stats-change ${s.up === true ? 'up' : s.up === false ? 'down' : 'stable'}`}>
                {s.change}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Instant Result Uploader */}
      <div className="result-uploader">
        <div className="result-uploader-header">
          <div>
            <div className="result-uploader-title">
              <PlayCircle size={20} color="#ff6b00" />
              <h2>Instant Result Uploader</h2>
            </div>
            <p className="result-uploader-sub">Publish today's upcoming game results directly from the dashboard.</p>
          </div>
        </div>
        <div className="games-grid">
          {games.map((game) => (
            <div key={game.id} className={`game-card ${game.published ? 'published' : ''}`}>
              <div className="game-header">
                <span className="game-code">{game.code}</span>
                <span className={`game-status ${
                  game.published ? 'status-published' : 
                  game.status === 'Upcoming' ? 'status-upcoming' : 'status-awaiting'
                }`}>
                  {game.published ? '✓ Published' : game.status}
                </span>
              </div>
              <h3 className="game-name">{game.name}</h3>
              <p className="game-time">{game.time}</p>
              <div className="game-result-section">
                <div className="game-result">
                  <span className="result-label">Two digit result</span>
                  {editingGame === game.id ? (
                    <div className="result-edit">
                      <input
                        type="text"
                        maxLength="2"
                        value={editResult}
                        onChange={(e) => setEditResult(e.target.value.replace(/[^0-9]/g, ''))}
                        className="result-input"
                        placeholder="00"
                        autoFocus
                      />
                      <button 
                        className="result-save-btn"
                        onClick={() => handleSaveResult(game.id)}
                        title="Save result"
                      >
                        <Save size={14} />
                      </button>
                      <button 
                        className="result-cancel-btn"
                        onClick={handleCancelEdit}
                        title="Cancel"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  ) : (
                    <>
                      <span className={`result-value ${game.published ? 'result-published' : ''}`}>
                        {game.result}
                      </span>
                      {!game.published && (
                        <button 
                          className="result-edit-btn"
                          onClick={() => handleEditResult(game)}
                          title="Edit result"
                        >
                          <Edit2 size={14} />
                        </button>
                      )}
                    </>
                  )}
                </div>
                
                {!game.published && game.result !== '00' && (
                  <button 
                    className="publish-btn"
                    onClick={() => handlePublishResult(game.id)}
                    disabled={publishingGame === game.id}
                  >
                    {publishingGame === game.id ? (
                      <>
                        <span className="spinner"></span>
                        Publishing...
                      </>
                    ) : (
                      <>
                        <Send size={14} />
                        Publish Result
                      </>
                    )}
                  </button>
                )}
                
                {game.published && (
                  <div className="published-badge">
                    <CheckCircle size={14} />
                    Published Successfully
                  </div>
                )}
                
                {!game.published && game.result === '00' && (
                  <div className="pending-badge">
                    <AlertCircle size={14} />
                    Set result to publish
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
        <div className="result-uploader-footer">
          <AlertCircle size={16} color="#f59e0b" />
          <p>Settlement protection: publishing credits all winning wallets immediately. Verify the two-digit result before confirming.</p>
        </div>
      </div>

      {/* Recent Users */}
      <div className="recent-users">
        <div className="recent-users-header">
          <h2 className="section-title">Recent Users</h2>
          <span className="user-count">0 new users joined in the last 7 days</span>
        </div>
        <div className="table-wrapper">
          <table className="users-table">
            <thead>
              <tr>
                <th>User</th>
                <th>User ID</th>
                <th>Mobile</th>
                <th>Wallet</th>
                <th>Joined</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user, idx) => (
                <tr key={idx}>
                  <td className="user-name">{user.name}</td>
                  <td className="user-id">{user.id}</td>
                  <td>{user.mobile}</td>
                  <td className="wallet-amount">{user.wallet}</td>
                  <td className="joined-date">{user.joined}</td>
                  <td>
                    <span className="status-badge status-active">
                      <CheckCircle size={12} />
                      {user.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="quick-actions-section">
        <h2 className="section-title">Quick Actions</h2>
        <div className="quick-actions-grid">
          {quickActions.map(({ icon: Icon, label, path }, idx) => (
            <button 
              key={idx} 
              className="quick-action-btn" 
              style={{ animationDelay: `${idx * 0.02}s` }}
              onClick={() => handleQuickAction(path)}
            >
              <Icon size={18} />
              <span>{label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}