import React, { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import {
  LayoutDashboard, Settings, DollarSign, Image, QrCode,
  Users, Wallet, Gamepad2, Bell, MessageSquare, LogOut,
  ChevronRight, FileText, ChevronDown, X,
  Info, Shield, FileCheck, StickyNote,
  Trophy, TrendingDown, Edit3, Award,
  Grid3x3,
  Swords // ✅ Personal Games icon
} from 'lucide-react'
import './Sidebar.css'
import munafalogo from "../../../public/munafalogo.png"

const menuItems = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/' },

  {
    icon: Trophy,
    label: 'Winner Prediction',
    path: '/winner-prediction',
  },

  {
    icon: TrendingDown,
    label: 'Profit Loss',
    path: '/profit-loss',
  },

  {
    icon: Edit3,
    label: 'Declare Result',
    path: '/declare-result',
  },

  {
    icon: Award,
    label: 'Winning Details',
    path: '/winning-details',
  },

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
      { label: 'Deposit Points Request', path: '/wallet/upi-verification' },
      { label: 'QR UPI Verification', path: '/wallet/qr-upi-verification' },
      { label: 'Withdraw Request', path: '/wallet/withdraw-points-request' },
      { label: 'Add Points', path: '/wallet/add-points' },
      { label: 'Bid Revert', path: '/wallet/bid-revert' },
      { label: 'All Refunds', path: '/wallet/all-refunds' },
    ]
  },

  {
    icon: Gamepad2, label: 'Games', path: '/games',
    children: [
      { label: 'All Games', path: '/games/all' },
      { label: 'Bet Report', path: '/games/bet/report' },
      { label: 'Game Results', path: '/games/results' },
      { label: 'Game Rate', path: '/games/rate' },
    ]
  },

  {
    icon: Grid3x3,
    label: 'Games & Numbers',
    path: '/games-numbers',
    children: [
      { label: 'Single Digit', path: '/game-numbers/single_digits' },
      { label: 'Jodi Digit',   path: '/game-numbers/jodi_digits' },
      { label: 'Single Pana',  path: '/game-numbers/single_pana' },
      { label: 'Double Pana',  path: '/game-numbers/double_pana' },
      { label: 'Triple Pana',  path: '/game-numbers/triple_pana' },
      { label: 'Half Sangam',  path: '/game-numbers/half_sangam' },
      { label: 'Full Sangam',  path: '/game-numbers/full_sangam' },
    ]
  },

  // ✅ NEW: Personal Games (with Disawar as nested dropdown)
  {
    icon: Swords,
    label: 'Personal Games',
    path: '/personal-games',
    children: [
      {
        label: 'Disawar',
        path: '/personal-games/disawar',
        children: [
          { label: 'Game List',       path: '/get-disawar-game-list' },
          { label: 'Game Rate',       path: '/personal-games/disawar/game-rate' },
          { label: 'Bid History',     path: '/personal-games/disawar/bid-history' },
          { label: 'Declare Result',  path: '/personal-games/disawar/declare-result' },
          { label: 'Winning Report',  path: '/personal-games/disawar/winning-report' },
        ]
      },
    ]
  },

  { icon: Bell, label: 'Notification', path: '/notification' },
  { icon: MessageSquare, label: 'App Enquiry', path: '/enquiry' },

  {
    icon: Settings,
    label: 'Settings',
    path: '/settings',
    children: [
      { label: 'Change Password', path: '/change-password' },
      { label: 'Contact Us Details', path: '/contact-us' },
      { label: 'How To Play', path: '/how-to-play' },
    ]
  },

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
  const [openNested, setOpenNested] = useState({}) // ✅ For nested submenus

  const toggleMenu = (label) => setOpenMenus(prev => ({ ...prev, [label]: !prev[label] }))
  const toggleNested = (label) => setOpenNested(prev => ({ ...prev, [label]: !prev[label] }))

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
              (item.children && item.children.some(c =>
                location.pathname === c.path ||
                (c.children && c.children.some(cc => location.pathname === cc.path))
              ))
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

                  {item.badge && (
                    <span className={`sidebar__menu-badge ${item.badge.toLowerCase()}`}>
                      {item.badge}
                    </span>
                  )}

                  {hasChildren && (
                    <span className="sidebar__menu-arrow">
                      {isExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                    </span>
                  )}
                </button>

                {hasChildren && isExpanded && (
                  <div className="sidebar__submenu">
                    {item.children.map(child => {
                      const hasNestedChildren = child.children?.length > 0
                      const isChildActive = location.pathname === child.path ||
                        (child.children && child.children.some(cc => location.pathname === cc.path))
                      const isChildExpanded = openNested[child.label]

                      return (
                        <div key={child.path} className="sidebar__submenu-item">
                          <button
                            className={`sidebar__submenu-btn ${isChildActive ? 'active' : ''}`}
                            onClick={() => {
                              if (hasNestedChildren) {
                                toggleNested(child.label)
                              } else {
                                handleNav(child.path)
                              }
                            }}
                          >
                            <span>{child.label}</span>
                            {hasNestedChildren && (
                              <span className="sidebar__submenu-arrow">
                                {isChildExpanded ? <ChevronDown size={12} /> : <ChevronRight size={12} />}
                              </span>
                            )}
                          </button>

                          {hasNestedChildren && isChildExpanded && (
                            <div className="sidebar__nested-submenu">
                              {child.children.map(subChild => (
                                <button
                                  key={subChild.path}
                                  className={`sidebar__nested-submenu-btn ${location.pathname === subChild.path ? 'active' : ''}`}
                                  onClick={() => handleNav(subChild.path)}
                                >
                                  {subChild.label}
                                </button>
                              ))}
                            </div>
                          )}
                        </div>
                      )
                    })}
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