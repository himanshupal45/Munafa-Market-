import React, { useState } from 'react'
import { 
  X, Wallet, Search, ChevronLeft, ChevronRight,
  User, Calendar, DollarSign, FileText,
  CheckCircle, AlertCircle, Clock, Filter,
  Eye, Edit2, Save, X as XIcon
} from 'lucide-react'
import './AddPointRequest.css'

const initialRequests = [
  { id: 1, username: 'Abhishek', userId: 'DA108', requestId: '1786181985', utr: 'NOT SUBMITTED', amount: '500.00', date: '08 Aug, 2026 03:09 PM', status: 'PENDING' },
  { id: 2, username: 'Rukesh', userId: 'DA936', requestId: '1783886338', utr: 'NOT SUBMITTED', amount: '1500.00', date: '13 Jul, 2026 01:28 AM', status: 'PENDING' },
  { id: 3, username: 'Rukesh', userId: 'DA936', requestId: '1783846274', utr: 'NOT SUBMITTED', amount: '1000.00', date: '12 Jul, 2026 02:21 PM', status: 'PENDING' },
  { id: 4, username: 'Rukesh', userId: 'DA936', requestId: '1783846130', utr: 'NOT SUBMITTED', amount: '1500.00', date: '12 Jul, 2026 02:18 PM', status: 'PENDING' },
  { id: 5, username: 'Rukesh', userId: 'DA936', requestId: '1783846111', utr: 'NOT SUBMITTED', amount: '1000.00', date: '12 Jul, 2026 02:18 PM', status: 'PENDING' },
  { id: 6, username: 'Rukesh', userId: 'DA936', requestId: '1783845869', utr: 'NOT SUBMITTED', amount: '1500.00', date: '12 Jul, 2026 02:14 PM', status: 'PENDING' },
  { id: 7, username: 'Rukesh', userId: 'DA936', requestId: '1783845611', utr: 'NOT SUBMITTED', amount: '1000.00', date: '12 Jul, 2026 02:14 PM', status: 'PENDING' },
]

const statusOptions = ['PENDING', 'APPROVED', 'REJECTED']

