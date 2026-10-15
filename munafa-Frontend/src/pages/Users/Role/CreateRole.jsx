import React, { useState } from 'react'
import { 
  X, Shield, Plus, ChevronDown, ChevronRight,
  Check, Settings, Users, QrCode, 
  Gamepad2, Bell, Wallet, TrendingUp,
  UserCog, CreditCard, Gift, ArrowUpRight,
  ArrowDownRight, List, Edit2, Trash2,
  Search, Filter, Save
} from 'lucide-react'
import './CreateRole.css'

export default function CreateRole({ dark, onClose, onSave }) {
  const [roleName, setRoleName] = useState('')
  const [permissions, setPermissions] = useState('')
  const [status, setStatus] = useState('Show')
  const [searchTerm, setSearchTerm] = useState('')
  const [expandedSections, setExpandedSections] = useState({
    overview: true,
    teamUsers: false,
    wallet: false,
    gameBet: false,
    result: false,
    notification: false,
  })
  const [selectedPermissions, setSelectedPermissions] = useState([])

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }))
  }

  const togglePermission = (label) => {
    setSelectedPermissions(prev => 
      prev.includes(label) 
        ? prev.filter(p => p !== label)
        : [...prev, label]
    )
  }

  const handleSubmit = () => {
    if (!roleName) {
      alert('Please enter role name')
      return
    }
    if (onSave) {
      onSave({
        name: roleName,
        permissions: selectedPermissions.join(', ') || 'No permissions',
        status: status === 'Show' ? 'Active' : 'Inactive'
      })
    } else {
      alert(`✅ Role "${roleName}" created successfully!`)
      onClose()
    }
  }

  const PermissionCheckbox = ({ label, indent = false }) => (
    <label className={`permission-item ${indent ? 'indent' : ''} ${selectedPermissions.includes(label) ? 'checked' : ''}`}>
      <input 
        type="checkbox" 
        className="permission-checkbox" 
        checked={selectedPermissions.includes(label)}
        onChange={() => togglePermission(label)}
      />
      <span className="permission-label">{label}</span>
      {selectedPermissions.includes(label) && (
        <Check size={14} className="permission-check-icon" />
      )}
    </label>
  )

  const SectionHeader = ({ icon: Icon, title, section, count }) => (
    <div className="section-header" onClick={() => toggleSection(section)}>
      <div className="section-header-left">
        <div className="section-icon-wrapper">
          <Icon size={18} className="section-icon" />
        </div>
        <span className="section-title">{title}</span>
        {count > 0 && (
          <span className="section-badge">{count}</span>
        )}
      </div>
      <div className="section-header-right">
        {expandedSections[section] ? (
          <ChevronDown size={18} />
        ) : (
          <ChevronRight size={18} />
        )}
      </div>
    </div>
  )

  // Get count of selected permissions in each section
  const getSectionCount = (section) => {
    const sectionPermissions = {
      overview: ['Dashboard', 'Site Setting', 'Set Amount', 'App Banners', 'Payment QR Code'],
      teamUsers: ['Create Role', 'Assign Role', 'Users List', 'Users Add', 'Users Edit', 'Users Delete', 'QR Code List', 'QR Code Add', 'QR Code Edit', 'QR Code Delete'],
      wallet: ['Add Point', 'Withdraw', 'Request List', 'Request Add', 'Request Edit', 'Request Delete'],
      gameBet: ['Game Bet'],
      result: ['Result'],
      notification: ['Notification']
    }
    return sectionPermissions[section]?.filter(p => selectedPermissions.includes(p)).length || 0
  }

  const allPermissions = [
    { section: 'overview', label: 'Dashboard' },
    { section: 'overview', label: 'Site Setting' },
    { section: 'overview', label: 'Set Amount' },
    { section: 'overview', label: 'App Banners' },
    { section: 'overview', label: 'Payment QR Code' },
    { section: 'teamUsers', label: 'Create Role' },
    { section: 'teamUsers', label: 'Assign Role' },
    { section: 'teamUsers', label: 'Users List' },
    { section: 'teamUsers', label: 'Users Add', indent: true },
    { section: 'teamUsers', label: 'Users Edit', indent: true },
    { section: 'teamUsers', label: 'Users Delete', indent: true },
    { section: 'teamUsers', label: 'QR Code List' },
    { section: 'teamUsers', label: 'QR Code Add', indent: true },
    { section: 'teamUsers', label: 'QR Code Edit', indent: true },
    { section: 'teamUsers', label: 'QR Code Delete', indent: true },
    { section: 'wallet', label: 'Add Point' },
    { section: 'wallet', label: 'Withdraw' },
    { section: 'wallet', label: 'Request List' },
    { section: 'wallet', label: 'Request Add', indent: true },
    { section: 'wallet', label: 'Request Edit', indent: true },
    { section: 'wallet', label: 'Request Delete', indent: true },
    { section: 'gameBet', label: 'Game Bet' },
    { section: 'result', label: 'Result' },
    { section: 'notification', label: 'Notification' },
  ]

  const filteredPermissions = allPermissions.filter(p =>
    p.label.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className={`create-role ${dark ? 'dark' : 'light'}`}>
      {/* Header */}
      <div className="create-role-header">
        <div className="create-role-header-left">
          <div className="header-icon-wrapper">
            <Shield size={24} className="create-role-icon" />
          </div>
          <div>
            <h1 className="create-role-title">Add Role</h1>
            <p className="create-role-subtitle">Create a new role with custom permissions</p>
          </div>
        </div>
        <button className="create-role-close-btn" onClick={onClose} type="button">
          <X size={20} />
        </button>
      </div>

      <div className="create-role-content">
        {/* Role Name */}
        <div className="role-name-section">
          <div className="role-name-header">
            <label className="role-name-label">Role Name</label>
            <span className="role-name-required">*</span>
          </div>
          <input
            type="text"
            placeholder="Enter role name (e.g., Super Admin, Manager, Support)"
            value={roleName}
            onChange={(e) => setRoleName(e.target.value)}
            className="role-name-input"
          />
        </div>

        {/* Permissions */}
        <div className="permissions-section">
          <div className="permissions-header">
            <h3 className="permissions-title">Permissions</h3>
            <div className="permissions-actions">
              <div className="permissions-search">
                <Search size={14} className="search-icon" />
                <input
                  type="text"
                  placeholder="Search permissions..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="permissions-search-input"
                />
              </div>
              <span className="permissions-count">
                {selectedPermissions.length} selected
              </span>
            </div>
          </div>

          {searchTerm ? (
            <div className="permission-list search-results">
              {filteredPermissions.map((p, idx) => (
                <PermissionCheckbox 
                  key={idx} 
                  label={p.label} 
                  indent={p.indent} 
                />
              ))}
              {filteredPermissions.length === 0 && (
                <div className="no-search-results">
                  <Search size={24} />
                  <p>No permissions found</p>
                </div>
              )}
            </div>
          ) : (
            <>
              {/* OVERVIEW */}
              <div className="permission-group">
                <SectionHeader 
                  icon={Settings} 
                  title="Overview" 
                  section="overview"
                  count={getSectionCount('overview')}
                />
                {expandedSections.overview && (
                  <div className="permission-list">
                    <PermissionCheckbox label="Dashboard" />
                    <PermissionCheckbox label="Site Setting" />
                    <PermissionCheckbox label="Set Amount" />
                    <PermissionCheckbox label="App Banners" />
                    <PermissionCheckbox label="Payment QR Code" />
                  </div>
                )}
              </div>

              {/* TEAM & USERS */}
              <div className="permission-group">
                <SectionHeader 
                  icon={Users} 
                  title="Team & Users" 
                  section="teamUsers"
                  count={getSectionCount('teamUsers')}
                />
                {expandedSections.teamUsers && (
                  <div className="permission-list">
                    <PermissionCheckbox label="Create Role" />
                    <PermissionCheckbox label="Assign Role" />
                    <PermissionCheckbox label="Users List" />
                    <PermissionCheckbox label="Users Add" indent />
                    <PermissionCheckbox label="Users Edit" indent />
                    <PermissionCheckbox label="Users Delete" indent />
                    <PermissionCheckbox label="QR Code List" />
                    <PermissionCheckbox label="QR Code Add" indent />
                    <PermissionCheckbox label="QR Code Edit" indent />
                    <PermissionCheckbox label="QR Code Delete" indent />
                  </div>
                )}
              </div>

              {/* WALLET */}
              <div className="permission-group">
                <SectionHeader 
                  icon={Wallet} 
                  title="Wallet" 
                  section="wallet"
                  count={getSectionCount('wallet')}
                />
                {expandedSections.wallet && (
                  <div className="permission-list">
                    <PermissionCheckbox label="Add Point" />
                    <PermissionCheckbox label="Withdraw" />
                    <PermissionCheckbox label="Request List" />
                    <PermissionCheckbox label="Request Add" indent />
                    <PermissionCheckbox label="Request Edit" indent />
                    <PermissionCheckbox label="Request Delete" indent />
                  </div>
                )}
              </div>

              {/* GAME BET */}
              <div className="permission-group">
                <SectionHeader 
                  icon={Gamepad2} 
                  title="Game Bet" 
                  section="gameBet"
                  count={getSectionCount('gameBet')}
                />
                {expandedSections.gameBet && (
                  <div className="permission-list">
                    <PermissionCheckbox label="Game Bet" />
                  </div>
                )}
              </div>

              {/* RESULT */}
              <div className="permission-group">
                <SectionHeader 
                  icon={TrendingUp} 
                  title="Result" 
                  section="result"
                  count={getSectionCount('result')}
                />
                {expandedSections.result && (
                  <div className="permission-list">
                    <PermissionCheckbox label="Result" />
                  </div>
                )}
              </div>

              {/* NOTIFICATION */}
              <div className="permission-group">
                <SectionHeader 
                  icon={Bell} 
                  title="Notification" 
                  section="notification"
                  count={getSectionCount('notification')}
                />
                {expandedSections.notification && (
                  <div className="permission-list">
                    <PermissionCheckbox label="Notification" />
                  </div>
                )}
              </div>
            </>
          )}
        </div>

        {/* Status & Submit */}
        <div className="create-role-footer">
          <div className="status-section">
            <label className="status-label">Status</label>
            <div className="status-options">
              <button 
                className={`status-option ${status === 'Show' ? 'active' : ''}`}
                onClick={() => setStatus('Show')}
              >
                <Check size={14} />
                Show
              </button>
              <button 
                className={`status-option ${status === 'Hide' ? 'active' : ''}`}
                onClick={() => setStatus('Hide')}
              >
                <X size={14} />
                Hide
              </button>
            </div>
          </div>
          <button className="create-role-submit" onClick={handleSubmit}>
            <Save size={18} />
            Create Role
          </button>
        </div>
      </div>
    </div>
  )
}