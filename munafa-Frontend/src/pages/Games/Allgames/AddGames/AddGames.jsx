import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { X, Gamepad2, Save, Clock, CheckCircle, AlertCircle } from 'lucide-react'
import { gamesAPI } from '../../../../services/api'
import './AddGames.css'

export default function AddGame({ dark }) {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    name: '',
    shortName: '',
    jodiRate: '',
    harufRate: '',
    openTime: '',
    closeTime: '',
    resultTime: '',
    status: 'Show',
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    setError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    if (!formData.name.trim() || !formData.shortName.trim()) {
      return setError('Game name aur short name zaroori hai')
    }
    if (!formData.openTime || !formData.closeTime) {
      return setError('Open aur Close time zaroori hai')
    }
    if (formData.resultTime && formData.openTime <= formData.closeTime) {
      // normal (din wala) game: result close time se pehle nahi ho sakta
      if (formData.resultTime < formData.closeTime) {
        return setError('Result time Close time se pehle nahi ho sakta')
      }
    }

    setLoading(true)
    try {
      const res = await gamesAPI.create({
        name: formData.name.trim().toUpperCase(),
        code: formData.shortName.trim().toUpperCase(),
        openTime: formData.openTime,
        closeTime: formData.closeTime,
        resultTime: formData.resultTime,
        minBet: 10,
        maxBet: 10000,
        winMultiplier: Number(formData.jodiRate) || 9,
        status: formData.status === 'Show' ? 'Active' : 'Inactive',
      })

      if (res.success) {
        setSuccess('Game successfully add ho gaya!')
        setTimeout(() => navigate('/games/all'), 1500)
      }
    } catch (err) {
      setError(err.message || 'Game add nahi hua, dobara try karo')
    } finally {
      setLoading(false)
    }
  }

  const timeField = (label, name) => (
    <div className="form-group">
      <label className="form-label">
        {label} {name !== 'resultTime' && <span className="required">*</span>}
      </label>
      <div className="time-input-wrapper">
        <Clock size={18} className="time-icon" />
        <input
          type="time"
          name={name}
          value={formData[name]}
          onChange={handleChange}
          className="form-input time-input"
        />
      </div>
    </div>
  )

  return (
    <div className={`add-game ${dark ? 'dark' : 'light'}`}>
      <div className="add-game-header">
        <div className="add-game-header-left">
          <Gamepad2 size={24} className="add-game-icon" />
          <h1 className="add-game-title">Add Game</h1>
        </div>
        <button className="add-game-close-btn" onClick={() => navigate('/games/all')} type="button">
          <X size={20} />
        </button>
      </div>

      {error && (
        <div style={{ background: '#fee2e2', color: '#dc2626', padding: '10px 16px', borderRadius: '8px', margin: '0 0 16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <AlertCircle size={16} /> {error}
        </div>
      )}
      {success && (
        <div style={{ background: '#dcfce7', color: '#16a34a', padding: '10px 16px', borderRadius: '8px', margin: '0 0 16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <CheckCircle size={16} /> {success}
        </div>
      )}

      <form onSubmit={handleSubmit} className="add-game-form">
        <div className="form-group">
          <label className="form-label">Name <span className="required">*</span></label>
          <input type="text" name="name" placeholder="Enter game name" value={formData.name} onChange={handleChange} className="form-input" />
        </div>

        <div className="form-group">
          <label className="form-label">Short Name <span className="required">*</span></label>
          <input type="text" name="shortName" placeholder="e.g. FB" value={formData.shortName} onChange={handleChange} className="form-input" maxLength="3" />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label className="form-label">Jodi Rate</label>
            <input type="number" name="jodiRate" placeholder="e.g. 9" value={formData.jodiRate} onChange={handleChange} className="form-input" />
          </div>
          <div className="form-group">
            <label className="form-label">Haruf Rate</label>
            <input type="number" name="harufRate" placeholder="e.g. 9" value={formData.harufRate} onChange={handleChange} className="form-input" />
          </div>
        </div>

        {timeField('Open Time', 'openTime')}
        {timeField('Close Time', 'closeTime')}
        {timeField('Result Time', 'resultTime')}

        <div className="form-group">
          <label className="form-label">Select Status</label>
          <div className="status-options">
            <button type="button" className={`status-option ${formData.status === 'Show' ? 'active' : ''}`} onClick={() => setFormData((p) => ({ ...p, status: 'Show' }))}>
              <CheckCircle size={16} /> Show
            </button>
            <button type="button" className={`status-option ${formData.status === 'Hide' ? 'active-hide' : ''}`} onClick={() => setFormData((p) => ({ ...p, status: 'Hide' }))}>
              <X size={16} /> Hide
            </button>
          </div>
        </div>

        <div className="form-actions">
          <button type="button" className="btn-cancel" onClick={() => navigate('/games/all')}>Cancel</button>
          <button type="submit" className="btn-submit" disabled={loading}>
            <Save size={18} />
            {loading ? 'Adding...' : 'Add Game'}
          </button>
        </div>
      </form>
    </div>
  )
}