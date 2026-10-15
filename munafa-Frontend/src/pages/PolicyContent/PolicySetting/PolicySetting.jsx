import React, { useState, useRef, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { 
  Home as HomeIcon, 
  Lock, 
  Phone, 
  PlayCircle 
} from 'lucide-react'
import './PolicySetting.css'

// ============================================
// ✅ CHANGE PASSWORD PAGE
// ============================================
function ChangePassword() {
  const [oldPassword, setOldPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!oldPassword || !newPassword || !confirmPassword) {
      alert('Please fill all fields')
      return
    }
    if (newPassword !== confirmPassword) {
      alert('New password and confirm password do not match')
      return
    }
    if (newPassword.length < 6) {
      alert('Password must be at least 6 characters')
      return
    }
    alert('✅ Password changed successfully!')
    setOldPassword('')
    setNewPassword('')
    setConfirmPassword('')
  }

  return (
    <>
      <div className="st-breadcrumb">
        <HomeIcon size={14} />
        <span>Home</span>
        <span className="st-breadcrumb-sep">/</span>
        <span>Change Password</span>
      </div>

      {/* ✅ Page Title with Icon */}
      <div className="st-page-title-wrapper">
        <Lock size={26} className="st-page-title-icon" />
        <h1 className="st-page-title">Change Password</h1>
      </div>

      <div className="st-card-wrapper">
        <form onSubmit={handleSubmit} className="st-card">
          <div className="st-card-header st-header-green">
            <h2 className="st-card-title">Change Password</h2>
          </div>

          <div className="st-card-body">
            <div className="st-form-group">
              <input
                type="password"
                className="st-input"
                placeholder="Old Password"
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
              />
            </div>

            <div className="st-form-group">
              <input
                type="password"
                className="st-input"
                placeholder="New Password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
            </div>

            <div className="st-form-group">
              <input
                type="password"
                className="st-input"
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>

            <div className="st-actions st-actions-right">
              <button type="submit" className="st-submit-btn st-submit-green">
                Submit
              </button>
            </div>
          </div>
        </form>
      </div>
    </>
  )
}

// ============================================
// ✅ CONTACT US PAGE
// ============================================
function ContactUs() {
  const [whatsappNumber, setWhatsappNumber] = useState('9079386716')

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!whatsappNumber) {
      alert('Please enter WhatsApp number')
      return
    }
    alert('✅ Contact details saved!')
  }

  return (
    <>
      <div className="st-breadcrumb">
        <HomeIcon size={14} />
        <span>Home</span>
        <span className="st-breadcrumb-sep">/</span>
        <span>Contact Details</span>
      </div>

      {/* ✅ Page Title with Icon */}
      <div className="st-page-title-wrapper">
        <Phone size={26} className="st-page-title-icon" />
        <h1 className="st-page-title">Contact Us</h1>
      </div>

      <div className="st-card-wrapper">
        <form onSubmit={handleSubmit} className="st-card">
          <div className="st-card-header st-header-green">
            <h2 className="st-card-title">Contact Details</h2>
          </div>

          <div className="st-card-body">
            <div className="st-form-group">
              <label className="st-label">WhatsApp Number</label>
              <input
                type="text"
                className="st-input"
                placeholder="Enter WhatsApp number"
                value={whatsappNumber}
                onChange={(e) => setWhatsappNumber(e.target.value.replace(/\D/g, ''))}
              />
            </div>

            <div className="st-actions st-actions-left">
              <button type="submit" className="st-submit-btn st-submit-blue">
                Submit
              </button>
            </div>
          </div>
        </form>
      </div>
    </>
  )
}

