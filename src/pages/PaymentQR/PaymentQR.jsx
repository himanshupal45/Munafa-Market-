import React, { useState, useRef } from 'react'
import { 
  X, QrCode, Plus, Trash2, Edit2, 
  CheckCircle, AlertCircle, Upload, Search,
  Eye, ChevronLeft, ChevronRight
} from 'lucide-react'
import './PaymentQR.css'

const initialQRCodes = [
  {
    id: 1,
    image: 'https://api.qrserver.com/v1/create-qr-code/?size=100x100&data=9560497011-2@ybl',
    name: 'Ram Singh',
    upiId: '9560497011-2@ybl',
    status: 'Show'
  },
  {
    id: 2,
    image: 'https://api.qrserver.com/v1/create-qr-code/?size=100x100&data=gpay123456789@oki',
    name: 'RAM SINGH',
    upiId: 'gpay123456789@oki',
    status: 'Show'
  }
]

export default function PaymentQR({ dark, onClose }) {
  const [qrCodes, setQrCodes] = useState(initialQRCodes)
  const [selectedIds, setSelectedIds] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [showAddModal, setShowAddModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [editingQR, setEditingQR] = useState(null)
  const [imagePreview, setImagePreview] = useState(null)
  const [newQRData, setNewQRData] = useState({
    name: '',
    upiId: '',
    status: 'Show'
  })
  const fileInputRef = useRef(null)
  const editFileInputRef = useRef(null)

  // Handle image upload for new QR
  const handleImageUpload = (e) => {
    const file = e.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result)
      }
      reader.readAsDataURL(file)
    }
  }

  // Handle image upload for edit
  const handleEditImageUpload = (e) => {
    const file = e.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setEditingQR(prev => ({ 
          ...prev, 
          newImage: reader.result 
        }))
      }
      reader.readAsDataURL(file)
    }
  }

  // Handle new QR form change
  const handleNewQRChange = (e) => {
    const { name, value } = e.target
    setNewQRData(prev => ({ ...prev, [name]: value }))
  }

  // Handle edit QR form change
  const handleEditQRChange = (e) => {
    const { name, value } = e.target
    setEditingQR(prev => ({ ...prev, [name]: value }))
  }

  // Add QR
  const handleAddQR = () => {
    if (!imagePreview) {
      alert('Please upload a QR code image')
      return
    }
    if (!newQRData.name || !newQRData.upiId) {
      alert('Please fill all fields')
      return
    }

    const newQR = {
      id: Math.max(...qrCodes.map(q => q.id), 0) + 1,
      image: imagePreview,
      name: newQRData.name,
      upiId: newQRData.upiId,
      status: newQRData.status
    }
    setQrCodes([...qrCodes, newQR])
    setShowAddModal(false)
    setImagePreview(null)
    setNewQRData({ name: '', upiId: '', status: 'Show' })
  }

  // Edit QR
  const handleEditQR = (qr) => {
    setEditingQR({ ...qr })
    setShowEditModal(true)
  }

  // Save Edit
  const handleSaveEdit = () => {
    if (editingQR) {
      setQrCodes(qrCodes.map(q => 
        q.id === editingQR.id 
          ? { 
              ...editingQR, 
              image: editingQR.newImage || editingQR.image
            }
          : q
      ))
      setShowEditModal(false)
      setEditingQR(null)
    }
  }

  // Delete QR
  const handleDelete = (id) => {
    if (window.confirm('Delete this QR code?')) {
      setQrCodes(qrCodes.filter(q => q.id !== id))
      setSelectedIds(selectedIds.filter(sid => sid !== id))
    }
  }

  // Delete Selected
  const handleDeleteSelected = () => {
    if (window.confirm(`Delete ${selectedIds.length} selected QR codes?`)) {
      setQrCodes(qrCodes.filter(q => !selectedIds.includes(q.id)))
      setSelectedIds([])
    }
  }

  // Select All
  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedIds(qrCodes.map(q => q.id))
    } else {
      setSelectedIds([])
    }
  }

  // Select One
  const handleSelectOne = (id) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter(sid => sid !== id))
    } else {
      setSelectedIds([...selectedIds, id])
    }
  }

  // Filter QR codes
  const filteredQRCodes = qrCodes.filter(q => 
    q.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    q.upiId.toLowerCase().includes(searchTerm.toLowerCase())
  )

  // Trigger file input
  const triggerFileUpload = () => {
    fileInputRef.current?.click()
  }

  const triggerEditFileUpload = () => {
    editFileInputRef.current?.click()
  }

  return (
    <div className={`payment-qr ${dark ? 'dark' : 'light'}`}>
      {/* Header */}
      <div className="payment-qr-header">
        <div className="payment-qr-header-left">
          <QrCode size={24} className="payment-qr-icon" />
          <h1 className="payment-qr-title">Payment QR Code</h1>
        </div>
        {/* <button className="payment-qr-close-btn" onClick={onClose} type="button">
          <X size={20} />
        </button> */}
      </div>

      {/* Stats */}
      <div className="payment-qr-stats">
        <div className="stat-item">
          <span className="stat-label">Total QR Codes</span>
          <span className="stat-value">{qrCodes.length}</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">Active</span>
          <span className="stat-value">{qrCodes.filter(q => q.status === 'Show').length}</span>
        </div>
      </div>

      {/* Toolbar */}
      <div className="payment-qr-toolbar">
        <div className="toolbar-left">
          <button className="toolbar-btn btn-add" onClick={() => setShowAddModal(true)}>
            <Plus size={16} />
            Add Qrcode
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
        </div>
      </div>

      {/* Table */}
      <div className="payment-qr-table-wrapper">
        <table className="payment-qr-table">
          <thead>
            <tr>
              <th className="col-checkbox">
                <input
                  type="checkbox"
                  checked={selectedIds.length === filteredQRCodes.length && filteredQRCodes.length > 0}
                  onChange={handleSelectAll}
                />
              </th>
              <th className="col-id">#</th>
              <th className="col-image">IMAGE</th>
              <th className="col-name">NAME</th>
              <th className="col-upi">UPI ID</th>
              <th className="col-status">STATUS</th>
              <th className="col-action">ACTION</th>
            </tr>
          </thead>
          <tbody>
            {filteredQRCodes.map((qr, index) => (
              <tr key={qr.id} className={selectedIds.includes(qr.id) ? 'selected' : ''}>
                <td>
                  <input
                    type="checkbox"
                    checked={selectedIds.includes(qr.id)}
                    onChange={() => handleSelectOne(qr.id)}
                  />
                </td>
                <td>{index + 1}</td>
                <td>
                  <div className="qr-thumbnail">
                    <img src={qr.image} alt={qr.name} />
                  </div>
                </td>
                <td className="qr-name">{qr.name}</td>
                <td className="qr-upi">{qr.upiId}</td>
                <td>
                  <span className={`status-badge ${qr.status === 'Show' ? 'status-show' : 'status-hide'}`}>
                    {qr.status === 'Show' ? <CheckCircle size={12} /> : <AlertCircle size={12} />}
                    {qr.status}
                  </span>
                </td>
                <td>
                  <div className="action-buttons">
                    <button className="action-btn btn-edit" onClick={() => handleEditQR(qr)}>
                      Update
                    </button>
                    <button className="action-btn btn-delete" onClick={() => handleDelete(qr.id)}>
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Footer */}
      <div className="payment-qr-footer">
        <span>
          Total Data: {filteredQRCodes.length} | Total Pages: 1
        </span>
      </div>

      {/* Add Modal */}
      {showAddModal && (
        <div className="modal-overlay" onClick={() => setShowAddModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <Plus size={24} color="#ff6b00" />
              <h3>Add QR Code</h3>
              <button className="modal-close" onClick={() => setShowAddModal(false)}>
                <X size={18} />
              </button>
            </div>
            <div className="modal-body">
              <div className="upload-area" onClick={triggerFileUpload}>
                {imagePreview ? (
                  <div className="upload-preview">
                    <img src={imagePreview} alt="QR Preview" />
                    <button 
                      className="upload-remove-btn"
                      onClick={(e) => {
                        e.stopPropagation()
                        setImagePreview(null)
                      }}
                    >
                      <X size={14} />
                    </button>
                  </div>
                ) : (
                  <>
                    <Upload size={32} />
                    <p>Click to upload QR code image</p>
                    <span>PNG, JPG up to 2MB</span>
                  </>
                )}
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleImageUpload}
                  accept="image/*"
                  style={{ display: 'none' }}
                />
              </div>
              <div className="form-group">
                <label>Name</label>
                <input 
                  type="text" 
                  name="name"
                  value={newQRData.name}
                  onChange={handleNewQRChange}
                  className="form-input" 
                  placeholder="Enter name" 
                />
              </div>
              <div className="form-group">
                <label>UPI ID</label>
                <input 
                  type="text" 
                  name="upiId"
                  value={newQRData.upiId}
                  onChange={handleNewQRChange}
                  className="form-input" 
                  placeholder="Enter UPI ID" 
                />
              </div>
              <div className="form-group">
                <label>Status</label>
                <select 
                  name="status"
                  value={newQRData.status}
                  onChange={handleNewQRChange}
                  className="form-select"
                >
                  <option value="Show">Show</option>
                  <option value="Hide">Hide</option>
                </select>
              </div>
            </div>
            <div className="modal-actions">
              <button className="modal-btn btn-cancel" onClick={() => setShowAddModal(false)}>
                Cancel
              </button>
              <button className="modal-btn btn-add" onClick={handleAddQR}>
                Add QR Code
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {showEditModal && editingQR && (
        <div className="modal-overlay" onClick={() => setShowEditModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <Edit2 size={24} color="#f59e0b" />
              <h3>Update QR Code</h3>
              <button className="modal-close" onClick={() => setShowEditModal(false)}>
                <X size={18} />
              </button>
            </div>
            <div className="modal-body">
              <div className="upload-area" onClick={triggerEditFileUpload}>
                {editingQR.newImage || editingQR.image ? (
                  <div className="upload-preview">
                    <img src={editingQR.newImage || editingQR.image} alt="QR Preview" />
                    <button 
                      className="upload-remove-btn"
                      onClick={(e) => {
                        e.stopPropagation()
                        setEditingQR(prev => ({ ...prev, newImage: null }))
                      }}
                    >
                      <X size={14} />
                    </button>
                  </div>
                ) : (
                  <>
                    <Upload size={32} />
                    <p>Click to upload new QR code</p>
                    <span>PNG, JPG up to 2MB</span>
                  </>
                )}
                <input
                  type="file"
                  ref={editFileInputRef}
                  onChange={handleEditImageUpload}
                  accept="image/*"
                  style={{ display: 'none' }}
                />
              </div>
              <div className="form-group">
                <label>Name</label>
                <input 
                  type="text" 
                  name="name"
                  value={editingQR.name || ''}
                  onChange={handleEditQRChange}
                  className="form-input" 
                  placeholder="Enter name" 
                />
              </div>
              <div className="form-group">
                <label>UPI ID</label>
                <input 
                  type="text" 
                  name="upiId"
                  value={editingQR.upiId || ''}
                  onChange={handleEditQRChange}
                  className="form-input" 
                  placeholder="Enter UPI ID" 
                />
              </div>
              <div className="form-group">
                <label>Status</label>
                <select 
                  name="status"
                  value={editingQR.status || 'Show'}
                  onChange={handleEditQRChange}
                  className="form-select"
                >
                  <option value="Show">Show</option>
                  <option value="Hide">Hide</option>
                </select>
              </div>
            </div>
            <div className="modal-actions">
              <button className="modal-btn btn-cancel" onClick={() => setShowEditModal(false)}>
                Cancel
              </button>
              <button className="modal-btn btn-add" onClick={handleSaveEdit}>
                Update QR Code
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}