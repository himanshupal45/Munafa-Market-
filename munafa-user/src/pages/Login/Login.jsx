import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Phone, Lock, Eye, EyeOff, AlertCircle } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import './Login.css'
import munahalogo from '../../../public/munafalogo.png'  // ✅ Logo import

function SplashScreen({ logo }) {
  return (
    <div className="splash-screen">
      <div className="splash-glow" />

      <div className="splash-particles">
        {[...Array(20)].map((_, i) => <div key={i} className="splash-particle" />)}
      </div>

      <div className="splash-coins">
        {['coin-sm', 'coin-md', 'coin-lg', 'coin-xs', 'coin-md', 'coin-sm'].map((cls, i) => (
          <span key={i} className={`splash-coin ${cls}`}>🪙</span>
        ))}
      </div>

      <div className="splash-content">
        <div className="splash-ring">
          <div className="splash-ring-inner">
            {logo ? (
              <img src={logo} alt="Logo" className="splash-logo-img" />
            ) : (
              <span className="splash-logo-fallback">🎯</span>
            )}
          </div>
        </div>

        <h1 className="splash-title">
          <span>Munafa</span><span>Market</span>
        </h1>
        <p className="splash-sub">Welcome back! Loading your dashboard...</p>

        <div className="splash-progress-wrap">
          <div className="splash-progress-bar" />
        </div>

        <div className="splash-dots">
          <div className="splash-dot" />
          <div className="splash-dot" />
          <div className="splash-dot" />
        </div>
      </div>

      <p className="splash-footer">Munafa Market v2.0</p>
    </div>
  )
}

export default function Login() {
  const navigate = useNavigate()
  const { login, finalizeLogin } = useAuth()
  const [mobile, setMobile] = useState('')
  const [password, setPassword] = useState('')
  const [showPass, setShowPass] = useState(false)
  const [error, setError] = useState('')
  const [splash, setSplash] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    if (!mobile || mobile.length < 10) return setError('Valid mobile number daalo')
    if (!password || password.length < 6) return setError('Password 6+ characters ka hona chahiye')

    setSplash(true)

    const timerPromise = new Promise(r => setTimeout(r, 3000))
    let result
    try {
      result = await login(mobile, password)
    } catch {
      result = { success: false, message: 'Kuch gadbad ho gayi' }
    }

    await timerPromise

    if (result?.success) {
      finalizeLogin(result.user)
      setSplash(false)
      navigate('/', { replace: true })
    } else {
      setSplash(false)
      setError(result?.message || 'Mobile ya password galat hai')
    }
  }

  if (splash) return <SplashScreen logo={munahalogo} />

  return (
    <div className="login-page">
      {/* ✅ Brand with Logo Image */}
      <div className="login-brand">
        <div className="login-brand-icon">
          <img
            src={munahalogo}
            alt="Munafa Market Logo"
            className="login-logo-img"
          />
        </div>
        <h1 className="login-brand-title">Munafa Market</h1>
        <p className="login-brand-sub">Apne account mein login karo</p>
      </div>

      <div className="login-card">
        <h2 className="login-card-title">Sign In</h2>

        {error && (
          <div className="login-error">
            <AlertCircle size={15} /> {error}
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate>
          <div className="login-field">
            <label className="login-label">Mobile Number</label>
            <div className="login-input-wrap">
              <span className="login-input-icon"><Phone size={16} /></span>
              <input
                className="login-input"
                type="tel"
                placeholder="Enter Mobile No"
                value={mobile}
                maxLength={10}
                onChange={e => {
                  setMobile(e.target.value.replace(/\D/g, ''))
                  setError('')
                }}
              />
            </div>
          </div>

          <div className="login-field login-field-last">
            <label className="login-label">Password</label>
            <div className="login-input-wrap">
              <span className="login-input-icon"><Lock size={16} /></span>
              <input
                className="login-input"
                type={showPass ? 'text' : 'password'}
                placeholder="••••••••"
                value={password}
                onChange={e => {
                  setPassword(e.target.value)
                  setError('')
                }}
              />
              <button
                type="button"
                className="login-eye"
                onClick={() => setShowPass(!showPass)}
                aria-label="Toggle password visibility"
              >
                {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <button type="submit" className="login-submit">Login</button>
        </form>

        <p className="login-footer">
          Account nahi hai? <Link to="/register">Register karo</Link>
        </p>
      </div>
    </div>
  )
}