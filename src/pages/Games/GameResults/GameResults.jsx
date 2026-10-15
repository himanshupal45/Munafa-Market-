import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { 
  X, Trophy, Plus, Search, Trash2, 
  Edit2, ChevronLeft, ChevronRight,
  CheckCircle, AlertCircle, Save,
  X as XIcon
} from 'lucide-react'
import './GameResults.css'

const initialResults = [
  { id: 1, date: '2026-07-21', game: 'DISAWAR', number: '25', status: 'SHOW' },
  { id: 2, date: '2026-07-18', game: 'GALI', number: '01', status: 'SHOW' },
  { id: 3, date: '2025-08-29', game: 'DISAWAR', number: '51', status: 'SHOW' },
  { id: 4, date: '2025-08-28', game: 'GALI', number: '55', status: 'SHOW' },
  { id: 5, date: '2025-08-28', game: 'GHAZIABAD', number: '11', status: 'SHOW' },
  { id: 6, date: '2025-08-28', game: 'FARIDABAD', number: '44', status: 'SHOW' },
  { id: 7, date: '2025-08-28', game: 'DISAWAR', number: '78', status: 'SHOW' },
  { id: 8, date: '2025-08-27', game: 'GALI', number: '34', status: 'SHOW' },
  { id: 9, date: '2025-08-27', game: 'FARIDABAD', number: '12', status: 'SHOW' },
  { id: 10, date: '2025-08-27', game: 'GHAZIABAD', number: '67', status: 'SHOW' },
  { id: 11, date: '2025-08-26', game: 'DISAWAR', number: '89', status: 'SHOW' },
  { id: 12, date: '2025-08-26', game: 'GALI', number: '45', status: 'SHOW' },
  { id: 13, date: '2025-08-26', game: 'FARIDABAD', number: '23', status: 'SHOW' },
  { id: 14, date: '2025-08-25', game: 'GHAZIABAD', number: '56', status: 'SHOW' },
  { id: 15, date: '2025-08-25', game: 'DISAWAR', number: '90', status: 'SHOW' },
]

const games = ['DISAWAR', 'GALI', 'GHAZIABAD', 'FARIDABAD']

