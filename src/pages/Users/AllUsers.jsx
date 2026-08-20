import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { 
  X, Users as UsersIcon, Search, Trash2, 
  FileSpreadsheet, ChevronDown, User, 
  Eye, Mail, Phone, MapPin, Calendar,
  CheckCircle, AlertCircle, Filter,
  ChevronLeft, ChevronRight
} from 'lucide-react'
import './AllUsers.css'

const initialUsers = [
  { id: 1, username: 'pankaj', userId: 'DA838', city: 'Not Found..', mobile: '9720726509', joined: '27 Jun, 2025 09:12 PM', wallet: '0.00', commission: '0.00', status: 'ACTIVE' },
  { id: 2, username: 'Bala', userId: 'DA837', city: 'Not Found..', mobile: '6396839861', joined: '27 Jun, 2025 09:07 PM', wallet: '0.00', commission: '0.00', status: 'ACTIVE' },
  { id: 3, username: 'VK Nishad', userId: 'DA836', city: 'Not Found..', mobile: '9058736097', joined: '27 Jun, 2025 09:03 PM', wallet: '0.00', commission: '0.00', status: 'ACTIVE' },
  { id: 4, username: 'SURJAN SINGH', userId: 'DA835', city: 'Not Found..', mobile: '9259036564', joined: '27 Jun, 2025 08:12 PM', wallet: '0.00', commission: '0.00', status: 'ACTIVE' },
  { id: 5, username: 'M', userId: 'DA834', city: 'Not Found..', mobile: '9520833877', joined: '27 Jun, 2025 06:54 PM', wallet: '0.00', commission: '0.00', status: 'ACTIVE' },
  { id: 6, username: 'Mintu', userId: 'DA833', city: 'Ludhiana', mobile: '8630967543', joined: '27 Jun, 2025 01:45 PM', wallet: '0.00', commission: '0.00', status: 'ACTIVE' },
  { id: 7, username: 'Dd', userId: 'DA832', city: 'Not Found..', mobile: '9927402169', joined: '27 Jun, 2025 11:49 AM', wallet: '0.00', commission: '0.00', status: 'ACTIVE' },
  { id: 8, username: 'Devendara', userId: 'DA831', city: 'Not Found..', mobile: '9045388294', joined: '27 Jun, 2025 00:00 AM', wallet: '0.00', commission: '0.00', status: 'ACTIVE' },
  { id: 9, username: 'Rahul', userId: 'DA830', city: 'Delhi', mobile: '9876543210', joined: '26 Jun, 2025 08:00 PM', wallet: '100.00', commission: '5.00', status: 'ACTIVE' },
  { id: 10, username: 'Amit', userId: 'DA829', city: 'Mumbai', mobile: '9876543211', joined: '26 Jun, 2025 07:00 PM', wallet: '200.00', commission: '10.00', status: 'ACTIVE' },
]

