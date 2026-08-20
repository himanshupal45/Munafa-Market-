import React, { useState } from 'react'
import { 
  X, Shield, Plus, Trash2, Search, 
  Edit2, CheckCircle, AlertCircle,
  ChevronLeft, ChevronRight
} from 'lucide-react'
import CreateRole from '../Role/CreateRole'
import './Roles.css'

const initialRoles = [
  { id: 1, name: 'Super Admin', permissions: 'All Permissions', users: 3, status: 'Active' },
  { id: 2, name: 'Manager', permissions: 'Manage Users, Reports', users: 5, status: 'Active' },
  { id: 3, name: 'Support', permissions: 'View Users, Support Tickets', users: 8, status: 'Active' },
]

export default function Roles({ dark, onClose }) {
  const [roles, setRoles] = useState(initialRoles)
  const [selectedIds, setSelectedIds] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [showCreateRole, setShowCreateRole] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedIds(roles.map(r => r.id))
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

  const handleDelete = (id) => {
    if (window.confirm('Delete this role?')) {
      setRoles(roles.filter(r => r.id !== id))
      setSelectedIds(selectedIds.filter(sid => sid !== id))
    }
  }

  const handleDeleteSelected = () => {
    if (window.confirm(`Delete ${selectedIds.length} selected roles?`)) {
      setRoles(roles.filter(r => !selectedIds.includes(r.id)))
      setSelectedIds([])
    }
  }

  const handleAddRole = (newRole) => {
    const newId = Math.max(...roles.map(r => r.id), 0) + 1
    setRoles([...roles, { 
      id: newId, 
      name: newRole.name, 
      permissions: newRole.permissions || 'No permissions',
      users: 0,
      status: newRole.status || 'Active' 
    }])
    setShowCreateRole(false)
  }

  const filteredRoles = roles.filter(r => 
    r.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.permissions.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const totalPages = Math.ceil(filteredRoles.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = Math.min(startIndex + itemsPerPage, filteredRoles.length)
  const currentRoles = filteredRoles.slice(startIndex, endIndex)

  // If Create Role is open, show it
  if (showCreateRole) {
    return (
      <CreateRole 
        dark={dark} 
        onClose={() => setShowCreateRole(false)}
        onSave={handleAddRole}
      />
    )
  }

  return (
    <div className={`roles-page ${dark ? 'dark' : 'light'}`}>
      {/* Header */}
      <div className="roles-header">
        <div className="roles-header-left">
          <Shield size={24} className="roles-icon" />
          <h1 className="roles-title">Roles</h1>
        </div>
        
      </div>

      {/* Toolbar */}
      <div className="roles-toolbar">
        <div className="toolbar-left">
          <button className="toolbar-btn btn-add" onClick={() => setShowCreateRole(true)}>
            <Plus size={16} />
            Add Role
          </button>
          {selectedIds.length > 0 && (
            <button className="toolbar-btn btn-delete" onClick={handleDeleteSelected}>
              <Trash2 size={16} />
              Delete Multiple ({selectedIds.length})
            </button>
          )}
        </div>
        <div className="toolbar-right">
          <div className="search-box">
            <Search size={16} className="search-icon" />
            <input
              type="text"
              placeholder="Search records..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="roles-table-wrapper">
        <table className="roles-table">
          <thead>
            <tr>
              <th className="col-checkbox">
                <input
                  type="checkbox"
                  checked={selectedIds.length === filteredRoles.length && filteredRoles.length > 0}
                  onChange={handleSelectAll}
                />
              </th>
              <th className="col-id">#</th>
              <th className="col-role">ROLE</th>
              <th className="col-permissions">PERMISSIONS</th>
              <th className="col-users">USERS</th>
              <th className="col-status">STATUS</th>
              <th className="col-action">ACTION</th>
            </tr>
          </thead>
          <tbody>
            {currentRoles.length > 0 ? (
              currentRoles.map((role, index) => (
                <tr key={role.id} className={selectedIds.includes(role.id) ? 'selected' : ''}>
                  <td>
                    <input
                      type="checkbox"
                      checked={selectedIds.includes(role.id)}
                      onChange={() => handleSelectOne(role.id)}
                    />
                  </td>
                  <td>{startIndex + index + 1}</td>
                  <td className="role-name">{role.name}</td>
                  <td className="role-permissions">{role.permissions}</td>
                  <td className="role-users">{role.users}</td>
                  <td>
                    <span className={`status-badge ${role.status === 'Active' ? 'status-active' : 'status-inactive'}`}>
                      {role.status === 'Active' ? <CheckCircle size={12} /> : <AlertCircle size={12} />}
                      {role.status}
                    </span>
                  </td>
                  <td>
                    <div className="action-buttons">
                      <button className="action-btn btn-edit">
                        <Edit2 size={14} />
                      </button>
                      <button className="action-btn btn-delete" onClick={() => handleDelete(role.id)}>
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="no-data">
                  <div className="no-data-message">
                    <AlertCircle size={32} />
                    <p>No records found.</p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Footer */}
      <div className="roles-footer">
        <span>
          Total Data: {filteredRoles.length} | Total Pages: {totalPages || 1}
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