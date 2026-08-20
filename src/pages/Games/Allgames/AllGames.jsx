import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { 
  X, Gamepad2, Plus, Search, Trash2, 
  Edit2, ChevronLeft, ChevronRight,
  Clock, Calendar, Eye, CheckCircle,
  AlertCircle, Save, X as XIcon
} from 'lucide-react'
import './AllGames.css'

const initialGames = [
  { id: 1, name: 'FARIDABAD', shortName: 'FB', jodiRate: '100', harufRate: '10', openTime: '11:00 AM', closeTime: '05:30 PM', resultTime: '06:30 PM', status: 'SHOW' },
  { id: 2, name: 'GHAZIABAD', shortName: 'GB', jodiRate: '100', harufRate: '10', openTime: '11:00 AM', closeTime: '09:15 PM', resultTime: '09:45 PM', status: 'SHOW' },
  { id: 3, name: 'GALI', shortName: 'GL', jodiRate: '100', harufRate: '10', openTime: '11:00 AM', closeTime: '11:30 PM', resultTime: '11:45 PM', status: 'SHOW' },
  { id: 4, name: 'DISAWAR', shortName: 'DW', jodiRate: '100', harufRate: '10', openTime: '10:00 PM', closeTime: '04:00 AM', resultTime: '05:30 AM', status: 'SHOW' },
]

export default function AllGames({ dark, onClose }) {
  const navigate = useNavigate()
  const [games, setGames] = useState(initialGames)
  const [selectedIds, setSelectedIds] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [editingGame, setEditingGame] = useState(null)
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedIds(games.map(g => g.id))
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
    if (window.confirm('Delete this game?')) {
      setGames(games.filter(g => g.id !== id))
      setSelectedIds(selectedIds.filter(sid => sid !== id))
    }
  }

  const handleDeleteSelected = () => {
    if (window.confirm(`Delete ${selectedIds.length} selected games?`)) {
      setGames(games.filter(g => !selectedIds.includes(g.id)))
      setSelectedIds([])
    }
  }

  const handleEdit = (game) => {
    setEditingGame(game.id)
  }

  const handleSaveEdit = (id) => {
    setEditingGame(null)
    alert('✅ Game updated successfully!')
  }

  const handleCancelEdit = () => {
    setEditingGame(null)
  }

  const handleStatusToggle = (id) => {
    setGames(games.map(g => 
      g.id === id ? { ...g, status: g.status === 'SHOW' ? 'HIDE' : 'SHOW' } : g
    ))
  }

  const handleAddGame = () => {
    navigate('/games/add')
  }

  const filteredGames = games.filter(g => 
    g.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    g.shortName.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const totalPages = Math.ceil(filteredGames.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = Math.min(startIndex + itemsPerPage, filteredGames.length)
  const currentGames = filteredGames.slice(startIndex, endIndex)

  return (
    <div className={`all-games ${dark ? 'dark' : 'light'}`}>
      {/* Header */}
      <div className="all-games-header">
        <div className="all-games-header-left">
          <Gamepad2 size={24} className="all-games-icon" />
          <h1 className="all-games-title">All Games</h1>
        </div>
        
      </div>

      {/* Stats */}
      <div className="all-games-stats">
        <div className="stat-item">
          <span className="stat-label">Total Games</span>
          <span className="stat-value">{games.length}</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">Active</span>
          <span className="stat-value">{games.filter(g => g.status === 'SHOW').length}</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">Inactive</span>
          <span className="stat-value">{games.filter(g => g.status === 'HIDE').length}</span>
        </div>
      </div>

      {/* Toolbar */}
      <div className="all-games-toolbar">
        <div className="toolbar-left">
          <button className="toolbar-btn btn-add" onClick={handleAddGame}>
            <Plus size={16} />
            Add Game
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
      <div className="all-games-table-wrapper">
        <table className="all-games-table">
          <thead>
            <tr>
              <th className="col-checkbox">
                <input
                  type="checkbox"
                  checked={selectedIds.length === filteredGames.length && filteredGames.length > 0}
                  onChange={handleSelectAll}
                />
              </th>
              <th className="col-id">#</th>
              <th className="col-name">NAME</th>
              <th className="col-short">SHORT NAME</th>
              <th className="col-jodi">JODI RATE</th>
              <th className="col-haruf">HARUF RATE</th>
              <th className="col-open">OPEN TIME</th>
              <th className="col-close">CLOSE TIME</th>
              <th className="col-result">RESULT TIME</th>
              <th className="col-status">STATUS</th>
              <th className="col-action">ACTION</th>
            </tr>
          </thead>
          <tbody>
            {currentGames.map((game, index) => (
              <tr key={game.id} className={selectedIds.includes(game.id) ? 'selected' : ''}>
                <td>
                  <input
                    type="checkbox"
                    checked={selectedIds.includes(game.id)}
                    onChange={() => handleSelectOne(game.id)}
                  />
                </td>
                <td>{startIndex + index + 1}</td>
                <td className="game-name">{game.name}</td>
                <td className="game-short">{game.shortName}</td>
                <td>{game.jodiRate}</td>
                <td>{game.harufRate}</td>
                <td className="time">{game.openTime}</td>
                <td className="time">{game.closeTime}</td>
                <td className="time">{game.resultTime}</td>
                <td>
                  {editingGame === game.id ? (
                    <div className="status-edit">
                      <select 
                        className="status-select"
                        value={game.status}
                        onChange={(e) => {
                          setGames(games.map(g => 
                            g.id === game.id ? { ...g, status: e.target.value } : g
                          ))
                        }}
                      >
                        <option value="SHOW">SHOW</option>
                        <option value="HIDE">HIDE</option>
                      </select>
                      <button className="status-save-btn" onClick={() => handleSaveEdit(game.id)}>
                        <Save size={14} />
                      </button>
                      <button className="status-cancel-btn" onClick={handleCancelEdit}>
                        <XIcon size={14} />
                      </button>
                    </div>
                  ) : (
                    <button 
                      className={`status-badge ${game.status === 'SHOW' ? 'status-show' : 'status-hide'}`}
                      onClick={() => handleStatusToggle(game.id)}
                    >
                      {game.status === 'SHOW' ? <CheckCircle size={12} /> : <AlertCircle size={12} />}
                      {game.status}
                    </button>
                  )}
                </td>
                <td>
                  <div className="action-buttons">
                    {editingGame !== game.id && (
                      <button className="action-btn btn-edit" onClick={() => handleEdit(game)}>
                        <Edit2 size={14} />
                        Update
                      </button>
                    )}
                    <button className="action-btn btn-delete" onClick={() => handleDelete(game.id)}>
                      <Trash2 size={14} />
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Footer */}
      <div className="all-games-footer">
        <span>
          Total Data: {filteredGames.length} | Total Pages: {totalPages || 1}
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