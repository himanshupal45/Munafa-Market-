import React, { useState, useRef, useEffect } from 'react'
import { Bell, X, CheckCircle, AlertCircle, Info } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import './NotificationBell.css'

const notifications = [
  { id: 1, type: 'success', title: 'New User Registered', message: 'John Doe just joined the platform', time: '2 min ago', read: false },
  { id: 2, type: 'info', title: 'Payment Received', message: 'Payment of ₹500 received from Jane Smith', time: '15 min ago', read: false },
  { id: 3, type: 'warning', title: 'New Game Added', message: 'New game "Color Wala" is now available', time: '1 hour ago', read: false },
  { id: 4, type: 'success', title: 'Withdrawal Approved', message: 'Withdrawal request #452 approved', time: '2 hours ago', read: true },
  { id: 5, type: 'danger', title: 'User Blocked', message: 'User user_998 has been blocked', time: '3 hours ago', read: true },
  { id: 6, type: 'info', title: 'New Enquiry', message: 'New enquiry from +91-9876XXXXXX', time: '5 hours ago', read: true },
]

export default function NotificationBell({ dark }) {
  const navigate = useNavigate()
  const [isOpen, setIsOpen] = useState(false)
  const [notifData, setNotifData] = useState(notifications)
  const dropdownRef = useRef(null)

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const toggleDropdown = () => {
    setIsOpen(!isOpen)
  }

  const handleMarkAsRead = (id) => {
    setNotifData(notifData.map(n => 
      n.id === id ? { ...n, read: true } : n
    ))
  }

  const handleMarkAllAsRead = () => {
    setNotifData(notifData.map(n => ({ ...n, read: true })))
  }

  const handleViewAll = () => {
    setIsOpen(false)
    navigate('/notification')
  }

  const getIcon = (type) => {
    switch(type) {
      case 'success': return <CheckCircle size={16} className="notif-icon-success" />
      case 'danger': return <AlertCircle size={16} className="notif-icon-danger" />
      case 'warning': return <AlertCircle size={16} className="notif-icon-warning" />
      case 'info': return <Info size={16} className="notif-icon-info" />
      default: return <Bell size={16} className="notif-icon-default" />
    }
  }

  const unreadCount = notifData.filter(n => !n.read).length

  return (
    <div className="notification-bell-wrapper" ref={dropdownRef}>
      <button className="header__bell-btn" onClick={toggleDropdown} aria-label="Notifications">
        <Bell size={18} />
        {unreadCount > 0 && (
          <span className="header__badge">{unreadCount}</span>
        )}
      </button>

      {isOpen && (
        <div className={`notification-dropdown ${dark ? 'notification-dropdown--dark' : 'notification-dropdown--light'} notification-dropdown--open`}>
          <div className="notification-dropdown-header">
            <h3>Notifications</h3>
            <div className="notification-dropdown-actions">
              {unreadCount > 0 && (
                <button className="notif-mark-all" onClick={handleMarkAllAsRead}>
                  Mark all as read
                </button>
              )}
              <button className="notif-close" onClick={() => setIsOpen(false)}>
                <X size={16} />
              </button>
            </div>
          </div>

          <div className="notification-dropdown-body">
            {notifData.length === 0 ? (
              <div className="notif-empty">
                <Bell size={32} />
                <p>No notifications</p>
              </div>
            ) : (
              <>
                {notifData.slice(0, 8).map(notif => (
                  <div 
                    key={notif.id} 
                    className={`notif-item ${!notif.read ? 'notif-item--unread' : ''}`}
                    onClick={() => handleMarkAsRead(notif.id)}
                  >
                    <div className="notif-icon-wrapper">
                      {getIcon(notif.type)}
                    </div>
                    <div className="notif-content">
                      <div className="notif-title">{notif.title}</div>
                      <div className="notif-message">{notif.message}</div>
                      <div className="notif-time">{notif.time}</div>
                    </div>
                    {!notif.read && <div className="notif-unread-dot"></div>}
                  </div>
                ))}
              </>
            )}
          </div>

          <div className="notification-dropdown-footer">
            <button className="notif-view-all" onClick={handleViewAll}>
              View All Notifications
            </button>
          </div>
        </div>
      )}
    </div>
  )
}