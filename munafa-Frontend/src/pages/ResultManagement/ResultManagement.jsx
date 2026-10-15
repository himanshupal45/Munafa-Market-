import React, { useState } from 'react'
import {
  Home as HomeIcon,
  Plus,
  Search,
  Trash2,
  Edit2,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Check,
  X,
  AlertCircle,
  ClipboardList
} from 'lucide-react'
import './ResultManagement.css'

const initialResults = [
  { id: 1, date: '2026-07-21', game: 'DISAWAR',   number: '25', status: '' },
  { id: 2, date: '2026-07-18', game: 'GALI',      number: '01', status: '' },
  { id: 3, date: '2025-08-29', game: 'DISAWAR',   number: '51', status: '' },
  { id: 4, date: '2025-08-28', game: 'GALI',      number: '55', status: '' },
  { id: 5, date: '2025-08-28', game: 'GHAZIABAD', number: '11', status: '' },
  { id: 6, date: '2025-08-28', game: 'FARIDABAD', number: '44', status: '' },
  { id: 7, date: '2025-08-28', game: 'DISAWAR',   number: '78', status: '' },
  { id: 8, date: '2025-08-27', game: 'GALI',      number: '22', status: '' },
  { id: 9, date: '2025-08-26', game: 'DISAWAR',   number: '63', status: '' },
  { id: 10, date: '2025-08-25', game: 'GHAZIABAD', number: '05', status: '' },
  { id: 11, date: '2025-08-24', game: 'FARIDABAD', number: '88', status: '' },
  { id: 12, date: '2025-08-23', game: 'GALI',      number: '19', status: '' },
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

  // ✅ Pagination state
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 7

  // ============= FILTER =============
  const filteredResults = results.filter(r => {
    const matchSearch =
      r.game.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.number.includes(searchTerm) ||
      r.date.includes(searchTerm)
    const matchGame = selectedGame ? r.game === selectedGame : true
    return matchSearch && matchGame
  })

  // ✅ Pagination calculations
  const totalPages = Math.ceil(filteredResults.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentResults = filteredResults.slice(startIndex, endIndex)

  // ✅ Reset page when filter/search changes
  React.useEffect(() => {
    setCurrentPage(1)
  }, [searchTerm, selectedGame])

  const goToPage = (page) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)))
  }

  // ✅ Generate page numbers with ellipsis for many pages
  const getPageNumbers = () => {
    const pages = []
    const maxVisible = 5

    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) pages.push(i)
    } else {
      let start = Math.max(1, currentPage - Math.floor(maxVisible / 2))
      let end = Math.min(totalPages, start + maxVisible - 1)
      if (end - start + 1 < maxVisible) {
        start = Math.max(1, end - maxVisible + 1)
      }
      for (let i = start; i <= end; i++) pages.push(i)
    }
    return pages
  }

  // ============= SELECT HANDLERS =============
  const handleSelectAll = (e) => {
    setSelectedIds(e.target.checked ? currentResults.map(r => r.id) : [])
  }

  const handleSelectOne = (id) => {
    setSelectedIds(prev =>
      prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]
    )
  }

  // ============= DELETE =============
  const handleDeleteSelected = () => setShowDeleteModal(true)

  const confirmDelete = () => {
    setResults(results.filter(r => !selectedIds.includes(r.id)))
    setSelectedIds([])
    setShowDeleteModal(false)
  }

  const handleDeleteOne = (id) => {
    if (window.confirm('Delete this result?')) {
      setResults(prev => prev.filter(r => r.id !== id))
    }
  }

  // ============= EDIT =============
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

  // ============= ADD =============
  const handleAddResult = () => {
    if (!newResult.date || !newResult.game || !newResult.number) {
      alert('Please fill all fields')
      return
    }
    const newId = Math.max(...results.map(r => r.id), 0) + 1
    setResults([...results, { ...newResult, id: newId, status: '' }])
    setNewResult({ date: '', game: '', number: '' })
    setShowAddModal(false)
  }

  const handleShow = (id) => alert(`Showing result for ID: ${id}`)

  return (
    <div className="rm-page">
      {/* Breadcrumb */}
      <div className="rm-breadcrumb">
        <HomeIcon size={14} />
        <span>Home</span>
        <span className="rm-breadcrumb-sep">/</span>
        <span>Result Management</span>
      </div>

      {/* Page Title */}
      <div className="rm-page-title-wrapper">
        <ClipboardList size={26} className="rm-page-title-icon" />
        <h1 className="rm-page-title">Result Management</h1>
      </div>

      {/* Stats */}
      <div className="rm-stats-grid">
        <div className="rm-stat-card">
          <span className="rm-stat-label">Total Results</span>
          <span className="rm-stat-value">{results.length}</span>
        </div>
        <div className="rm-stat-card">
          <span className="rm-stat-label">Active</span>
          <span className="rm-stat-value rm-stat-green">
            {results.filter(r => r.status !== 'Inactive').length}
          </span>
        </div>
        <div className="rm-stat-card">
          <span className="rm-stat-label">Games</span>
          <span className="rm-stat-value">{games.length}</span>
        </div>
      </div>

      {/* Main Card */}
      <div className="rm-card">
        {/* Toolbar */}
        <div className="rm-toolbar">
          <div className="rm-toolbar-left">
            <button className="rm-add-btn" onClick={() => setShowAddModal(true)} type="button">
              <Plus size={16} />
              Add Result
            </button>
            {selectedIds.length > 0 && (
              <button className="rm-delete-btn" onClick={handleDeleteSelected} type="button">
                <Trash2 size={16} />
                Delete ({selectedIds.length})
              </button>
            )}
          </div>

          <div className="rm-toolbar-right">
            <div className="rm-search-box">
              <Search size={16} className="rm-search-icon" />
              <input
                type="text"
                placeholder="Search game, number or date"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="rm-search-input"
              />
            </div>
            <div className="rm-filter-dropdown">
              <select
                value={selectedGame}
                onChange={(e) => setSelectedGame(e.target.value)}
                className="rm-filter-select"
              >
                <option value="">All Games</option>
                {games.map(g => <option key={g} value={g}>{g}</option>)}
              </select>
              <ChevronDown size={14} className="rm-filter-arrow" />
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="rm-table-wrapper">
          <table className="rm-table">
            <thead>
              <tr>
                <th>
                  <input
                    type="checkbox"
                    checked={selectedIds.length === currentResults.length && currentResults.length > 0}
                    onChange={handleSelectAll}
                  />
                </th>
                <th>#</th>
                <th>DATE</th>
                <th>GAME</th>
                <th>NUMBER</th>
                <th>STATUS</th>
                <th>ACTION</th>
              </tr>
            </thead>
            <tbody>
              {currentResults.length === 0 ? (
                <tr>
                  <td colSpan="7" className="rm-table-empty">No data available in table</td>
                </tr>
              ) : (
                currentResults.map((result, index) => (
                  <tr key={result.id} className={selectedIds.includes(result.id) ? 'selected' : ''}>
                    <td>
                      <input
                        type="checkbox"
                        checked={selectedIds.includes(result.id)}
                        onChange={() => handleSelectOne(result.id)}
                      />
                    </td>
                    <td>{startIndex + index + 1}</td>
                    <td className="rm-date">{result.date}</td>
                    <td>
                      {editingId === result.id ? (
                        <select
                          value={editData.game}
                          onChange={(e) => setEditData({ ...editData, game: e.target.value })}
                          className="rm-edit-select"
                        >
                          {games.map(g => <option key={g} value={g}>{g}</option>)}
                        </select>
                      ) : (
                        <span className="rm-game">{result.game}</span>
                      )}
                    </td>
                    <td>
                      {editingId === result.id ? (
                        <input
                          type="text"
                          maxLength="2"
                          value={editData.number}
                          onChange={(e) => setEditData({ ...editData, number: e.target.value.replace(/[^0-9]/g, '') })}
                          className="rm-edit-input"
                        />
                      ) : (
                        <span className="rm-number">{result.number}</span>
                      )}
                    </td>
                    <td>
                      <span className={`rm-status-badge ${result.status === 'Inactive' ? 'rm-status-inactive' : 'rm-status-active'}`}>
                        {result.status || 'Active'}
                      </span>
                    </td>
                    <td>
                      <div className="rm-action-buttons">
                        {editingId === result.id ? (
                          <>
                            <button className="rm-action-btn rm-save-btn" onClick={() => handleSaveEdit(result.id)} title="Save" type="button">
                              <Check size={14} />
                            </button>
                            <button className="rm-action-btn rm-cancel-btn" onClick={handleCancelEdit} title="Cancel" type="button">
                              <X size={14} />
                            </button>
                          </>
                        ) : (
                          <>
                            <button className="rm-action-btn rm-show-btn" onClick={() => handleShow(result.id)} type="button">
                              SHOW
                            </button>
                            <button className="rm-action-btn rm-edit-btn" onClick={() => handleEdit(result)} type="button">
                              <Edit2 size={14} />
                            </button>
                            <button className="rm-action-btn rm-remove-btn" onClick={() => handleDeleteOne(result.id)} type="button">
                              <Trash2 size={14} />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* ✅ Footer with Pagination */}
        <div className="rm-footer">
          <span className="rm-footer-info">
            Showing {startIndex + 1} to {Math.min(endIndex, filteredResults.length)} of {filteredResults.length} entries
          </span>

          {totalPages > 1 && (
            <div className="rm-pagination">
              {/* Previous */}
              <button
                className="rm-page-btn"
                onClick={() => goToPage(currentPage - 1)}
                disabled={currentPage === 1}
                type="button"
              >
                <ChevronLeft size={16} />
              </button>

              {/* Page numbers */}
              {getPageNumbers().map(page => (
                <button
                  key={page}
                  className={`rm-page-btn ${page === currentPage ? 'active' : ''}`}
                  onClick={() => goToPage(page)}
                  type="button"
                >
                  {page}
                </button>
              ))}

              {/* Next */}
              <button
                className="rm-page-btn"
                onClick={() => goToPage(currentPage + 1)}
                disabled={currentPage === totalPages}
                type="button"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Delete Modal */}
      {showDeleteModal && (
        <div className="rm-modal-overlay" onClick={() => setShowDeleteModal(false)}>
          <div className="rm-modal" onClick={(e) => e.stopPropagation()}>
            <div className="rm-modal-header">
              <AlertCircle size={22} className="rm-modal-icon rm-modal-icon-red" />
              <h3 className="rm-modal-title">Delete Results</h3>
              <button className="rm-modal-close" onClick={() => setShowDeleteModal(false)} type="button">
                <X size={18} />
              </button>
            </div>
            <p className="rm-modal-text">
              Are you sure you want to delete {selectedIds.length} selected result(s)?
            </p>
            <div className="rm-modal-actions">
              <button className="rm-modal-btn rm-btn-cancel" onClick={() => setShowDeleteModal(false)} type="button">
                Cancel
              </button>
              <button className="rm-modal-btn rm-btn-confirm" onClick={confirmDelete} type="button">
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Modal */}
      {showAddModal && (
        <div className="rm-modal-overlay" onClick={() => setShowAddModal(false)}>
          <div className="rm-modal" onClick={(e) => e.stopPropagation()}>
            <div className="rm-modal-header">
              <Plus size={22} className="rm-modal-icon rm-modal-icon-orange" />
              <h3 className="rm-modal-title">Add New Result</h3>
              <button className="rm-modal-close" onClick={() => setShowAddModal(false)} type="button">
                <X size={18} />
              </button>
            </div>

            <div className="rm-modal-form">
              <div className="rm-form-group">
                <label className="rm-label">Date</label>
                <input
                  type="date"
                  value={newResult.date}
                  onChange={(e) => setNewResult({ ...newResult, date: e.target.value })}
                  className="rm-input"
                />
              </div>

              <div className="rm-form-group">
                <label className="rm-label">Game</label>
                <select
                  value={newResult.game}
                  onChange={(e) => setNewResult({ ...newResult, game: e.target.value })}
                  className="rm-select"
                >
                  <option value="">Select Game</option>
                  {games.map(g => <option key={g} value={g}>{g}</option>)}
                </select>
              </div>

              <div className="rm-form-group">
                <label className="rm-label">Number</label>
                <input
                  type="text"
                  maxLength="2"
                  placeholder="00"
                  value={newResult.number}
                  onChange={(e) => setNewResult({ ...newResult, number: e.target.value.replace(/[^0-9]/g, '') })}
                  className="rm-input"
                />
              </div>
            </div>

            <div className="rm-modal-actions">
              <button className="rm-modal-btn rm-btn-cancel" onClick={() => setShowAddModal(false)} type="button">
                Cancel
              </button>
              <button className="rm-modal-btn rm-btn-add" onClick={handleAddResult} type="button">
                Add Result
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}