import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { User, Phone, Mail, Lock, AlertCircle } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import './Register.css'

const MOBILE_REGEX = /^[6-9]\d{9}$/
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

export default function Register() {
  const navigate = useNavigate()
  const { register } = useAuth()
  const [form, setForm] = useState({
    name: '',
    mobile: '',
    email: '',
    password: '',
    confirm: '',
  })
  const [showPass, setShowPass] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const set = (key) => (e) => {
    let value = e.target.value
    if (key === 'mobile') value = value.replace(/\D/g, '').slice(0, 10) // sirf digits, max 10
    if (key === 'email') value = value.trim()
    setForm((p) => ({ ...p, [key]: value }))
    setError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (!form.name.trim()) return setError('Naam daalo')
    if (!MOBILE_REGEX.test(form.mobile))
      return setError('Valid 10 digit mobile number daalo (6-9 se shuru hona chahiye)')
    if (!EMAIL_REGEX.test(form.email)) return setError('Valid email daalo')
    if (form.password.length < 6)
      return setError('Password 6+ characters ka hona chahiye')
    if (form.password !== form.confirm)
      return setError('Password match nahi kar raha')

    setLoading(true)
    try {
      const res = await register(
        form.name.trim(),
        form.mobile,
        form.password,
        form.email.toLowerCase()
      )
      if (res.success) navigate('/', { replace: true })
      else setError(res.message || 'Registration fail ho gaya')
    } catch (err) {
      setError('Server se connect nahi ho pa raha, dobara try karo')
    } finally {
      setLoading(false)
    }
  }

  const fields = [
    { icon: <User size={16} />, label: 'Full Name', key: 'name', type: 'text', extra: { autoComplete: 'name' } },
    { icon: <Phone size={16} />, label: 'Mobile Number', key: 'mobile', type: 'tel', extra: { maxLength: 10, inputMode: 'numeric', autoComplete: 'tel' } },
    { icon: <Mail size={16} />, label: 'Email', key: 'email', type: 'email', extra: { autoComplete: 'email' } },
    { icon: <Lock size={16} />, label: 'Password', key: 'password', type: showPass ? 'text' : 'password', extra: { autoComplete: 'new-password' } },
    { icon: <Lock size={16} />, label: 'Confirm Password', key: 'confirm', type: showPass ? 'text' : 'password', extra: { autoComplete: 'new-password' } },
  ]

  return (
    <div className="register-page">
      <div className="register-brand">
        <div className="register-brand-icon">
          <img
            src="/munafalogo.png"
            alt="Munafa Market Logo"
            className="register-logo-img"
          />
        </div>
        <h1 className="register-brand-title">Munafa Market</h1>
      </div>

      <div className="register-card">
        <h2 className="register-card-title">Create Account</h2>

        {error && (
          <div className="register-error">
            <AlertCircle size={15} /> {error}
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate>
          {fields.map(({ icon, label, key, type, extra }) => (
            <div className="register-field" key={key}>
              <label className="register-label">{label}</label>
              <div className="register-input-wrap">
                <span className="register-input-icon">{icon}</span>
                <input
                  className="register-input"
                  type={type}
                  placeholder={label}
                  value={form[key]}
                  onChange={set(key)}
                  {...extra}
                />
              </div>
            </div>
          ))}

          <div className="register-show-pass" onClick={() => setShowPass(!showPass)}>
            <div className={`register-show-pass-box ${showPass ? 'active' : ''}`}>
              {showPass && '✓'}
            </div>
            <span>Password dikhao</span>
          </div>

          <button type="submit" className="register-submit" disabled={loading}>
            {loading ? <><span className="spinner" /> Registering...</> : 'Register'}
          </button>
        </form>

        <p className="register-footer">
          Account hai? <Link to="/login">Login karo</Link>
        </p>
      </div>
    </div>
  )
}