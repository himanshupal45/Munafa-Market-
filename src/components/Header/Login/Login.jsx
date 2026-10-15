import React, { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { 
  Mail, Lock, Eye, EyeOff, 
  Sparkles, Shield, 
  ArrowRight, CheckCircle, AlertCircle,
  User, Phone
} from 'lucide-react'
import './Login.css'
import munafalogo from '../../../../public/munafalogo.png'

export default function Login({ dark }) {
  const navigate = useNavigate()
  const [showPassword, setShowPassword] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [rememberMe, setRememberMe] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [showError, setShowError] = useState(false)

  useEffect(() => {
    const user = localStorage.getItem('user')
    if (user) {
      navigate('/')
    }
  }, [navigate])

  useEffect(() => {
    const savedEmail = localStorage.getItem('rememberedEmail')
    if (savedEmail) {
      setEmail(savedEmail)
      setRememberMe(true)
    }
  }, [])

  const validateEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    setError('')
    setShowError(false)

    if (!email) {
      setError('Please enter your email address')
      setShowError(true)
      return
    }

    if (!validateEmail(email)) {
      setError('Please enter a valid email address')
      setShowError(true)
      return
    }

    if (!password) {
      setError('Please enter your password')
      setShowError(true)
      return
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters')
      setShowError(true)
      return
    }

    setIsLoading(true)

    setTimeout(() => {
      setIsLoading(false)
      
      // Demo credentials check
      const users = JSON.parse(localStorage.getItem('registeredUsers') || '[]')
      const user = users.find(u => u.email === email && u.password === password)
      
      if (user || (email === 'admin@munafamarket.com' && password === 'admin123')) {
        const userData = {
          email: email,
          name: user?.name || 'Admin',
          role: user?.role || 'Super Admin',
          loggedIn: true
        }
        localStorage.setItem('user', JSON.stringify(userData))
        
        if (rememberMe) {
          localStorage.setItem('rememberedEmail', email)
        } else {
          localStorage.removeItem('rememberedEmail')
        }
        
        navigate('/')
      } else {
        setError('Invalid email or password. Please try again.')
        setShowError(true)
      }
    }, 1500)
  }

  const handleForgotPassword = () => {
    alert('📧 Password reset link has been sent to your registered email address.')
  }

  return (
    <div className={`auth-page ${dark ? 'dark' : 'light'}`}>
      <div className="auth-bg">
        <div className="auth-bg-circle auth-bg-circle-1"></div>
        <div className="auth-bg-circle auth-bg-circle-2"></div>
        <div className="auth-bg-circle auth-bg-circle-3"></div>
        <div className="auth-bg-circle auth-bg-circle-4"></div>
        <div className="auth-bg-circle auth-bg-circle-5"></div>
      </div>

      <div className="auth-container">
        <div className="auth-brand">
          <div className="auth-brand-content">
            <div className="auth-brand-logo">
              <img src={munafalogo} alt="Munafa Market" />
            </div>
            <h1 className="auth-brand-title">WELCOME BACK!</h1>
            <p className="auth-brand-subtitle">
              Sign in to access your account and manage your games.
            </p>
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
              <h2>Sign In</h2>
              <p>Enter your credentials to access your account</p>
            </div>

            {showError && (
              <div className="auth-error">
                <AlertCircle size={16} />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="auth-form" noValidate>
              <div className="auth-form-group">
                <label className="auth-label">Email Address</label>
                <div className={`auth-input-wrapper ${showError && !email ? 'error' : ''}`}>
                  <Mail size={18} className="auth-input-icon" />
                  <input
                    type="email"
                    placeholder="admin@munafamarket.com"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value)
                      setShowError(false)
                    }}
                    className="auth-input"
                    required
                    autoFocus
                  />
                </div>
              </div>

              <div className="auth-form-group">
                <label className="auth-label">Password</label>
                <div className={`auth-input-wrapper ${showError && !password ? 'error' : ''}`}>
                  <Lock size={18} className="auth-input-icon" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value)
                      setShowError(false)
                    }}
                    className="auth-input"
                    required
                    minLength="6"
                  />
                  <button
                    type="button"
                    className="auth-password-toggle"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                {password && password.length > 0 && password.length < 6 && (
                  <div className="auth-hint error">Minimum 6 characters required</div>
                )}
                {password && password.length >= 6 && (
                  <div className="auth-hint success">✓ Strong password</div>
                )}
              </div>

              <div className="auth-options">
                <label className="auth-remember">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                  />
                  <span>Remember me</span>
                </label>
                <button 
                  type="button" 
                  className="auth-forgot"
                  onClick={handleForgotPassword}
                >
                  Forgot Password?
                </button>
              </div>

              <button 
                type="submit" 
                className={`auth-submit ${isLoading ? 'loading' : ''}`}
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <span className="auth-loader"></span>
                    <span>Signing In...</span>
                  </>
                ) : (
                  <>
                    Sign In
                    <ArrowRight size={18} />
                  </>
                )}
              </button>
            </form>

            <div className="auth-footer">
              <p>
                Don't have an account?{' '}
                <Link to="/register" className="auth-footer-link">
                  Create Account
                </Link>
              </p>
              <p className="auth-footer-version">v2.0.0</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}