import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { 
  X, Plus, Calendar, Gamepad2, 
  CheckCircle, Save, Trophy
} from 'lucide-react'
import './AddResult.css'

const games = ['DISAWAR', 'GALI', 'GHAZIABAD', 'FARIDABAD']

export default function AddResult({ dark, onClose }) {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    game: '',
    number: '',
    date: new Date().toISOString().split('T')[0],
    status: 'SHOW'
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!formData.game || !formData.number) {
      alert('Please fill all required fields')
      return
    }
    alert('✅ Result added successfully!')
    navigate('/games/results')
  }

  const handleBack = () => {
    navigate('/games/results')
  }

  return (
    <div className={`add-result ${dark ? 'dark' : 'light'}`}>
      {/* Header */}
      <div className="ar-header">
        <div className="ar-header-left">
          <Trophy size={24} className="ar-icon" />
          <h1 className="ar-title">Add Result</h1>
        </div>
        <button className="ar-close-btn" onClick={handleBack} type="button">
          <X size={20} />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="ar-form">
        {/* Row 1: Select Game & Number */}
        <div className="form-row">
          <div className="form-group">
            <label className="form-label">
              <Gamepad2 size={16} className="form-label-icon" />
              Select Game <span className="required">*</span>
            </label>
            <select
              name="game"
              value={formData.game}
              onChange={handleChange}
              className="form-select"
            >
              <option value="">Select Game</option>
              {games.map(g => (
                <option key={g} value={g}>{g}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">
              Number <span className="required">*</span>
            </label>
            <input
              type="text"
              name="number"
              maxLength="2"
              placeholder="Enter number"
              value={formData.number}
              onChange={handleChange}
              className="form-input"
            />
          </div>
        </div>

        {/* Row 2: Date & Status */}
        <div className="form-row">
          <div className="form-group">
            <label className="form-label">
              <Calendar size={16} className="form-label-icon" />
              Date
            </label>
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              className="form-input"
            />
          </div>

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
        </div>

        {/* Buttons */}
        <div className="form-actions">
          <button type="button" className="btn-cancel" onClick={handleBack}>
            Cancel
          </button>
          <button type="submit" className="btn-submit">
            <Save size={18} />
            Add Result
          </button>
        </div>
      </form>
    </div>
  )
}