export default function GameResults({ dark, onClose }) {
  const navigate = useNavigate()
  const [results, setResults] = useState(initialResults)
  const [selectedIds, setSelectedIds] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [editingResult, setEditingResult] = useState(null)
  const [editData, setEditData] = useState({ game: '', number: '' })
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedIds(results.map(r => r.id))
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
    if (window.confirm('Delete this result?')) {
      setResults(results.filter(r => r.id !== id))
      setSelectedIds(selectedIds.filter(sid => sid !== id))
    }
  }

  const handleDeleteSelected = () => {
    if (window.confirm(`Delete ${selectedIds.length} selected results?`)) {
      setResults(results.filter(r => !selectedIds.includes(r.id)))
      setSelectedIds([])
    }
  }

  const handleEdit = (result) => {
    setEditingResult(result.id)
    setEditData({ game: result.game, number: result.number })
  }

  const handleSaveEdit = (id) => {
    setResults(results.map(r => 
      r.id === id ? { ...r, game: editData.game, number: editData.number } : r
    ))
    setEditingResult(null)
    setEditData({ game: '', number: '' })
  }

  const handleCancelEdit = () => {
    setEditingResult(null)
    setEditData({ game: '', number: '' })
  }

  const handleStatusToggle = (id) => {
    setResults(results.map(r => 
      r.id === id ? { ...r, status: r.status === 'SHOW' ? 'HIDE' : 'SHOW' } : r
    ))
  }

  const handleAddResult = () => {
    navigate('/games/add-result')
  }

  const filteredResults = results.filter(r => 
    r.game.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.number.includes(searchTerm) ||
    r.date.includes(searchTerm)
  )

  const totalPages = Math.ceil(filteredResults.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = Math.min(startIndex + itemsPerPage, filteredResults.length)
  const currentResults = filteredResults.slice(startIndex, endIndex)

  const getPageNumbers = () => {
    const pages = []
    const maxVisible = 5
    let start = Math.max(1, currentPage - Math.floor(maxVisible / 2))
    let end = Math.min(totalPages, start + maxVisible - 1)
    
    if (end - start + 1 < maxVisible) {
      start = Math.max(1, end - maxVisible + 1)
    }
    
    for (let i = start; i <= end; i++) {
      pages.push(i)
    }
    return pages
  }

  return (
    <div className={`game-results ${dark ? 'dark' : 'light'}`}>
      {/* Header */}
      <div className="gr-header">
        <div className="gr-header-left">
          <Trophy size={24} className="gr-icon" />
          <h1 className="gr-title">Result</h1>
        </div>
        {/* <button className="gr-close-btn" onClick={onClose} type="button">
          <X size={20} />
        </button> */}
      </div>

      {/* Stats */}
      <div className="gr-stats">
        <div className="stat-item">
          <span className="stat-label">Total Results</span>
          <span className="stat-value">{results.length}</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">Active</span>
          <span className="stat-value">{results.filter(r => r.status === 'SHOW').length}</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">Inactive</span>
          <span className="stat-value">{results.filter(r => r.status === 'HIDE').length}</span>
        </div>
      </div>

      {/* Toolbar */}
      <div className="gr-toolbar">
        <div className="toolbar-left">
          <button className="toolbar-btn btn-add" onClick={handleAddResult}>
            <Plus size={16} />
            Add Result
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
              placeholder="Search game, number or date"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="gr-table-wrapper">
        <table className="gr-table">
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
            {currentResults.map((result, index) => (
              <tr key={result.id} className={selectedIds.includes(result.id) ? 'selected' : ''}>
                <td>
                  <input
                    type="checkbox"
                    checked={selectedIds.includes(result.id)}
                    onChange={() => handleSelectOne(result.id)}
                  />
                </td>
                <td>{startIndex + index + 1}</td>
                <td>{result.date}</td>
                <td>
                  {editingResult === result.id ? (
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
                  {editingResult === result.id ? (
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
                  {editingResult === result.id ? (
                    <div className="status-edit">
                      <select 
                        className="status-select"
                        value={result.status}
                        onChange={(e) => {
                          setResults(results.map(r => 
                            r.id === result.id ? { ...r, status: e.target.value } : r
                          ))
                        }}
                      >
                        <option value="SHOW">SHOW</option>
                        <option value="HIDE">HIDE</option>
                      </select>
                    </div>
                  ) : (
                    <button 
                      className={`status-badge ${result.status === 'SHOW' ? 'status-show' : 'status-hide'}`}
                      onClick={() => handleStatusToggle(result.id)}
                    >
                      {result.status === 'SHOW' ? <CheckCircle size={12} /> : <AlertCircle size={12} />}
                      {result.status}
                    </button>
                  )}
                </td>
                <td>
                  <div className="action-buttons">
                    {editingResult === result.id ? (
                      <>
                        <button className="action-btn btn-save" onClick={() => handleSaveEdit(result.id)}>
                          <Save size={14} />
                        </button>
                        <button className="action-btn btn-cancel" onClick={handleCancelEdit}>
                          <XIcon size={14} />
                        </button>
                      </>
                    ) : (
                      <>
                        <button className="action-btn btn-edit" onClick={() => handleEdit(result)}>
                          Update
                        </button>
                        <button className="action-btn btn-delete" onClick={() => handleDelete(result.id)}>
                          Delete
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

      {/* Footer with Pagination */}
      <div className="gr-footer">
        <span>
          Total Data: {filteredResults.length} | Total Pages: {totalPages || 1}
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
            
            <div className="pagination-numbers">
              {getPageNumbers().map(page => (
                <button
                  key={page}
                  className={`pagination-number ${page === currentPage ? 'active' : ''}`}
                  onClick={() => setCurrentPage(page)}
                >
                  {page}
                </button>
              ))}
            </div>
            
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