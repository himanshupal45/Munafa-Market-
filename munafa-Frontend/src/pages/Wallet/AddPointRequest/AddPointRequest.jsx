import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Home as HomeIcon,
  ArrowUpRight,
  Wallet,
  CreditCard,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Smartphone,
  Zap,
  ShieldCheck,
} from 'lucide-react'
import { paymentsAPI, myDepositsAPI } from '../../../services/api'
import './AddPointRequest.css'

const QUICK_AMOUNTS = [100, 250, 500, 1000, 2000, 5000]

const loadRazorpayScript = () =>
  new Promise((resolve) => {
    if (window.Razorpay) return resolve(true)
    const s = document.createElement('script')
    s.src = 'https://checkout.razorpay.com/v1/checkout.js'
    s.onload = () => resolve(true)
    s.onerror = () => resolve(false)
    document.body.appendChild(s)
  })

export default function AddPointRequest() {
  const navigate = useNavigate()

  const [mode, setMode] = useState('test') // 'test' | 'upi'
  const [amount, setAmount] = useState('')
  const [utr, setUtr] = useState('')

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(null)
  const [config, setConfig] = useState(null)

  const points = Number(amount) > 0 ? Math.floor(Number(amount)) : 0

  // ---------- Load payment config ----------
  useEffect(() => {
    paymentsAPI
      .config()
      .then((res) => { if (res?.success) setConfig(res) })
      .catch(() => {})
  }, [])

  const handleQuick = (val) => {
    setAmount(String(val))
    setError(null)
  }

  // ============ TEST GATEWAY PAY ============
  const handleTestPayment = async (e) => {
    e.preventDefault()
    setError(null)
    setSuccess(null)

    const amt = Number(amount)
    if (!Number.isFinite(amt) || amt < 10) {
      setError('Minimum ₹10 ka amount daalo')
      return
    }

    setLoading(true)
    try {
      // 1) Order banao
      const res = await paymentsAPI.createOrder({ amount: amt })
      if (!res?.success) throw new Error(res?.message || 'Order create nahi hua')

      // 2) TEST MODE — direct verify
      if (res.testMode) {
        const v = await paymentsAPI.verify({
          orderId: res.order.id,
          paymentId: `test_pay_${Date.now()}`,
          signature: 'test_mode',
          amount: amt,
        })
        if (!v?.success) throw new Error(v?.message || 'Payment verify nahi hui')
        setSuccess({ points: v.points, balance: v.balance, testMode: true })
        setAmount('')
        setLoading(false)
        return
      }

      // 3) REAL MODE — Razorpay checkout
      const ok = await loadRazorpayScript()
      if (!ok) throw new Error('Razorpay load nahi hua')

      const options = {
        key: res.key,
        amount: res.order.amount,
        currency: res.order.currency,
        name: 'Munafa',
        description: `Add ${res.points} points`,
        order_id: res.order.id,
        handler: async (response) => {
          try {
            const v = await paymentsAPI.verify({
              orderId: response.razorpay_order_id,
              paymentId: response.razorpay_payment_id,
              signature: response.razorpay_signature,
              amount: amt,
            })
            if (!v?.success) throw new Error(v?.message || 'Verify fail')
            setSuccess({ points: v.points, balance: v.balance, testMode: false })
            setAmount('')
          } catch (err) {
            setError(err.message || 'Verify fail')
          } finally {
            setLoading(false)
          }
        },
        modal: {
          ondismiss: () => {
            setLoading(false)
            setError('Payment cancel ho gayi')
          },
        },
        theme: { color: '#ff6b00' },
      }
      new window.Razorpay(options).open()
    } catch (err) {
      setError(err.message || 'Kuch galat ho gaya')
      setLoading(false)
    }
  }

  // ============ UPI MANUAL (UTR submit) ============
  const handleUpiSubmit = async (e) => {
    e.preventDefault()
    setError(null)
    setSuccess(null)

    const amt = Number(amount)
    const utrClean = utr.trim().toUpperCase()

    if (!Number.isFinite(amt) || amt < 100) {
      setError('Minimum ₹100 ka amount daalo')
      return
    }
    if (!/^[A-Z0-9]{12,22}$/.test(utrClean)) {
      setError('UTR / Transaction ID sahi daalo (12-22 akshar, A-Z 0-9)')
      return
    }

    setLoading(true)
    try {
      const res = await myDepositsAPI.create({ amount: amt, utr: utrClean })
      if (!res?.success) throw new Error(res?.message || 'Request nahi bhej paye')
      setSuccess({ pending: true, amount: amt, utr: utrClean })
      setAmount('')
      setUtr('')
    } catch (err) {
      setError(err.message || 'Kuch galat ho gaya')
    } finally {
      setLoading(false)
    }
  }

  // ============ SUCCESS SCREEN ============
  if (success) {
    return (
      <div className="wv-page">
        <div className="wv-breadcrumb">
          <HomeIcon size={14} />
          <span>Home</span>
          <span className="wv-breadcrumb-sep">/</span>
          <span>Add Points</span>
        </div>

        <div className="wv-card wv-success-card">
          <CheckCircle2 size={64} className="wv-success-icon" />
          <h2 className="wv-success-title">
            {success.pending ? 'Request Submitted!' : 'Payment Successful!'}
          </h2>

          {success.pending ? (
            <>
              <p className="wv-success-text">
                ₹<strong>{success.amount}</strong> ki deposit request bhej di gayi.
              </p>
              <p className="wv-success-balance">
                UTR: <strong>{success.utr}</strong>
              </p>
              <p className="wv-hint">
                Admin verify karke points add karega. Status{' '}
                <strong>Wallet History</strong> me dekh sakte ho.
              </p>
            </>
          ) : (
            <>
              <p className="wv-success-text">
                <strong>+{success.points.toLocaleString('en-IN')} points</strong>{' '}
                add ho gaye.
              </p>
              <p className="wv-success-balance">
                New Balance:{' '}
                <strong>{Number(success.balance).toLocaleString('en-IN')}</strong>
              </p>
              {success.testMode && (
                <p className="wv-test-badge">🧪 Test Mode Payment</p>
              )}
            </>
          )}

          <div className="wv-success-actions">
            <button
              className="wv-btn wv-btn-primary"
              onClick={() => navigate('/user/wallet/history')}
              type="button"
            >
              View Wallet History
            </button>
            <button
              className="wv-btn wv-btn-outline"
              onClick={() => setSuccess(null)}
              type="button"
            >
              Add More Points
            </button>
          </div>
        </div>
      </div>
    )
  }

  // ============ MAIN FORM ============
  return (
    <div className="wv-page">
      <div className="wv-breadcrumb">
        <HomeIcon size={14} />
        <span>Home</span>
        <span className="wv-breadcrumb-sep">/</span>
        <span>Add Points (User Wallet)</span>
      </div>

      <div className="wv-page-title-wrapper">
        <ArrowUpRight size={26} className="wv-page-title-icon" />
        <h1 className="wv-page-title">Add Points</h1>
      </div>

      {/* Mode Tabs */}
      <div className="wv-mode-tabs">
        <button
          type="button"
          className={`wv-mode-tab ${mode === 'test' ? 'active' : ''}`}
          onClick={() => { setMode('test'); setError(null) }}
        >
          <Zap size={16} />
          Instant Pay
        </button>
        <button
          type="button"
          className={`wv-mode-tab ${mode === 'upi' ? 'active' : ''}`}
          onClick={() => { setMode('upi'); setError(null) }}
        >
          <Smartphone size={16} />
          UPI Manual
        </button>
      </div>

      <div className="wv-card">
        {config?.testMode && mode === 'test' && (
          <div className="wv-alert wv-alert-info">
            <ShieldCheck size={16} />
            <span>🧪 Test Mode — direct payment success hoga (no real money)</span>
          </div>
        )}

        <form
          onSubmit={mode === 'test' ? handleTestPayment : handleUpiSubmit}
          className="wv-form"
        >
          <div className="wv-form-icon-wrap">
            <Wallet size={44} className="wv-form-icon" />
          </div>

          <label className="wv-label">Amount (₹)</label>
          <input
            type="number"
            className="wv-input"
            placeholder="500"
            value={amount}
            onChange={(e) => { setAmount(e.target.value); setError(null) }}
            min={mode === 'test' ? 10 : 100}
            max={50000}
            disabled={loading}
          />

          {points > 0 && (
            <div className="wv-preview">
              <CreditCard size={16} />
              <span>
                You'll get <strong>{points.toLocaleString('en-IN')} points</strong>
              </span>
            </div>
          )}

          <div className="wv-quick">
            {QUICK_AMOUNTS.map((q) => (
              <button
                key={q}
                type="button"
                className={`wv-quick-btn ${Number(amount) === q ? 'active' : ''}`}
                onClick={() => handleQuick(q)}
                disabled={loading}
              >
                ₹{q}
              </button>
            ))}
          </div>

          {mode === 'upi' && (
            <>
              <label className="wv-label">UTR / Transaction ID</label>
              <input
                type="text"
                className="wv-input"
                placeholder="12-22 akshar (A-Z 0-9)"
                value={utr}
                onChange={(e) => { setUtr(e.target.value); setError(null) }}
                disabled={loading}
                maxLength={22}
              />
              <p className="wv-hint">
                UPI app me payment karke UTR yahan daalo. Admin 5-10 min me approve karega.
              </p>
            </>
          )}

          {error && (
            <div className="wv-alert wv-alert-error">
              <AlertCircle size={16} />
              <span>{error}</span>
            </div>
          )}

          <button
            type="submit"
            className="wv-submit-btn"
            disabled={
              loading ||
              !amount ||
              Number(amount) < (mode === 'test' ? 10 : 100) ||
              (mode === 'upi' && !utr)
            }
          >
            {loading ? (
              <>
                <Loader2 size={18} className="wv-spin" /> Processing...
              </>
            ) : mode === 'test' ? (
              <>Pay ₹{amount || 0} & Add {points} Points</>
            ) : (
              <>Submit Deposit Request</>
            )}
          </button>

          <p className="wv-hint">
            🔒 Secure. {mode === 'test' ? 'Instant credit.' : 'Manual admin approval.'}
          </p>
        </form>
      </div>
    </div>
  )
}