export default function Users({ dark, onClose }) {
  const navigate = useNavigate()
  const [users, setUsers] = useState(initialUsers)
  const [selectedIds, setSelectedIds] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 20

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedIds(users.map(u => u.id))
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

  const handleDelete = (id) => {
    if (window.confirm('Delete this user?')) {
      setUsers(users.filter(u => u.id !== id))
      setSelectedIds(selectedIds.filter(sid => sid !== id))
    }
  }

  const handleDeleteSelected = () => {
    if (window.confirm(`Delete ${selectedIds.length} selected users?`)) {
      setUsers(users.filter(u => !selectedIds.includes(u.id)))
      setSelectedIds([])
    }
  }

  const handleViewProfile = (user) => {
    // Navigate to UserProfile with user data
    navigate('/user-profile', { state: { user } })
  }

  const handleExportExcel = () => {
    alert('📊 Exporting to Excel...')
  }

  // Filter users
  const filteredUsers = users.filter(u => 
    u.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.userId.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.mobile.includes(searchTerm) ||
    u.city.toLowerCase().includes(searchTerm.toLowerCase())
  )

  // Pagination
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = Math.min(startIndex + itemsPerPage, filteredUsers.length)
  const currentUsers = filteredUsers.slice(startIndex, endIndex)

  React.useEffect(() => {
    setCurrentPage(1)
  }, [searchTerm])

  const goToPage = (page) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)))
  }

  const getPageNumbers = () => {
    const pages = []
    const maxVisible = 5
    let start = Math.max(1, currentPage - Math.floor(maxVisible / 2))
    let end = Math.min(totalPages, start + maxVisible - 1)
    
    if (end - start + 1 < maxVisible) {
      start = Math.max(1, end - maxVisible + 1)
    }
    
    for (let i = start; i <= end; i++) {
      pages.push(i)
    }
    return pages
  }

  return (
    <div className={`users-page ${dark ? 'dark' : 'light'}`}>
      {/* Header */}
      <div className="users-header">
        <div className="users-header-left">
          <UsersIcon size={24} className="users-icon" />
          <h1 className="users-title">All Users</h1>
        </div>
        {/* <button className="users-close-btn" onClick={onClose} type="button">
          <X size={20} />
        </button> */}
      </div>

      {/* Stats */}
      <div className="users-stats">
        <div className="stat-item">
          <span className="stat-label">Total Users</span>
          <span className="stat-value">{users.length}</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">Active</span>
          <span className="stat-value">{users.filter(u => u.status === 'ACTIVE').length}</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">Inactive</span>
          <span className="stat-value">{users.filter(u => u.status === 'INACTIVE').length}</span>
        </div>
      </div>

      {/* Toolbar */}
      <div className="users-toolbar">
        <div className="toolbar-left">
          <button className="toolbar-btn btn-export" onClick={handleExportExcel}>
            <FileSpreadsheet size={16} />
            Export to Excel
          </button>
          {selectedIds.length > 0 && (
            <button className="toolbar-btn btn-delete" onClick={handleDeleteSelected}>
              <Trash2 size={16} />
              Delete Multiple ({selectedIds.length})
            </button>
          )}
        </div>
        <div className="toolbar-right">
          <div className="search-box">
            <Search size={16} className="search-icon" />
            <input
              type="text"
              placeholder="Search records..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>
          <div className="filter-dropdown">
            <select className="filter-select">
              <option value="all">All Users</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
            <ChevronDown size={14} className="filter-arrow" />
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="users-table-wrapper">
        <table className="users-table">
          <thead>
            <tr>
              <th className="col-checkbox">
                <input
                  type="checkbox"
                  checked={selectedIds.length === filteredUsers.length && filteredUsers.length > 0}
                  onChange={handleSelectAll}
                />
              </th>
              <th className="col-id">#</th>
              <th className="col-image">IMAGE</th>
              <th className="col-username">USERNAME</th>
              <th className="col-userid">USER ID</th>
              <th className="col-city">CITY</th>
              <th className="col-mobile">MOBILE</th>
              <th className="col-joined">JOINED</th>
              <th className="col-wallet">WALLET</th>
              <th className="col-commission">COMMISION</th>
              <th className="col-status">STATUS</th>
              <th className="col-action">ACTION</th>
            </tr>
          </thead>
          <tbody>
            {currentUsers.map((user, index) => (
              <tr key={user.id} className={selectedIds.includes(user.id) ? 'selected' : ''}>
                <td>
                  <input
                    type="checkbox"
                    checked={selectedIds.includes(user.id)}
                    onChange={() => handleSelectOne(user.id)}
                  />
                </td>
                <td>{startIndex + index + 1}</td>
                <td>
                  <div className="user-avatar">
                    {user.username.charAt(0).toUpperCase()}
                  </div>
                </td>
                <td className="user-username">{user.username}</td>
                <td className="user-id">{user.userId}</td>
                <td className="user-city">{user.city}</td>
                <td className="user-mobile">{user.mobile}</td>
                <td className="user-joined">{user.joined}</td>
                <td className="user-wallet">₹ {user.wallet}</td>
                <td className="user-commission">₹ {user.commission}</td>
                <td>
                  <span className={`status-badge ${user.status === 'ACTIVE' ? 'status-active' : 'status-inactive'}`}>
                    {user.status === 'ACTIVE' ? <CheckCircle size={12} /> : <AlertCircle size={12} />}
                    {user.status}
                  </span>
                </td>
                <td>
                  <div className="action-buttons">
                    <button 
                      className="action-btn btn-profile" 
                      onClick={() => handleViewProfile(user)}
                    >
                      <User size={14} />
                      Profile
                    </button>
                    <button className="action-btn btn-delete" onClick={() => handleDelete(user.id)}>
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Footer with Pagination */}
      <div className="users-footer">
        <span>
          Showing {startIndex + 1} to {endIndex} of {filteredUsers.length} entries
        </span>
        {totalPages > 1 && (
          <div className="pagination">
            <button 
              className="pagination-btn"
              onClick={() => goToPage(currentPage - 1)}
              disabled={currentPage === 1}
            >
              <ChevronLeft size={16} />
              Previous
            </button>
            
            <div className="pagination-numbers">
              {getPageNumbers().map(page => (
                <button
                  key={page}
                  className={`pagination-number ${page === currentPage ? 'active' : ''}`}
                  onClick={() => goToPage(page)}
                >
                  {page}
                </button>
              ))}
            </div>
            
            <button 
              className="pagination-btn"
              onClick={() => goToPage(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              Next
              <ChevronRight size={16} />
            </button>
          </div>
        )}
      </div>
    </div>
  )
}