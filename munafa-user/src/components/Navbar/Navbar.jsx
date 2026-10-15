import React, { useEffect, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import {
  Home, Trophy, BarChart3, Sparkles, User, Wallet,
  Menu, X, LogOut
} from 'lucide-react'
import ThemeToggle from '../ThemeToggle/ThemeToggle'
import { useAuth, apiCall } from '../../context/AuthContext'
import './Navbar.css'
import munahalogo from '../../../public/munafalogo.png'

const navItems = [
  { icon: Home, label: 'Home', path: '/' },
  { icon: Trophy, label: 'Results', path: '/results' },
  { icon: BarChart3, label: 'Rate Chart', path: '/rate-chart' },
  { icon: Sparkles, label: 'Privacy Policy', path: '/dp-boss' },
  { icon: User, label: 'Profile', path: '/profile' },
]

export default function Navbar() {
  const location = useLocation()
  const { pathname } = location
  const navigate = useNavigate()
  const { user, logout } = useAuth()  // ✅ logout from AuthContext
  const [balance, setBalance] = useState(null)
  const [menuOpen, setMenuOpen] = useState(false)

  // Route change hone par menu close
  useEffect(() => {
    setMenuOpen(false)
  }, [pathname])

  // Menu open hone par body scroll lock
  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [menuOpen])

  useEffect(() => {
    if (!user) { setBalance(null); return }
    let active = true
    ;(async () => {
      try {
        const res = await apiCall('/auth/me')
        const u = res?.user || res
        const b = u?.wallet ?? u?.walletBalance ?? u?.balance
        if (active && b != null) { setBalance(Number(b)); return }
      } catch {
        /* fallback */
      }
      const b = user.wallet ?? user.walletBalance ?? user.balance
      if (active) setBalance(b != null ? Number(b) : 0)
    })()
    return () => { active = false }
  }, [user])

  // ✅ Logout handler
  const handleLogout = () => {
    setMenuOpen(false)
    if (typeof logout === 'function') {
      logout()
    } else {
      // Fallback: clear localStorage + navigate
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      navigate('/User/login')
    }
  }

  return (
    <>
      <nav className="navbar">
        <div className="navbar-container">
          {/* Left — Logo (Clickable → Home) */}
          <Link to="/" className="navbar-brand" aria-label="Go to Home">
            <span className="brand-text">
              <img src={munahalogo} alt="Munafa Market Logo" />
            </span>
          </Link>

          {/* Right — Wallet + Hamburger */}
          <div className="navbar-right">
            <Link to="/wallet" className="navbar-wallet" title="Wallet">
              <Wallet size={18} strokeWidth={2.2} />
              <span className="navbar-wallet-balance">
                {balance == null ? '--' : balance.toLocaleString('en-IN')}
              </span>
            </Link>

            <button
              className="navbar-hamburger"
              onClick={() => setMenuOpen(true)}
              aria-label="Open menu"
            >
              <Menu size={24} strokeWidth={2.2} />
            </button>
          </div>
        </div>
      </nav>

      {/* Drawer Menu */}
      {menuOpen && (
        <>
          <div
            className="navbar-overlay"
            onClick={() => setMenuOpen(false)}
          />
          <aside className="navbar-drawer">
            {/* Drawer Header */}
            <div className="navbar-drawer-header">
              <span className="navbar-drawer-title">Menu</span>
              <button
                className="navbar-drawer-close"
                onClick={() => setMenuOpen(false)}
                aria-label="Close menu"
              >
                <X size={24} strokeWidth={2.2} />
              </button>
            </div>

            {/* Theme Toggle Section */}
            <div className="navbar-drawer-theme">
              <span className="navbar-drawer-theme-label">Theme</span>
              <ThemeToggle />
            </div>

            {/* Drawer Links */}
            <ul className="navbar-drawer-links">
              {navItems.map(({ icon: Icon, label, path }) => {
                const active = pathname === path
                return (
                  <li key={path}>
                    <Link
                      to={path}
                      className={active ? 'active' : ''}
                      onClick={() => setMenuOpen(false)}
                    >
                      <Icon size={20} strokeWidth={active ? 2.5 : 2} />
                      <span>{label}</span>
                    </Link>
                  </li>
                )
              })}
            </ul>

            {/* ✅ Drawer Footer — Logout */}
            <div className="navbar-drawer-footer">
              <button
                type="button"
                className="navbar-drawer-logout"
                onClick={handleLogout}
              >
                <LogOut size={20} strokeWidth={2.2} />
                <span>Logout</span>
              </button>
            </div>
          </aside>
        </>
      )}
    </>
  )
}