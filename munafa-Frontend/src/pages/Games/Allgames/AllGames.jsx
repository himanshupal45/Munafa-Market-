import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Home as HomeIcon, Gamepad2, Edit2, Trash2, ChevronLeft, ChevronRight } from 'lucide-react'
import { gamesAPI } from '../../../services/api'
import { getBettingState } from '../../../utils/gameTime'
import './AllGames.css'

const fallbackGames = [
  { _id: '1', gameName: 'TARA DAY', openTime: '09:46 AM', closeTime: '09:47 AM', resultTime: '', status: true },
  { _id: '2', gameName: 'EXPRESS MORNING', openTime: '10:00 AM', closeTime: '11:00 AM', resultTime: '', status: true },
  { _id: '3', gameName: 'MILAN MORNING', openTime: '10:20 AM', closeTime: '11:20 AM', resultTime: '', status: true },
  { _id: '4', gameName: 'KALYAN MORNING', openTime: '11:00 AM', closeTime: '11:55 AM', resultTime: '', status: true },
  { _id: '5', gameName: 'MADHUR MORNING', openTime: '11:25 AM', closeTime: '12:25 PM', resultTime: '', status: true },
  { _id: '6', gameName: 'SRIDEVI DAY', openTime: '11:25 AM', closeTime: '12:20 PM', resultTime: '', status: true },
  { _id: '7', gameName: 'TIME BAZAR', openTime: '01:00 PM', closeTime: '02:00 PM', resultTime: '', status: true },
  { _id: '8', gameName: 'MADHUR DAY', openTime: '01:25 PM', closeTime: '02:25 PM', resultTime: '', status: true },
  { _id: '9', gameName: 'WORLI MUMBAI DAY', openTime: '01:30 PM', closeTime: '02:30 PM', resultTime: '', status: true },
  { _id: '10', gameName: 'RAJDHANI DAY', openTime: '03:00 PM', closeTime: '05:00 PM', resultTime: '', status: true },
]

const STATE_LABEL = {
  open: { text: 'OPEN', bg: '#dcfce7', color: '#16a34a' },
  upcoming: { text: 'UPCOMING', bg: '#fef9c3', color: '#a16207' },
  closed: { text: 'CLOSED', bg: '#fee2e2', color: '#dc2626' },
  unknown: { text: '--', bg: '#f3f4f6', color: '#6b7280' },
}

