import React, { useState } from 'react'
import { 
  X, Mail, Search, Trash2, 
  ChevronLeft, ChevronRight,
  User, Phone, MessageSquare,
  Eye, CheckCircle, AlertCircle,
  FileText
} from 'lucide-react'
import './Enquiry.css'

const initialEnquiries = [
  // Empty state - no records found
]

export default function Enquiry({ dark, onClose }) {
  const [enquiries, setEnquiries] = useState(initialEnquiries)
  const [selectedIds, setSelectedIds] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [showDetails, setShowDetails] = useState(null)
  const itemsPerPage = 10

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedIds(enquiries.map(e => e.id))
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
    if (window.confirm('Delete this enquiry?')) {
      setEnquiries(enquiries.filter(e => e.id !== id))
      setSelectedIds(selectedIds.filter(sid => sid !== id))
    }
  }

  const handleDeleteSelected = () => {
    if (window.confirm(`Delete ${selectedIds.length} selected enquiries?`)) {
      setEnquiries(enquiries.filter(e => !selectedIds.includes(e.id)))
      setSelectedIds([])
    }
  }

  const handleViewDetails = (enquiry) => {
    setShowDetails(enquiry)
  }

  const handleCloseDetails = () => {
    setShowDetails(null)
  }

  const filteredEnquiries = enquiries.filter(e => 
    e.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    e.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    e.mobile?.includes(searchTerm) ||
    e.subject?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const totalPages = Math.ceil(filteredEnquiries.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = Math.min(startIndex + itemsPerPage, filteredEnquiries.length)
  const currentEnquiries = filteredEnquiries.slice(startIndex, endIndex)

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
    <div className={`enquiry-page ${dark ? 'dark' : 'light'}`}>
      {/* Header */}
      <div className="enq-header">
        <div className="enq-header-left">
          <Mail size={24} className="enq-icon" />
          <h1 className="enq-title">Contact Enquiries</h1>
        </div>
        
      </div>

      {/* Stats */}
      <div className="enq-stats">
        <div className="stat-item">
          <span className="stat-label">Total Enquiries</span>
          <span className="stat-value">{enquiries.length}</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">Unread</span>
          <span className="stat-value">{enquiries.filter(e => e.status === 'UNREAD').length}</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">Read</span>
          <span className="stat-value">{enquiries.filter(e => e.status === 'READ').length}</span>
        </div>
      </div>

      {/* Toolbar */}
      <div className="enq-toolbar">
        <div className="toolbar-left">
          {selectedIds.length > 0 && (
            <button className="toolbar-btn btn-delete" onClick={handleDeleteSelected}>
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
              placeholder="Search enquiries..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="enq-table-wrapper">
        <table className="enq-table">
          <thead>
            <tr>
              <th className="col-checkbox">
                <input
                  type="checkbox"
                  checked={selectedIds.length === filteredEnquiries.length && filteredEnquiries.length > 0}
                  onChange={handleSelectAll}
                />
              </th>
              <th className="col-id">#</th>
              <th className="col-name">NAME</th>
              <th className="col-email">EMAIL</th>
              <th className="col-mobile">MOBILE</th>
              <th className="col-subject">SUBJECT</th>
              <th className="col-action">ACTION</th>
            </tr>
          </thead>
          <tbody>
            {currentEnquiries.length > 0 ? (
              currentEnquiries.map((enquiry, index) => (
                <tr key={enquiry.id} className={selectedIds.includes(enquiry.id) ? 'selected' : ''}>
                  <td>
                    <input
                      type="checkbox"
                      checked={selectedIds.includes(enquiry.id)}
                      onChange={() => handleSelectOne(enquiry.id)}
                    />
                  </td>
                  <td>{startIndex + index + 1}</td>
                  <td className="enq-name">{enquiry.name}</td>
                  <td className="enq-email">{enquiry.email}</td>
                  <td className="enq-mobile">{enquiry.mobile}</td>
                  <td className="enq-subject">{enquiry.subject}</td>
                  <td>
                    <div className="action-buttons">
                      <button className="action-btn btn-view" onClick={() => handleViewDetails(enquiry)}>
                        <Eye size={14} />
                        View
                      </button>
                      <button className="action-btn btn-delete" onClick={() => handleDelete(enquiry.id)}>
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="no-data">
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

      {/* Footer with Pagination */}
      <div className="enq-footer">
        <span>
          Total Data: {filteredEnquiries.length} | Total Pages: {totalPages || 0}
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

      {/* View Details Modal */}
      {showDetails && (
        <div className="modal-overlay" onClick={handleCloseDetails}>
          <div className="modal-content modal-details" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <FileText size={24} color="#ff6b00" />
              <h3>Enquiry Details</h3>
              <button className="modal-close" onClick={handleCloseDetails}>
                <X size={18} />
              </button>
            </div>
            <div className="details-grid">
              <div className="detail-item">
                <User size={16} className="detail-icon" />
                <span className="detail-label">Name</span>
                <span className="detail-value">{showDetails.name}</span>
              </div>
              <div className="detail-item">
                <Mail size={16} className="detail-icon" />
                <span className="detail-label">Email</span>
                <span className="detail-value">{showDetails.email}</span>
              </div>
              <div className="detail-item">
                <Phone size={16} className="detail-icon" />
                <span className="detail-label">Mobile</span>
                <span className="detail-value">{showDetails.mobile}</span>
              </div>
              <div className="detail-item">
                <MessageSquare size={16} className="detail-icon" />
                <span className="detail-label">Subject</span>
                <span className="detail-value">{showDetails.subject}</span>
              </div>
              <div className="detail-item full-width">
                <span className="detail-label">Message</span>
                <span className="detail-value message-text">{showDetails.message}</span>
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