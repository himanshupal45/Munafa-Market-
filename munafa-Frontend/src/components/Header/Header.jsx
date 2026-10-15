import React, { useState, useRef, useEffect } from 'react'
import { Menu, Sun, Moon, Search, User, LogOut, UserCircle } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import NotificationBell from '../Header/NotificationBell/NotificationBell'
import './Header.css'

export default function Header({ onMenuClick, dark, onToggleDark }) {
  const navigate = useNavigate()
  const { user, logout } = useAuth()
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const dropdownRef = useRef(null)

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleLogout = () => {
    logout()           // JWT memory clear — no localStorage
    navigate('/login')
  }

  return (
    <header className={`header ${dark ? 'header--dark' : 'header--light'}`}>
      <div className="header__left">
        <button className="header__menu-btn" onClick={onMenuClick}>
          <Menu size={20} />
        </button>
        <div className="header__search">
          <Search size={14} className="header__search-icon" />
          <input type="text" placeholder="Search..." className="header__search-input" />
        </div>
      </div>

      <div className="header__right">
        <button className="header__theme-btn" onClick={onToggleDark}>
          {dark ? <><Sun size={14} /> Light</> : <><Moon size={14} /> Dark</>}
        </button>

        <NotificationBell dark={dark} />

        <div className="header__avatar-wrapper" ref={dropdownRef}>
          <div className="header__avatar" onClick={() => setIsDropdownOpen(!isDropdownOpen)}>
            <User size={16} />
          </div>
          <div className="header__user-info" onClick={() => setIsDropdownOpen(!isDropdownOpen)}>
            <span className="header__user-name">{user?.name || 'Admin'}</span>
            <span className="header__user-role">{user?.role || 'Super Admin'}</span>
          </div>

          {isDropdownOpen && (
            <div className="header__dropdown">
              <div className="header__dropdown-header">
                <div className="header__dropdown-avatar"><User size={24} /></div>
                <div className="header__dropdown-info">
                  <span className="header__dropdown-name">{user?.name || 'Admin'}</span>
                  <span className="header__dropdown-role">{user?.role || 'Super Admin'}</span>
                </div>
              </div>
              <div className="header__dropdown-divider"></div>
              <button className="header__dropdown-item" onClick={() => { setIsDropdownOpen(false); navigate('/update-profile') }}>
                <UserCircle size={18} /><span>Update Profile</span>
              </button>
              <button className="header__dropdown-item header__dropdown-item-logout" onClick={handleLogout}>
                <LogOut size={18} /><span>Logout</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
