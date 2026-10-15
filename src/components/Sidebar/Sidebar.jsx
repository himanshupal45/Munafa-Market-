import React, { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import {
  LayoutDashboard, Settings, DollarSign, Image, QrCode,
  Users, Wallet, Gamepad2, Bell, MessageSquare, LogOut,
  ChevronRight, FileText, ChevronDown, X,
  Info, Shield, FileCheck, StickyNote
} from 'lucide-react'
import './Sidebar.css'
import munafalogo from "../../../public/munafalogo.png"

const menuItems = [
  { icon: LayoutDashboard, label: 'Overview', path: '/' },
  { icon: Settings, label: 'Site Setting', path: '/site-setting' },
  { icon: DollarSign, label: 'Set Amount', path: '/set-amount' },
  { icon: Image, label: 'App Banners', path: '/app-banners' },
  { icon: QrCode, label: 'Payment QR Code', path: '/payment-qr' },
  {
    icon: Users, label: 'Team & Users', path: '/users',
    children: [
      { label: 'Create Role', path: '/users/create-role' },
      { label: 'Assign Role', path: '/users/assign-role' },
      { label: 'All Users', path: '/users/all' },
    ]
  },
  {
    icon: Wallet, label: 'Wallet', path: '/wallet',
    children: [
      { label: 'Wallet Points', path: '/wallet/Points' },
      { label: 'Add Wallet points', path: '/wallet/AddWallet/points' },
      { label: 'Withdrawals Request', path: '/wallet/withdrawals/Request' },
    ]
  },
  {
    icon: Gamepad2, label: 'Games', path: '/games',
    children: [
      { label: 'All Games', path: '/games/all' },
      { label: 'Bet Report', path: '/games/bet/report' },
      { label: 'Game Results', path: '/games/results' },
    ]
  },
  { icon: Bell, label: 'Notification', path: '/notification' },
  { icon: MessageSquare, label: 'App Enquiry', path: '/enquiry' },
  {
    icon: FileText, label: 'Policy & Content', path: '/policy-content',
    children: [
      { label: 'About Us', path: '/policy-content/about' },
      { label: 'Privacy Policy', path: '/policy-content/privacy' },
      { label: 'Game Rules', path: '/policy-content/game-rules' },
      { label: 'Notes', path: '/policy-content/notes' },
    ]
  },
]

export default function Sidebar({ isOpen, onClose, dark }) {
  const navigate = useNavigate()
  const location = useLocation()
  const [openMenus, setOpenMenus] = useState({})

  const toggleMenu = (label) => setOpenMenus(prev => ({ ...prev, [label]: !prev[label] }))

  const handleNav = (path) => {
    navigate(path)
    if (window.innerWidth < 768) onClose()
  }

  return (
    <>
      {isOpen && <div className="sidebar-overlay" onClick={onClose} />}

      <aside className={`sidebar ${isOpen ? 'sidebar--open' : ''} ${dark ? 'sidebar--dark' : 'sidebar--light'}`}>
        {/* Logo */}
        <div className="sidebar__logo">
          <div className="sidebar__logo-icon">
            <img 
              src={munafalogo} 
              alt="Munafa Market" 
              className="sidebar__logo-image"
            />
          </div>
          <span className="sidebar__logo-text">Munafa Market</span>
          <button onClick={onClose} className="sidebar__close-btn">
            <X size={18} />
          </button>
        </div>

        {/* Nav */}
        <nav className="sidebar__nav">
          {menuItems.map((item) => {
            const Icon = item.icon
            const isActive = location.pathname === item.path || 
              (item.children && item.children.some(c => location.pathname === c.path))
            const hasChildren = item.children?.length > 0
            const isExpanded = openMenus[item.label]

            return (
              <div key={item.label} className="sidebar__menu-item">
                <button
                  className={`sidebar__menu-btn ${isActive ? 'active' : ''}`}
                  onClick={() => hasChildren ? toggleMenu(item.label) : handleNav(item.path)}
                >
                  <Icon size={18} className="sidebar__menu-icon" />
                  <span className="sidebar__menu-label">{item.label}</span>
                  {hasChildren && (
                    <span className="sidebar__menu-arrow">
                      {isExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                    </span>
                  )}
                </button>

                {hasChildren && isExpanded && (
                  <div className="sidebar__submenu">
                    {item.children.map(child => (
                      <button
                        key={child.path}
                        className={`sidebar__submenu-btn ${location.pathname === child.path ? 'active' : ''}`}
                        onClick={() => handleNav(child.path)}
                      >
                        {child.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )
          })}
        </nav>

        {/* Logout */}
        <div className="sidebar__footer">
          <button className="sidebar__logout-btn">
            <LogOut size={18} />
            <span>Logout</span>
          </button>
        </div>
      </aside>
    </>
  )
}