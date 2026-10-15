import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  ChevronLeft,
  Wallet,
  Plus,
  Check,
  Copy,
  QrCode,
  X,
  ShieldCheck,
  Loader,
} from 'lucide-react'
import { QRCodeSVG } from 'qrcode.react'
import { useWalletBalance } from '../../hooks/useWalletBalance'
import { apiCall } from '../../context/AuthContext'
import './AddPoints.css'

// Backend se QR image ka full URL banane ke liye
const FILE_ORIGIN = (
  import.meta.env.DEV
    ? import.meta.env.VITE_DEV_API_URL || 'http://localhost:5000/api'
    : import.meta.env.VITE_API_URL || 'https://astroconnect.co.in/api'
).replace(/\/api\/?$/, '')

// ✅ Minimum ₹1, maximum ₹10 lakh (apne hisaab se change karo)
const MIN_AMOUNT = 1
const MAX_AMOUNT = 1000000

// ============================================
// Payment Methods
// ============================================
const PAYMENT_METHODS = [
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
        <rect x="7" y="17" width="12" height="5" rx="1" fill="#00baf2" />
        <rect x="7" y="24" width="9" height="5" rx="1" fill="#20336b" />
        <text x="22" y="22" fontSize="11" fontWeight="800" fill="#00baf2" fontFamily="Arial, Helvetica, sans-serif">pay</text>
        <text x="22" y="32" fontSize="11" fontWeight="800" fill="#20336b" fontFamily="Arial, Helvetica, sans-serif">tm</text>
      </svg>
    ),
  },
  {
    id: 'upi-qr',
    name: 'UPI QR Code',
    logo: (
      <div className="ap-payment-logo-qr">
        <QrCode size={26} strokeWidth={2.2} />
      </div>
    ),
  },
]

const QUICK_AMOUNTS = [100, 200, 500, 1000, 2000, 5000]

const isMobileDevice = () =>
  /Android|iPhone|iPad|iPod/i.test(navigator.userAgent)

