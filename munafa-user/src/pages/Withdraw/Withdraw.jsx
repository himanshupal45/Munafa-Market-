import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ChevronLeft, Wallet, ArrowDownToLine, Check, QrCode, Upload, X } from 'lucide-react'
import { useWalletBalance } from '../../hooks/useWalletBalance'
import { apiCall } from '../../context/AuthContext'
import './Withdraw.css'

// 👇 Minimum withdraw amount
const MIN_WITHDRAW = 100

const WITHDRAW_METHODS = [
  {
    id: 'phonepe',
    name: 'PhonePe',
    logo: (
      <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <rect width="24" height="24" rx="6" fill="#5f259f" />
        <path
          d="M10.206 9.941h2.949v4.692c-.402.201-.938.268-1.34.268-1.072 0-1.609-.536-1.609-1.743V9.941zm13.47 4.816c-1.523 6.449-7.985 10.442-14.433 8.919C2.794 22.154-1.199 15.691.324 9.243 1.847 2.794 8.309-1.199 14.757.324c6.449 1.523 10.442 7.985 8.919 14.433zm-6.231-5.888a.887.887 0 0 0-.871-.871h-1.609l-3.686-4.222c-.335-.402-.871-.536-1.407-.402l-1.274.401c-.201.067-.268.335-.134.469l4.021 3.82H6.386c-.201 0-.335.134-.335.335v.67c0 .469.402.871.871.871h.938v3.217c0 2.413 1.273 3.82 3.418 3.82.67 0 1.206-.067 1.877-.335v2.145c0 .603.469 1.072 1.072 1.072h.938a.432.432 0 0 0 .402-.402V9.874h1.542c.201 0 .335-.134.335-.335v-.67z"
          fill="#ffffff"
        />
      </svg>
    ),
  },
  {
    id: 'gpay',
    name: 'Google Pay',
    logo: (
      <svg viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
        <rect width="48" height="48" rx="12" fill="#fff" stroke="#e5e5e5" strokeWidth="1" />
        <path d="M35.5 24.5c0-.8-.1-1.6-.2-2.3H24v4.4h6.5c-.3 1.5-1.1 2.7-2.4 3.5v2.9h3.8c2.3-2.1 3.6-5.2 3.6-8.5z" fill="#4285F4" />
        <path d="M24 36c3.2 0 5.9-1.1 7.9-2.9l-3.8-2.9c-1.1.7-2.4 1.1-4.1 1.1-3.2 0-5.9-2.1-6.9-5h-3.9v3c2 3.9 6 6.7 10.8 6.7z" fill="#34A853" />
        <path d="M17.1 26.3c-.5-1.4-.5-2.9 0-4.3v-3h-3.9c-1.6 3.1-1.6 6.9 0 10l3.9-2.7z" fill="#FBBC04" />
        <path d="M24 15.7c1.7 0 3.3.6 4.5 1.8l3.4-3.4C29.9 12.1 27.2 11 24 11c-4.8 0-8.8 2.8-10.8 6.7l3.9 3c1-2.9 3.7-5 6.9-5z" fill="#EA4335" />
      </svg>
    ),
  },
  {
    id: 'paytm',
    name: 'Paytm',
    logo: (
      <svg viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
        <rect width="48" height="48" rx="12" fill="#ffffff" stroke="#e5e5e5" strokeWidth="1" />
        <rect x="8" y="18" width="14" height="5" rx="1" fill="#00baf2" />
        <rect x="8" y="25" width="10" height="5" rx="1" fill="#20336b" />
        <text x="24" y="23" fontSize="11" fontWeight="800" fill="#00baf2" fontFamily="Arial, Helvetica, sans-serif">pay</text>
        <text x="24" y="33" fontSize="11" fontWeight="800" fill="#20336b" fontFamily="Arial, Helvetica, sans-serif">tm</text>
      </svg>
    ),
  },
  {
    id: 'qr',
    name: 'QR Code (Any UPI App)',
    logo: (
      <div className="wd-method-logo-qr">
        <QrCode size={26} strokeWidth={2.2} />
      </div>
    ),
  },
]

