import React, { useState } from 'react'
import { 
  X, Users, UserCog, Search, Plus, 
  Trash2, Edit2, CheckCircle, AlertCircle,
  ChevronLeft, ChevronRight, User, Shield,
  Mail, Phone, Calendar, MapPin, Filter,
  UserPlus, Eye, EyeOff
} from 'lucide-react'
import './AssignRole.css'

const initialUsers = [
  { id: 1, name: 'John Doe', email: 'john@example.com', role: 'Super Admin', status: 'Active', joined: '15 Jan, 2025' },
  { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'Manager', status: 'Active', joined: '20 Feb, 2025' },
  { id: 3, name: 'Mike Johnson', email: 'mike@example.com', role: 'Support', status: 'Inactive', joined: '10 Mar, 2025' },
  { id: 4, name: 'Sarah Williams', email: 'sarah@example.com', role: 'Manager', status: 'Active', joined: '05 Apr, 2025' },
  { id: 5, name: 'David Brown', email: 'david@example.com', role: 'Support', status: 'Active', joined: '12 May, 2025' },
]

const roles = ['Super Admin', 'Manager', 'Support', 'Viewer']

export default function AssignRole({ dark, onClose }) {
  const [users, setUsers] = useState(initialUsers)
  const [selectedIds, setSelectedIds] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [editingUser, setEditingUser] = useState(null)
  const [selectedRole, setSelectedRole] = useState('')
  const [selectedFilterRole, setSelectedFilterRole] = useState('')
  const [showRoleWiseUsers, setShowRoleWiseUsers] = useState(false)
  const [showAddUser, setShowAddUser] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [newUser, setNewUser] = useState({
    role: '',
    username: '',
    password: '',
    status: 'Show'
  })
  const itemsPerPage = 10

  // Handle Add User
  const handleAddUser = () => {
    if (!newUser.role || !newUser.username || !newUser.password) {
      alert('Please fill all fields')
      return
    }

    const newUserData = {
      id: Math.max(...users.map(u => u.id), 0) + 1,
      name: newUser.username,
      email: newUser.username.toLowerCase().replace(/\s/g, '') + '@example.com',
      role: newUser.role,
      status: newUser.status === 'Show' ? 'Active' : 'Inactive',
      joined: new Date().toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' })
    }

    setUsers([...users, newUserData])
    setNewUser({ role: '', username: '', password: '', status: 'Show' })
    setShowAddUser(false)
    alert(`✅ User "${newUser.username}" added successfully with role "${newUser.role}"!`)
  }

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedIds(users.map(u => u.id))
    } else {
      setSelectedIds([])
    }
  }

  const handleSelectOne = (id) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter(sid => sid !== id))
    } else {
      setSelectedIds([...selectedIds, id])
    }
  }

  const handleEditRole = (user) => {
    setEditingUser(user.id)
    setSelectedRole(user.role)
  }

  const handleSaveRole = (id) => {
    if (!selectedRole) {
      alert('Please select a role')
      return
    }
    setUsers(users.map(u => 
      u.id === id ? { ...u, role: selectedRole } : u
    ))
    setEditingUser(null)
    setSelectedRole('')
    alert('✅ Role assigned successfully!')
  }

  const handleCancelEdit = () => {
    setEditingUser(null)
    setSelectedRole('')
  }

  const handleDelete = (id) => {
    if (window.confirm('Remove this user?')) {
      setUsers(users.filter(u => u.id !== id))
      setSelectedIds(selectedIds.filter(sid => sid !== id))
    }
  }

  const handleDeleteSelected = () => {
    if (window.confirm(`Remove ${selectedIds.length} selected users?`)) {
      setUsers(users.filter(u => !selectedIds.includes(u.id)))
      setSelectedIds([])
    }
  }

  const handleRoleWiseUsers = () => {
    setShowRoleWiseUsers(true)
  }

  const handleCloseRoleWise = () => {
    setShowRoleWiseUsers(false)
    setSelectedFilterRole('')
  }

  // Filter users by role
  const filteredUsers = users.filter(u => {
    const matchSearch = u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.role.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchRole = selectedFilterRole ? u.role === selectedFilterRole : true
    
    return matchSearch && matchRole
  })

  // Group users by role for Role Wise view
  const usersByRole = roles.reduce((acc, role) => {
    acc[role] = users.filter(u => u.role === role)
    return acc
  }, {})

  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = Math.min(startIndex + itemsPerPage, filteredUsers.length)
  const currentUsers = filteredUsers.slice(startIndex, endIndex)

  // If Add User is open
  if (showAddUser) {
    return (
      <div className={`assign-role ${dark ? 'dark' : 'light'}`}>
        <div className="assign-role-header">
          <div className="assign-role-header-left">
            <UserPlus size={24} className="assign-role-icon" />
            <h1 className="assign-role-title">Add Role Wise User</h1>
          </div>
          <button className="assign-role-close-btn" onClick={() => setShowAddUser(false)} type="button">
            <X size={20} />
          </button>
        </div>

        <div className="add-user-container">
          <div className="add-user-card">
            <div className="add-user-form">
              {/* Select Role */}
              <div className="form-group">
                <label className="form-label">Select Role</label>
                <div className="form-field">
                  <Shield size={18} className="form-icon" />
                  <select
                    value={newUser.role}
                    onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
                    className="form-select"
                  >
                    <option value="">Select Role</option>
                    {roles.map(role => (
                      <option key={role} value={role}>{role}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Username */}
              <div className="form-group">
                <label className="form-label">Username</label>
                <div className="form-field">
                  <User size={18} className="form-icon" />
                  <input
                    type="text"
                    placeholder="Enter username"
                    value={newUser.username}
                    onChange={(e) => setNewUser({ ...newUser, username: e.target.value })}
                    className="form-input"
                  />
                </div>
              </div>

              {/* Password */}
              <div className="form-group">
                <label className="form-label">Password</label>
                <div className="form-field">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter password"
                    value={newUser.password}
                    onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                    className="form-input"
                  />
                  <button 
                    className="password-toggle"
                    onClick={() => setShowPassword(!showPassword)}
                    type="button"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              {/* Select Status */}
              <div className="form-group">
                <label className="form-label">Select Status</label>
                <div className="status-options-add">
                  <button 
                    className={`status-option-add ${newUser.status === 'Show' ? 'active' : ''}`}
                    onClick={() => setNewUser({ ...newUser, status: 'Show' })}
                    type="button"
                  >
                    <CheckCircle size={16} />
                    Show
                  </button>
                  <button 
                    className={`status-option-add ${newUser.status === 'Hide' ? 'active-hide' : ''}`}
                    onClick={() => setNewUser({ ...newUser, status: 'Hide' })}
                    type="button"
                  >
                    <X size={16} />
                    Hide
                  </button>
                </div>
              </div>

              {/* Buttons */}
              <div className="add-user-actions">
                <button className="btn-cancel" onClick={() => setShowAddUser(false)}>
                  Cancel
                </button>
                <button className="btn-add-user" onClick={handleAddUser}>
                  <UserPlus size={18} />
                  Add User
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // If Role Wise Users view is open
  if (showRoleWiseUsers) {
    return (
      <div className={`assign-role ${dark ? 'dark' : 'light'}`}>
        <div className="assign-role-header">
          <div className="assign-role-header-left">
            <Filter size={24} className="assign-role-icon" />
            <h1 className="assign-role-title">Role Wise Users</h1>
          </div>
          <div className="assign-role-header-actions">
            <button className="header-btn btn-add-user-header" onClick={() => setShowAddUser(true)}>
              <UserPlus size={16} />
              Add User
            </button>
            <button className="assign-role-close-btn" onClick={handleCloseRoleWise} type="button">
              <X size={20} />
            </button>
          </div>
        </div>

        <div className="role-wise-grid">
          {roles.map(role => {
            const roleUsers = usersByRole[role] || []
            return (
              <div key={role} className="role-wise-card">
                <div className="role-wise-header">
                  <Shield size={18} className="role-wise-icon" />
                  <h3 className="role-wise-title">{role}</h3>
                  <span className="role-wise-count">{roleUsers.length}</span>
                </div>
                <div className="role-wise-users">
                  {roleUsers.length > 0 ? (
                    roleUsers.map(user => (
                      <div key={user.id} className="role-wise-user">
                        <div className="user-avatar-xs">
                          {user.name.charAt(0).toUpperCase()}
                        </div>
                        <div className="user-info">
                          <span className="user-name">{user.name}</span>
                          <span className="user-email">{user.email}</span>
                        </div>
                        <span className={`status-dot ${user.status === 'Active' ? 'active' : 'inactive'}`} />
                      </div>
                    ))
                  ) : (
                    <div className="no-users-msg">No users assigned</div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    )
  }

  return (
    <div className={`assign-role ${dark ? 'dark' : 'light'}`}>
      {/* Header */}
      <div className="assign-role-header">
        <div className="assign-role-header-left">
          <UserCog size={24} className="assign-role-icon" />
          <h1 className="assign-role-title">Assign Role</h1>
        </div>
        <div className="assign-role-header-actions">
          <button className="header-btn btn-add-user-header" onClick={() => setShowAddUser(true)}>
            <UserPlus size={16} />
            Add User
          </button>
          <button className="header-btn role-wise-btn" onClick={handleRoleWiseUsers}>
            <Filter size={16} />
            Role Wise User
          </button>
          {/* <button className="assign-role-close-btn" onClick={onClose} type="button">
            <X size={20} />
          </button> */}
        </div>
      </div>

      {/* Stats */}
      <div className="assign-role-stats">
        <div className="stat-item">
          <span className="stat-label">Total Users</span>
          <span className="stat-value">{users.length}</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">With Roles</span>
          <span className="stat-value">{users.filter(u => u.role).length}</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">Active</span>
          <span className="stat-value">{users.filter(u => u.status === 'Active').length}</span>
        </div>
      </div>

      {/* Filter by Role */}
      <div className="filter-section">
        <select 
          className="filter-select"
          value={selectedFilterRole}
          onChange={(e) => setSelectedFilterRole(e.target.value)}
        >
          <option value="">All Roles</option>
          {roles.map(r => (
            <option key={r} value={r}>{r}</option>
          ))}
        </select>
        {selectedFilterRole && (
          <button className="clear-filter-btn" onClick={() => setSelectedFilterRole('')}>
            <X size={14} />
            Clear
          </button>
        )}
      </div>

      {/* Toolbar */}
      <div className="assign-role-toolbar">
        <div className="toolbar-left">
          {selectedIds.length > 0 && (
            <button className="toolbar-btn btn-delete" onClick={handleDeleteSelected}>
              <Trash2 size={16} />
              Remove Selected ({selectedIds.length})
            </button>
          )}
        </div>
        <div className="toolbar-right">
          <div className="search-box">
            <Search size={16} className="search-icon" />
            <input
              type="text"
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="assign-role-table-wrapper">
        <table className="assign-role-table">
          <thead>
            <tr>
              <th className="col-checkbox">
                <input
                  type="checkbox"
                  checked={selectedIds.length === filteredUsers.length && filteredUsers.length > 0}
                  onChange={handleSelectAll}
                />
              </th>
              <th className="col-id">#</th>
              <th className="col-user">USER</th>
              <th className="col-email">EMAIL</th>
              <th className="col-role">ROLE</th>
              <th className="col-status">STATUS</th>
              <th className="col-action">ACTION</th>
            </tr>
          </thead>
          <tbody>
            {currentUsers.map((user, index) => (
              <tr key={user.id} className={selectedIds.includes(user.id) ? 'selected' : ''}>
                <td>
                  <input
                    type="checkbox"
                    checked={selectedIds.includes(user.id)}
                    onChange={() => handleSelectOne(user.id)}
                  />
                </td>
                <td>{startIndex + index + 1}</td>
                <td>
                  <div className="user-cell">
                    <div className="user-avatar-sm">
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                    <span className="user-name">{user.name}</span>
                  </div>
                </td>
                <td className="user-email">{user.email}</td>
                <td>
                  {editingUser === user.id ? (
                    <div className="role-edit">
                      <select
                        value={selectedRole}
                        onChange={(e) => setSelectedRole(e.target.value)}
                        className="role-select"
                      >
                        <option value="">Select Role</option>
                        {roles.map(r => (
                          <option key={r} value={r}>{r}</option>
                        ))}
                      </select>
                      <button 
                        className="role-save-btn" 
                        onClick={() => handleSaveRole(user.id)}
                      >
                        <CheckCircle size={14} />
                      </button>
                      <button 
                        className="role-cancel-btn" 
                        onClick={handleCancelEdit}
                      >
                        <X size={14} />
                      </button>
                    </div>
                  ) : (
                    <span className="role-badge">{user.role}</span>
                  )}
                </td>
                <td>
                  <span className={`status-badge ${user.status === 'Active' ? 'status-active' : 'status-inactive'}`}>
                    {user.status === 'Active' ? <CheckCircle size={12} /> : <AlertCircle size={12} />}
                    {user.status}
                  </span>
                </td>
                <td>
                  <div className="action-buttons">
                    {editingUser !== user.id && (
                      <button 
                        className="action-btn btn-assign" 
                        onClick={() => handleEditRole(user)}
                      >
                        <Edit2 size={14} />
                        Assign
                      </button>
                    )}
                    <button className="action-btn btn-delete" onClick={() => handleDelete(user.id)}>
                      <Trash2 size={14} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Footer */}
      <div className="assign-role-footer">
        <span>
          Showing {startIndex + 1} to {endIndex} of {filteredUsers.length} entries
        </span>
        {totalPages > 1 && (
          <div className="pagination">
            <button 
              className="pagination-btn"
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
            >
              <ChevronLeft size={16} />
            </button>
            <span className="pagination-info">
              Page {currentPage} of {totalPages}
            </span>
            <button 
              className="pagination-btn"
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
            >
              <ChevronRight size={16} />
            </button>
          </div>
        )}
      </div>
    </div>
  )
}