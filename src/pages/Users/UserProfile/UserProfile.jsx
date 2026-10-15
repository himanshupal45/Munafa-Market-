import React, { useState } from 'react'
import { 
  X, User, MapPin, Calendar, Phone, 
  Wallet, TrendingUp, TrendingDown, 
  CreditCard, ArrowUpRight, ArrowDownRight,
  Gift, History, Settings, Plus, Minus,
  Zap, Award, Star, Clock, CheckCircle,
  AlertCircle, ChevronRight, ChevronDown,
  Download, Filter, Search, ArrowLeft
} from 'lucide-react'
import './UserProfile.css'

export default function UserProfile({ dark, onClose }) {
  const [activeTab, setActiveTab] = useState('ledger')
  const [adjustAmount, setAdjustAmount] = useState('')
  const [adjustRemark, setAdjustRemark] = useState('')
  const [adjustType, setAdjustType] = useState('credit')

  const userData = {
    name: 'bachi',
    userId: 'DA945',
    mobile: '8708605575',
    city: 'Adilabad',
    joined: '22 Jul, 2026',
    status: 'Active',
    wallet: '20.00',
    commission: '0.00',
    totalBets: '0.00',
    deposits: '0.00',
    withdrawals: '0.00'
  }

  // Transaction data based on active tab
  const getTransactions = () => {
    const allTransactions = [
      { date: '22 Jul, 2026 02:46 PM', type: 'CREDIT', category: 'Referral Amount', details: 'Referral Amount', amount: '+20.00', balance: '20.00' },
      { date: '22 Jul, 2026 02:30 PM', type: 'DEBIT', category: 'Bet', details: 'Game: DISAWAR', amount: '-10.00', balance: '0.00' },
      { date: '22 Jul, 2026 02:15 PM', type: 'CREDIT', category: 'Deposit', details: 'UPI Transfer', amount: '+50.00', balance: '50.00' },
      { date: '22 Jul, 2026 01:45 PM', type: 'DEBIT', category: 'Withdrawal', details: 'Bank Transfer', amount: '-30.00', balance: '0.00' },
      { date: '22 Jul, 2026 01:30 PM', type: 'CREDIT', category: 'Admin Points', details: 'Bonus Added', amount: '+5.00', balance: '5.00' },
      { date: '22 Jul, 2026 01:15 PM', type: 'DEBIT', category: 'Bet', details: 'Game: GALI', amount: '-25.00', balance: '0.00' },
      { date: '22 Jul, 2026 12:45 PM', type: 'CREDIT', category: 'Deposit', details: 'Cash Deposit', amount: '+100.00', balance: '100.00' },
    ]

    switch(activeTab) {
      case 'bets':
        return allTransactions.filter(t => t.category === 'Bet')
      case 'admin':
        return allTransactions.filter(t => t.category === 'Admin Points')
      case 'deposits':
        return allTransactions.filter(t => t.category === 'Deposit')
      case 'withdrawals':
        return allTransactions.filter(t => t.category === 'Withdrawal')
      default:
        return allTransactions
    }
  }

  const transactions = getTransactions()

  const handleApply = () => {
    alert('✅ Points adjusted successfully!')
  }

  return (
    <div className={`user-profile ${dark ? 'dark' : 'light'}`}>
      {/* Header */}
      <div className="user-profile-header">
        <div className="user-profile-header-left">
          <User size={24} className="user-profile-icon" />
          <h1 className="user-profile-title">User Profile</h1>
        </div>
      </div>

      {/* User Info Card */}
      <div className="user-info-card">
        <div className="user-info-left">
          <div className="user-avatar-large">
            {userData.name.charAt(0).toUpperCase()}
          </div>
          <div className="user-info-details">
            <h2 className="user-info-name">{userData.name}</h2>
            <div className="user-info-meta">
              <span className="user-id"><User size={14} /> {userData.userId}</span>
              <span className="user-phone"><Phone size={14} /> {userData.mobile}</span>
              <span className="user-city"><MapPin size={14} /> {userData.city}</span>
              <span className="user-joined"><Calendar size={14} /> Joined {userData.joined}</span>
            </div>
          </div>
        </div>
        <div className="user-info-right">
          <span className="status-badge status-active">
            <CheckCircle size={14} />
            {userData.status}
          </span>
          <p className="user-remark">Required remark shown to the user</p>
        </div>
      </div>

      {/* Adjust Points */}
      <div className="adjust-points-card">
        <h3 className="adjust-points-title">
          <Zap size={18} />
          ADJUST POINTS
        </h3>
        <div className="adjust-points-grid">
          <div className="adjust-type">
            <button 
              className={`adjust-type-btn ${adjustType === 'credit' ? 'active-credit' : ''}`}
              onClick={() => setAdjustType('credit')}
            >
              <Plus size={16} />
              Add (Credit)
            </button>
            <button 
              className={`adjust-type-btn ${adjustType === 'debit' ? 'active-debit' : ''}`}
              onClick={() => setAdjustType('debit')}
            >
              <Minus size={16} />
              Deduct (Debit)
            </button>
          </div>
          <div className="adjust-fields">
            <div className="adjust-field">
              <label>Amount</label>
              <input
                type="number"
                placeholder="Enter amount"
                value={adjustAmount}
                onChange={(e) => setAdjustAmount(e.target.value)}
                className="adjust-input"
              />
            </div>
            <div className="adjust-field">
              <label>Remark <span className="required">(required)</span></label>
              <input
                type="text"
                placeholder="why this adjustment?"
                value={adjustRemark}
                onChange={(e) => setAdjustRemark(e.target.value)}
                className="adjust-input"
              />
            </div>
          </div>
          <button className="apply-btn" onClick={handleApply}>
            Apply
          </button>
        </div>
      </div>

      {/* Wallet Stats */}
      <div className="wallet-stats-grid">
        <div className="wallet-stat-card">
          <Wallet size={20} className="stat-icon wallet-icon" />
          <span className="stat-label">WALLET</span>
          <span className="stat-value">₹ {userData.wallet}</span>
        </div>
        <div className="wallet-stat-card">
          <Gift size={20} className="stat-icon commission-icon" />
          <span className="stat-label">COMMISSION</span>
          <span className="stat-value">₹ {userData.commission}</span>
        </div>
        <div className="wallet-stat-card">
          <TrendingUp size={20} className="stat-icon bets-icon" />
          <span className="stat-label">TOTAL BETS</span>
          <span className="stat-value">₹ {userData.totalBets}</span>
        </div>
        <div className="wallet-stat-card">
          <ArrowUpRight size={20} className="stat-icon deposits-icon" />
          <span className="stat-label">DEPOSITS</span>
          <span className="stat-value">₹ {userData.deposits}</span>
        </div>
        <div className="wallet-stat-card">
          <ArrowDownRight size={20} className="stat-icon withdrawals-icon" />
          <span className="stat-label">WITHDRAWALS</span>
          <span className="stat-value">₹ {userData.withdrawals}</span>
        </div>
      </div>

      {/* Tabs - All working */}
      <div className="profile-tabs">
        <button 
          className={`tab-btn ${activeTab === 'ledger' ? 'active' : ''}`}
          onClick={() => setActiveTab('ledger')}
        >
          <History size={16} />
          Wallet Ledger
        </button>
        <button 
          className={`tab-btn ${activeTab === 'bets' ? 'active' : ''}`}
          onClick={() => setActiveTab('bets')}
        >
          <TrendingUp size={16} />
          Bets
        </button>
        <button 
          className={`tab-btn ${activeTab === 'admin' ? 'active' : ''}`}
          onClick={() => setActiveTab('admin')}
        >
          <Settings size={16} />
          Admin Points
        </button>
        <button 
          className={`tab-btn ${activeTab === 'deposits' ? 'active' : ''}`}
          onClick={() => setActiveTab('deposits')}
        >
          <ArrowUpRight size={16} />
          Deposits
        </button>
        <button 
          className={`tab-btn ${activeTab === 'withdrawals' ? 'active' : ''}`}
          onClick={() => setActiveTab('withdrawals')}
        >
          <ArrowDownRight size={16} />
          Withdrawals
        </button>
      </div>

      {/* Table - Data changes based on active tab */}
      <div className="user-transactions">
        <div className="transactions-toolbar">
          <div className="transactions-search">
            <Search size={16} className="search-icon" />
            <input
              type="text"
              placeholder={`Search ${activeTab}...`}
              className="search-input"
            />
          </div>
          <div className="transactions-actions">
            <button className="filter-btn">
              <Filter size={16} />
              Filter
            </button>
            <button className="download-btn">
              <Download size={16} />
              Download
            </button>
          </div>
        </div>

        <div className="transactions-table-wrapper">
          <table className="transactions-table">
            <thead>
              <tr>
                <th>DATE</th>
                <th>TYPE</th>
                <th>CATEGORY</th>
                <th>DETAILS</th>
                <th>AMOUNT</th>
                <th>BALANCE</th>
              </tr>
            </thead>
            <tbody>
              {transactions.length > 0 ? (
                transactions.map((txn, index) => (
                  <tr key={index}>
                    <td className="txn-date">{txn.date}</td>
                    <td>
                      <span className={`txn-type ${txn.type === 'CREDIT' ? 'credit' : 'debit'}`}>
                        {txn.type === 'CREDIT' ? (
                          <ArrowUpRight size={14} />
                        ) : (
                          <ArrowDownRight size={14} />
                        )}
                        {txn.type}
                      </span>
                    </td>
                    <td className="txn-category">{txn.category}</td>
                    <td className="txn-details">{txn.details}</td>
                    <td className={`txn-amount ${txn.type === 'CREDIT' ? 'credit-amount' : 'debit-amount'}`}>
                      {txn.amount}
                    </td>
                    <td className="txn-balance">₹ {txn.balance}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="no-data">
                    <div className="no-data-message">
                      <AlertCircle size={32} />
                      <p>No {activeTab} transactions found</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="transactions-footer">
          <span>Showing 1 to {transactions.length} of {transactions.length} entries</span>
          <div className="pagination">
            <button className="pagination-btn" disabled>Previous</button>
            <button className="pagination-btn active">1</button>
            <button className="pagination-btn" disabled>Next</button>
          </div>
        </div>
      </div>
    </div>
  )
}