export default function AllGames({ dark }) {
  const navigate = useNavigate()
  const [games, setGames] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [, setTick] = useState(0) // har minute badge refresh
  const itemsPerPage = 10

  const fetchGames = async () => {
    setLoading(true)
    try {
      const res = await gamesAPI.getAll()
      if (res.success && res.games?.length > 0) {
        setGames(
          res.games.map((g) => ({
            _id: g._id,
            gameName: g.name || g.gameName,
            openTime: g.openTime || '--',
            closeTime: g.closeTime || '--',
            resultTime: g.resultTime || '',
            status: g.status === 'Active' || g.status === true,
          }))
        )
      } else {
        setGames(fallbackGames)
      }
    } catch (err) {
      console.log('Backend failed, using fallback data')
      setGames(fallbackGames)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchGames() }, [])

  useEffect(() => {
    const id = setInterval(() => setTick((t) => t + 1), 30000)
    return () => clearInterval(id)
  }, [])

  const handleStatusToggle = async (id) => {
    const updated = games.map((g) => (g._id === id ? { ...g, status: !g.status } : g))
    setGames(updated)
    try {
      const game = updated.find((g) => g._id === id)
      await gamesAPI.update(id, { status: game.status ? 'Active' : 'Inactive' })
    } catch (err) {
      console.log('Status toggle backend failed (showing local change)')
    }
  }

  const handleEdit = (id) => {
    alert(`Edit game: ${id}`)
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this game?')) return
    setGames((prev) => prev.filter((g) => g._id !== id))
    try {
      await gamesAPI.delete(id)
    } catch (err) {
      console.log('Delete backend failed (removed locally)')
    }
  }

  const handleAddNew = () => navigate('/games/add')

  const rowText = (g, i) =>
    [i + 1, g.gameName, g.openTime, g.closeTime, g.resultTime || '--', g.status ? 'ON' : 'OFF']

  const handleCopy = () => {
    const text = games.map((g, i) => rowText(g, i).join('\t')).join('\n')
    navigator.clipboard.writeText(text).then(() => alert('Copied!'))
  }

  const handleCSV = () => {
    const headers = ['#', 'Game Name', 'Open Time', 'Close Time', 'Result Time', 'Status']
    const rows = games.map((g, i) => rowText(g, i).map((v) => `"${v}"`).join(',')).join('\n')
    const blob = new Blob([`${headers.join(',')}\n${rows}`], { type: 'text/csv' })
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.download = `game_list_${Date.now()}.csv`
    link.click()
  }

  const tableHtml = () => {
    let html =
      '<table><thead><tr><th>#</th><th>Game Name</th><th>Open Time</th><th>Close Time</th><th>Result Time</th><th>Status</th></tr></thead><tbody>'
    games.forEach((g, i) => {
      html += `<tr>${rowText(g, i).map((v) => `<td>${v}</td>`).join('')}</tr>`
    })
    return html + '</tbody></table>'
  }

  const handleExcel = () => {
    const blob = new Blob([tableHtml()], { type: 'application/vnd.ms-excel' })
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.download = `game_list_${Date.now()}.xls`
    link.click()
  }

  const handlePrint = () => {
    const w = window.open('', '_blank')
    if (!w) return
    w.document.write(`<html><head><title>Game List</title>
      <style>body{font-family:Arial;padding:20px}table{width:100%;border-collapse:collapse}
      th,td{border:1px solid #ddd;padding:8px}th{background:#f5f5f5}</style></head><body>
      <h2>Game List</h2>${tableHtml()}</body></html>`)
    w.document.close()
    w.focus()
    setTimeout(() => { w.print(); w.close() }, 250)
  }

  const filteredGames = games.filter((g) =>
    g.gameName?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const totalPages = Math.max(1, Math.ceil(filteredGames.length / itemsPerPage))
  const safePage = Math.min(currentPage, totalPages)
  const startIndex = (safePage - 1) * itemsPerPage
  const currentGames = filteredGames.slice(startIndex, startIndex + itemsPerPage)

  const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1)

  return (
    <div className="gl-page">
      <div className="gl-breadcrumb">
        <HomeIcon size={14} />
        <span>Home</span>
        <span className="gl-breadcrumb-sep">/</span>
        <span>Game List</span>
      </div>

      <div className="gl-page-title-wrapper">
        <Gamepad2 size={26} className="gl-page-title-icon" />
        <h1 className="gl-page-title">Game List</h1>
      </div>

      <div className="gl-card">
        <div className="gl-card-top">
          <button className="gl-add-btn" onClick={handleAddNew} type="button">+Add New</button>
        </div>

        <div className="gl-toolbar">
          <div className="gl-toolbar-buttons">
            <button className="gl-toolbar-btn" onClick={handleCopy} type="button">Copy</button>
            <button className="gl-toolbar-btn" onClick={handleCSV} type="button">CSV</button>
            <button className="gl-toolbar-btn" onClick={handleExcel} type="button">Excel</button>
            <button className="gl-toolbar-btn" onClick={handlePrint} type="button">PDF</button>
            <button className="gl-toolbar-btn" onClick={handlePrint} type="button">Print</button>
          </div>
          <div className="gl-toolbar-search">
            <label>Search:</label>
            <input
              type="text"
              className="gl-search-input"
              value={searchTerm}
              onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1) }}
            />
          </div>
        </div>

        {error && <div className="gl-error">{error}</div>}

        <div className="gl-table-wrapper">
          <table className="gl-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Game Name</th>
                <th>Open Time</th>
                <th>Close Time</th>
                <th>Result Time</th>
                <th>Betting</th>
                <th>Game Status</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="7" className="gl-table-empty">Loading...</td></tr>
              ) : currentGames.length === 0 ? (
                <tr><td colSpan="7" className="gl-table-empty">No data available in table</td></tr>
              ) : (
                currentGames.map((game, i) => {
                  const s = STATE_LABEL[getBettingState(game)]
                  return (
                    <tr key={game._id}>
                      <td>{startIndex + i + 1}</td>
                      <td className="gl-game-name">{game.gameName}</td>
                      <td>{game.openTime}</td>
                      <td>{game.closeTime}</td>
                      <td>{game.resultTime || '--'}</td>
                      <td>
                        <span style={{ background: s.bg, color: s.color, padding: '2px 10px', borderRadius: '999px', fontSize: '12px', fontWeight: 600 }}>
                          {s.text}
                        </span>
                      </td>
                      <td>
                        <div className="gl-status-cell">
                          <label className="gl-toggle-switch">
                            <input type="checkbox" checked={game.status} onChange={() => handleStatusToggle(game._id)} />
                            <span className="gl-toggle-slider"></span>
                          </label>
                          <button className="gl-action-btn gl-edit-btn" onClick={() => handleEdit(game._id)} title="Edit" type="button">
                            <Edit2 size={14} />
                          </button>
                          <button className="gl-action-btn gl-delete-btn" onClick={() => handleDelete(game._id)} title="Delete" type="button">
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>

        <div className="gl-pagination">
          <button className="gl-page-btn" onClick={() => setCurrentPage(Math.max(safePage - 1, 1))} disabled={safePage === 1} type="button">
            <ChevronLeft size={16} />
          </button>
          {pageNumbers.map((page) => (
            <button
              key={page}
              className={`gl-page-btn ${page === safePage ? 'active' : ''}`}
              onClick={() => setCurrentPage(page)}
              type="button"
            >
              {page}
            </button>
          ))}
          <button className="gl-page-btn" onClick={() => setCurrentPage(Math.min(safePage + 1, totalPages))} disabled={safePage === totalPages} type="button">
            <ChevronRight size={16} />
          </button>
        </div>
      </div>
    </div>
  )
}