import React, { useState } from 'react'
import { 
  Plus, Search, Trash2, Edit2, Eye, 
  ChevronDown, ChevronRight, X, Check,
  AlertCircle
} from 'lucide-react'
import './ResultManagement.css'

const initialResults = [
  { id: 1, date: '2026-07-21', game: 'DISAWAR', number: '25', status: '' },
  { id: 2, date: '2026-07-18', game: 'GALI', number: '01', status: '' },
  { id: 3, date: '2025-08-29', game: 'DISAWAR', number: '51', status: '' },
  { id: 4, date: '2025-08-28', game: 'GALI', number: '55', status: '' },
  { id: 5, date: '2025-08-28', game: 'GHAZIABAD', number: '11', status: '' },
  { id: 6, date: '2025-08-28', game: 'FARIDABAD', number: '44', status: '' },
  { id: 7, date: '2025-08-28', game: 'DISAWAR', number: '78', status: '' },
]

const games = ['DISAWAR', 'GALI', 'GHAZIABAD', 'FARIDABAD']

export default function ResultManagement({ dark, onClose }) {
  const [results, setResults] = useState(initialResults)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedGame, setSelectedGame] = useState('')
  const [selectedIds, setSelectedIds] = useState([])
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [editData, setEditData] = useState({ game: '', number: '' })
  const [showAddModal, setShowAddModal] = useState(false)
  const [newResult, setNewResult] = useState({ date: '', game: '', number: '' })

  // Filter results
  const filteredResults = results.filter(r => {
    const matchSearch = r.game.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        r.number.includes(searchTerm) ||
                        r.date.includes(searchTerm)
    const matchGame = selectedGame ? r.game === selectedGame : true
    return matchSearch && matchGame
  })

  // Select all
  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedIds(filteredResults.map(r => r.id))
    } else {
      setSelectedIds([])
    }
  }

  // Select one
  const handleSelectOne = (id) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter(sid => sid !== id))
    } else {
      setSelectedIds([...selectedIds, id])
    }
  }

  // Delete selected
  const handleDeleteSelected = () => {
    setShowDeleteModal(true)
  }

  const confirmDelete = () => {
    setResults(results.filter(r => !selectedIds.includes(r.id)))
    setSelectedIds([])
    setShowDeleteModal(false)
  }

  // Edit result
  const handleEdit = (result) => {
    setEditingId(result.id)
    setEditData({ game: result.game, number: result.number })
  }

  const handleSaveEdit = (id) => {
    setResults(results.map(r => 
      r.id === id ? { ...r, game: editData.game, number: editData.number } : r
    ))
    setEditingId(null)
    setEditData({ game: '', number: '' })
  }

  const handleCancelEdit = () => {
    setEditingId(null)
    setEditData({ game: '', number: '' })
  }

  // Add new result
  const handleAddResult = () => {
    if (!newResult.date || !newResult.game || !newResult.number) {
      alert('Please fill all fields')
      return
    }
    const newId = Math.max(...results.map(r => r.id)) + 1
    setResults([...results, { ...newResult, id: newId, status: '' }])
    setNewResult({ date: '', game: '', number: '' })
    setShowAddModal(false)
  }

  // Show result
  const handleShow = (id) => {
    alert(`Showing result for ID: ${id}`)
  }

  return (
    <div className={`result-management ${dark ? 'dark' : 'light'}`}>
      {/* Header */}
      <div className="result-header">
        <div className="result-header-left">
          <h1 className="result-title">Result</h1>
        </div>
        <button className="result-close-btn" onClick={onClose}>
          <X size={20} />
        </button>
      </div>

      {/* Stats - Overview */}
      <div className="result-stats">
        <div className="stat-item">
          <span className="stat-label">Total Results</span>
          <span className="stat-value">{results.length}</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">Active</span>
          <span className="stat-value">{results.filter(r => r.status !== 'Inactive').length}</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">Games</span>
          <span className="stat-value">{games.length}</span>
        </div>
      </div>

      {/* Toolbar */}
      <div className="result-toolbar">
        <div className="toolbar-left">
          <button className="toolbar-btn btn-add" onClick={() => setShowAddModal(true)}>
            <Plus size={16} />
            Add Result
          </button>
          {selectedIds.length > 0 && (
            <button className="toolbar-btn btn-delete" onClick={handleDeleteSelected}>
              <Trash2 size={16} />
              Delete Multiple
            </button>
          )}
        </div>
        <div className="toolbar-right">
          <div className="search-box">
            <Search size={16} className="search-icon" />
            <input
              type="text"
              placeholder="Search game, number or date"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>
          <div className="filter-dropdown">
            <select 
              value={selectedGame} 
              onChange={(e) => setSelectedGame(e.target.value)}
              className="filter-select"
            >
              <option value="">All Games</option>
              {games.map(g => (
                <option key={g} value={g}>{g}</option>
              ))}
            </select>
            <ChevronDown size={14} className="filter-arrow" />
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="result-table-wrapper">
        <table className="result-table">
          <thead>
            <tr>
              <th className="col-checkbox">
                <input
                  type="checkbox"
                  checked={selectedIds.length === filteredResults.length && filteredResults.length > 0}
                  onChange={handleSelectAll}
                />
              </th>
              <th className="col-id">#</th>
              <th className="col-date">DATE</th>
              <th className="col-game">GAME</th>
              <th className="col-number">NUMBER</th>
              <th className="col-status">STATUS</th>
              <th className="col-action">ACTION</th>
            </tr>
          </thead>
          <tbody>
            {filteredResults.map((result, index) => (
              <tr key={result.id} className={selectedIds.includes(result.id) ? 'selected' : ''}>
                <td>
                  <input
                    type="checkbox"
                    checked={selectedIds.includes(result.id)}
                    onChange={() => handleSelectOne(result.id)}
                  />
                </td>
                <td>{index + 1}</td>
                <td>{result.date}</td>
                <td>
                  {editingId === result.id ? (
                    <select
                      value={editData.game}
                      onChange={(e) => setEditData({ ...editData, game: e.target.value })}
                      className="edit-select"
                    >
                      {games.map(g => (
                        <option key={g} value={g}>{g}</option>
                      ))}
                    </select>
                  ) : (
                    result.game
                  )}
                </td>
                <td>
                  {editingId === result.id ? (
                    <input
                      type="text"
                      maxLength="2"
                      value={editData.number}
                      onChange={(e) => setEditData({ ...editData, number: e.target.value.replace(/[^0-9]/g, '') })}
                      className="edit-input"
                    />
                  ) : (
                    result.number
                  )}
                </td>
                <td>
                  <span className={`status-badge ${result.status === 'Inactive' ? 'status-inactive' : 'status-active'}`}>
                    {result.status || 'Active'}
                  </span>
                </td>
                <td>
                  <div className="action-buttons">
                    {editingId === result.id ? (
                      <>
                        <button className="action-btn btn-save" onClick={() => handleSaveEdit(result.id)}>
                          <Check size={14} />
                        </button>
                        <button className="action-btn btn-cancel" onClick={handleCancelEdit}>
                          <X size={14} />
                        </button>
                      </>
                    ) : (
                      <>
                        <button className="action-btn btn-show" onClick={() => handleShow(result.id)}>
                          SHOW
                        </button>
                        <button className="action-btn btn-edit" onClick={() => handleEdit(result)}>
                          <Edit2 size={14} />
                        </button>
                        <button className="action-btn btn-delete" onClick={() => {
                          if (window.confirm('Delete this result?')) {
                            setResults(results.filter(r => r.id !== result.id))
                          }
                        }}>
                          <Trash2 size={14} />
                        </button>
                      </>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Footer Stats */}
      <div className="result-footer">
        <span>Showing {filteredResults.length} of {results.length} results</span>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="modal-overlay" onClick={() => setShowDeleteModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <AlertCircle size={24} color="#ef4444" />
              <h3>Delete Results</h3>
            </div>
            <p>Are you sure you want to delete {selectedIds.length} selected result(s)?</p>
            <div className="modal-actions">
              <button className="modal-btn btn-cancel" onClick={() => setShowDeleteModal(false)}>
                Cancel
              </button>
              <button className="modal-btn btn-confirm" onClick={confirmDelete}>
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Result Modal */}
      {showAddModal && (
        <div className="modal-overlay" onClick={() => setShowAddModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <Plus size={24} color="#ff6b00" />
              <h3>Add New Result</h3>
              <button className="modal-close" onClick={() => setShowAddModal(false)}>
                <X size={18} />
              </button>
            </div>
            <div className="modal-form">
              <div className="form-group">
                <label>Date</label>
                <input
                  type="date"
                  value={newResult.date}
                  onChange={(e) => setNewResult({ ...newResult, date: e.target.value })}
                  className="form-input"
                />
              </div>
              <div className="form-group">
                <label>Game</label>
                <select
                  value={newResult.game}
                  onChange={(e) => setNewResult({ ...newResult, game: e.target.value })}
                  className="form-select"
                >
                  <option value="">Select Game</option>
                  {games.map(g => (
                    <option key={g} value={g}>{g}</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>Number</label>
                <input
                  type="text"
                  maxLength="2"
                  placeholder="00"
                  value={newResult.number}
                  onChange={(e) => setNewResult({ ...newResult, number: e.target.value.replace(/[^0-9]/g, '') })}
                  className="form-input"
                />
              </div>
            </div>
            <div className="modal-actions">
              <button className="modal-btn btn-cancel" onClick={() => setShowAddModal(false)}>
                Cancel
              </button>
              <button className="modal-btn btn-add" onClick={handleAddResult}>
                Add Result
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}