// ============================================
// ✅ HOW TO PLAY PAGE
// ============================================
function HowToPlay() {
  const initialContent = `Download app from playstore. Fill necessary detail and click on register. Otp will get on your mobile no. You will approve by by admin in 2min. You allow to all services.<br/>here is recommended video <a href="https://youtu.be/Mp8QOc_9Z88" target="_blank" rel="noopener noreferrer">https://youtu.be/Mp8QOc_9Z88</a>`

  const editorRef = useRef(null)

  useEffect(() => {
    if (editorRef.current) {
      editorRef.current.innerHTML = initialContent
    }
  }, [])

  const execCommand = (command, value = null) => {
    document.execCommand(command, false, value)
    editorRef.current?.focus()
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const html = editorRef.current?.innerHTML || ''
    alert('✅ How To Play content saved!')
    console.log('Content:', html)
  }

  return (
    <>
      <div className="st-breadcrumb">
        <HomeIcon size={14} />
        <span>Home</span>
        <span className="st-breadcrumb-sep">/</span>
        <span>How To Play</span>
      </div>

      {/* ✅ Page Title with Icon */}
      <div className="st-page-title-wrapper">
        <PlayCircle size={26} className="st-page-title-icon" />
        <h1 className="st-page-title">How To Play</h1>
      </div>

      <div className="st-card-wrapper st-card-wrapper-wide">
        <form onSubmit={handleSubmit} className="st-card">
          <div className="st-card-header st-header-green">
            <h2 className="st-card-title">How To Play</h2>
          </div>

          <div className="st-card-body">
            <div className="st-form-group">
              <label className="st-label">How To Play Content</label>

              <div className="st-editor-wrapper">
                <div className="st-editor-toolbar">
                  <button type="button" className="st-toolbar-btn" onClick={() => execCommand('bold')} title="Bold">
                    <strong>B</strong>
                  </button>
                  <button type="button" className="st-toolbar-btn" onClick={() => execCommand('underline')} title="Underline">
                    <u>U</u>
                  </button>
                  <button type="button" className="st-toolbar-btn" onClick={() => execCommand('italic')} title="Italic">
                    <em>I</em>
                  </button>
                  <button type="button" className="st-toolbar-btn" onClick={() => execCommand('strikeThrough')} title="Strikethrough">
                    <s>S</s>
                  </button>
                  <span className="st-toolbar-divider"></span>
                  <button type="button" className="st-toolbar-btn" onClick={() => execCommand('justifyLeft')} title="Align Left">⯇</button>
                  <button type="button" className="st-toolbar-btn" onClick={() => execCommand('justifyCenter')} title="Align Center">≡</button>
                  <button type="button" className="st-toolbar-btn" onClick={() => execCommand('justifyRight')} title="Align Right">⯈</button>
                  <span className="st-toolbar-divider"></span>
                  <button type="button" className="st-toolbar-btn" onClick={() => execCommand('insertUnorderedList')} title="Bullet List">•</button>
                  <button type="button" className="st-toolbar-btn" onClick={() => execCommand('insertOrderedList')} title="Number List">1.</button>
                  <span className="st-toolbar-divider"></span>
                  <button
                    type="button"
                    className="st-toolbar-btn"
                    onClick={() => {
                      const url = prompt('Enter URL:')
                      if (url) execCommand('createLink', url)
                    }}
                    title="Insert Link"
                  >
                    🔗
                  </button>
                </div>

                <div
                  ref={editorRef}
                  className="st-editor-content"
                  contentEditable
                  suppressContentEditableWarning
                />
              </div>
            </div>

            <div className="st-actions st-actions-left">
              <button type="submit" className="st-submit-btn st-submit-blue">
                Submit
              </button>
            </div>
          </div>
        </form>
      </div>
    </>
  )
}

// ============================================
// ✅ MAIN SETTINGS PAGE — Auto-routes by URL
// ============================================
export default function Settings({ dark }) {
  const location = useLocation()

  const renderContent = () => {
    if (location.pathname.includes('change-password')) return <ChangePassword />
    if (location.pathname.includes('contact-us')) return <ContactUs />
    if (location.pathname.includes('how-to-play')) return <HowToPlay />
    return <ChangePassword />
  }

  return (
    <div className={`st-page ${dark ? 'dark' : 'light'}`}>
      {renderContent()}
    </div>
  )
}