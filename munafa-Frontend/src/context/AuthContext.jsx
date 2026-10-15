import React, { createContext, useContext, useState, useEffect, useCallback } from 'react'

const AuthContext = createContext(null)

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

const TOKEN_KEY = 'auth_token'
const USER_KEY = 'auth_user'   

export const getToken = () => localStorage.getItem(TOKEN_KEY)
export const setToken = (token) => {
  if (token) {
    localStorage.setItem(TOKEN_KEY, token)
  } else {  
    localStorage.removeItem(TOKEN_KEY)
  }
}
export const clearToken = () => {
  localStorage.removeItem(TOKEN_KEY)
  localStorage.removeItem(USER_KEY)
}

export const apiCall = async (endpoint, method = 'GET', body = null, isFormData = false) => {
  const headers = {}
  const token = getToken()
  if (token) headers['Authorization'] = `Bearer ${token}`
  if (!isFormData) headers['Content-Type'] = 'application/json'

  const config = { method, headers }
  if (body) config.body = isFormData ? body : JSON.stringify(body)

  const res = await fetch(`${API_BASE}${endpoint}`, config)
  const data = await res.json()
  if (!res.ok) throw new Error(data.message || 'Kuch galat hua')
  return data
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  // ✅ Global splash state — PublicRoute se upar hai isliye redirect affect nahi karega
  const [showLoginSplash, setShowLoginSplash] = useState(false)

  useEffect(() => {
    const initAuth = async () => {
      const token = getToken()
      const savedUser = localStorage.getItem(USER_KEY)
      if (token && savedUser) {
        try {
          setUser(JSON.parse(savedUser))
          await fetchMe()
        } catch (err) {
          console.error('Auth init error:', err)
          clearToken()
          setUser(null)
        }
      }
      setLoading(false)
    }
    initAuth()
  }, [])

  const login = async (mobile, password) => {
    setError('')
    try {
      const data = await apiCall('/auth/login', 'POST', { mobile, password })
      setToken(data.token)
      localStorage.setItem(USER_KEY, JSON.stringify(data.user))
      // ✅ setUser yahan nahi — baad mein navigate ke baad karenge
      return {
        success: true,
        user: data.user,
        token: data.token,
        _rawData: data
      }
    } catch (err) {
      console.error('🔴 Login Error:', err)
      setError(err.message)
      return {
        success: false,
        message: err.message || 'Login failed'
      }
    }
  }

  // ✅ Login ke baad user set karo — splash ke baad call hoga
  const finalizeLogin = useCallback((userData) => {
    setUser(userData)
  }, [])

  const logout = () => {
    clearToken()
    setUser(null)
  }

  const fetchMe = async () => {
    const token = getToken()
    if (!token) { setUser(null); return }
    try {
      const data = await apiCall('/auth/me')
      setUser(data.user)
      localStorage.setItem(USER_KEY, JSON.stringify(data.user))
    } catch (err) {
      console.error('Fetch me error:', err)
      clearToken()
      setUser(null)
    }
  }

  const isAuthenticated = () => !!user && !!getToken()

  return (
    <AuthContext.Provider value={{
      user,
      login,
      finalizeLogin,
      logout,
      loading,
      error,
      setError,
      isAuthenticated,
      fetchMe,
      showLoginSplash,
      setShowLoginSplash
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
