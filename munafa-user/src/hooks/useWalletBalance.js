import { useState, useEffect, useCallback } from 'react'
import { useAuth, apiCall } from '../context/AuthContext'

export const useWalletBalance = () => {
  const { user } = useAuth()
  const cached = user?.wallet ?? 0
  const [balance, setBalance] = useState(null)

  const loadBalance = useCallback(async () => {
    try {
      const res = await apiCall('/wallet/balance')
      if (res?.success && res.balance != null) {
        setBalance(Number(res.balance))
      }
    } catch {
      /* fallback to cached */
    }
  }, [])

  useEffect(() => {
    loadBalance()
    const onFocus = () => loadBalance()
    const onVisible = () => {
      if (document.visibilityState === 'visible') loadBalance()
    }
    window.addEventListener('focus', onFocus)
    document.addEventListener('visibilitychange', onVisible)
    return () => {
      window.removeEventListener('focus', onFocus)
      document.removeEventListener('visibilitychange', onVisible)
    }
  }, [loadBalance])

  return { balance: balance ?? cached, refresh: loadBalance }
}