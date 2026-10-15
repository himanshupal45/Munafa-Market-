import React, { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { Home as HomeIcon, Bell, Upload, X } from 'lucide-react'
import './AddNotification.css'

export default function SendNotification({ dark }) {
  const navigate = useNavigate()

  const [title, setTitle] = useState('')
  const [notificationText, setNotificationText] = useState('')
  const [imageFile, setImageFile] = useState(null)
  const [imagePreview, setImagePreview] = useState(null)
  const [imageSize, setImageSize] = useState('0')

  const fileInputRef = useRef(null)

  // ============= HANDLERS =============

  const handleImageUpload = (e) => {
    const file = e.target.files[0]
    if (file) {
      setImageFile(file)
      const sizeKB = (file.size / 1024).toFixed(2)
      setImageSize(sizeKB)

      const reader = new FileReader()
      reader.onloadend = () => setImagePreview(reader.result)
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    if (!title.trim()) {
      alert('Please enter Title')
      return
    }
    if (!notificationText.trim()) {
      alert('Please enter Notification Text')
      return
    }

    alert('✅ Notification sent successfully!')
    setTitle('')
    setNotificationText('')
    setImageFile(null)
    setImagePreview(null)
    setImageSize('0')
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  // ✅ Close handler
  const handleClose = () => {
    navigate('/notification')
  }

  return (
    <div className="sn-page">
      {/* ✅ Breadcrumb */}
      <div className="sn-breadcrumb">
        <HomeIcon size={14} />
        <span>Home</span>
        <span className="sn-breadcrumb-sep">/</span>
        <span>Send Notification</span>
      </div>

      {/* ✅ Page Title with Icon AND Cross Button */}
       <div className="sn-page-title-wrapper">
        <div className="sn-page-title-left">
          <Bell size={26} className="sn-page-title-icon" />
          <h1 className="sn-page-title">Send Notification</h1>
        </div>
        
      </div> 

      {/* ✅ Main Card */}
      <div className="sn-card-wrapper">
        <form onSubmit={handleSubmit} className="sn-card">
          {/* Green Header */}
          <div className="sn-card-header">
            <div className="sn-page-title-wrapper">
            <h2 className="sn-card-title">Notification Details</h2>
            
       
        <button
          className="sn-close-btn"
          onClick={handleClose}
          title="Close"
          type="button"
          aria-label="Close"
        >
          <X size={22} />
        </button>
      </div>
          </div>

          {/* Card Body */}
          <div className="sn-card-body">
            {/* Title */}
            <div className="sn-form-group">
              <label className="sn-label">Title</label>
              <input
                type="text"
                className="sn-input"
                placeholder="Enter Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>

            {/* Notification Text */}
            <div className="sn-form-group">
              <label className="sn-label">Notification Text</label>
              <input
                type="text"
                className="sn-input"
                placeholder="Enter Text"
                value={notificationText}
                onChange={(e) => setNotificationText(e.target.value)}
              />
            </div>

            {/* Image Upload */}
            <div className="sn-form-group">
              <label className="sn-label">Image</label>

              <div className="sn-upload-row">
                <label className="sn-upload-btn">
                  <Upload size={16} />
                  <span>Upload</span>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="sn-file-input"
                  />
                </label>
              </div>

              <div className="sn-image-preview-box">
                {imagePreview ? (
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="sn-preview-img"
                  />
                ) : (
                  <div className="sn-no-image">
                    <span>No Image</span>
                  </div>
                )}
              </div>

              <div className="sn-file-info">
                <span className="sn-file-name">
                  {imageFile ? imageFile.name : 'No file selected'}
                </span>
                <span className="sn-file-size">Size: {imageSize} KB</span>
              </div>
            </div>

            {/* Submit Button */}
            <div className="sn-actions">
              <button type="submit" className="sn-submit-btn">
                Submit
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}