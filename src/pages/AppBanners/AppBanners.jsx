import React, { useState, useRef } from 'react'
import { 
  X, Image as ImageIcon, Eye, Plus, 
  Trash2, Edit2, CheckCircle, AlertCircle,
  Upload, ChevronLeft, ChevronRight
} from 'lucide-react'
import './AppBanners.css'

const initialSlides = [
  {
    id: 1,
    image: 'https://via.placeholder.com/800x400/ff6b00/ffffff?text=Hindustan+Matka',
    status: 'Show',
    title: 'Hindustan Matka - Online App',
    subtitle: 'MINIMUM DEPOSIT 05/-',
    subtitle2: 'MINIMUM WITHDRAWAL 500/-',
    badge: '101% TRUSTED ONLINE APP',
    description: "India's Most Trusted App",
    cta: 'सर्व जोर से लेकर कमाओ अभी डाउनलोड करें',
    brand: 'Hindustan Matka'
  }
]

export default function AppBanners({ dark, onClose }) {
  const [slides, setSlides] = useState(initialSlides)
  const [selectedIds, setSelectedIds] = useState([])
  const [showAddModal, setShowAddModal] = useState(false)
  const [previewSlide, setPreviewSlide] = useState(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [editingSlide, setEditingSlide] = useState(null)
  const [imagePreview, setImagePreview] = useState(null)
  const [editImagePreview, setEditImagePreview] = useState(null)
  const [newSlideData, setNewSlideData] = useState({
    title: '',
    subtitle: '',
    subtitle2: '',
    badge: '',
    description: '',
    cta: '',
    brand: '',
    status: 'Show'
  })
  const fileInputRef = useRef(null)
  const editFileInputRef = useRef(null)
  const itemsPerPage = 10

  // Handle image upload for new slide
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
        setEditImagePreview(reader.result)
        setEditingSlide(prev => ({ 
          ...prev, 
          newImage: reader.result 
        }))
      }
      reader.readAsDataURL(file)
    }
  }

  // Handle new slide form change
  const handleNewSlideChange = (e) => {
    const { name, value } = e.target
    setNewSlideData(prev => ({ ...prev, [name]: value }))
  }

  // Handle add slide
  const handleAddSlide = () => {
    if (!imagePreview) {
      alert('Please upload an image')
      return
    }

    const newSlide = {
      id: Math.max(...slides.map(s => s.id), 0) + 1,
      image: imagePreview,
      status: newSlideData.status || 'Show',
      title: newSlideData.title || 'New Slide',
      subtitle: newSlideData.subtitle || '',
      subtitle2: newSlideData.subtitle2 || '',
      badge: newSlideData.badge || '',
      description: newSlideData.description || '',
      cta: newSlideData.cta || '',
      brand: newSlideData.brand || ''
    }
    setSlides([...slides, newSlide])
    setShowAddModal(false)
    setImagePreview(null)
    setNewSlideData({
      title: '',
      subtitle: '',
      subtitle2: '',
      badge: '',
      description: '',
      cta: '',
      brand: '',
      status: 'Show'
    })
  }

  // Handle edit slide
  const handleEditSlide = (slide) => {
    setEditingSlide({ ...slide })
    setEditImagePreview(slide.image)
  }

  // Handle save edit
  const handleSaveEdit = () => {
    if (editingSlide) {
      setSlides(slides.map(s => 
        s.id === editingSlide.id 
          ? { 
              ...editingSlide, 
              image: editingSlide.newImage || editingSlide.image
            }
          : s
      ))
      setEditingSlide(null)
      setEditImagePreview(null)
    }
  }

  // Handle cancel edit
  const handleCancelEdit = () => {
    setEditingSlide(null)
    setEditImagePreview(null)
  }

  // Handle edit form change
  const handleEditChange = (e) => {
    const { name, value } = e.target
    setEditingSlide(prev => ({ ...prev, [name]: value }))
  }

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedIds(slides.map(s => s.id))
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
    if (window.confirm('Delete this slide?')) {
      setSlides(slides.filter(s => s.id !== id))
      setSelectedIds(selectedIds.filter(sid => sid !== id))
    }
  }

  const handleDeleteSelected = () => {
    if (window.confirm(`Delete ${selectedIds.length} selected slides?`)) {
      setSlides(slides.filter(s => !selectedIds.includes(s.id)))
      setSelectedIds([])
    }
  }

  const handleShowPreview = (slide) => {
    setPreviewSlide(slide)
  }

  const handleClosePreview = () => {
    setPreviewSlide(null)
  }

  // Pagination
  const totalPages = Math.ceil(slides.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentSlides = slides.slice(startIndex, endIndex)

  // Trigger file input click
  const triggerFileUpload = () => {
    fileInputRef.current?.click()
  }

  const triggerEditFileUpload = () => {
    editFileInputRef.current?.click()
  }

  return (
    <div className={`app-banners ${dark ? 'dark' : 'light'}`}>
      {/* Header */}
      <div className="app-banners-header">
        <div className="app-banners-header-left">
          <ImageIcon size={24} className="app-banners-icon" />
          <h1 className="app-banners-title">App Banners</h1>
        </div>
        {/* <button className="app-banners-close-btn" onClick={onClose} type="button">
          <X size={20} />
        </button> */}
      </div>

      {/* Stats */}
      <div className="app-banners-stats">
        <div className="stat-item">
          <span className="stat-label">Total Slides</span>
          <span className="stat-value">{slides.length}</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">Active</span>
          <span className="stat-value">{slides.filter(s => s.status === 'Show').length}</span>
        </div>
      </div>

      {/* Toolbar */}
      <div className="app-banners-toolbar">
        <div className="toolbar-left">
          <button className="toolbar-btn btn-add" onClick={() => setShowAddModal(true)}>
            <Plus size={16} />
            Add New
          </button>
          {selectedIds.length > 0 && (
            <button className="toolbar-btn btn-delete" onClick={handleDeleteSelected}>
              <Trash2 size={16} />
              Delete Selected ({selectedIds.length})
            </button>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="app-banners-table-wrapper">
        <table className="app-banners-table">
          <thead>
            <tr>
              <th className="col-checkbox">
                <input
                  type="checkbox"
                  checked={selectedIds.length === slides.length && slides.length > 0}
                  onChange={handleSelectAll}
                />
              </th>
              <th className="col-id">#</th>
              <th className="col-image">Image</th>
              <th className="col-status">Status</th>
              <th className="col-action">Action</th>
            </tr>
          </thead>
          <tbody>
            {currentSlides.map((slide, index) => (
              <tr key={slide.id} className={selectedIds.includes(slide.id) ? 'selected' : ''}>
                <td>
                  <input
                    type="checkbox"
                    checked={selectedIds.includes(slide.id)}
                    onChange={() => handleSelectOne(slide.id)}
                  />
                </td>
                <td>{startIndex + index + 1}</td>
                <td>
                  <div className="slide-thumbnail">
                    <img src={slide.image} alt={`Slide ${slide.id}`} />
                  </div>
                </td>
                <td>
                  <span className={`status-badge ${slide.status === 'Show' ? 'status-show' : 'status-hide'}`}>
                    {slide.status === 'Show' ? <CheckCircle size={12} /> : <AlertCircle size={12} />}
                    {slide.status}
                  </span>
                </td>
                <td>
                  <div className="action-buttons">
                    <button 
                      className="action-btn btn-show" 
                      onClick={() => handleShowPreview(slide)}
                    >
                      <Eye size={14} />
                      Show
                    </button>
                    <button 
                      className="action-btn btn-edit" 
                      onClick={() => handleEditSlide(slide)}
                    >
                      <Edit2 size={14} />
                    </button>
                    <button 
                      className="action-btn btn-delete" 
                      onClick={() => handleDelete(slide.id)}
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Footer */}
      <div className="app-banners-footer">
        <span>
          Total Data: {slides.length} | Total Pages: {totalPages}
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
              <h3>Add New Slide</h3>
              <button className="modal-close" onClick={() => setShowAddModal(false)}>
                <X size={18} />
              </button>
            </div>
            <div className="modal-body">
              <div className="upload-area" onClick={triggerFileUpload}>
                {imagePreview ? (
                  <div className="upload-preview">
                    <img src={imagePreview} alt="Preview" />
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
                    <p>Click to upload image</p>
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
                <label>Slide Title</label>
                <input 
                  type="text" 
                  name="title"
                  value={newSlideData.title}
                  onChange={handleNewSlideChange}
                  className="form-input" 
                  placeholder="Enter slide title" 
                />
              </div>
              <div className="form-group">
                <label>Subtitle</label>
                <input 
                  type="text" 
                  name="subtitle"
                  value={newSlideData.subtitle}
                  onChange={handleNewSlideChange}
                  className="form-input" 
                  placeholder="Enter subtitle" 
                />
              </div>
              <div className="form-group">
                <label>Badge Text</label>
                <input 
                  type="text" 
                  name="badge"
                  value={newSlideData.badge}
                  onChange={handleNewSlideChange}
                  className="form-input" 
                  placeholder="Enter badge text" 
                />
              </div>
              <div className="form-group">
                <label>Status</label>
                <select 
                  name="status"
                  value={newSlideData.status}
                  onChange={handleNewSlideChange}
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
              <button className="modal-btn btn-add" onClick={handleAddSlide}>
                Add Slide
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {editingSlide && (
        <div className="modal-overlay" onClick={handleCancelEdit}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <Edit2 size={24} color="#f59e0b" />
              <h3>Edit Slide</h3>
              <button className="modal-close" onClick={handleCancelEdit}>
                <X size={18} />
              </button>
            </div>
            <div className="modal-body">
              <div className="upload-area" onClick={triggerEditFileUpload}>
                {editImagePreview ? (
                  <div className="upload-preview">
                    <img src={editImagePreview} alt="Preview" />
                    <button 
                      className="upload-remove-btn"
                      onClick={(e) => {
                        e.stopPropagation()
                        setEditImagePreview(null)
                        setEditingSlide(prev => ({ ...prev, newImage: null }))
                      }}
                    >
                      <X size={14} />
                    </button>
                  </div>
                ) : (
                  <>
                    <Upload size={32} />
                    <p>Click to upload new image</p>
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
                <label>Slide Title</label>
                <input 
                  type="text" 
                  name="title"
                  value={editingSlide.title || ''}
                  onChange={handleEditChange}
                  className="form-input" 
                  placeholder="Enter slide title" 
                />
              </div>
              <div className="form-group">
                <label>Subtitle</label>
                <input 
                  type="text" 
                  name="subtitle"
                  value={editingSlide.subtitle || ''}
                  onChange={handleEditChange}
                  className="form-input" 
                  placeholder="Enter subtitle" 
                />
              </div>
              <div className="form-group">
                <label>Badge Text</label>
                <input 
                  type="text" 
                  name="badge"
                  value={editingSlide.badge || ''}
                  onChange={handleEditChange}
                  className="form-input" 
                  placeholder="Enter badge text" 
                />
              </div>
              <div className="form-group">
                <label>Status</label>
                <select 
                  name="status"
                  value={editingSlide.status || 'Show'}
                  onChange={handleEditChange}
                  className="form-select"
                >
                  <option value="Show">Show</option>
                  <option value="Hide">Hide</option>
                </select>
              </div>
            </div>
            <div className="modal-actions">
              <button className="modal-btn btn-cancel" onClick={handleCancelEdit}>
                Cancel
              </button>
              <button className="modal-btn btn-add" onClick={handleSaveEdit}>
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Preview Modal */}
      {previewSlide && (
        <div className="modal-overlay" onClick={handleClosePreview}>
          <div className="modal-content modal-preview" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <Eye size={24} color="#ff6b00" />
              <h3>Slide Preview</h3>
              <button className="modal-close" onClick={handleClosePreview}>
                <X size={18} />
              </button>
            </div>
            <div className="preview-container">
              <img src={previewSlide.image} alt="Slide Preview" className="preview-image" />
              <div className="preview-overlay">
                <div className="preview-content">
                  {previewSlide.badge && (
                    <div className="preview-badge">{previewSlide.badge}</div>
                  )}
                  {previewSlide.title && (
                    <h2 className="preview-title">{previewSlide.title}</h2>
                  )}
                  {previewSlide.subtitle && (
                    <p className="preview-subtitle">{previewSlide.subtitle}</p>
                  )}
                  {previewSlide.subtitle2 && (
                    <p className="preview-subtitle2">{previewSlide.subtitle2}</p>
                  )}
                  {previewSlide.description && (
                    <p className="preview-description">{previewSlide.description}</p>
                  )}
                  {previewSlide.cta && (
                    <button className="preview-cta">{previewSlide.cta}</button>
                  )}
                  {previewSlide.brand && (
                    <div className="preview-brand">{previewSlide.brand}</div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}