const AddPoints = () => {
  const navigate = useNavigate()
  const { balance, refresh } = useWalletBalance()

  const [amount, setAmount] = useState('')
  const [selected, setSelected] = useState(null)
  const [paymentMethod, setPaymentMethod] = useState(null)

  const [txnId, setTxnId] = useState('')
  const [showUpiModal, setShowUpiModal] = useState(false)
  const [utrNumber, setUtrNumber] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [copied, setCopied] = useState(false)

  // ✅ Admin ka QR — backend se fetch hoga
  const [adminQR, setAdminQR] = useState(null)
  const [qrLoading, setQrLoading] = useState(true)

  // ✅ Backend se active QR fetch karo
  useEffect(() => {
    const fetchActiveQR = async () => {
      setQrLoading(true)
      try {
        const res = await apiCall('/payment-qr/active')
        if (res?.success && res.qr) {
          setAdminQR({
            title: res.qr.title,
            upiId: res.qr.upiId,
            qrImage: res.qr.qrImage ? `${FILE_ORIGIN}${res.qr.qrImage}` : '',
          })
        }
      } catch (err) {
        console.warn('Active QR fetch fail:', err.message)
      } finally {
        setQrLoading(false)
      }
    }
    fetchActiveQR()
  }, [])

  useEffect(() => {
    if (amount && Number(amount) > 0) {
      setTxnId(`TXN${Date.now()}${Math.floor(Math.random() * 1000)}`)
    }
  }, [amount])

  const handleQuickSelect = (val) => {
    setSelected(val)
    setAmount(String(val))
  }

  const handleAmountChange = (e) => {
    setAmount(e.target.value.replace(/\D/g, ''))
    setSelected(null)
  }

  // ✅ UPI URL admin ke UPI ID se banega
  const buildUpiUrl = () => {
    const upiId = adminQR?.upiId || 'yourstore@okaxis'
    const name = adminQR?.title || 'Merchant'
    const params = new URLSearchParams({
      pa: upiId,
      pn: name,
      am: String(amount),
      cu: 'INR',
      tn: `AddPoints-${txnId}`,
      tr: txnId,
    })
    return `upi://pay?${params.toString()}`
  }

  const handleSubmit = () => {
    // ✅ Minimum ₹1, maximum MAX_AMOUNT
    if (!amount || Number(amount) < 1) {
      alert('Please enter valid amount (minimum ₹1) / कृपया वैध राशि दर्ज करें (न्यूनतम ₹1)')
      return
    }
    if (Number(amount) > MAX_AMOUNT) {
      alert(`Maximum ₹${MAX_AMOUNT.toLocaleString('en-IN')} allowed hai`)
      return
    }
    if (!paymentMethod) {
      alert('Please select payment method / कृपया भुगतान विधि चुनें')
      return
    }
    if (!adminQR) {
      alert('Abhi koi QR available nahi hai. Please try later.')
      return
    }
    setShowUpiModal(true)
  }

  const handleOpenUpiApp = () => {
    const url = buildUpiUrl()
    if (isMobileDevice()) {
      window.location.href = url
    } else {
      alert('This button works only on mobile. Please scan QR. / यह बटन सिर्फ मोबाइल पर काम करता है। QR स्कैन करें।')
    }
  }

  const handleCopyUpi = async () => {
    const upi = adminQR?.upiId || ''
    if (!upi) return
    try {
      await navigator.clipboard.writeText(upi)
      setCopied(true)
      setTimeout(() => setCopied(false), 1800)
    } catch {
      alert('Copy failed, please copy manually: ' + upi)
    }
  }

  const handleUtrChange = (e) => {
    const value = e.target.value.replace(/[^a-zA-Z0-9]/g, '').slice(0, 22)
    setUtrNumber(value)
  }

  const handleUtrSubmit = async () => {
    const utr = utrNumber.trim()

    if (utr.length < 8 || utr.length > 22) {
      alert('Please enter valid UTR (8-22 characters) / कृपया वैध UTR दर्ज करें (8-22 अक्षर)')
      return
    }

    setSubmitting(true)
    try {
      const res = await apiCall('/deposit-requests', 'POST', {
        amount: Number(amount),
        utr,
        method: 'upi',
        paymentApp: paymentMethod,
      })

      if (res?.success) {
        alert('✅ Deposit request submitted!\nWill be added to wallet after verification.\n\n✅ जमा अनुरोध सबमिट हो गया!\nसत्यापन के बाद वॉलेट में जुड़ेगा।')
        refresh()
        setShowUpiModal(false)
        setUtrNumber('')
        setAmount('')
        setPaymentMethod(null)
        setSelected(null)
        navigate('/wallet')
      } else {
        alert(res?.message || 'Submission failed / सबमिशन विफल रहा')
      }
    } catch (err) {
      console.error(err)
      alert(err.message || 'Network error — please retry / नेटवर्क त्रुटि — दोबारा प्रयास करें')
    } finally {
      setSubmitting(false)
    }
  }

  const upiUrl = amount && Number(amount) > 0 ? buildUpiUrl() : ''
  const mobile = isMobileDevice()

  return (
    <div className="ap-page">
      <div className="ap-header">
        <button className="ap-back-btn" onClick={() => navigate(-1)} aria-label="Back">
          <ChevronLeft size={28} strokeWidth={2.2} />
        </button>
        <h1 className="ap-title">Add Points / पॉइंट्स जोड़ें</h1>
        <div className="ap-header-spacer" />
      </div>

      <div className="ap-content">
        <div className="ap-icon-wrap">
          <Plus size={48} strokeWidth={2.5} className="ap-icon" />
        </div>
        <h2 className="ap-heading">Add Points to Wallet / वॉलेट में पॉइंट्स जोड़ें</h2>
        <p className="ap-text">
          Select amount, choose payment method, and add points. / राशि चुनें, भुगतान विधि चुनें, और पॉइंट्स जोड़ें।
        </p>

        <div className="ap-balance-card">
          <div className="ap-balance-row">
            <span className="ap-balance-label">Current Balance / वर्तमान बैलेंस</span>
            <span className="ap-balance-value">
              <Wallet size={16} /> ₹{Number(balance).toLocaleString('en-IN')}
            </span>
          </div>
        </div>

        <div className="ap-quick-wrap">
          <span className="ap-input-label">Quick Select / जल्दी चुनें</span>
          <div className="ap-quick-grid">
            {QUICK_AMOUNTS.map((val) => (
              <button
                key={val}
                type="button"
                className={`ap-quick-btn ${selected === val ? 'ap-quick-btn-active' : ''}`}
                onClick={() => handleQuickSelect(val)}
              >
                ₹{val}
              </button>
            ))}
          </div>
        </div>

        <div className="ap-input-wrap">
          <label className="ap-input-label">Enter Amount / राशि दर्ज करें</label>
          <div className="ap-input-box">
            <span className="ap-input-prefix">₹</span>
            <input
              type="text"
              className="ap-input"
              placeholder="0"
              value={amount}
              onChange={handleAmountChange}
              inputMode="numeric"
            />
          </div>
          {/* ✅ Minimum hint — ab ₹1 se start */}
          <p className="ap-min-hint">
            Minimum ₹{MIN_AMOUNT} / न्यूनतम ₹{MIN_AMOUNT}
          </p>
        </div>

        <div className="ap-payment-wrap">
          <span className="ap-payment-label">Select Payment Method / भुगतान विधि चुनें</span>
          <div className="ap-payment-list">
            {PAYMENT_METHODS.map((method) => (
              <button
                key={method.id}
                type="button"
                className={`ap-payment-btn ${
                  paymentMethod === method.id ? 'ap-payment-btn-active' : ''
                }`}
                onClick={() => setPaymentMethod(method.id)}
              >
                <span className="ap-payment-logo">{method.logo}</span>
                <span className="ap-payment-name">{method.name}</span>
                <span
                  className={`ap-payment-radio ${
                    paymentMethod === method.id ? 'ap-payment-radio-active' : ''
                  }`}
                >
                  {paymentMethod === method.id && <Check size={12} strokeWidth={3} />}
                </span>
              </button>
            ))}
          </div>
        </div>

        <button
          className="ap-primary-btn"
          type="button"
          onClick={handleSubmit}
          disabled={!amount || Number(amount) < 1 || !paymentMethod || qrLoading}
        >
          Proceed to Pay / भुगतान करें ₹{amount || 0}
        </button>

        <p className="ap-note">
          🔒 Payments are secure. No hidden charges. / भुगतान सुरक्षित हैं। कोई छिपा शुल्क नहीं।
        </p>
      </div>

      {showUpiModal && (
        <div className="ap-modal-overlay" onClick={() => setShowUpiModal(false)}>
          <div className="ap-modal" onClick={(e) => e.stopPropagation()}>
            <div className="ap-modal-header">
              <h3 className="ap-modal-title">Pay / भुगतान करें ₹{amount}</h3>
              <button
                className="ap-modal-close"
                onClick={() => setShowUpiModal(false)}
                aria-label="Close"
              >
                <X size={20} strokeWidth={2.4} />
              </button>
            </div>

            <div className="ap-modal-body">
              <div className="ap-qr-box">
                {qrLoading ? (
                  <Loader size={40} className="ap-spin" />
                ) : adminQR?.qrImage ? (
                  <img
                    src={adminQR.qrImage}
                    alt="Payment QR"
                    className="ap-qr-image"
                  />
                ) : upiUrl ? (
                  <QRCodeSVG value={upiUrl} size={180} level="M" includeMargin={false} />
                ) : (
                  <QrCode size={120} />
                )}
              </div>

              <p className="ap-modal-hint">
                Scan QR or open UPI app from button below / QR स्कैन करें या नीचे वाले बटन से UPI ऐप खोलें
              </p>

              {adminQR && (
                <div className="ap-upi-copy-row">
                  <span className="ap-upi-id">{adminQR.upiId}</span>
                  <button type="button" className="ap-copy-btn" onClick={handleCopyUpi}>
                    {copied ? <Check size={14} /> : <Copy size={14} />}
                    {copied ? 'Copied / कॉपी हुआ' : 'Copy / कॉपी'}
                  </button>
                </div>
              )}

              <button
                type="button"
                className={`ap-upi-open-btn ${!mobile ? 'ap-upi-open-btn-disabled' : ''}`}
                onClick={handleOpenUpiApp}
                disabled={!mobile}
              >
                {mobile
                  ? `Open UPI App & Pay / UPI ऐप खोलें और ₹${amount} भुगतान करें`
                  : 'Open on mobile or scan QR / मोबाइल पर खोलें या QR स्कैन करें'}
              </button>

              <div className="ap-modal-divider">
                <span>After Payment / भुगतान के बाद</span>
              </div>

              <label className="ap-input-label">
                Enter UTR / Transaction ID / UTR / ट्रांजैक्शन ID दर्ज करें
              </label>
              <div className="ap-input-box">
                <input
                  type="text"
                  className="ap-input ap-input-full"
                  placeholder="e.g. 402312345678 / जैसे 402312345678"
                  value={utrNumber}
                  onChange={handleUtrChange}
                  inputMode="text"
                  maxLength={22}
                />
              </div>

              <p className="ap-modal-hint-sm">
                You'll find "UTR / Ref No" in UPI app or bank SMS — paste it here. / UPI ऐप या बैंक SMS में "UTR / Ref No" मिलेगा — वही पेस्ट करें।
              </p>

              <button
                type="button"
                className="ap-primary-btn"
                onClick={handleUtrSubmit}
                disabled={submitting || utrNumber.length < 8}
              >
                {submitting ? 'Submitting... / सबमिट हो रहा है...' : 'Submit for Verification / सत्यापन के लिए सबमिट करें'}
              </button>

              <div className="ap-trust-row">
                <ShieldCheck size={14} />
                <span>Manual verification in 5–30 minutes / मैन्युअल सत्यापन 5–30 मिनट में</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default AddPoints