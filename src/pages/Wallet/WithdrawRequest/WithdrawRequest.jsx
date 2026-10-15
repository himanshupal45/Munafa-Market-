 import React, { useState } from 'react'
import { 
  X, Wallet, Search, ChevronLeft, ChevronRight,
  User, Calendar, DollarSign, FileText,
  CheckCircle, AlertCircle, Clock, Filter,
  Eye, Edit2, Save, X as XIcon, ArrowDownRight,
  Banknote, CreditCard, UserCheck
} from 'lucide-react'
import './WithdrawRequest.css'

const initialRequests = [
  // Add some sample data or keep empty for "No records found" state
]

export default function WithdrawRequest({ dark, onClose }) {
  const [requests, setRequests] = useState(initialRequests)
  const [selectedIds, setSelectedIds] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [editingStatus, setEditingStatus] = useState(null)
  const [selectedStatus, setSelectedStatus] = useState('')
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

  const filteredRequests = requests.filter(r => 
    r.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.requestId?.includes(searchTerm) ||
    r.amount?.includes(searchTerm)
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
      case 'PROCESSING':
        return <span className="status-badge status-processing"><Clock size={12} /> PROCESSING</span>
      default:
        return <span className="status-badge status-pending"><Clock size={12} /> PENDING</span>
    }
  }

  const statusOptions = ['PENDING', 'PROCESSING', 'APPROVED', 'REJECTED']

  return (
    <div className={`withdraw-request ${dark ? 'dark' : 'light'}`}>
      {/* Header */}
      <div className="wr-header">
        <div className="wr-header-left">
          <ArrowDownRight size={24} className="wr-icon" />
          <h1 className="wr-title">Withdraw Request</h1>
        </div>
        {/* <button className="wr-close-btn" onClick={onClose} type="button">
          <X size={20} />
        </button> */}
      </div>

      {/* Stats */}
      <div className="wr-stats">
        <div className="stat-item">
          <span className="stat-label">Total Requests</span>
          <span className="stat-value">{requests.length}</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">Pending</span>
          <span className="stat-value">{requests.filter(r => r.status === 'PENDING').length}</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">Processing</span>
          <span className="stat-value">{requests.filter(r => r.status === 'PROCESSING').length}</span>
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
      <div className="wr-toolbar">
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
              placeholder="Search by username, request ID, amount..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="wr-table-wrapper">
        <table className="wr-table">
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
              <th className="col-user">USERNAME</th>
              <th className="col-request">REQUEST ID</th>
              <th className="col-amount">AMOUNT</th>
              <th className="col-payout">PAYOUT DETAILS</th>
              <th className="col-status">STATUS</th>
              <th className="col-action">ACTION</th>
            </tr>
          </thead>
          <tbody>
            {currentRequests.length > 0 ? (
              currentRequests.map((request, index) => (
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
                      <span className="user-name">{request.username}</span>
                    </div>
                  </td>
                  <td className="request-id">{request.requestId}</td>
                  <td className="amount">₹ {request.amount}</td>
                  <td className="payout-details">
                    <div className="payout-info">
                      <Banknote size={14} className="payout-icon" />
                      <span>{request.payoutDetails || 'N/A'}</span>
                    </div>
                  </td>
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
                          Update Status
                        </button>
                      )}
                      <button className="action-btn btn-view">
                        <Eye size={14} />
                        View
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8" className="no-data">
                  <div className="no-data-message">
                    <FileText size={48} />
                    <p>No records found.</p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Footer */}
      <div className="wr-footer">
        <span>
          Total Data: {filteredRequests.length} | Total Pages: {totalPages || 0}
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