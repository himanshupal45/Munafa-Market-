import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Home as HomeIcon,
  Bell,
  Plus,
  Search,
  Trash2,
  ChevronLeft,
  ChevronRight,
  CheckCircle,
  AlertCircle,
  Save,
  X as XIcon
} from 'lucide-react'
import './Notification.css'

const initialNotifications = [
  { id: 1, date: '2026-08-19', type: 'Notification', title: 'test', message: 'test', status: 'HIDE' },
  { id: 2, date: '2026-08-18', type: 'Notification', title: 'Welcome Offer', message: 'Get 100% bonus on first deposit', status: 'SHOW' },
  { id: 3, date: '2026-08-17', type: 'Notification', title: 'New Game Added', message: 'New game DISAWAR is now available', status: 'SHOW' },
  { id: 4, date: '2026-08-16', type: 'Notification', title: 'Maintenance', message: 'Server maintenance on 20th Aug', status: 'HIDE' },
]

export default function Notification({ dark }) {
  const navigate = useNavigate()
  const [notifications, setNotifications] = useState(initialNotifications)
  const [selectedIds, setSelectedIds] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [editingNotification, setEditingNotification] = useState(null)
  const [editData, setEditData] = useState({ title: '', message: '', type: '' })
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10

  const handleSelectAll = (e) => {
    setSelectedIds(e.target.checked ? notifications.map(n => n.id) : [])
  }

  const handleSelectOne = (id) => {
    setSelectedIds(prev =>
      prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]
    )
  }

  const handleDelete = (id) => {
    if (window.confirm('Delete this notification?')) {
      setNotifications(prev => prev.filter(n => n.id !== id))
      setSelectedIds(prev => prev.filter(s => s !== id))
    }
  }

  const handleDeleteSelected = () => {
    if (window.confirm(`Delete ${selectedIds.length} selected notifications?`)) {
      setNotifications(prev => prev.filter(n => !selectedIds.includes(n.id)))
      setSelectedIds([])
    }
  }

  const handleEdit = (n) => {
    setEditingNotification(n.id)
    setEditData({ title: n.title, message: n.message, type: n.type })
  }

  const handleSaveEdit = (id) => {
    setNotifications(prev =>
      prev.map(n => n.id === id
        ? { ...n, title: editData.title, message: editData.message, type: editData.type }
        : n
      )
    )
    setEditingNotification(null)
    setEditData({ title: '', message: '', type: '' })
  }

  const handleCancelEdit = () => {
    setEditingNotification(null)
    setEditData({ title: '', message: '', type: '' })
  }

  const handleAddNotification = () => {
    navigate('/add-notification')
  }

  const handleStatusToggle = (id) => {
    setNotifications(prev =>
      prev.map(n => n.id === id ? { ...n, status: n.status === 'SHOW' ? 'HIDE' : 'SHOW' } : n)
    )
  }

  const filteredNotifications = notifications.filter(n =>
    n.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    n.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
    n.type.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const totalPages = Math.ceil(filteredNotifications.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const currentNotifications = filteredNotifications.slice(startIndex, startIndex + itemsPerPage)

  const getPageNumbers = () => {
    const pages = []
    const maxVisible = 5
    let start = Math.max(1, currentPage - Math.floor(maxVisible / 2))
    let end = Math.min(totalPages, start + maxVisible - 1)
    if (end - start + 1 < maxVisible) start = Math.max(1, end - maxVisible + 1)
    for (let i = start; i <= end; i++) pages.push(i)
    return pages
  }

  return (
    <div className="nf-page">
      {/* ✅ Breadcrumb */}
      <div className="nf-breadcrumb">
        <HomeIcon size={14} />
        <span>Home</span>
        <span className="nf-breadcrumb-sep">/</span>
        <span>Notification</span>
      </div>

      {/* ✅ Page Title with Icon */}
      <div className="nf-page-title-wrapper">
        <Bell size={26} className="nf-page-title-icon" />
        <h1 className="nf-page-title">Notification</h1>
      </div>

      {/* ✅ Stats */}
      <div className="nf-stats-grid">
        <div className="nf-stat-card">
          <span className="nf-stat-label">Total</span>
          <span className="nf-stat-value">{notifications.length}</span>
        </div>
        <div className="nf-stat-card">
          <span className="nf-stat-label">Active</span>
          <span className="nf-stat-value nf-stat-green">
            {notifications.filter(n => n.status === 'SHOW').length}
          </span>
        </div>
        <div className="nf-stat-card">
          <span className="nf-stat-label">Inactive</span>
          <span className="nf-stat-value nf-stat-red">
            {notifications.filter(n => n.status === 'HIDE').length}
          </span>
        </div>
      </div>

      {/* ✅ Main Card */}
      <div className="nf-card">
        {/* Toolbar */}
        <div className="nf-toolbar">
          <div className="nf-toolbar-left">
            <button className="nf-toolbar-btn nf-add-btn" onClick={handleAddNotification} type="button">
              <Plus size={16} />
              Add Notification
            </button>
            {selectedIds.length > 0 && (
              <button className="nf-toolbar-btn nf-delete-btn" onClick={handleDeleteSelected} type="button">
                <Trash2 size={16} />
                Delete ({selectedIds.length})
              </button>
            )}
          </div>
          <div className="nf-toolbar-search">
            <label>Search:</label>
            <input
              type="text"
              className="nf-search-input"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Table */}
        <div className="nf-table-wrapper">
          <table className="nf-table">
            <thead>
              <tr>
                <th>
                  <input
                    type="checkbox"
                    checked={selectedIds.length === filteredNotifications.length && filteredNotifications.length > 0}
                    onChange={handleSelectAll}
                  />
                </th>
                <th>#</th>
                <th>ADD DATE</th>
                <th>TYPE</th>
                <th>TITLE</th>
                <th>MESSAGE</th>
                <th>STATUS</th>
                <th>ACTION</th>
              </tr>
            </thead>
            <tbody>
              {currentNotifications.length === 0 ? (
                <tr>
                  <td colSpan="8" className="nf-table-empty">No data available in table</td>
                </tr>
              ) : (
                currentNotifications.map((n, i) => (
                  <tr key={n.id} className={selectedIds.includes(n.id) ? 'selected' : ''}>
                    <td>
                      <input
                        type="checkbox"
                        checked={selectedIds.includes(n.id)}
                        onChange={() => handleSelectOne(n.id)}
                      />
                    </td>
                    <td>{startIndex + i + 1}</td>
                    <td className="nf-date">{n.date}</td>
                    <td>
                      <span className="nf-type-badge">{n.type}</span>
                    </td>
                    <td>
                      {editingNotification === n.id ? (
                        <input
                          type="text"
                          value={editData.title}
                          onChange={(e) => setEditData({ ...editData, title: e.target.value })}
                          className="nf-edit-input"
                        />
                      ) : (
                        <span className="nf-title-text">{n.title}</span>
                      )}
                    </td>
                    <td>
                      {editingNotification === n.id ? (
                        <input
                          type="text"
                          value={editData.message}
                          onChange={(e) => setEditData({ ...editData, message: e.target.value })}
                          className="nf-edit-input"
                        />
                      ) : (
                        <span className="nf-message-text">{n.message}</span>
                      )}
                    </td>
                    <td>
                      <button
                        className={`nf-status-badge ${n.status === 'SHOW' ? 'nf-status-show' : 'nf-status-hide'}`}
                        onClick={() => handleStatusToggle(n.id)}
                        type="button"
                      >
                        {n.status === 'SHOW' ? <CheckCircle size={12} /> : <AlertCircle size={12} />}
                        {n.status}
                      </button>
                    </td>
                    <td>
                      <div className="nf-action-buttons">
                        {editingNotification === n.id ? (
                          <>
                            <button className="nf-action-btn nf-save-btn" onClick={() => handleSaveEdit(n.id)} title="Save" type="button">
                              <Save size={14} />
                            </button>
                            <button className="nf-action-btn nf-cancel-btn" onClick={handleCancelEdit} title="Cancel" type="button">
                              <XIcon size={14} />
                            </button>
                          </>
                        ) : (
                          <>
                            <button className="nf-action-btn nf-update-btn" onClick={() => handleEdit(n)} type="button">
                              Update
                            </button>
                            <button className="nf-action-btn nf-remove-btn" onClick={() => handleDelete(n.id)} type="button">
                              Delete
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

        {/* Pagination */}
        <div className="nf-pagination-wrapper">
          <span className="nf-pagination-info">
            Total: {filteredNotifications.length} | Page {currentPage} of {totalPages || 1}
          </span>
          {totalPages > 1 && (
            <div className="nf-pagination">
              <button
                className="nf-page-btn"
                onClick={() => setCurrentPage(p => Math.max(p - 1, 1))}
                disabled={currentPage === 1}
                type="button"
              >
                <ChevronLeft size={16} />
              </button>
              {getPageNumbers().map(page => (
                <button
                  key={page}
                  className={`nf-page-btn ${page === currentPage ? 'active' : ''}`}
                  onClick={() => setCurrentPage(page)}
                  type="button"
                >
                  {page}
                </button>
              ))}
              <button
                className="nf-page-btn"
                onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))}
                disabled={currentPage === totalPages}
                type="button"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}