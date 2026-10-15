import React, { useState, useEffect, useCallback } from 'react'
import { useNavigate, createSearchParams } from 'react-router-dom'
import {
  ArrowLeft,
  Send,
  PlusCircle,
  List,
  HandCoins,
  CreditCard,
  Smartphone,
  ArrowLeftRight,
  Landmark,
} from 'lucide-react'
import { useAuth, apiCall } from '../../context/AuthContext'
import './Wallet.css'

const actions = [
  { id: 'transfer', label: 'Transfer Points', icon: Send, path: '/wallet/transfer' },
  { id: 'add-funds', label: 'Add Funds', icon: PlusCircle, path: '/add-points' },
  { id: 'history', label: 'Wallet History', icon: List, path: '/wallet/history' },
  { id: 'withdraw', label: 'Withdraw Points', icon: HandCoins, path: '/withdraw' },
  { id: 'paytm', label: 'Paytm', icon: CreditCard, path: '/withdraw', params: { method: 'paytm' } },
  { id: 'phonepe', label: 'PhonePe', icon: Smartphone, path: '/withdraw', params: { method: 'phonepe' } },
  { id: 'gpay', label: 'Google Pay', icon: ArrowLeftRight, path: '/withdraw', params: { method: 'gpay' } },
  { id: 'bank', label: 'Bank', icon: Landmark, path: '/withdraw', params: { method: 'bank' } },
]

const Wallet = () => {
  const navigate = useNavigate()
  const { user } = useAuth()

  // Login ke waqt ka (purana ho sakta hai) — sirf pehle dikhane ke liye
  const cached = user?.wallet ?? user?.walletBalance ?? user?.balance ?? null

  // ✅ Asli balance server (database) se
  const [balance, setBalance] = useState(null)

  const loadBalance = useCallback(async () => {
    try {
      const res = await apiCall('/ledger/me')
      if (res?.success && res.balance != null) setBalance(Number(res.balance))
    } catch {
      /* fail ho to cached balance dikhta rahega */
    }
  }, [])

  // Page khulte hi, aur jab bhi user is tab/page par wapas aaye
  useEffect(() => {
    loadBalance()
    const onFocus = () => loadBalance()
    const onVisible = () => { if (document.visibilityState === 'visible') loadBalance() }
    window.addEventListener('focus', onFocus)
    document.addEventListener('visibilitychange', onVisible)
    return () => {
      window.removeEventListener('focus', onFocus)
      document.removeEventListener('visibilitychange', onVisible)
    }
  }, [loadBalance])

  const shown = balance ?? cached ?? 0

  const handleNavigate = (action) => {
    if (action.params) {
      navigate({
        pathname: action.path,
        search: createSearchParams(action.params).toString(),
      })
    } else {
      navigate(action.path)
    }
  }

  return (
    <div className="w-page">
      {/* Header */}
      <div className="w-header">
        <button className="w-back-btn" onClick={() => navigate(-1)} aria-label="Back">
          <ArrowLeft size={24} strokeWidth={2.5} />
        </button>
        <h1 className="w-header-title">Wallet</h1>
        <div className="w-header-spacer" />
      </div>

      {/* Hero */}
      <div className="w-hero">
        <div className="w-hero-icon-wrap">
          <span className="w-hero-emoji">💼</span>
        </div>
        <h2 className="w-hero-title">Wallet</h2>
      </div>

      {/* Panel */}
      <div className="w-panel">
        {/* Balance */}
        <div className="w-balance-block">
          <span className="w-balance-value">{Number(shown).toLocaleString('en-IN')}</span>
          <span className="w-balance-label">Available Points</span>
        </div>

        {/* Grid */}
        <div className="w-grid">
          {actions.map((action) => {
            const Icon = action.icon
            return (
              <button
                key={action.id}
                type="button"
                className="w-grid-item"
                onClick={() => handleNavigate(action)}
              >
                <span className="w-grid-icon">
                  <Icon size={44} strokeWidth={1.6} />
                </span>
                <span className="w-grid-label">{action.label}</span>
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default Wallet