export default function AddPointRequest({ dark, onClose }) {
  const [requests, setRequests] = useState(initialRequests)
  const [selectedIds, setSelectedIds] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [editingStatus, setEditingStatus] = useState(null)
  const [selectedStatus, setSelectedStatus] = useState('')
  const [editingRemark, setEditingRemark] = useState(null)
  const [remarkText, setRemarkText] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedIds(requests.map(r => r.id))
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

  const handleStatusEdit = (id) => {
    setEditingStatus(id)
    const request = requests.find(r => r.id === id)
    setSelectedStatus(request?.status || '')
  }

  const handleStatusSave = (id) => {
    if (!selectedStatus) {
      alert('Please select a status')
      return
    }
    setRequests(requests.map(r => 
      r.id === id ? { ...r, status: selectedStatus } : r
    ))
    setEditingStatus(null)
    setSelectedStatus('')
    alert(`✅ Status updated to ${selectedStatus}`)
  }

  const handleStatusCancel = () => {
    setEditingStatus(null)
    setSelectedStatus('')
  }

  const handleRemarkEdit = (id) => {
    setEditingRemark(id)
    const request = requests.find(r => r.id === id)
    setRemarkText(request?.remark || '')
  }

  const handleRemarkSave = (id) => {
    setRequests(requests.map(r => 
      r.id === id ? { ...r, remark: remarkText || 'No remark provided' } : r
    ))
    setEditingRemark(null)
    setRemarkText('')
    alert('✅ Remark saved successfully!')
  }

  const handleRemarkCancel = () => {
    setEditingRemark(null)
    setRemarkText('')
  }

  const filteredRequests = requests.filter(r => 
    r.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.userId.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.requestId.includes(searchTerm) ||
    r.utr.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const totalPages = Math.ceil(filteredRequests.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = Math.min(startIndex + itemsPerPage, filteredRequests.length)
  const currentRequests = filteredRequests.slice(startIndex, endIndex)

  const getStatusBadge = (status) => {
    switch(status) {
      case 'APPROVED':
        return <span className="status-badge status-approved"><CheckCircle size={12} /> APPROVED</span>
      case 'REJECTED':
        return <span className="status-badge status-rejected"><AlertCircle size={12} /> REJECTED</span>
      default:
        return <span className="status-badge status-pending"><Clock size={12} /> PENDING</span>
    }
  }

  return (
    <div className={`add-point-request ${dark ? 'dark' : 'light'}`}>
      {/* Header */}
      <div className="ap-header">
        <div className="ap-header-left">
          <Wallet size={24} className="ap-icon" />
          <h1 className="ap-title">Add Point Request</h1>
        </div>
        {/* <button className="ap-close-btn" onClick={onClose} type="button">
          <X size={20} />
        </button> */}
      </div>

      {/* Stats */}
      <div className="ap-stats">
        <div className="stat-item">
          <span className="stat-label">Total Requests</span>
          <span className="stat-value">{requests.length}</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">Pending</span>
          <span className="stat-value">{requests.filter(r => r.status === 'PENDING').length}</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">Approved</span>
          <span className="stat-value">{requests.filter(r => r.status === 'APPROVED').length}</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">Rejected</span>
          <span className="stat-value">{requests.filter(r => r.status === 'REJECTED').length}</span>
        </div>
      </div>

      {/* Toolbar */}
      <div className="ap-toolbar">
        <div className="toolbar-left">
          {selectedIds.length > 0 && (
            <button className="toolbar-btn btn-delete">
              <XIcon size={16} />
              Delete Selected ({selectedIds.length})
            </button>
          )}
        </div>
        <div className="toolbar-right">
          <div className="search-box">
            <Search size={16} className="search-icon" />
            <input
              type="text"
              placeholder="Search by username, ID, request ID, UTR..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="ap-table-wrapper">
        <table className="ap-table">
          <thead>
            <tr>
              <th className="col-checkbox">
                <input
                  type="checkbox"
                  checked={selectedIds.length === filteredRequests.length && filteredRequests.length > 0}
                  onChange={handleSelectAll}
                />
              </th>
              <th className="col-id">#</th>
              <th className="col-user">USERNAME & ID</th>
              <th className="col-request">REQUEST ID</th>
              <th className="col-utr">UTR / TXN NO</th>
              <th className="col-amount">AMOUNT</th>
              <th className="col-date">DATE</th>
              <th className="col-status">STATUS</th>
              <th className="col-action">ACTION</th>
            </tr>
          </thead>
          <tbody>
            {currentRequests.map((request, index) => (
              <tr key={request.id} className={selectedIds.includes(request.id) ? 'selected' : ''}>
                <td>
                  <input
                    type="checkbox"
                    checked={selectedIds.includes(request.id)}
                    onChange={() => handleSelectOne(request.id)}
                  />
                </td>
                <td>{startIndex + index + 1}</td>
                <td>
                  <div className="user-cell">
                    <div className="user-avatar-sm">
                      {request.username.charAt(0).toUpperCase()}
                    </div>
                    <div className="user-info">
                      <span className="user-name">{request.username}</span>
                      <span className="user-id">User ID: {request.userId}</span>
                    </div>
                  </div>
                </td>
                <td className="request-id">{request.requestId}</td>
                <td className="utr">{request.utr}</td>
                <td className="amount">₹ {request.amount}</td>
                <td className="date">{request.date}</td>
                <td>
                  {editingStatus === request.id ? (
                    <div className="status-edit">
                      <select
                        value={selectedStatus}
                        onChange={(e) => setSelectedStatus(e.target.value)}
                        className="status-select"
                      >
                        <option value="">--Select Status--</option>
                        {statusOptions.map(s => (
                          <option key={s} value={s}>{s}</option>
                        ))}
                      </select>
                      <button className="status-save-btn" onClick={() => handleStatusSave(request.id)}>
                        <Save size={14} />
                      </button>
                      <button className="status-cancel-btn" onClick={handleStatusCancel}>
                        <XIcon size={14} />
                      </button>
                    </div>
                  ) : (
                    getStatusBadge(request.status)
                  )}
                </td>
                <td>
                  <div className="action-buttons">
                    {editingStatus !== request.id && (
                      <button className="action-btn btn-status" onClick={() => handleStatusEdit(request.id)}>
                        <Edit2 size={14} />
                        --Select Status--
                      </button>
                    )}
                    {editingRemark === request.id ? (
                      <div className="remark-edit">
                        <input
                          type="text"
                          placeholder="Remark / rejection reason"
                          value={remarkText}
                          onChange={(e) => setRemarkText(e.target.value)}
                          className="remark-input"
                        />
                        <button className="remark-save-btn" onClick={() => handleRemarkSave(request.id)}>
                          <Save size={14} />
                        </button>
                        <button className="remark-cancel-btn" onClick={handleRemarkCancel}>
                          <XIcon size={14} />
                        </button>
                      </div>
                    ) : (
                      <button className="action-btn btn-remark" onClick={() => handleRemarkEdit(request.id)}>
                        <FileText size={14} />
                        Remark / rejection reason
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Footer */}
      <div className="ap-footer">
        <span>
          Showing {startIndex + 1} to {endIndex} of {filteredRequests.length} entries
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
    </div>
  )
}