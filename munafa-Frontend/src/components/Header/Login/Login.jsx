import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Lock, Eye, EyeOff, Sparkles, Shield, ArrowRight, CheckCircle, AlertCircle, Phone } from 'lucide-react'
import { useAuth } from '../../../context/AuthContext'
import './Login.css'
import munafalogo from '/munafalogo.png?url'

export default function Login() {
  const navigate = useNavigate()
  const { login, finalizeLogin, setShowLoginSplash } = useAuth()
  const [showPassword, setShowPassword] = useState(false)
  const [mobile, setMobile] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (!mobile || mobile.length < 10) {
      setError('Valid mobile number daalo')
      return
    }
    if (!password || password.length < 6) {
      setError('Password kam se kam 6 characters ka hona chahiye')
      return
    }

    // ✅ Global splash ON karo (App level par render hoga — koi redirect affect nahi karega)
    setShowLoginSplash(true)

    // Timer aur login parallel
    const timerPromise = new Promise(resolve => setTimeout(resolve, 3000))

    let result = null
    try {
      result = await login(mobile, password)
    } catch (err) {
      result = { success: false, message: 'Kuch gadbad ho gayi' }
    }

    // Poore 3 second wait karo
    await timerPromise

    if (result?.success) {
      // ✅ Pehle user set karo, phir splash band, phir navigate
      finalizeLogin(result.user)
      setShowLoginSplash(false)
      navigate('/admin', { replace: true })
    } else {
      setShowLoginSplash(false)
      setError(result?.message || 'Mobile ya password galat hai')
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-bg">
        <div className="auth-bg-circle auth-bg-circle-1"></div>
        <div className="auth-bg-circle auth-bg-circle-2"></div>
        <div className="auth-bg-circle auth-bg-circle-3"></div>
      </div>

      <div className="auth-container">
        <div className="auth-brand">
          <div className="auth-brand-content">
            <div className="auth-brand-logo">
              <img src={munafalogo} alt="Munafa Market" />
            </div>
            <h1 className="auth-brand-title">WELCOME BACK!</h1>
            <p className="auth-brand-subtitle">Log In to access your account and manage your games.</p>
            <div className="auth-brand-features">
              <div className="brand-feature">
                <Shield size={16} />
                <span>Secure Platform</span>
              </div>
              <div className="brand-feature">
                <CheckCircle size={16} />
                <span>Trusted Since 2020</span>
              </div>
              <div className="brand-feature">
                <Sparkles size={16} />
                <span>24/7 Support</span>
              </div>
            </div>
          </div>
        </div>

        <div className="auth-form-container">
          <div className="auth-form-wrapper">
            <div className="auth-form-header">
              <h2>Log In</h2>
              <p>Login with mobile number and password.</p>
            </div>

            {error && (
              <div className="auth-error">
                <AlertCircle size={16} />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="auth-form" noValidate>
              <div className="auth-form-group">
                <label className="auth-label">Mobile Number</label>
                <div className="auth-input-wrapper">
                  <Phone size={18} className="auth-input-icon" />
                  <input
                    type="tel"
                    placeholder="Enter Mobile No.."
                    value={mobile}
                    onChange={(e) => {
                      setMobile(e.target.value.replace(/\D/g, ''))
                      setError('')
                    }}
                    className="auth-input"
                    maxLength={10}
                    required
                    autoFocus
                  />
                </div>
              </div>

              <div className="auth-form-group">
                <label className="auth-label">Password</label>
                <div className="auth-input-wrapper">
                  <Lock size={18} className="auth-input-icon" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter Password"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value)
                      setError('')
                    }}
                    className="auth-input"
                    required
                  />
                  <button
                    type="button"
                    className="auth-password-toggle"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <button type="submit" className="auth-submit">
                Log In <ArrowRight size={18} />
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
