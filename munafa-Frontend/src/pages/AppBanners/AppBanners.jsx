import React, { useState, useRef, useEffect } from 'react'
import { 
  X, Image as ImageIcon, Eye, Plus, 
  Trash2, Edit2, CheckCircle, AlertCircle,
  Upload, ChevronLeft, ChevronRight
} from 'lucide-react'
import { bannersAPI } from '../../services/api'
import './AppBanners.css'

// ✅ ADD THIS - API URL for images
const API_URL = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5000'

export default function AppBanners({ dark, onClose }) {
  const [slides, setSlides] = useState([])
  const [selectedIds, setSelectedIds] = useState([])
  const [showAddModal, setShowAddModal] = useState(false)
  const [previewSlide, setPreviewSlide] = useState(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [editingSlide, setEditingSlide] = useState(null)
  const [imagePreview, setImagePreview] = useState(null)
  const [imageFile, setImageFile] = useState(null)
  const [editImageFile, setEditImageFile] = useState(null)
  const [loading, setLoading] = useState(false)
  const [editImagePreview, setEditImagePreview] = useState(null)
  const [newSlideData, setNewSlideData] = useState({
    title: '',
    subtitle: '',
    subtitle2: '',
    badge: '',
    description: '',
    cta: '',
    brand: '',
    status: 'Active'
  })
  const fileInputRef = useRef(null)
  const editFileInputRef = useRef(null)
  const itemsPerPage = 10

  // Load banners from API
  useEffect(() => {
    loadBanners()
  }, [])

  const loadBanners = async () => {
    setLoading(true)
    try {
      const res = await bannersAPI.getAll()
      if (res.success && res.banners) {
        const formattedSlides = res.banners.map((banner, index) => ({
          id: banner._id || index + 1,
          _id: banner._id,
          image: banner.image,
          status: banner.status === 'Active' ? 'Show' : 'Hide',
          title: banner.title || '',
          subtitle: banner.subtitle || '',
          subtitle2: banner.subtitle2 || '',
          badge: banner.badge || '',
          description: banner.description || '',
          cta: banner.cta || '',
          brand: banner.brand || '',
          order: banner.order || 0,
          link: banner.link || '',
          type: banner.type || 'App Banner'
        }))
        setSlides(formattedSlides)
      }
    } catch (error) {
      console.error('Error loading banners:', error)
    } finally {
      setLoading(false)
    }
  }

  // Handle image upload for new slide
  const handleImageUpload = (e) => {
    const file = e.target.files[0]
    if (file) {
      setImageFile(file)
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
      setEditImageFile(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setEditImagePreview(reader.result)
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
  const handleAddSlide = async () => {
    if (!imageFile) {
      alert('Please upload an image')
      return
    }

    setLoading(true)
    try {
      const formData = new FormData()
      formData.append('image', imageFile)
      formData.append('title', newSlideData.title || 'New Slide')
      formData.append('status', newSlideData.status)
      formData.append('type', 'App Banner')
      formData.append('order', slides.length)
      formData.append('subtitle', newSlideData.subtitle || '')
      formData.append('subtitle2', newSlideData.subtitle2 || '')
      formData.append('badge', newSlideData.badge || '')
      formData.append('description', newSlideData.description || '')
      formData.append('cta', newSlideData.cta || '')
      formData.append('brand', newSlideData.brand || '')

      const createRes = await bannersAPI.create(formData)
      if (createRes.success) {
        await loadBanners()
        setShowAddModal(false)
        setImagePreview(null)
        setImageFile(null)
        setNewSlideData({
          title: '',
          subtitle: '',
          subtitle2: '',
          badge: '',
          description: '',
          cta: '',
          brand: '',
          status: 'Active'
        })
      } else {
        alert('Failed to create banner')
      }
    } catch (error) {
      console.error('Error adding banner:', error)
      alert('Error adding banner')
    } finally {
      setLoading(false)
    }
  }

  // Handle edit slide
  const handleEditSlide = (slide) => {
    setEditingSlide({ 
      ...slide,
      status: slide.status === 'Show' ? 'Active' : 'Inactive'
    })
    setEditImagePreview(slide.image)
    setEditImageFile(null)
  }

  // Handle save edit
  const handleSaveEdit = async () => {
    if (!editingSlide) return

    setLoading(true)
    try {
      const formData = new FormData()
      
      if (editImageFile) {
        formData.append('image', editImageFile)
      }
      
      formData.append('title', editingSlide.title || '')
      formData.append('status', editingSlide.status)
      formData.append('type', editingSlide.type || 'App Banner')
      formData.append('order', editingSlide.order || 0)
      formData.append('subtitle', editingSlide.subtitle || '')
      formData.append('subtitle2', editingSlide.subtitle2 || '')
      formData.append('badge', editingSlide.badge || '')
      formData.append('description', editingSlide.description || '')
      formData.append('cta', editingSlide.cta || '')
      formData.append('brand', editingSlide.brand || '')

      const updateRes = await bannersAPI.update(editingSlide._id, formData)
      if (updateRes.success) {
        await loadBanners()
        setEditingSlide(null)
        setEditImagePreview(null)
        setEditImageFile(null)
      } else {
        alert('Failed to update banner')
      }
    } catch (error) {
      console.error('Error updating banner:', error)
      alert('Error updating banner')
    } finally {
      setLoading(false)
    }
  }

  // Handle cancel edit
  const handleCancelEdit = () => {
    setEditingSlide(null)
    setEditImagePreview(null)
    setEditImageFile(null)
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

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this slide?')) return
    
    const slide = slides.find(s => s.id === id)
    if (!slide) return

    setLoading(true)
    try {
      const deleteRes = await bannersAPI.delete(slide._id)
      if (deleteRes.success) {
        await loadBanners()
        setSelectedIds(selectedIds.filter(sid => sid !== id))
      } else {
        alert('Failed to delete banner')
      }
    } catch (error) {
      console.error('Error deleting banner:', error)
      alert('Error deleting banner')
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteSelected = async () => {
    if (!window.confirm(`Delete ${selectedIds.length} selected slides?`)) return

    setLoading(true)
    try {
      const selectedSlides = slides.filter(s => selectedIds.includes(s.id))
      const deletePromises = selectedSlides.map(s => bannersAPI.delete(s._id))
      await Promise.all(deletePromises)
      await loadBanners()
      setSelectedIds([])
    } catch (error) {
      console.error('Error deleting banners:', error)
      alert('Error deleting banners')
    } finally {
      setLoading(false)
    }
  }

  const handleShowPreview = (slide) => {
    setPreviewSlide(slide)
  }

  const handleClosePreview = () => {
    setPreviewSlide(null)
  }

  // Toggle status
  const handleToggleStatus = async (slide) => {
    const newStatus = slide.status === 'Show' ? 'Inactive' : 'Active'
    
    setLoading(true)
    try {
      const formData = new FormData()
      formData.append('status', newStatus)
      
      const updateRes = await bannersAPI.update(slide._id, formData)
      if (updateRes.success) {
        await loadBanners()
      } else {
        alert('Failed to update status')
      }
    } catch (error) {
      console.error('Error updating status:', error)
      alert('Error updating status')
    } finally {
      setLoading(false)
    }
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

  if (loading && slides.length === 0) {
    return (
      <div className="app-banners">
        <div className="loading-container">
          <div className="loader">Loading...</div>
        </div>
      </div>
    )
  }

  return (
    <div className={`app-banners ${dark ? 'dark' : 'light'}`}>
      {/* Header */}
      <div className="app-banners-header">
        <div className="app-banners-header-left">
          <ImageIcon size={24} className="app-banners-icon" />
          <h1 className="app-banners-title">App Banners</h1>
        </div>
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
        <div className="stat-item">
          <span className="stat-label">Inactive</span>
          <span className="stat-value">{slides.filter(s => s.status === 'Hide').length}</span>
        </div>
      </div>

      {/* Toolbar */}
      <div className="app-banners-toolbar">
        <div className="toolbar-left">
          <button className="toolbar-btn btn-add" onClick={() => setShowAddModal(true)} disabled={loading}>
            <Plus size={16} />
            Add New
          </button>
          {selectedIds.length > 0 && (
            <button className="toolbar-btn btn-delete" onClick={handleDeleteSelected} disabled={loading}>
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
                  disabled={loading}
                />
              </th>
              <th className="col-id">#</th>
              <th className="col-image">Image</th>
              <th className="col-title">Title</th>
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
                    disabled={loading}
                  />
                </td>
                <td>{startIndex + index + 1}</td>
                <td>
                  <div className="slide-thumbnail">
                    <img 
                      src={`${API_URL}${slide.image}`} 
                      alt={`Slide ${slide.id}`}
                      onError={(e) => {
                        e.target.src = 'https://via.placeholder.com/100x60/1e1e1e/666?text=No+Image'
                      }}
                    />
                  </div>
                </td>
                <td>{slide.title || 'Untitled'}</td>
                <td>
                  <span 
                    className={`status-badge ${slide.status === 'Show' ? 'status-show' : 'status-hide'}`}
                    onClick={() => handleToggleStatus(slide)}
                    style={{ cursor: 'pointer' }}
                  >
                    {slide.status === 'Show' ? <CheckCircle size={12} /> : <AlertCircle size={12} />}
                    {slide.status}
                  </span>
                </td>
                <td>
                  <div className="App-banners-action-buttons">
                    <button 
                      className="App-banners-action-btn App-banners-btn-show" 
                      onClick={() => handleShowPreview(slide)}
                      disabled={loading}
                    >
                      <Eye size={14} />
                      Show
                    </button>
                    <button 
                      className="App-banners-action-btn App-banners-btn-edit" 
                      onClick={() => handleEditSlide(slide)}
                      disabled={loading}
                    >
                      <Edit2 size={14} />
                    </button>
                    <button 
                      className="App-banners-action-btn App-banners-btn-delete" 
                      onClick={() => handleDelete(slide.id)}
                      disabled={loading}
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
              disabled={currentPage === 1 || loading}
            >
              <ChevronLeft size={16} />
            </button>
            <span className="pagination-info">
              Page {currentPage} of {totalPages}
            </span>
            <button 
              className="pagination-btn"
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages || loading}
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
                        setImageFile(null)
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
                <label>Subtitle 2</label>
                <input 
                  type="text" 
                  name="subtitle2"
                  value={newSlideData.subtitle2}
                  onChange={handleNewSlideChange}
                  className="form-input" 
                  placeholder="Enter second subtitle" 
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
                <label>Description</label>
                <input 
                  type="text" 
                  name="description"
                  value={newSlideData.description}
                  onChange={handleNewSlideChange}
                  className="form-input" 
                  placeholder="Enter description" 
                />
              </div>
              <div className="form-group">
                <label>CTA Text</label>
                <input 
                  type="text" 
                  name="cta"
                  value={newSlideData.cta}
                  onChange={handleNewSlideChange}
                  className="form-input" 
                  placeholder="Enter CTA text" 
                />
              </div>
              <div className="form-group">
                <label>Brand</label>
                <input 
                  type="text" 
                  name="brand"
                  value={newSlideData.brand}
                  onChange={handleNewSlideChange}
                  className="form-input" 
                  placeholder="Enter brand name" 
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
                  <option value="Active">Show</option>
                  <option value="Inactive">Hide</option>
                </select>
              </div>
            </div>
            <div className="modal-actions">
              <button className="modal-btn btn-cancel" onClick={() => setShowAddModal(false)} disabled={loading}>
                Cancel
              </button>
              <button className="modal-btn btn-add" onClick={handleAddSlide} disabled={loading}>
                {loading ? 'Adding...' : 'Add Slide'}
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
                        setEditImageFile(null)
                        setEditingSlide(prev => ({ ...prev, image: null }))
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
                <label>Subtitle 2</label>
                <input 
                  type="text" 
                  name="subtitle2"
                  value={editingSlide.subtitle2 || ''}
                  onChange={handleEditChange}
                  className="form-input" 
                  placeholder="Enter second subtitle" 
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
                <label>Description</label>
                <input 
                  type="text" 
                  name="description"
                  value={editingSlide.description || ''}
                  onChange={handleEditChange}
                  className="form-input" 
                  placeholder="Enter description" 
                />
              </div>
              <div className="form-group">
                <label>CTA Text</label>
                <input 
                  type="text" 
                  name="cta"
                  value={editingSlide.cta || ''}
                  onChange={handleEditChange}
                  className="form-input" 
                  placeholder="Enter CTA text" 
                />
              </div>
              <div className="form-group">
                <label>Brand</label>
                <input 
                  type="text" 
                  name="brand"
                  value={editingSlide.brand || ''}
                  onChange={handleEditChange}
                  className="form-input" 
                  placeholder="Enter brand name" 
                />
              </div>
              <div className="form-group">
                <label>Status</label>
                <select 
                  name="status"
                  value={editingSlide.status || 'Active'}
                  onChange={handleEditChange}
                  className="form-select"
                >
                  <option value="Active">Show</option>
                  <option value="Inactive">Hide</option>
                </select>
              </div>
            </div>
            <div className="modal-actions">
              <button className="modal-btn btn-cancel" onClick={handleCancelEdit} disabled={loading}>
                Cancel
              </button>
              <button className="modal-btn btn-add" onClick={handleSaveEdit} disabled={loading}>
                {loading ? 'Saving...' : 'Save Changes'}
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
              <img 
                src={`${API_URL}${previewSlide.image}`} 
                alt="Slide Preview" 
                className="preview-image"
                onError={(e) => {
                  e.target.src = 'https://via.placeholder.com/800x400/1e1e1e/666?text=No+Image'
                }}
              />
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