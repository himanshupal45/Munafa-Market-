import React, { createContext, useContext, useState } from 'react'

const AuthContext = createContext(null)

// ─── API BASE URL ─────────────────────────────────────────────
// npm run dev  -> hamesha LOCAL backend (.env ki VITE_API_URL ignore hoti hai)
// npm run build -> VITE_API_URL, warna live URL
const API_BASE = import.meta.env.DEV
  ? import.meta.env.VITE_DEV_API_URL || 'http://localhost:5000/api'
  : import.meta.env.VITE_API_URL || 'https://astroconnect.co.in/api'

if (import.meta.env.DEV) console.log('API_BASE =', API_BASE)

// Token localStorage mein save hoga
let memoryToken = localStorage.getItem('token') || null

export const setToken = (t) => {
  memoryToken = t
  localStorage.setItem('token', t)
}

export const clearToken = () => {
  memoryToken = null
  localStorage.removeItem('token')
  localStorage.removeItem('user')
}

export const getToken = () => memoryToken

export const apiCall = async (endpoint, method = 'GET', body = null, isFormData = false) => {
  const headers = {}
  if (memoryToken) headers['Authorization'] = `Bearer ${memoryToken}`
  if (!isFormData) headers['Content-Type'] = 'application/json'

  const config = { method, headers }
  if (body) config.body = isFormData ? body : JSON.stringify(body)

  let res
  try {
    res = await fetch(`${API_BASE}${endpoint}`, config)
  } catch {
    // Server band ho ya CORS block ho
    throw new Error('Server se connect nahi ho pa raha. Backend chal raha hai?')
  }

  // Agar server JSON ki jagah HTML bheje (jaise proxy ka 404 page), crash na ho
  let data = null
  try {
    data = await res.json()
  } catch {
    data = null
  }

  if (!res.ok) throw new Error((data && data.message) || `Error ${res.status}`)
  return data
}

export function AuthProvider({ children }) {
  // User bhi localStorage se load karo
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem('user')
      return saved ? JSON.parse(saved) : null
    } catch {
      return null
    }
  })
  const [loading, setLoading] = useState(false)

  const login = async (mobile, password) => {
    setLoading(true)
    try {
      const data = await apiCall('/auth/login', 'POST', { mobile, password })
      setToken(data.token)
      setUser(data.user)
      localStorage.setItem('user', JSON.stringify(data.user))
      return { success: true }
    } catch (err) {
      return { success: false, message: err.message }
    } finally {
      setLoading(false)
    }
  }

  // ✅ email add hua
  const register = async (name, mobile, password, email) => {
    setLoading(true)
    try {
      const data = await apiCall('/auth/register', 'POST', { name, mobile, password, email })
      setToken(data.token)
      setUser(data.user)
      localStorage.setItem('user', JSON.stringify(data.user))
      return { success: true }
    } catch (err) {
      return { success: false, message: err.message }
    } finally {
      setLoading(false)
    }
  }

  const logout = () => {
    clearToken()
    setUser(null)
  }

  const isAuthenticated = () => !!user && !!memoryToken

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}