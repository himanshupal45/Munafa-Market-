import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { 
  Mail, Lock, Eye, EyeOff, 
  Sparkles, Shield, 
  ArrowRight, CheckCircle, AlertCircle,
  User, Phone, Award
} from 'lucide-react'
import './Register.css'
import munafalogo from '../../../../public/munafalogo.png'

export default function Register({ dark }) {
  const navigate = useNavigate()
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    agreeTerms: false
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [showError, setShowError] = useState(false)
  const [success, setSuccess] = useState('')

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
    setShowError(false)
    setSuccess('')
  }

  const validateEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
  }

  const validatePhone = (phone) => {
    return /^[0-9]{10}$/.test(phone)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    setError('')
    setShowError(false)
    setSuccess('')

    // Validation
    if (!formData.name) {
      setError('Please enter your full name')
      setShowError(true)
      return
    }

    if (!formData.email) {
      setError('Please enter your email address')
      setShowError(true)
      return
    }

    if (!validateEmail(formData.email)) {
      setError('Please enter a valid email address')
      setShowError(true)
      return
    }

    if (!formData.phone) {
      setError('Please enter your phone number')
      setShowError(true)
      return
    }

    if (!validatePhone(formData.phone)) {
      setError('Please enter a valid 10-digit phone number')
      setShowError(true)
      return
    }

    if (!formData.password) {
      setError('Please enter a password')
      setShowError(true)
      return
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters')
      setShowError(true)
      return
    }

    if (!formData.confirmPassword) {
      setError('Please confirm your password')
      setShowError(true)
      return
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match')
      setShowError(true)
      return
    }

    if (!formData.agreeTerms) {
      setError('Please agree to the Terms & Conditions')
      setShowError(true)
      return
    }

    setIsLoading(true)

    setTimeout(() => {
      setIsLoading(false)
      
      // Check if user already exists
      const users = JSON.parse(localStorage.getItem('registeredUsers') || '[]')
      if (users.some(u => u.email === formData.email)) {
        setError('Email already registered. Please login.')
        setShowError(true)
        return
      }

      // Save user
      const newUser = {
        id: Date.now(),
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        password: formData.password,
        role: 'User',
        registeredAt: new Date().toISOString(),
        status: 'Active'
      }
      
      users.push(newUser)
      localStorage.setItem('registeredUsers', JSON.stringify(users))
      
      setSuccess('✅ Registration successful! Please login to continue.')
      
      // Auto login after registration
      setTimeout(() => {
        navigate('/login')
      }, 2000)
    }, 1500)
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

      <div className="auth-container auth-container--register">
        <div className="auth-brand">
          <div className="auth-brand-content">
            <div className="auth-brand-logo">
              <img src={munafalogo} alt="Munafa Market" />
            </div>
            <h1 className="auth-brand-title">CREATE ACCOUNT</h1>
            <p className="auth-brand-subtitle">
              Join Munafa Market and start your gaming journey.
            </p>
            <div className="auth-brand-features">
              <div className="brand-feature">
                <Award size={16} />
                <span>Bonus on Signup</span>
              </div>
              <div className="brand-feature">
                <Shield size={16} />
                <span>100% Secure</span>
              </div>
              <div className="brand-feature">
                <Sparkles size={16} />
                <span>Fast Withdrawals</span>
              </div>
            </div>
          </div>
        </div>

        <div className="auth-form-container">
          <div className="auth-form-wrapper">
            <div className="auth-form-header">
              <h2>Create Account</h2>
              <p>Fill in your details to get started</p>
            </div>

            {showError && (
              <div className="auth-error">
                <AlertCircle size={16} />
                <span>{error}</span>
              </div>
            )}

            {success && (
              <div className="auth-success">
                <CheckCircle size={16} />
                <span>{success}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="auth-form" noValidate>
              {/* Full Name */}
              <div className="auth-form-group">
                <label className="auth-label">Full Name</label>
                <div className={`auth-input-wrapper ${showError && !formData.name ? 'error' : ''}`}>
                  <User size={18} className="auth-input-icon" />
                  <input
                    type="text"
                    name="name"
                    placeholder="John Doe"
                    value={formData.name}
                    onChange={handleChange}
                    className="auth-input"
                    required
                  />
                </div>
              </div>

              {/* Email */}
              <div className="auth-form-group">
                <label className="auth-label">Email Address</label>
                <div className={`auth-input-wrapper ${showError && !formData.email ? 'error' : ''}`}>
                  <Mail size={18} className="auth-input-icon" />
                  <input
                    type="email"
                    name="email"
                    placeholder="john@example.com"
                    value={formData.email}
                    onChange={handleChange}
                    className="auth-input"
                    required
                  />
                </div>
              </div>

              {/* Phone */}
              <div className="auth-form-group">
                <label className="auth-label">Phone Number</label>
                <div className={`auth-input-wrapper ${showError && !formData.phone ? 'error' : ''}`}>
                  <Phone size={18} className="auth-input-icon" />
                  <input
                    type="tel"
                    name="phone"
                    placeholder="9876543210"
                    value={formData.phone}
                    onChange={handleChange}
                    className="auth-input"
                    maxLength="10"
                    required
                  />
                </div>
              </div>

              {/* Password */}
              <div className="auth-form-group">
                <label className="auth-label">Password</label>
                <div className={`auth-input-wrapper ${showError && !formData.password ? 'error' : ''}`}>
                  <Lock size={18} className="auth-input-icon" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={handleChange}
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
                {formData.password && formData.password.length > 0 && formData.password.length < 6 && (
                  <div className="auth-hint error">Minimum 6 characters required</div>
                )}
                {formData.password && formData.password.length >= 6 && (
                  <div className="auth-hint success">✓ Strong password</div>
                )}
              </div>

              {/* Confirm Password */}
              <div className="auth-form-group">
                <label className="auth-label">Confirm Password</label>
                <div className={`auth-input-wrapper ${showError && formData.password !== formData.confirmPassword ? 'error' : ''}`}>
                  <Lock size={18} className="auth-input-icon" />
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    name="confirmPassword"
                    placeholder="••••••••"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className="auth-input"
                    required
                  />
                  <button
                    type="button"
                    className="auth-password-toggle"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                {formData.confirmPassword && formData.password !== formData.confirmPassword && (
                  <div className="auth-hint error">Passwords do not match</div>
                )}
                {formData.confirmPassword && formData.password === formData.confirmPassword && formData.password.length >= 6 && (
                  <div className="auth-hint success">✓ Passwords match</div>
                )}
              </div>

              {/* Terms */}
              <div className="auth-terms">
                <label className="auth-terms-label">
                  <input
                    type="checkbox"
                    name="agreeTerms"
                    checked={formData.agreeTerms}
                    onChange={handleChange}
                  />
                  <span>
                    I agree to the{' '}
                    <Link to="/terms">Terms & Conditions</Link> and{' '}
                    <Link to="/privacy">Privacy Policy</Link>
                  </span>
                </label>
              </div>

              {/* Submit */}
              <button 
                type="submit" 
                className={`auth-submit ${isLoading ? 'loading' : ''}`}
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <span className="auth-loader"></span>
                    <span>Creating Account...</span>
                  </>
                ) : (
                  <>
                    Create Account
                    <ArrowRight size={18} />
                  </>
                )}
              </button>
            </form>

            <div className="auth-footer">
              <p>
                Already have an account?{' '}
                <Link to="/login" className="auth-footer-link">
                  Sign In
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