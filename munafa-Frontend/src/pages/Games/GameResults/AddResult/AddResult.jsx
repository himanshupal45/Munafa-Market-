
import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { X, Calendar, Gamepad2, CheckCircle, Save, Trophy, AlertCircle } from 'lucide-react'
import { gamesAPI } from '../../../../services/api'
import './AddResult.css'

export default function AddResult({ dark }) {
  const navigate = useNavigate()
  const [games, setGames] = useState([])
  const [formData, setFormData] = useState({
    gameId: '',
    result: '',
    date: new Date().toISOString().split('T')[0],
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  // ✅ Backend se games load karo dropdown ke liye
  useEffect(() => {
    const fetchGames = async () => {
      try {
        const res = await gamesAPI.getAll()
        if (res.success) setGames(res.games)
      } catch (err) {
        setError('Games load nahi hue')
      }
    }
    fetchGames()
  }, [])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  // ✅ Result backend mein add karo
  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    if (!formData.gameId || !formData.result) {
      setError('Game aur result number zaroori hai')
      return
    }

    setLoading(true)
    try {
      const res = await gamesAPI.addResult(formData.gameId, formData.result)
      if (res.success) {
        setSuccess('✅ Result add ho gaya!')
        setTimeout(() => navigate('/games/results'), 1500)
      }
    } catch (err) {
      setError(err.message || 'Result add nahi hua')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={`add-result ${dark ? 'dark' : 'light'}`}>
      <div className="ar-header">
        <div className="ar-header-left">
          <Trophy size={24} className="ar-icon" />
          <h1 className="ar-title">Add Result</h1>
        </div>
        <button className="ar-close-btn" onClick={() => navigate('/games/results')} type="button">
          <X size={20} />
        </button>
      </div>

      {error && (
        <div style={{ background: '#fee2e2', color: '#dc2626', padding: '10px 16px', borderRadius: '8px', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <AlertCircle size={16} /> {error}
        </div>
      )}
      {success && (
        <div style={{ background: '#dcfce7', color: '#16a34a', padding: '10px 16px', borderRadius: '8px', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <CheckCircle size={16} /> {success}
        </div>
      )}

      <form onSubmit={handleSubmit} className="ar-form">
        <div className="form-row">
          <div className="form-group">
            <label className="form-label">
              <Gamepad2 size={16} className="form-label-icon" />
              Select Game <span className="required">*</span>
            </label>
            <select name="gameId" value={formData.gameId} onChange={handleChange} className="form-select">
              <option value="">-- Game Select Karo --</option>
              {games.map(g => (
                <option key={g._id} value={g._id}>{g.name} ({g.code})</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">
              Result Number <span className="required">*</span>
            </label>
            <input
              type="text"
              name="result"
              maxLength="2"
              placeholder="00-99"
              value={formData.result}
              onChange={(e) => setFormData(p => ({ ...p, result: e.target.value.replace(/[^0-9]/g, '') }))}
              className="form-input"
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label className="form-label">
              <Calendar size={16} className="form-label-icon" />
              Date
            </label>
            <input type="date" name="date" value={formData.date} onChange={handleChange} className="form-input" />
          </div>
        </div>

        <div className="form-actions">
          <button type="button" className="btn-cancel" onClick={() => navigate('/games/results')}>Cancel</button>
          <button type="submit" className="btn-submit" disabled={loading}>
            <Save size={18} />
            {loading ? 'Adding...' : 'Add Result'}
          </button>
        </div>
      </form>
    </div>
  )
}