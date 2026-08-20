import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { 
  X, Gamepad2, Plus, Save, 
  Clock, Calendar, Eye, CheckCircle,
  AlertCircle, ArrowLeft
} from 'lucide-react'
import './AddGames.css'

export default function AddGame({ dark, onClose }) {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    name: '',
    shortName: '',
    jodiRate: '',
    harufRate: '',
    openTime: '',
    closeTime: '',
    resultTime: '',
    status: 'Show'
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!formData.name || !formData.shortName) {
      alert('Please fill all required fields')
      return
    }
    alert('✅ Game added successfully!')
    // Navigate back to All Games page
    navigate('/games/all')
  }

  const handleBack = () => {
    // Navigate back to All Games page
    navigate('/games/all')
  }

  return (
    <div className={`add-game ${dark ? 'dark' : 'light'}`}>
      {/* Header */}
      <div className="add-game-header">
        <div className="add-game-header-left">
          <Gamepad2 size={24} className="add-game-icon" />
          <h1 className="add-game-title">Add Game</h1>
        </div>
        <button className="add-game-close-btn" onClick={handleBack} type="button">
          <X size={20} />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="add-game-form">
        {/* Game Name */}
        <div className="form-group">
          <label className="form-label">
            Name <span className="required">*</span>
          </label>
          <input
            type="text"
            name="name"
            placeholder="Enter game name"
            value={formData.name}
            onChange={handleChange}
            className="form-input"
          />
        </div>

        {/* Short Name */}
        <div className="form-group">
          <label className="form-label">
            Short Name <span className="required">*</span>
          </label>
          <input
            type="text"
            name="shortName"
            placeholder="Enter short name"
            value={formData.shortName}
            onChange={handleChange}
            className="form-input"
            maxLength="3"
          />
        </div>

        {/* Jodi Rate & Haruf Rate */}
        <div className="form-row">
          <div className="form-group">
            <label className="form-label">Jodi Rate</label>
            <input
              type="number"
              name="jodiRate"
              placeholder="Enter Jodi rate"
              value={formData.jodiRate}
              onChange={handleChange}
              className="form-input"
            />
          </div>
          <div className="form-group">
            <label className="form-label">Haruf Rate</label>
            <input
              type="number"
              name="harufRate"
              placeholder="Enter Haruf rate"
              value={formData.harufRate}
              onChange={handleChange}
              className="form-input"
            />
          </div>
        </div>

        {/* Open Time */}
        <div className="form-group">
          <label className="form-label">Open Time</label>
          <div className="time-input-wrapper">
            <Clock size={18} className="time-icon" />
            <input
              type="time"
              name="openTime"
              value={formData.openTime}
              onChange={handleChange}
              className="form-input time-input"
            />
            <span className="time-placeholder">--:-- --</span>
          </div>
        </div>

        {/* Close Time */}
        <div className="form-group">
          <label className="form-label">Close Time</label>
          <div className="time-input-wrapper">
            <Clock size={18} className="time-icon" />
            <input
              type="time"
              name="closeTime"
              value={formData.closeTime}
              onChange={handleChange}
              className="form-input time-input"
            />
            <span className="time-placeholder">--:-- --</span>
          </div>
        </div>

        {/* Result Time */}
        <div className="form-group">
          <label className="form-label">Result Time</label>
          <div className="time-input-wrapper">
            <Clock size={18} className="time-icon" />
            <input
              type="time"
              name="resultTime"
              value={formData.resultTime}
              onChange={handleChange}
              className="form-input time-input"
            />
            <span className="time-placeholder">--:-- --</span>
          </div>
        </div>

        {/* Select Status */}
        <div className="form-group">
          <label className="form-label">Select Status</label>
          <div className="status-options">
            <button 
              type="button"
              className={`status-option ${formData.status === 'Show' ? 'active' : ''}`}
              onClick={() => setFormData(prev => ({ ...prev, status: 'Show' }))}
            >
              <CheckCircle size={16} />
              Show
            </button>
            <button 
              type="button"
              className={`status-option ${formData.status === 'Hide' ? 'active-hide' : ''}`}
              onClick={() => setFormData(prev => ({ ...prev, status: 'Hide' }))}
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
            Add Game
          </button>
        </div>
      </form>
    </div>
  )
}