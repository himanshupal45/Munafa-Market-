import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { 
  X, Trophy, Plus, Search, Trash2, 
  Edit2, ChevronLeft, ChevronRight,
  CheckCircle, AlertCircle, Save
} from 'lucide-react'
import { gamesAPI } from '../../../services/api'
import './GameResults.css'

export default function GameResults({ dark }) {
  const navigate = useNavigate()
  const [results, setResults] = useState([])
  const [games, setGames] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [selectedIds, setSelectedIds] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [editingResult, setEditingResult] = useState(null)
  const [editData, setEditData] = useState({ game: '', result: '' })
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10

  // ✅ Backend se results fetch karo
  const fetchResults = async () => {
    setLoading(true)
    try {
      const [resultsRes, gamesRes] = await Promise.all([
        gamesAPI.getResults(),
        gamesAPI.getAll()
      ])
      if (resultsRes.success) setResults(resultsRes.results)
      if (gamesRes.success) setGames(gamesRes.games)
    } catch (err) {
      setError('Results load nahi hue: ' + err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchResults() }, [])

  const handleSelectAll = (e) => {
    setSelectedIds(e.target.checked ? results.map(r => r._id) : [])
  }

  const handleSelectOne = (id) => {
    setSelectedIds(prev => prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id])
  }

  // ✅ Publish result — bets settle honge
  const handlePublish = async (result) => {
    if (!window.confirm(`Result publish karna chahte ho? Winning wallets credit ho jayenge.`)) return
    try {
      const res = await gamesAPI.publishResult(result._id)
      if (res.success) {
        setResults(prev => prev.map(r => r._id === result._id ? { ...r, isPublished: true } : r))
        alert('✅ Result publish ho gaya! Winning bets settle ho gayi.')
      }
    } catch (err) {
      alert('Publish nahi hua: ' + err.message)
    }
  }

  const handleEdit = (result) => {
    setEditingResult(result._id)
    setEditData({ game: result.game?._id || result.game, result: result.result })
  }

  const handleSaveEdit = async (id) => {
    try {
      // Note: result update API nahi hai — sirf local update
      setResults(prev => prev.map(r => r._id === id ? { ...r, result: editData.result } : r))
      setEditingResult(null)
    } catch (err) {
      alert('Update nahi hua: ' + err.message)
    }
  }

  const filteredResults = results.filter(r =>
    r.gameName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.result?.includes(searchTerm)
  )

  const totalPages = Math.ceil(filteredResults.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const currentResults = filteredResults.slice(startIndex, startIndex + itemsPerPage)

  const getPageNumbers = () => {
    const pages = []
    const maxVisible = 5
    let start = Math.max(1, currentPage - Math.floor(maxVisible / 2))
    let end = Math.min(totalPages, start + maxVisible - 1)
    if (end - start + 1 < maxVisible) start = Math.max(1, end - maxVisible + 1)
    for (let i = start; i <= end; i++) pages.push(i)
    return pages
  }

  return (
    <div className={`game-results ${dark ? 'dark' : 'light'}`}>
      <div className="gr-header">
        <div className="gr-header-left">
          <Trophy size={24} className="gr-icon" />
          <h1 className="gr-title">Result</h1>
        </div>
      </div>

      <div className="gr-stats">
        <div className="stat-item">
          <span className="stat-label">Total Results</span>
          <span className="stat-value">{results.length}</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">Published</span>
          <span className="stat-value">{results.filter(r => r.isPublished).length}</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">Pending</span>
          <span className="stat-value">{results.filter(r => !r.isPublished).length}</span>
        </div>
      </div>

      <div className="gr-toolbar">
        <div className="toolbar-left">
          <button className="toolbar-btn btn-add" onClick={() => navigate('/games/add-result')}>
            <Plus size={16} /> Add Result
          </button>
        </div>
        <div className="toolbar-right">
          <div className="search-box">
            <Search size={16} className="search-icon" />
            <input type="text" placeholder="Search game ya number..." value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)} className="search-input" />
          </div>
        </div>
      </div>

      {error && (
        <div style={{ background: '#fee2e2', color: '#dc2626', padding: '10px 16px', borderRadius: '8px', marginBottom: '16px' }}>
          {error}
        </div>
      )}

      <div className="gr-table-wrapper">
        <table className="gr-table">
          <thead>
            <tr>
              <th><input type="checkbox" checked={selectedIds.length === filteredResults.length && filteredResults.length > 0} onChange={handleSelectAll} /></th>
              <th>#</th>
              <th>DATE</th>
              <th>GAME</th>
              <th>NUMBER</th>
              <th>STATUS</th>
              <th>ACTION</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="7" style={{ textAlign: 'center', padding: '30px', color: '#888' }}>Loading...</td></tr>
            ) : currentResults.length === 0 ? (
              <tr><td colSpan="7" style={{ textAlign: 'center', padding: '30px', color: '#888' }}>Koi result nahi mila</td></tr>
            ) : currentResults.map((result, index) => (
              <tr key={result._id} className={selectedIds.includes(result._id) ? 'selected' : ''}>
                <td><input type="checkbox" checked={selectedIds.includes(result._id)} onChange={() => handleSelectOne(result._id)} /></td>
                <td>{startIndex + index + 1}</td>
                <td>{new Date(result.date || result.createdAt).toLocaleDateString('en-IN')}</td>
                <td>{result.gameName || result.game?.name || '-'}</td>
                <td>
                  {editingResult === result._id ? (
                    <input type="text" maxLength="2" value={editData.result}
                      onChange={(e) => setEditData(p => ({ ...p, result: e.target.value.replace(/[^0-9]/g, '') }))}
                      className="edit-input" style={{ width: '60px' }} />
                  ) : result.result}
                </td>
                <td>
                  <span className={`status-badge ${result.isPublished ? 'status-show' : 'status-hide'}`}>
                    {result.isPublished ? <><CheckCircle size={12} /> PUBLISHED</> : <><AlertCircle size={12} /> PENDING</>}
                  </span>
                </td>
                <td>
                  <div className="action-buttons">
                    {editingResult === result._id ? (
                      <>
                        <button className="action-btn btn-save" onClick={() => handleSaveEdit(result._id)}><Save size={14} /> Save</button>
                        <button className="action-btn btn-cancel" onClick={() => setEditingResult(null)}><X size={14} /></button>
                      </>
                    ) : (
                      <>
                        {!result.isPublished && (
                          <>
                            <button className="action-btn btn-edit" onClick={() => handleEdit(result)}><Edit2 size={14} /> Update</button>
                            <button className="action-btn btn-add" onClick={() => handlePublish(result)}><CheckCircle size={14} /> Publish</button>
                          </>
                        )}
                        {result.isPublished && (
                          <span style={{ color: '#16a34a', fontSize: '12px' }}>✅ Published</span>
                        )}
                      </>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="gr-footer">
        <span>Total Data: {filteredResults.length} | Total Pages: {totalPages || 1}</span>
        {totalPages > 1 && (
          <div className="pagination">
            <button className="pagination-btn" onClick={() => setCurrentPage(p => Math.max(p - 1, 1))} disabled={currentPage === 1}>
              <ChevronLeft size={16} />
            </button>
            <div className="pagination-numbers">
              {getPageNumbers().map(page => (
                <button key={page} className={`pagination-number ${page === currentPage ? 'active' : ''}`} onClick={() => setCurrentPage(page)}>{page}</button>
              ))}
            </div>
            <button className="pagination-btn" onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))} disabled={currentPage === totalPages}>
              <ChevronRight size={16} />
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
