import React, { useState, useEffect, useRef } from 'react'
import {
  Home as HomeIcon,
  QrCode,
  Plus,
  Trash2,
  Edit2,
  CheckCircle,
  AlertCircle,
  Upload,
  X,
  ChevronLeft,
  ChevronRight,
  Loader,
  RefreshCw,
} from 'lucide-react'
import { apiCall } from '../../context/AuthContext'
import './PaymentQR.css'

// Uploaded QR image ka full URL banane ke liye
const FILE_ORIGIN = (
  import.meta.env.DEV
    ? import.meta.env.VITE_DEV_API_URL || 'http://localhost:5000/api'
    : import.meta.env.VITE_API_URL || 'https://astroconnect.co.in/api'
).replace(/\/api\/?$/, '')

export default function PaymentQR({ dark }) {
  const [qrCodes, setQrCodes] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [showAddModal, setShowAddModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [editingQR, setEditingQR] = useState(null)
  const [imagePreview, setImagePreview] = useState(null)
  const [qrFile, setQrFile] = useState(null) // ✅ actual file for upload
  const [editQrFile, setEditQrFile] = useState(null)
  const [newQRData, setNewQRData] = useState({
    name: '',
    upiId: '',
    status: 'Active',
  })

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const fileInputRef = useRef(null)
  const editFileInputRef = useRef(null)
  const itemsPerPage = 10

  // ============================================
  // ✅ Load QR codes from backend
  // ============================================
  const loadQRs = async () => {
    setLoading(true)
    setError('')
    try {
      const res = await apiCall('/payment-qr')
      if (res?.success) {
        const mapped = (res.qrs || []).map((q) => ({
          id: q._id,
          name: q.title,
          upiId: q.upiId,
          image: q.qrImage ? `${FILE_ORIGIN}${q.qrImage}` : '',
          status: q.status === 'Active' ? 'Show' : 'Hide',
        }))
        setQrCodes(mapped)
      } else {
        setError(res?.message || 'QR load nahi ho sake')
      }
    } catch (err) {
      console.error('Load QR error:', err)
      setError(err.message || 'Network error')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadQRs()
  }, [])

  // ============================================
  // ✅ Image upload (new)
  // ============================================
  const handleImageUpload = (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (!file.type.startsWith('image/')) {
      alert('Sirf image file upload karein')
      return
    }
    if (file.size > 2 * 1024 * 1024) {
      alert('Image 2MB se choti honi chahiye')
      return
    }
    setQrFile(file)
    const reader = new FileReader()
    reader.onloadend = () => setImagePreview(reader.result)
    reader.readAsDataURL(file)
  }

  // ============================================
  // ✅ Image upload (edit)
  // ============================================
  const handleEditImageUpload = (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (!file.type.startsWith('image/')) {
      alert('Sirf image file upload karein')
      return
    }
    if (file.size > 2 * 1024 * 1024) {
      alert('Image 2MB se choti honi chahiye')
      return
    }
    setEditQrFile(file)
    const reader = new FileReader()
    reader.onloadend = () =>
      setEditingQR((prev) => ({ ...prev, newImage: reader.result }))
    reader.readAsDataURL(file)
  }

  const handleNewQRChange = (e) => {
    const { name, value } = e.target
    setNewQRData((prev) => ({ ...prev, [name]: value }))
  }

  const handleEditQRChange = (e) => {
    const { name, value } = e.target
    setEditingQR((prev) => ({ ...prev, [name]: value }))
  }

  // ============================================
  // ✅ Add QR — backend call
  // ============================================
  const handleAddQR = async () => {
    if (!qrFile) {
      alert('Please upload a QR code image')
      return
    }
    if (!newQRData.name || !newQRData.upiId) {
      alert('Please fill all fields')
      return
    }

    setSubmitting(true)
    try {
      const fd = new FormData()
      fd.append('title', newQRData.name)
      fd.append('upiId', newQRData.upiId)
      fd.append('status', newQRData.status) // 'Active' or 'Inactive'
      fd.append('qrImage', qrFile)

      const res = await apiCall('/payment-qr', 'POST', fd, true)

      if (res?.success) {
        alert('✅ QR added successfully')
        setShowAddModal(false)
        setImagePreview(null)
        setQrFile(null)
        setNewQRData({ name: '', upiId: '', status: 'Active' })
        if (fileInputRef.current) fileInputRef.current.value = ''
        loadQRs()
      } else {
        alert(res?.message || 'Add fail hua')
      }
    } catch (err) {
      console.error('Add QR error:', err)
      alert(err.message || 'Server error')
    } finally {
      setSubmitting(false)
    }
  }

  // ============================================
  // ✅ Edit QR
  // ============================================
  const handleEditQR = (qr) => {
    setEditingQR({ ...qr })
    setEditQrFile(null)
    setShowEditModal(true)
  }

  const handleSaveEdit = async () => {
    if (!editingQR) return

    setSubmitting(true)
    try {
      const fd = new FormData()
      fd.append('title', editingQR.name || '')
      fd.append('upiId', editingQR.upiId || '')
      fd.append('status', editingQR.status === 'Show' ? 'Active' : 'Inactive')
      if (editQrFile) fd.append('qrImage', editQrFile)

      const res = await apiCall(
        `/payment-qr/${editingQR.id}`,
        'PUT',
        fd,
        true
      )

      if (res?.success) {
        alert('✅ QR updated')
        setShowEditModal(false)
        setEditingQR(null)
        setEditQrFile(null)
        loadQRs()
      } else {
        alert(res?.message || 'Update fail hua')
      }
    } catch (err) {
      console.error('Update QR error:', err)
      alert(err.message || 'Server error')
    } finally {
      setSubmitting(false)
    }
  }

  // ============================================
  // ✅ Delete QR
  // ============================================
  const handleDelete = async (id) => {
    if (!window.confirm('Delete this QR code?')) return
    try {
      const res = await apiCall(`/payment-qr/${id}`, 'DELETE')
      if (res?.success) {
        alert('🗑️ QR deleted')
        loadQRs()
      } else {
        alert(res?.message || 'Delete fail hua')
      }
    } catch (err) {
      alert(err.message || 'Server error')
    }
  }

  const triggerFileUpload = () => fileInputRef.current?.click()
  const triggerEditFileUpload = () => editFileInputRef.current?.click()

  // ============================================
  // Filter + Pagination
  // ============================================
  const filteredQRCodes = qrCodes.filter(
    (q) =>
      q.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      q.upiId.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const totalPages = Math.ceil(filteredQRCodes.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const currentQRCodes = filteredQRCodes.slice(
    startIndex,
    startIndex + itemsPerPage
  )

  return (
    <div className="pq-page">
      {/* Breadcrumb */}
      <div className="pq-breadcrumb">
        <HomeIcon size={14} />
        <span>Home</span>
        <span className="pq-breadcrumb-sep">/</span>
        <span>Payment QR Code</span>
      </div>

      {/* Page Title */}
      <div className="pq-page-title-wrapper">
        <QrCode size={26} className="pq-page-title-icon" />
        <h1 className="pq-page-title">Payment QR Code</h1>
        <button
          className="pq-refresh-btn"
          onClick={loadQRs}
          disabled={loading}
          type="button"
        >
          <RefreshCw size={14} /> Refresh
        </button>
      </div>

      {/* Main Card */}
      <div className="pq-card">
        {/* Toolbar */}
        <div className="pq-toolbar">
          <div className="pq-toolbar-left">
            <button
              className="pq-add-btn"
              onClick={() => setShowAddModal(true)}
              type="button"
            >
              <Plus size={16} />
              Add Qrcode
            </button>
          </div>
          <div className="pq-toolbar-search">
            <label>Search:</label>
            <input
              type="text"
              className="pq-search-input"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Table */}
        <div className="pq-table-wrapper">
          <table className="pq-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Image</th>
                <th>Name</th>
                <th>UPI ID</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="6" className="pq-table-empty">
                    <Loader size={20} className="pq-spin" /> Loading...
                  </td>
                </tr>
              ) : error ? (
                <tr>
                  <td colSpan="6" className="pq-table-empty pq-table-error">
                    ⚠️ {error}
                    <button
                      onClick={loadQRs}
                      className="pq-retry-btn"
                      type="button"
                    >
                      Retry
                    </button>
                  </td>
                </tr>
              ) : currentQRCodes.length === 0 ? (
                <tr>
                  <td colSpan="6" className="pq-table-empty">
                    No data available in table
                  </td>
                </tr>
              ) : (
                currentQRCodes.map((qr, i) => (
                  <tr key={qr.id}>
                    <td>{startIndex + i + 1}</td>
                    <td>
                      <div className="pq-thumbnail">
                        <img src={qr.image} alt={qr.name} />
                      </div>
                    </td>
                    <td className="pq-name">{qr.name}</td>
                    <td className="pq-upi">{qr.upiId}</td>
                    <td>
                      <span
                        className={`pq-status-badge ${
                          qr.status === 'Show'
                            ? 'pq-status-show'
                            : 'pq-status-hide'
                        }`}
                      >
                        {qr.status === 'Show' ? (
                          <CheckCircle size={12} />
                        ) : (
                          <AlertCircle size={12} />
                        )}
                        {qr.status}
                      </span>
                    </td>
                    <td>
                      <div className="pq-action-buttons">
                        <button
                          className="pq-action-btn pq-edit-btn"
                          onClick={() => handleEditQR(qr)}
                          type="button"
                        >
                          <Edit2 size={14} />
                          Update
                        </button>
                        <button
                          className="pq-action-btn pq-delete-btn"
                          onClick={() => handleDelete(qr.id)}
                          type="button"
                        >
                          <Trash2 size={14} />
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="pq-pagination-wrapper">
          <span className="pq-pagination-info">
            Total: {filteredQRCodes.length} | Page {currentPage} of{' '}
            {totalPages || 1}
          </span>
          {totalPages > 1 && (
            <div className="pq-pagination">
              <button
                className="pq-page-btn"
                onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                disabled={currentPage === 1}
                type="button"
              >
                <ChevronLeft size={16} />
              </button>
              <button
                className="pq-page-btn"
                onClick={() =>
                  setCurrentPage((p) => Math.min(p + 1, totalPages))
                }
                disabled={currentPage === totalPages}
                type="button"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* ============================================
          Add Modal
          ============================================ */}
      {showAddModal && (
        <div
          className="pq-modal-overlay"
          onClick={() => setShowAddModal(false)}
        >
          <div className="pq-modal" onClick={(e) => e.stopPropagation()}>
            <div className="pq-modal-header">
              <Plus
                size={22}
                className="pq-modal-icon pq-modal-icon-orange"
              />
              <h3 className="pq-modal-title">Add QR Code</h3>
              <button
                className="pq-modal-close"
                onClick={() => setShowAddModal(false)}
                type="button"
              >
                <X size={18} />
              </button>
            </div>
            <div className="pq-modal-body">
              <div className="pq-upload-area" onClick={triggerFileUpload}>
                {imagePreview ? (
                  <div className="pq-upload-preview">
                    <img src={imagePreview} alt="QR Preview" />
                    <button
                      className="pq-upload-remove"
                      onClick={(e) => {
                        e.stopPropagation()
                        setImagePreview(null)
                        setQrFile(null)
                        if (fileInputRef.current) fileInputRef.current.value = ''
                      }}
                      type="button"
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
                  className="pq-hidden-input"
                />
              </div>

              <div className="pq-form-group">
                <label className="pq-label">Name</label>
                <input
                  type="text"
                  name="name"
                  value={newQRData.name}
                  onChange={handleNewQRChange}
                  className="pq-input"
                  placeholder="Enter name"
                />
              </div>

              <div className="pq-form-group">
                <label className="pq-label">UPI ID</label>
                <input
                  type="text"
                  name="upiId"
                  value={newQRData.upiId}
                  onChange={handleNewQRChange}
                  className="pq-input"
                  placeholder="Enter UPI ID"
                />
              </div>

              <div className="pq-form-group">
                <label className="pq-label">Status</label>
                <select
                  name="status"
                  value={newQRData.status}
                  onChange={handleNewQRChange}
                  className="pq-select"
                >
                  <option value="Active">Show (Active)</option>
                  <option value="Inactive">Hide (Inactive)</option>
                </select>
              </div>
            </div>
            <div className="pq-modal-actions">
              <button
                className="pq-modal-btn pq-btn-cancel"
                onClick={() => setShowAddModal(false)}
                type="button"
                disabled={submitting}
              >
                Cancel
              </button>
              <button
                className="pq-modal-btn pq-btn-add"
                onClick={handleAddQR}
                type="button"
                disabled={submitting}
              >
                {submitting ? 'Adding...' : 'Add QR Code'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ============================================
          Edit Modal
          ============================================ */}
      {showEditModal && editingQR && (
        <div
          className="pq-modal-overlay"
          onClick={() => setShowEditModal(false)}
        >
          <div className="pq-modal" onClick={(e) => e.stopPropagation()}>
            <div className="pq-modal-header">
              <Edit2
                size={22}
                className="pq-modal-icon pq-modal-icon-yellow"
              />
              <h3 className="pq-modal-title">Update QR Code</h3>
              <button
                className="pq-modal-close"
                onClick={() => setShowEditModal(false)}
                type="button"
              >
                <X size={18} />
              </button>
            </div>
            <div className="pq-modal-body">
              <div className="pq-upload-area" onClick={triggerEditFileUpload}>
                {editingQR.newImage || editingQR.image ? (
                  <div className="pq-upload-preview">
                    <img
                      src={editingQR.newImage || editingQR.image}
                      alt="QR Preview"
                    />
                    <button
                      className="pq-upload-remove"
                      onClick={(e) => {
                        e.stopPropagation()
                        setEditingQR((prev) => ({
                          ...prev,
                          newImage: null,
                        }))
                        setEditQrFile(null)
                        if (editFileInputRef.current)
                          editFileInputRef.current.value = ''
                      }}
                      type="button"
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
                  className="pq-hidden-input"
                />
              </div>

              <div className="pq-form-group">
                <label className="pq-label">Name</label>
                <input
                  type="text"
                  name="name"
                  value={editingQR.name || ''}
                  onChange={handleEditQRChange}
                  className="pq-input"
                  placeholder="Enter name"
                />
              </div>

              <div className="pq-form-group">
                <label className="pq-label">UPI ID</label>
                <input
                  type="text"
                  name="upiId"
                  value={editingQR.upiId || ''}
                  onChange={handleEditQRChange}
                  className="pq-input"
                  placeholder="Enter UPI ID"
                />
              </div>

              <div className="pq-form-group">
                <label className="pq-label">Status</label>
                <select
                  name="status"
                  value={editingQR.status || 'Show'}
                  onChange={handleEditQRChange}
                  className="pq-select"
                >
                  <option value="Show">Show (Active)</option>
                  <option value="Hide">Hide (Inactive)</option>
                </select>
              </div>
            </div>
            <div className="pq-modal-actions">
              <button
                className="pq-modal-btn pq-btn-cancel"
                onClick={() => setShowEditModal(false)}
                type="button"
                disabled={submitting}
              >
                Cancel
              </button>
              <button
                className="pq-modal-btn pq-btn-add"
                onClick={handleSaveEdit}
                type="button"
                disabled={submitting}
              >
                {submitting ? 'Updating...' : 'Update QR Code'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}