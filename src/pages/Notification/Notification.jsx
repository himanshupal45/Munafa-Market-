import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { 
  X, Bell, Plus, Search, Trash2, 
  Edit2, ChevronLeft, ChevronRight,
  CheckCircle, AlertCircle, Save,
  X as XIcon, Calendar, Mail,
  MessageSquare, Eye
} from 'lucide-react'
import './Notification.css'

const initialNotifications = [
  { id: 1, date: '2026-08-19', type: 'Notification', title: 'test', message: 'test', status: 'HIDE' },
  { id: 2, date: '2026-08-18', type: 'Notification', title: 'Welcome Offer', message: 'Get 100% bonus on first deposit', status: 'SHOW' },
  { id: 3, date: '2026-08-17', type: 'Notification', title: 'New Game Added', message: 'New game DISAWAR is now available', status: 'SHOW' },
  { id: 4, date: '2026-08-16', type: 'Notification', title: 'Maintenance', message: 'Server maintenance on 20th Aug', status: 'HIDE' },
]

export default function Notification({ dark, onClose }) {
  const navigate = useNavigate()
  const [notifications, setNotifications] = useState(initialNotifications)
  const [selectedIds, setSelectedIds] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [editingNotification, setEditingNotification] = useState(null)
  const [editData, setEditData] = useState({ title: '', message: '', type: '' })
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedIds(notifications.map(n => n.id))
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
    if (window.confirm('Delete this notification?')) {
      setNotifications(notifications.filter(n => n.id !== id))
      setSelectedIds(selectedIds.filter(sid => sid !== id))
    }
  }

  const handleDeleteSelected = () => {
    if (window.confirm(`Delete ${selectedIds.length} selected notifications?`)) {
      setNotifications(notifications.filter(n => !selectedIds.includes(n.id)))
      setSelectedIds([])
    }
  }

  const handleEdit = (notification) => {
    setEditingNotification(notification.id)
    setEditData({ 
      title: notification.title, 
      message: notification.message,
      type: notification.type 
    })
  }

  const handleSaveEdit = (id) => {
    setNotifications(notifications.map(n => 
      n.id === id ? { ...n, title: editData.title, message: editData.message, type: editData.type } : n
    ))
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
    setNotifications(notifications.map(n => 
      n.id === id ? { ...n, status: n.status === 'SHOW' ? 'HIDE' : 'SHOW' } : n
    ))
  }

  const filteredNotifications = notifications.filter(n => 
    n.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    n.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
    n.type.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const totalPages = Math.ceil(filteredNotifications.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = Math.min(startIndex + itemsPerPage, filteredNotifications.length)
  const currentNotifications = filteredNotifications.slice(startIndex, endIndex)

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
    <div className={`notification-page ${dark ? 'dark' : 'light'}`}>
      {/* Header */}
      <div className="notif-header">
        <div className="notif-header-left">
          <Bell size={24} className="notif-icon" />
          <h1 className="notif-title">Notification</h1>
        </div>
        {/* <button className="notif-close-btn" onClick={onClose} type="button">
          <X size={20} />
        </button> */}
      </div>

      {/* Stats */}
      <div className="notif-stats">
        <div className="stat-item">
          <span className="stat-label">Total</span>
          <span className="stat-value">{notifications.length}</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">Active</span>
          <span className="stat-value">{notifications.filter(n => n.status === 'SHOW').length}</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">Inactive</span>
          <span className="stat-value">{notifications.filter(n => n.status === 'HIDE').length}</span>
        </div>
      </div>

      {/* Toolbar */}
      <div className="notif-toolbar">
        <div className="toolbar-left">
          <button className="toolbar-btn btn-add" onClick={handleAddNotification}>
            <Plus size={16} />
            Add Notification
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
              placeholder="Search notifications..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="notif-table-wrapper">
        <table className="notif-table">
          <thead>
            <tr>
              <th className="col-checkbox">
                <input
                  type="checkbox"
                  checked={selectedIds.length === filteredNotifications.length && filteredNotifications.length > 0}
                  onChange={handleSelectAll}
                />
              </th>
              <th className="col-id">#</th>
              <th className="col-date">ADD DATE</th>
              <th className="col-type">TYPE</th>
              <th className="col-title">TITLE</th>
              <th className="col-message">MESSAGE</th>
              <th className="col-status">STATUS</th>
              <th className="col-action">ACTION</th>
            </tr>
          </thead>
          <tbody>
            {currentNotifications.map((notification, index) => (
              <tr key={notification.id} className={selectedIds.includes(notification.id) ? 'selected' : ''}>
                <td>
                  <input
                    type="checkbox"
                    checked={selectedIds.includes(notification.id)}
                    onChange={() => handleSelectOne(notification.id)}
                  />
                </td>
                <td>{startIndex + index + 1}</td>
                <td className="notif-date">{notification.date}</td>
                <td>
                  <span className="type-badge">{notification.type}</span>
                </td>
                <td>
                  {editingNotification === notification.id ? (
                    <input
                      type="text"
                      value={editData.title}
                      onChange={(e) => setEditData({ ...editData, title: e.target.value })}
                      className="edit-input"
                    />
                  ) : (
                    notification.title
                  )}
                </td>
                <td>
                  {editingNotification === notification.id ? (
                    <input
                      type="text"
                      value={editData.message}
                      onChange={(e) => setEditData({ ...editData, message: e.target.value })}
                      className="edit-input"
                    />
                  ) : (
                    <span className="notif-message">{notification.message}</span>
                  )}
                </td>
                <td>
                  {editingNotification === notification.id ? (
                    <div className="status-edit">
                      <select 
                        className="status-select"
                        value={notification.status}
                        onChange={(e) => {
                          setNotifications(notifications.map(n => 
                            n.id === notification.id ? { ...n, status: e.target.value } : n
                          ))
                        }}
                      >
                        <option value="SHOW">SHOW</option>
                        <option value="HIDE">HIDE</option>
                      </select>
                    </div>
                  ) : (
                    <button 
                      className={`status-badge ${notification.status === 'SHOW' ? 'status-show' : 'status-hide'}`}
                      onClick={() => handleStatusToggle(notification.id)}
                    >
                      {notification.status === 'SHOW' ? <CheckCircle size={12} /> : <AlertCircle size={12} />}
                      {notification.status}
                    </button>
                  )}
                </td>
                <td>
                  <div className="action-buttons">
                    {editingNotification === notification.id ? (
                      <>
                        <button className="action-btn btn-save" onClick={() => handleSaveEdit(notification.id)}>
                          <Save size={14} />
                        </button>
                        <button className="action-btn btn-cancel" onClick={handleCancelEdit}>
                          <XIcon size={14} />
                        </button>
                      </>
                    ) : (
                      <>
                        <button className="action-btn btn-edit" onClick={() => handleEdit(notification)}>
                          Update
                        </button>
                        <button className="action-btn btn-delete" onClick={() => handleDelete(notification.id)}>
                          Delete
                        </button>
                      </>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Footer with Pagination */}
      <div className="notif-footer">
        <span>
          Total Data: {filteredNotifications.length} | Total Pages: {totalPages || 1}
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
            
            <div className="pagination-numbers">
              {getPageNumbers().map(page => (
                <button
                  key={page}
                  className={`pagination-number ${page === currentPage ? 'active' : ''}`}
                  onClick={() => setCurrentPage(page)}
                >
                  {page}
                </button>
              ))}
            </div>
            
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
    </div>
  )
}