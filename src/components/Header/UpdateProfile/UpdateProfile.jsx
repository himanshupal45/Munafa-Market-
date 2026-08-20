import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { 
  X, User, Mail, Phone, Calendar, 
  MapPin, Home, Save, Upload, Eye,
  UserCircle, Lock, Users, Globe,
  Cake, Heart, Edit2
} from 'lucide-react'
import './UpdateProfile.css'

export default function UpdateProfile({ dark, onClose }) {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    firstName: 'Admin',
    lastName: '.',
    username: 'admin',
    password: '',
    contactNumber: '46546',
    email: 'admin@gmail.com',
    gender: 'male',
    dateOfBirth: '2022-01-01',
    maritalStatus: 'single',
    age: '22',
    country: 'india',
    state: 'delhi',
    address: 'sfsfsdf sdefdsfs fsdf sdf'
  })

  const [profileImage, setProfileImage] = useState(null)
  const [imagePreview, setImagePreview] = useState(null)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleImageUpload = (e) => {
    const file = e.target.files[0]
    if (file) {
      setProfileImage(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleRemoveImage = () => {
    setProfileImage(null)
    setImagePreview(null)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    alert('✅ Profile updated successfully!')
    navigate('/')
  }

  const handleBack = () => {
    navigate('/')
  }

  return (
    <div className={`update-profile ${dark ? 'dark' : 'light'}`}>
      {/* Header */}
      <div className="up-header">
        <div className="up-header-left">
          <UserCircle size={24} className="up-icon" />
          <h1 className="up-title">Update Profile</h1>
        </div>
        <button className="up-close-btn" onClick={handleBack} type="button">
          <X size={20} />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="up-form">
        {/* Profile Image */}
        <div className="up-image-section">
          <div className="up-image-wrapper">
            {imagePreview ? (
              <div className="up-image-preview">
                <img src={imagePreview} alt="Profile" />
                <button 
                  className="up-image-remove"
                  onClick={handleRemoveImage}
                  type="button"
                >
                  <X size={14} />
                </button>
              </div>
            ) : (
              <div className="up-image-placeholder">
                <User size={40} />
              </div>
            )}
          </div>
          <div className="up-image-upload">
            <label className="up-upload-btn">
              <Upload size={16} />
              Click to Upload Image
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="up-file-input"
              />
            </label>
            <span className="up-file-name">No file chosen</span>
          </div>
          <div className="up-image-preview-label">
            <Eye size={16} />
            <span>Image Preview</span>
          </div>
        </div>

        {/* Form Row 1: First Name & Last Name */}
        <div className="up-form-row">
          <div className="up-form-group">
            <label className="up-label">
              <User size={16} className="up-label-icon" />
              First Name
            </label>
            <input
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              className="up-input"
            />
          </div>
          <div className="up-form-group">
            <label className="up-label">
              <User size={16} className="up-label-icon" />
              Last Name
            </label>
            <input
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              className="up-input"
            />
          </div>
        </div>

        {/* Form Row 2: Username & Password */}
        <div className="up-form-row">
          <div className="up-form-group">
            <label className="up-label">
              <User size={16} className="up-label-icon" />
              Username <span className="up-required">*</span>
            </label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              className="up-input"
              required
            />
          </div>
          <div className="up-form-group">
            <label className="up-label">
              <Lock size={16} className="up-label-icon" />
              Password <span className="up-hint">(Leave blank to keep current password)</span>
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="up-input"
              placeholder="Enter new password"
            />
          </div>
        </div>

        {/* Form Row 3: Contact Number & Email */}
        <div className="up-form-row">
          <div className="up-form-group">
            <label className="up-label">
              <Phone size={16} className="up-label-icon" />
              Contact Number
            </label>
            <input
              type="text"
              name="contactNumber"
              value={formData.contactNumber}
              onChange={handleChange}
              className="up-input"
            />
          </div>
          <div className="up-form-group">
            <label className="up-label">
              <Mail size={16} className="up-label-icon" />
              Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="up-input"
            />
          </div>
        </div>

        {/* Form Row 4: Gender & Date Of Birth */}
        <div className="up-form-row">
          <div className="up-form-group">
            <label className="up-label">
              <Users size={16} className="up-label-icon" />
              Gender
            </label>
            <select
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              className="up-select"
            >
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </div>
          <div className="up-form-group">
            <label className="up-label">
              <Cake size={16} className="up-label-icon" />
              Date Of Birth
            </label>
            <input
              type="date"
              name="dateOfBirth"
              value={formData.dateOfBirth}
              onChange={handleChange}
              className="up-input"
            />
          </div>
        </div>

        {/* Form Row 5: Marital Status & Age */}
        <div className="up-form-row">
          <div className="up-form-group">
            <label className="up-label">
              <Heart size={16} className="up-label-icon" />
              Marital Status
            </label>
            <select
              name="maritalStatus"
              value={formData.maritalStatus}
              onChange={handleChange}
              className="up-select"
            >
              <option value="single">Single</option>
              <option value="married">Married</option>
              <option value="divorced">Divorced</option>
              <option value="widowed">Widowed</option>
            </select>
          </div>
          <div className="up-form-group">
            <label className="up-label">
              <Calendar size={16} className="up-label-icon" />
              Age
            </label>
            <input
              type="number"
              name="age"
              value={formData.age}
              onChange={handleChange}
              className="up-input"
            />
          </div>
        </div>

        {/* Form Row 6: Country & State */}
        <div className="up-form-row">
          <div className="up-form-group">
            <label className="up-label">
              <Globe size={16} className="up-label-icon" />
              Country
            </label>
            <input
              type="text"
              name="country"
              value={formData.country}
              onChange={handleChange}
              className="up-input"
            />
          </div>
          <div className="up-form-group">
            <label className="up-label">
              <MapPin size={16} className="up-label-icon" />
              State
            </label>
            <input
              type="text"
              name="state"
              value={formData.state}
              onChange={handleChange}
              className="up-input"
            />
          </div>
        </div>

        {/* Address */}
        <div className="up-form-group full-width">
          <label className="up-label">
            <Home size={16} className="up-label-icon" />
            Address
          </label>
          <textarea
            name="address"
            value={formData.address}
            onChange={handleChange}
            className="up-textarea"
            rows="3"
          />
        </div>

        {/* Buttons */}
        <div className="up-form-actions">
          <button type="button" className="up-btn-cancel" onClick={handleBack}>
            Cancel
          </button>
          <button type="submit" className="up-btn-submit">
            <Save size={18} />
            Update Profile
          </button>
        </div>
      </form>
    </div>
  )
}