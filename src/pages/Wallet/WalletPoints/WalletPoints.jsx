import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { 
  X, Wallet, Plus, Search, Trash2, 
  Eye, ChevronLeft, ChevronRight,
  TrendingUp, TrendingDown, Award,
  Calendar, User, FileText, Filter,
  UserCircle
} from 'lucide-react'
import './WalletPoints.css'

const initialPoints = [
  { id: 1, user: 'Deepak', adjustments: 1, totalAdded: '0.00', totalDeducted: '-1.00', net: '-1.00', lastAdjustment: '19 Aug, 2026 10:26 AM' },
  { id: 2, user: 'Gautam Rishi', adjustments: 1, totalAdded: '1,000.00', totalDeducted: '-0.00', net: '+1,000.00', lastAdjustment: '13 Jul, 2026 01:44 AM' },
  { id: 3, user: 'Afjal Khan', adjustments: 553, totalAdded: '191,410.00', totalDeducted: '-151,180.00', net: '+40,230.00', lastAdjustment: '29 Aug, 2025 11:54 AM' },
  { id: 4, user: 'Suraj', adjustments: 6, totalAdded: '60.00', totalDeducted: '-525.00', net: '-465.00', lastAdjustment: '28 Aug, 2025 07:19 PM' },
  { id: 5, user: 'Kumar', adjustments: 20, totalAdded: '1,030.00', totalDeducted: '-0.00', net: '+1,030.00', lastAdjustment: '28 Aug, 2025 04:13 PM' },
  { id: 6, user: 'vinay', adjustments: 4, totalAdded: '120.00', totalDeducted: '-0.00', net: '+120.00', lastAdjustment: '28 Aug, 2025 03:27 PM' },
  { id: 7, user: 'Amar Singh', adjustments: 3, totalAdded: '40.00', totalDeducted: '-20.00', net: '+20.00', lastAdjustment: '27 Aug, 2025 10:41 PM' },
  { id: 8, user: 'Abhishek', adjustments: 18, totalAdded: '1,295.00', totalDeducted: '-700.00', net: '+595.00', lastAdjustment: '27 Aug, 2025 10:27 PM' },
  { id: 9, user: 'manojcheapwall', adjustments: 1, totalAdded: '620.00', totalDeducted: '-100.00', net: '+520.00', lastAdjustment: '27 Aug, 2025 09:12 PM' },
]

