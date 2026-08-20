import React, { useState } from 'react'
import { 
  X, Calendar, Gamepad2, Eye, 
  FileText, TrendingUp, TrendingDown,
  Users, DollarSign, Clock, AlertCircle,
  ChevronLeft, ChevronRight
} from 'lucide-react'
import './GameBetReport.css'

export default function GameBetReport({ dark, onClose }) {
  const [selectedDate, setSelectedDate] = useState('2026-08-19')
  const [selectedGame, setSelectedGame] = useState('')
  const [showReport, setShowReport] = useState(false)

  const games = ['FARIDABAD', 'GHAZIABAD', 'GALI', 'DISAWAR']

  const handleViewReport = () => {
    if (!selectedDate || !selectedGame) {
      alert('Please select both date and game')
      return
    }
    setShowReport(true)
  }

  return (
    <div className={`game-bet-report ${dark ? 'dark' : 'light'}`}>
      {/* Header */}
      <div className="gbr-header">
        <div className="gbr-header-left">
          <FileText size={24} className="gbr-icon" />
          <h1 className="gbr-title">Game Bet Report</h1>
        </div>
        {/* <button className="gbr-close-btn" onClick={onClose} type="button">
          <X size={20} />
        </button> */}
      </div>

      {/* Filter Section */}
      <div className="gbr-filter">
        <div className="filter-row">
          <div className="filter-group">
            <label className="filter-label">
              <Calendar size={16} />
              DATE
            </label>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="filter-input"
            />
          </div>
          <div className="filter-group">
            <label className="filter-label">
              <Gamepad2 size={16} />
              GAME
            </label>
            <select
              value={selectedGame}
              onChange={(e) => setSelectedGame(e.target.value)}
              className="filter-select"
            >
              <option value="">--Select Game--</option>
              {games.map(game => (
                <option key={game} value={game}>{game}</option>
              ))}
            </select>
          </div>
          <button className="view-report-btn" onClick={handleViewReport}>
            <Eye size={18} />
            View Report
          </button>
        </div>
      </div>

      {/* Report Content */}
      {showReport ? (
        <div className="gbr-report">
          {/* Summary Cards */}
          <div className="report-summary">
            <div className="summary-card">
              <div className="summary-icon jodi">
                <TrendingUp size={20} />
              </div>
              <div className="summary-info">
                <span className="summary-label">Total Jodi Bets</span>
                <span className="summary-value">₹ 45,230.00</span>
              </div>
            </div>
            <div className="summary-card">
              <div className="summary-icon haruf">
                <TrendingDown size={20} />
              </div>
              <div className="summary-info">
                <span className="summary-label">Total Haruf Bets</span>
                <span className="summary-value">₹ 12,450.00</span>
              </div>
            </div>
            <div className="summary-card">
              <div className="summary-icon total">
                <Users size={20} />
              </div>
              <div className="summary-info">
                <span className="summary-label">Total Bets</span>
                <span className="summary-value">₹ 57,680.00</span>
              </div>
            </div>
            <div className="summary-card">
              <div className="summary-icon users">
                <Users size={20} />
              </div>
              <div className="summary-info">
                <span className="summary-label">Total Users</span>
                <span className="summary-value">24</span>
              </div>
            </div>
          </div>

          {/* Jodi Bets Table */}
          <div className="report-table-section">
            <h3 className="table-section-title">
              <TrendingUp size={18} className="section-icon jodi-icon" />
              Jodi Bets
            </h3>
            <div className="report-table-wrapper">
              <table className="report-table">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>User</th>
                    <th>Jodi Number</th>
                    <th>Amount</th>
                    <th>Time</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>1</td>
                    <td>John Doe</td>
                    <td>25</td>
                    <td>₹ 500.00</td>
                    <td>10:30 AM</td>
                  </tr>
                  <tr>
                    <td>2</td>
                    <td>Jane Smith</td>
                    <td>42</td>
                    <td>₹ 1,000.00</td>
                    <td>11:15 AM</td>
                  </tr>
                  <tr>
                    <td>3</td>
                    <td>Mike Johnson</td>
                    <td>18</td>
                    <td>₹ 750.00</td>
                    <td>12:00 PM</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Haruf Bets Table */}
          <div className="report-table-section">
            <h3 className="table-section-title">
              <TrendingDown size={18} className="section-icon haruf-icon" />
              Haruf Bets
            </h3>
            <div className="report-table-wrapper">
              <table className="report-table">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>User</th>
                    <th>Haruf Number</th>
                    <th>Amount</th>
                    <th>Time</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>1</td>
                    <td>Sarah Williams</td>
                    <td>7</td>
                    <td>₹ 300.00</td>
                    <td>10:45 AM</td>
                  </tr>
                  <tr>
                    <td>2</td>
                    <td>David Brown</td>
                    <td>3</td>
                    <td>₹ 450.00</td>
                    <td>11:30 AM</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      ) : (
        <div className="gbr-empty">
          <FileText size={48} className="empty-icon" />
          <h3 className="empty-title">No report loaded</h3>
          <p className="empty-text">
            Pick a date and a game above, then press View Report to see Jodi and Haruf bet totals.
          </p>
        </div>
      )}
    </div>
  )
}