import React from 'react'
import { useNavigate } from 'react-router-dom'
import { User, Phone, Shield, LogOut } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import './Profile.css'

export default function Profile() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => { logout(); navigate('/login', { replace: true }) }

  const items = [
    { icon: <User size={18} color="var(--orange)" />,   label: 'Full Name', value: user?.name },
    { icon: <Phone size={18} color="var(--orange)" />,  label: 'Mobile',    value: user?.mobile },
    { icon: <Shield size={18} color="var(--orange)" />, label: 'User ID',   value: user?.userId },
  ]

  return (
    <div className="profile-page">
      {/* Avatar */}
      <div className="profile-avatar-section">
        <div className="profile-avatar">
          {user?.name?.charAt(0)?.toUpperCase() || '?'}
        </div>
        <h2 className="profile-name">{user?.name || 'User'}</h2>
        <p className="profile-mobile">{user?.mobile}</p>
        <div className="profile-role-badge">
          <span>{user?.role || 'User'}</span>
        </div>
      </div>

      {/* Info */}
      <div className="profile-info">
        {items.map(({ icon, label, value }, i) => (
          <div className="profile-info-card" key={label} style={{ animationDelay: `${i * 0.07}s` }}>
            <div className="profile-info-icon">{icon}</div>
            <div>
              <p className="profile-info-label">{label}</p>
              <p className="profile-info-value">{value || '—'}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Logout */}
      <button className="profile-logout" onClick={handleLogout}>
        <LogOut size={18} /> Logout
      </button>
    </div>
  )
}
