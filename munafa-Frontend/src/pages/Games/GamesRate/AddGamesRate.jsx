import React, { useState, useEffect } from 'react'
import { apiCall } from '../../../context/AuthContext'
import './AddGamesRate.css'

// ── Add New Form Modal ─────────────────────────────────────────────
function AddNewForm({ onAdd, onClose }) {
  const [form, setForm] = useState({ label: '', value1: '', value2: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handle = (k, v) => setForm(p => ({ ...p, [k]: v }))

  const submit = async (e) => {
    e.preventDefault()
    if (!form.label.trim()) return setError('Game name required')
    if (!form.value1 || !form.value2) return setError('Both values required')
    setLoading(true)
    setError('')
    try {
      const data = await apiCall('/game-rates', 'POST', {
        key: form.label.trim().replace(/\s+/g, '_').toLowerCase(),
        label: form.label.trim(),
        value1: Number(form.value1),
        value2: Number(form.value2),
      })
      onAdd(data.rates)
      onClose()
    } catch (err) {
      setError(err.message || 'Server error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="anf-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="anf-modal">
        <div className="anf-header">
          <h2 className="anf-title">Add New Game Rate</h2>
          <button className="anf-close" onClick={onClose}>✕</button>
        </div>
        <form onSubmit={submit} className="anf-form">
          <div className="anf-field">
            <label className="anf-label">Game Name</label>
            <input
              className="anf-input"
              placeholder="e.g. Super Sangam"
              value={form.label}
              onChange={e => handle('label', e.target.value)}
              autoFocus
            />
          </div>
          <div className="anf-row">
            <div className="anf-field">
              <label className="anf-label">Value 1 (Bet ₹)</label>
              <input
                className="anf-input value-1"
                type="number"
                placeholder="e.g. 10"
                value={form.value1}
                onChange={e => handle('value1', e.target.value)}
              />
            </div>
            <div className="anf-field">
              <label className="anf-label">Value 2 (Win ₹)</label>
              <input
                className="anf-input value-2"
                type="number"
                placeholder="e.g. 950"
                value={form.value2}
                onChange={e => handle('value2', e.target.value)}
              />
            </div>
          </div>
          {error && <p className="anf-error">⚠ {error}</p>}
          <div className="anf-actions">
            <button type="button" className="btn-reset" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn-submit" disabled={loading}>
              {loading ? <><span className="spinner"></span> Adding...</> : <>＋ Add Game</>}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

// ── Main Component ─────────────────────────────────────────────────
const AddGamesRate = () => {
  const [rates, setRates] = useState([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState(null)
  const [showForm, setShowForm] = useState(false)

  const fetchRates = async () => {
    setLoading(true)
    setMessage(null)
    try {
      const data = await apiCall('/game-rates')
      if (data.success) setRates(data.rates || [])
    } catch (err) {
      setMessage({ type: 'error', text: 'Rates load nahi hue: ' + err.message })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchRates() }, [])

  const handleChange = (key, field, value) => {
    setRates(prev => prev.map(r => r.key === key ? { ...r, [field]: value } : r))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    setMessage(null)
    try {
      const data = await apiCall('/game-rates', 'PUT', {
        rates: rates.map(r => ({
          key: r.key,
          label: r.label,
          value1: Number(r.value1),
          value2: Number(r.value2),
        }))
      })
      setRates(data.rates)
      setMessage({ type: 'success', text: 'Rates save ho gaye ✅' })
    } catch (err) {
      setMessage({ type: 'error', text: err.message || 'Save nahi hua' })
    } finally {
      setSaving(false)
    }
  }

  const handleRemove = async (key) => {
    if (!window.confirm('Ye game rate delete karna hai?')) return
    try {
      const data = await apiCall(`/game-rates/${key}`, 'DELETE')
      if (data.success) setRates(data.rates)
    } catch (err) {
      setMessage({ type: 'error', text: 'Delete nahi hua: ' + err.message })
    }
  }

  const ICONS = ['1','2','3','4','5','6','7','8','9','★','◆','▲']

  return (
    <div className="game-rate-wrapper">
      {showForm && (
        <AddNewForm
          onAdd={(newRates) => setRates(newRates)}
          onClose={() => setShowForm(false)}
        />
      )}

      <div className="game-rate-header">
        <div>
          <h1 className="game-rate-title"><span>Add</span> Games Rate</h1>
          <p className="game-rate-subtitle">Database se connected — real rates configure karo</p>
        </div>
        <div className="game-rate-actions">
          <button className="btn-outline" onClick={fetchRates}>↺ Refresh</button>
          <button className="btn-primary" onClick={() => setShowForm(true)}>＋ Add New</button>
        </div>
      </div>

      <div className="rate-card">
        <div className="rate-card-title">
          🎲 Game Rates Configuration
          <span className="rate-count">{rates.length} games</span>
        </div>

        {loading ? (
          <div className="rate-loading">
            <span className="spinner" style={{ borderTopColor: 'var(--accent-orange)' }}></span>
            <p>Loading rates...</p>
          </div>
        ) : (
          <form className="rate-form" onSubmit={handleSubmit}>
            <div className="rate-grid">
              {rates.map((rate, idx) => (
                <div className="rate-group" key={rate.key}>
                  <label>
                    <i>{ICONS[idx] || '★'}</i>
                    {rate.label}
                    <button
                      type="button"
                      className="rate-remove-btn"
                      onClick={() => handleRemove(rate.key)}
                      title="Remove"
                    >✕</button>
                  </label>
                  <div className="rate-input-wrapper">
                    <div className="input-group">
                      <span className="input-label">Value 1 (Bet ₹)</span>
                      <input
                        type="number"
                        className="rate-input value-1"
                        value={rate.value1}
                        onChange={e => handleChange(rate.key, 'value1', e.target.value)}
                        placeholder="Bet ₹"
                      />
                    </div>
                    <div className="input-group">
                      <span className="input-label">Value 2 (Win ₹)</span>
                      <input
                        type="number"
                        className="rate-input value-2"
                        value={rate.value2}
                        onChange={e => handleChange(rate.key, 'value2', e.target.value)}
                        placeholder="Win ₹"
                      />
                    </div>
                  </div>
                </div>
              ))}

              <button type="button" className="rate-add-card" onClick={() => setShowForm(true)}>
                <span className="rate-add-icon">＋</span>
                <span className="rate-add-label">Add New Game</span>
              </button>
            </div>

            {message && (
              <div className={`message ${message.type}`}>
                {message.type === 'success' ? '✓' : '⚠'} {message.text}
              </div>
            )}

            <div className="rate-form-footer">
              <div className="info-text">ℹ All values are in Indian Rupees (₹)</div>
              <div className="rate-actions">
                <button type="button" className="btn-reset" onClick={fetchRates}>↺ Reset</button>
                <button type="submit" className="btn-submit" disabled={saving}>
                  {saving ? <><span className="spinner"></span> Saving...</> : <>✓ Save Rates</>}
                </button>
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}

export default AddGamesRate