const Withdraw = () => {
  const navigate = useNavigate()
  const { balance, refresh } = useWalletBalance()

  const [amount, setAmount] = useState('')
  const [method, setMethod] = useState(null)
  const [accountDetails, setAccountDetails] = useState('')
  const [qrImage, setQrImage] = useState(null)
  const [qrFile, setQrFile] = useState(null)
  const [submitting, setSubmitting] = useState(false)

  const handleAmountChange = (e) => {
    setAmount(e.target.value.replace(/\D/g, ''))
  }

  const handleQrUpload = (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (!file.type.startsWith('image/')) {
      alert('Sirf image file upload karein')
      return
    }
    if (file.size > 5 * 1024 * 1024) {
      alert('Image 5MB se choti honi chahiye')
      return
    }
    setQrFile(file)
    const reader = new FileReader()
    reader.onload = () => setQrImage(reader.result)
    reader.readAsDataURL(file)
  }

  const removeQr = () => {
    setQrImage(null)
    setQrFile(null)
  }

  const handleSubmit = async () => {
    if (submitting) return
    if (!amount || Number(amount) <= 0) return alert('Pehle amount daalein / पहले राशि दर्ज करें')
    if (Number(amount) < MIN_WITHDRAW)
      return alert(`Minimum withdrawal ₹${MIN_WITHDRAW} hai / न्यूनतम निकासी ₹${MIN_WITHDRAW} है`)
    if (Number(amount) > Number(balance)) return alert('Insufficient balance / अपर्याप्त बैलेंस')
    if (!method) return alert('Withdraw method select karein / निकासी विधि चुनें')
    if (method === 'qr' && !qrFile) return alert('Apna QR code upload karein / अपना QR कोड अपलोड करें')
    if (method !== 'qr' && !accountDetails.trim())
      return alert('UPI ID / Mobile number daalein / UPI आईडी / मोबाइल नंबर दर्ज करें')

    setSubmitting(true)
    try {
      const fd = new FormData()
      fd.append('amount', amount)
      fd.append('method', method)
      if (method === 'qr') fd.append('qrImage', qrFile)
      else fd.append('accountDetails', accountDetails.trim())

      const res = await apiCall('/wallet/withdrawals', 'POST', fd, true)

      if (res?.success) {
        alert('✅ Withdraw request bhej di gayi. 24 ghante me process hogi. / ✅ निकासी अनुरोध भेज दिया गया। 24 घंटे में प्रोसेस होगा।')
        setAmount('')
        setMethod(null)
        setAccountDetails('')
        setQrImage(null)
        setQrFile(null)
        refresh?.()
        navigate(-1)
      } else {
        alert(res?.message || 'Request fail ho gayi / अनुरोध विफल रहा')
      }
    } catch (err) {
      alert(err.message || 'Server error / सर्वर त्रुटि')
    } finally {
      setSubmitting(false)
    }
  }

  const getLabel = () => {
    if (method === 'phonepe') return 'PhonePe Number / फ़ोनपे नंबर'
    if (method === 'gpay') return 'Google Pay UPI ID / गूगल पे UPI आईडी'
    if (method === 'paytm') return 'Paytm Number / पेटीएम नंबर'
    return 'UPI ID / Mobile Number / UPI आईडी / मोबाइल नंबर'
  }

  const getPlaceholder = () => {
    if (method === 'phonepe') return 'Registered PhonePe mobile number'
    if (method === 'gpay') return 'yourname@okaxis / yourname@okhdfcbank'
    if (method === 'paytm') return 'Registered Paytm mobile number'
    return 'yourname@upi'
  }

  const isSubmitEnabled = () => {
    if (!amount || Number(amount) <= 0) return false
    if (Number(amount) < MIN_WITHDRAW) return false   // 👈 NEW
    if (Number(amount) > Number(balance)) return false
    if (!method) return false
    if (method === 'qr') return !!qrFile
    return !!accountDetails.trim()
  }

  return (
    <div className="wd-page">
      <div className="wd-header">
        <button className="wd-back-btn" onClick={() => navigate(-1)} aria-label="Back">
          <ChevronLeft size={28} strokeWidth={2.2} />
        </button>
        <h1 className="wd-title">Withdraw / पैसे निकालें</h1>
        <div className="wd-header-spacer" />
      </div>

      <div className="wd-content">
        <div className="wd-icon-wrap">
          <ArrowDownToLine size={48} strokeWidth={2} className="wd-icon" />
        </div>
        <h2 className="wd-heading">Withdraw Funds / पैसे निकालें</h2>
        <p className="wd-text">
          Amount aur payment method select karein. Request 24 hours mein process hogi.
          <br />
          राशि और भुगतान विधि चुनें। अनुरोध 24 घंटे में प्रोसेस होगा।
        </p>

        <div className="wd-info-card">
          <div className="wd-info-row">
            <span className="wd-info-label">Available Balance / उपलब्ध बैलेंस</span>
            <span className="wd-info-value">
              <Wallet size={16} /> ₹{Number(balance).toLocaleString('en-IN')}
            </span>
          </div>
        </div>

        <div className="wd-input-wrap">
          <label className="wd-input-label">Enter Amount / राशि दर्ज करें</label>
          <div className="wd-input-box">
            <span className="wd-input-prefix">₹</span>
            <input
              type="text"
              className="wd-input"
              placeholder="0"
              value={amount}
              onChange={handleAmountChange}
              inputMode="numeric"
            />
          </div>
          {/* 👇 Minimum hint */}
          <p className="wd-min-hint">
            Minimum withdrawal: ₹{MIN_WITHDRAW} / न्यूनतम निकासी: ₹{MIN_WITHDRAW}
          </p>
        </div>

        <div className="wd-method-wrap">
          <span className="wd-method-label">Select Withdraw Method / पैसे निकालने का तरीका चुनें</span>
          <div className="wd-method-list">
            {WITHDRAW_METHODS.map((m) => (
              <button
                key={m.id}
                type="button"
                className={`wd-method-btn ${method === m.id ? 'wd-method-btn-active' : ''}`}
                onClick={() => setMethod(m.id)}
              >
                <span className="wd-method-logo">{m.logo}</span>
                <span className="wd-method-name">{m.name}</span>
                <span className={`wd-method-radio ${method === m.id ? 'wd-method-radio-active' : ''}`}>
                  {method === m.id && <Check size={12} strokeWidth={3} />}
                </span>
              </button>
            ))}
          </div>
        </div>

        {method && method !== 'qr' && (
          <div className="wd-input-wrap">
            <label className="wd-input-label">{getLabel()}</label>
            <div className="wd-input-box">
              <input
                type="text"
                className="wd-input wd-input-full"
                placeholder={getPlaceholder()}
                value={accountDetails}
                onChange={(e) => setAccountDetails(e.target.value)}
              />
            </div>
          </div>
        )}

        {method === 'qr' && (
          <div className="wd-input-wrap">
            <label className="wd-input-label">Apna QR Code Upload Karein / अपना QR कोड अपलोड करें</label>

            {!qrImage ? (
              <label className="wd-qr-upload">
                <input type="file" accept="image/*" onChange={handleQrUpload} className="wd-qr-file-input" />
                <Upload size={28} strokeWidth={2} className="wd-qr-upload-icon" />
                <span className="wd-qr-upload-text">QR Code image select karein / QR कोड इमेज चुनें</span>
                <span className="wd-qr-upload-hint">PNG, JPG (Max 5MB)</span>
              </label>
            ) : (
              <div className="wd-qr-preview">
                <img src={qrImage} alt="QR Code" className="wd-qr-img" />
                <button type="button" className="wd-qr-remove" onClick={removeQr} aria-label="Remove QR">
                  <X size={16} strokeWidth={2.5} />
                </button>
                <label className="wd-qr-change">
                  <input type="file" accept="image/*" onChange={handleQrUpload} className="wd-qr-file-input" />
                  Change QR / QR बदलें
                </label>
              </div>
            )}

            <p className="wd-qr-note">
              💡 PhonePe / GPay / Paytm kisi bhi UPI app ka QR upload kar sakte ho
              <br />
              किसी भी UPI ऐप का QR अपलोड कर सकते हैं
            </p>
          </div>
        )}

        <button
          className="wd-primary-btn"
          type="button"
          onClick={handleSubmit}
          disabled={!isSubmitEnabled() || submitting}
        >
          {submitting ? 'Sending... / भेजा जा रहा है...' : `Request Withdraw / निकासी अनुरोध ₹${amount || 0}`}
        </button>

        <p className="wd-note">
          ⚠️ Withdraw requests 24 hours mein process hoti hain.
          <br />
          ⚠️ निकासी अनुरोध 24 घंटे में प्रोसेस होते हैं।
        </p>
      </div>
    </div>
  )
}

export default Withdraw