export default function Points({ dark, onClose }) {
  const navigate = useNavigate()
  const [points, setPoints] = useState(initialPoints)
  const [selectedIds, setSelectedIds] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [showAddModal, setShowAddModal] = useState(false)
  const [showDetails, setShowDetails] = useState(null)
  const itemsPerPage = 10

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedIds(points.map(p => p.id))
    } else {
      setSelectedIds([])
    }
  }

  const handleSelectOne = (id) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter(sid => sid !== id))
    } else {
      setSelectedIds([...selectedIds, id])
    }
  }

  const handleViewProfile = (user) => {
    // Navigate to UserProfile with user data
    navigate('/user-profile', { 
      state: { 
        user: {
          name: user,
          userId: 'DA' + Math.floor(Math.random() * 1000),
          mobile: '9876543210',
          city: 'Not Found..',
          joined: new Date().toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' }),
          status: 'Active',
          wallet: '0.00',
          commission: '0.00',
          totalBets: '0.00',
          deposits: '0.00',
          withdrawals: '0.00'
        }
      } 
    })
  }

  const handleViewDetails = (point) => {
    setShowDetails(point)
  }

  const handleCloseDetails = () => {
    setShowDetails(null)
  }

  const filteredPoints = points.filter(p => 
    p.user.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const totalPages = Math.ceil(filteredPoints.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = Math.min(startIndex + itemsPerPage, filteredPoints.length)
  const currentPoints = filteredPoints.slice(startIndex, endIndex)

  return (
    <div className={`points-page ${dark ? 'dark' : 'light'}`}>
      {/* Header */}
      <div className="points-header">
        <div className="points-header-left">
          <Wallet size={24} className="points-icon" />
          <h1 className="points-title">Points</h1>
        </div>
        {/* <button className="points-close-btn" onClick={onClose} type="button">
          <X size={20} />
        </button> */}
      </div>

      {/* Stats */}
      <div className="points-stats">
        <div className="stat-item">
          <span className="stat-label">Total Users</span>
          <span className="stat-value">{points.length}</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">Total Adjustments</span>
          <span className="stat-value">{points.reduce((sum, p) => sum + p.adjustments, 0)}</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">Net Points</span>
          <span className="stat-value">₹ {points.reduce((sum, p) => sum + parseFloat(p.net.replace(/,/g, '')), 0).toFixed(2)}</span>
        </div>
      </div>

      {/* Toolbar */}
      <div className="points-toolbar">
        <div className="toolbar-left">
          <button className="toolbar-btn btn-add" onClick={() => setShowAddModal(true)}>
            <Plus size={16} />
            Add New
          </button>
          {selectedIds.length > 0 && (
            <button className="toolbar-btn btn-delete">
              <Trash2 size={16} />
              Delete Selected ({selectedIds.length})
            </button>
          )}
        </div>
        <div className="toolbar-right">
          <div className="search-box">
            <Search size={16} className="search-icon" />
            <input
              type="text"
              placeholder="Search name, mobile, ID, re"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="points-table-wrapper">
        <table className="points-table">
          <thead>
            <tr>
              <th className="col-checkbox">
                <input
                  type="checkbox"
                  checked={selectedIds.length === filteredPoints.length && filteredPoints.length > 0}
                  onChange={handleSelectAll}
                />
              </th>
              <th className="col-id">#</th>
              <th className="col-user">USER</th>
              <th className="col-adjustments">ADJUSTMENTS</th>
              <th className="col-added">TOTAL ADDED</th>
              <th className="col-deducted">TOTAL DEDUCTED</th>
              <th className="col-net">NET</th>
              <th className="col-last">LAST ADJUSTMENT</th>
              <th className="col-action">ACTION</th>
            </tr>
          </thead>
          <tbody>
            {currentPoints.map((point, index) => (
              <tr key={point.id} className={selectedIds.includes(point.id) ? 'selected' : ''}>
                <td>
                  <input
                    type="checkbox"
                    checked={selectedIds.includes(point.id)}
                    onChange={() => handleSelectOne(point.id)}
                  />
                </td>
                <td>{startIndex + index + 1}</td>
                <td className="user-name">{point.user}</td>
                <td className="adjustments">{point.adjustments}</td>
                <td className="added">{point.totalAdded}</td>
                <td className="deducted">{point.totalDeducted}</td>
                <td className={`net ${parseFloat(point.net.replace(/,/g, '')) >= 0 ? 'positive' : 'negative'}`}>
                  {point.net}
                </td>
                <td className="last-adjustment">{point.lastAdjustment}</td>
                <td>
                  <div className="action-buttons">
                    <button 
                      className="action-btn btn-profile" 
                      onClick={() => handleViewProfile(point.user)}
                    >
                      <UserCircle size={14} />
                      View Profile
                    </button>
                    <button 
                      className="action-btn btn-view" 
                      onClick={() => handleViewDetails(point)}
                    >
                      <Eye size={14} />
                      Details
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Footer */}
      <div className="points-footer">
        <span>
          Showing {startIndex + 1} to {endIndex} of {filteredPoints.length} entries
        </span>
        {totalPages > 1 && (
          <div className="pagination">
            <button 
              className="pagination-btn"
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
            >
              <ChevronLeft size={16} />
            </button>
            <span className="pagination-info">
              Page {currentPage} of {totalPages}
            </span>
            <button 
              className="pagination-btn"
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
            >
              <ChevronRight size={16} />
            </button>
          </div>
        )}
      </div>

      {/* Add Modal */}
      {showAddModal && (
        <div className="modal-overlay" onClick={() => setShowAddModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <Plus size={24} color="#ff6b00" />
              <h3>Add Points</h3>
              <button className="modal-close" onClick={() => setShowAddModal(false)}>
                <X size={18} />
              </button>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label>User</label>
                <select className="form-select">
                  <option value="">Select User</option>
                  {points.map(p => (
                    <option key={p.id} value={p.user}>{p.user}</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>Amount</label>
                <input type="number" placeholder="Enter amount" className="form-input" />
              </div>
              <div className="form-group">
                <label>Type</label>
                <select className="form-select">
                  <option value="credit">Credit (+)</option>
                  <option value="debit">Debit (-)</option>
                </select>
              </div>
              <div className="form-group">
                <label>Remark</label>
                <input type="text" placeholder="Enter remark" className="form-input" />
              </div>
            </div>
            <div className="modal-actions">
              <button className="modal-btn btn-cancel" onClick={() => setShowAddModal(false)}>
                Cancel
              </button>
              <button className="modal-btn btn-add" onClick={() => setShowAddModal(false)}>
                Add Points
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Details Modal */}
      {showDetails && (
        <div className="modal-overlay" onClick={handleCloseDetails}>
          <div className="modal-content modal-details" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <FileText size={24} color="#ff6b00" />
              <h3>Points Details - {showDetails.user}</h3>
              <button className="modal-close" onClick={handleCloseDetails}>
                <X size={18} />
              </button>
            </div>
            <div className="details-grid">
              <div className="detail-item">
                <User size={16} className="detail-icon" />
                <span className="detail-label">User</span>
                <span className="detail-value">{showDetails.user}</span>
              </div>
              <div className="detail-item">
                <Award size={16} className="detail-icon" />
                <span className="detail-label">Adjustments</span>
                <span className="detail-value">{showDetails.adjustments}</span>
              </div>
              <div className="detail-item">
                <TrendingUp size={16} className="detail-icon" />
                <span className="detail-label">Total Added</span>
                <span className="detail-value positive">+{showDetails.totalAdded}</span>
              </div>
              <div className="detail-item">
                <TrendingDown size={16} className="detail-icon" />
                <span className="detail-label">Total Deducted</span>
                <span className="detail-value negative">{showDetails.totalDeducted}</span>
              </div>
              <div className="detail-item">
                <Wallet size={16} className="detail-icon" />
                <span className="detail-label">Net</span>
                <span className={`detail-value ${parseFloat(showDetails.net.replace(/,/g, '')) >= 0 ? 'positive' : 'negative'}`}>
                  {showDetails.net}
                </span>
              </div>
              <div className="detail-item">
                <Calendar size={16} className="detail-icon" />
                <span className="detail-label">Last Adjustment</span>
                <span className="detail-value">{showDetails.lastAdjustment}</span>
              </div>
            </div>
            <div className="modal-actions">
              <button className="modal-btn btn-close" onClick={handleCloseDetails}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}