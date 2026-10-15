import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { 
  Save, Upload, X, Eye, Globe, 
  Facebook, Instagram, Twitter, Youtube,
  Phone, Mail, Link, Image, Settings
} from 'lucide-react'
import './SiteSetting.css'

export default function SiteSetting({ dark, onClose }) {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    mobile: '9899740783',
    email: 'email@gmail.com',
    facebook: 'https://www.facebook.com/',
    instagram: 'https://www.instagram.com/',
    twitter: 'https://twitter.com/',
    youtube: 'https://www.youtube.com/',
    depositYoutube: 'https://www.youtube.com/',
    withdrawYoutube: 'https://www.youtube.com/',
    gamePlayYoutube: 'https://www.youtube.com/',
  })

  const [logoFile, setLogoFile] = useState(null)
  const [logoPreview, setLogoPreview] = useState(null)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleLogoUpload = (e) => {
    const file = e.target.files[0]
    if (file) {
      setLogoFile(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setLogoPreview(reader.result)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleRemoveLogo = () => {
    setLogoFile(null)
    setLogoPreview(null)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    alert('✅ Settings saved successfully!')
    navigate('/')
  }

  const handleBack = () => {
    navigate('/')
  }

  return (
    <div className={`site-setting ${dark ? 'dark' : 'light'}`}>
      {/* Header - Fixed */}
      <div className="site-setting-header">
        <div className="site-setting-header-left">
          <Settings size={24} className="site-setting-icon" />
          <h1 className="site-setting-title">Site Setting</h1>
        </div>
        {/* <button className="site-setting-close-btn" onClick={handleBack} type="button">
          <X size={20} />
        </button> */}
      </div>

      <form onSubmit={handleSubmit} className="site-setting-form">
        {/* Contact Information */}
        <div className="setting-section">
          <h2 className="setting-section-title">Contact Information</h2>
          <div className="setting-grid">
            <div className="setting-group">
              <label className="setting-label">
                <Phone size={16} />
                Mobile
              </label>
              <input
                type="text"
                name="mobile"
                value={formData.mobile}
                onChange={handleChange}
                className="setting-input"
                placeholder="Enter mobile number"
              />
            </div>
            <div className="setting-group">
              <label className="setting-label">
                <Mail size={16} />
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="setting-input"
                placeholder="Enter email address"
              />
            </div>
          </div>
        </div>

        {/* Social Media Links */}
        <div className="setting-section">
          <h2 className="setting-section-title">Social Media Links</h2>
          <div className="setting-grid">
            <div className="setting-group">
              <label className="setting-label">
                <Facebook size={16} color="#1877f2" />
                Facebook
              </label>
              <input
                type="url"
                name="facebook"
                value={formData.facebook}
                onChange={handleChange}
                className="setting-input"
                placeholder="https://www.facebook.com/"
              />
            </div>
            <div className="setting-group">
              <label className="setting-label">
                <Instagram size={16} color="#e4405f" />
                Instagram
              </label>
              <input
                type="url"
                name="instagram"
                value={formData.instagram}
                onChange={handleChange}
                className="setting-input"
                placeholder="https://www.instagram.com/"
              />
            </div>
            <div className="setting-group">
              <label className="setting-label">
                <Twitter size={16} color="#1da1f2" />
                Twitter
              </label>
              <input
                type="url"
                name="twitter"
                value={formData.twitter}
                onChange={handleChange}
                className="setting-input"
                placeholder="https://twitter.com/"
              />
            </div>
            <div className="setting-group">
              <label className="setting-label">
                <Youtube size={16} color="#ff0000" />
                Youtube
              </label>
              <input
                type="url"
                name="youtube"
                value={formData.youtube}
                onChange={handleChange}
                className="setting-input"
                placeholder="https://www.youtube.com/"
              />
            </div>
          </div>
        </div>

        {/* YouTube Tutorial Links */}
        <div className="setting-section">
          <h2 className="setting-section-title">YouTube Tutorial Links</h2>
          <div className="setting-grid">
            <div className="setting-group">
              <label className="setting-label">
                <Youtube size={16} color="#ff0000" />
                Deposit YouTube Link
              </label>
              <input
                type="url"
                name="depositYoutube"
                value={formData.depositYoutube}
                onChange={handleChange}
                className="setting-input"
                placeholder="https://www.youtube.com/"
              />
            </div>
            <div className="setting-group">
              <label className="setting-label">
                <Youtube size={16} color="#ff0000" />
                Withdraw YouTube Link
              </label>
              <input
                type="url"
                name="withdrawYoutube"
                value={formData.withdrawYoutube}
                onChange={handleChange}
                className="setting-input"
                placeholder="https://www.youtube.com/"
              />
            </div>
            <div className="setting-group">
              <label className="setting-label">
                <Youtube size={16} color="#ff0000" />
                Game Play YouTube Link
              </label>
              <input
                type="url"
                name="gamePlayYoutube"
                value={formData.gamePlayYoutube}
                onChange={handleChange}
                className="setting-input"
                placeholder="https://www.youtube.com/"
              />
            </div>
          </div>
        </div>

        {/* Logo Upload */}
        <div className="setting-section">
          <h2 className="setting-section-title">Logo</h2>
          <div className="logo-upload-section">
            <div className="logo-upload-area">
              <label className="logo-upload-label">
                <Upload size={20} />
                <span>Click to Upload Image</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleLogoUpload}
                  className="logo-file-input"
                />
              </label>
              {logoFile && (
                <span className="logo-file-name">{logoFile.name}</span>
              )}
              {!logoFile && (
                <span className="logo-no-file">No file chosen</span>
              )}
            </div>

            <div className="logo-preview-section">
              <div className="logo-preview-header">
                <Eye size={16} />
                <span>logo Preview</span>
              </div>
              <div className="logo-preview-box">
                {logoPreview ? (
                  <div className="logo-preview-container">
                    <img src={logoPreview} alt="Logo Preview" className="logo-preview-image" />
                    <button 
                      className="logo-remove-btn" 
                      onClick={handleRemoveLogo}
                      type="button"
                    >
                      <X size={14} />
                    </button>
                  </div>
                ) : (
                  <div className="logo-placeholder">
                    <Image size={32} />
                    <span>No logo uploaded</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="setting-actions">
          <button type="submit" className="setting-save-btn">
            <Save size={16} />
            Save Settings
          </button>
        </div>
      </form>
    </div>
  )
}