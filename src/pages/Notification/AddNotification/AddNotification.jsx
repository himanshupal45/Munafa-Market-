import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { 
  X, Bell, Save, CheckCircle, 
  MessageSquare, Tag, AlertCircle
} from 'lucide-react'
import './AddNotification.css'

export default function AddNotification({ dark, onClose }) {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    type: 'Notification',
    title: '',
    message: '',
    status: 'SHOW'
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!formData.title || !formData.message) {
      alert('Please fill all required fields')
      return
    }
    alert('✅ Notification added successfully!')
    navigate('/notification')
  }

  const handleBack = () => {
    navigate('/notification')
  }

  return (
    <div className={`add-notification ${dark ? 'dark' : 'light'}`}>
      {/* Header */}
      <div className="an-header">
        <div className="an-header-left">
          <Bell size={24} className="an-icon" />
          <h1 className="an-title">Add Notification</h1>
        </div>
        <button className="an-close-btn" onClick={handleBack} type="button">
          <X size={20} />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="an-form">
        {/* Row 1: Select Type & Title */}
        <div className="form-row">
          <div className="form-group">
            <label className="form-label">
              <Tag size={16} className="form-label-icon" />
              Select Type <span className="required">*</span>
            </label>
            <select
              name="type"
              value={formData.type}
              onChange={handleChange}
              className="form-select"
            >
              <option value="Notification">Notification</option>
              <option value="Alert">Alert</option>
              <option value="Promotion">Promotion</option>
              <option value="Update">Update</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">
              <MessageSquare size={16} className="form-label-icon" />
              Title <span className="required">*</span>
            </label>
            <input
              type="text"
              name="title"
              placeholder="Enter title"
              value={formData.title}
              onChange={handleChange}
              className="form-input"
            />
          </div>
        </div>

        {/* Message */}
        <div className="form-group">
          <label className="form-label">
            <AlertCircle size={16} className="form-label-icon" />
            Message <span className="required">*</span>
          </label>
          <textarea
            name="message"
            placeholder="Enter message"
            value={formData.message}
            onChange={handleChange}
            className="form-textarea"
            rows="4"
          />
        </div>

        {/* Select Status */}
        <div className="form-group">
          <label className="form-label">Select Status</label>
          <div className="status-options">
            <button 
              type="button"
              className={`status-option ${formData.status === 'SHOW' ? 'active' : ''}`}
              onClick={() => setFormData(prev => ({ ...prev, status: 'SHOW' }))}
            >
              <CheckCircle size={16} />
              Show
            </button>
            <button 
              type="button"
              className={`status-option ${formData.status === 'HIDE' ? 'active-hide' : ''}`}
              onClick={() => setFormData(prev => ({ ...prev, status: 'HIDE' }))}
            >
              <X size={16} />
              Hide
            </button>
          </div>
        </div>

        {/* Buttons */}
        <div className="form-actions">
          <button type="button" className="btn-cancel" onClick={handleBack}>
            Cancel
          </button>
          <button type="submit" className="btn-submit">
            <Save size={18} />
            Add Notification
          </button>
        </div>
      </form>
    </div>
  )
}