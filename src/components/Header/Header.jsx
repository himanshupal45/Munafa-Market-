import React, { useState, useRef, useEffect } from 'react'
import { Menu, Sun, Moon, Search, User, LogOut, UserCircle } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import NotificationBell from '../Header/NotificationBell/NotificationBell'
import './Header.css'

export default function Header({ onMenuClick, dark, onToggleDark }) {
  const navigate = useNavigate()
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const dropdownRef = useRef(null)

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen)
  }

  const handleProfile = () => {
    setIsDropdownOpen(false)
    navigate('/update-profile')
  }

  const handleLogout = () => {
    setIsDropdownOpen(false)
    
    // Clear all user data from localStorage
    localStorage.removeItem('user')
    localStorage.removeItem('rememberedEmail')
    sessionStorage.clear()
    
    // Navigate to login page
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
          <input 
            type="text" 
            placeholder="Search..." 
            className="header__search-input"
          />
        </div>
      </div>

      <div className="header__right">
        {/* Theme toggle */}
        <button className="header__theme-btn" onClick={onToggleDark}>
          {dark ? (
            <>
              <Sun size={14} />
              Light
            </>
          ) : (
            <>
              <Moon size={14} />
              Dark
            </>
          )}
        </button>

        {/* Notification Bell with Dropdown */}
        <NotificationBell dark={dark} />

        {/* Avatar with Dropdown */}
        <div className="header__avatar-wrapper" ref={dropdownRef}>
          <div className="header__avatar" onClick={toggleDropdown}>
            <User size={16} />
          </div>
          
          <div className="header__user-info" onClick={toggleDropdown}>
            <span className="header__user-name">Admin</span>
            <span className="header__user-role">Super Admin</span>
          </div>

          {/* Dropdown Menu */}
          {isDropdownOpen && (
            <div className="header__dropdown">
              <div className="header__dropdown-header">
                <div className="header__dropdown-avatar">
                  <User size={24} />
                </div>
                <div className="header__dropdown-info">
                  <span className="header__dropdown-name">Admin</span>
                  <span className="header__dropdown-role">Super Admin</span>
                </div>
              </div>
              <div className="header__dropdown-divider"></div>
              <button className="header__dropdown-item" onClick={handleProfile}>
                <UserCircle size={18} />
                <span>Update Profile</span>
              </button>
              <button className="header__dropdown-item header__dropdown-item-logout" onClick={handleLogout}>
                <LogOut size={18} />
                <span>Logout</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}