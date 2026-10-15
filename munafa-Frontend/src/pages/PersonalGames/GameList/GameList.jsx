import React, { useState } from 'react'
import { Home as HomeIcon, Swords, Plus, Trash2, Edit2, ChevronLeft, ChevronRight } from 'lucide-react'
import './GameList.css'

export default function GameList() {
  const [searchTerm, setSearchTerm] = useState('')

  // ✅ Sample data (empty initially per screenshot)
  const [games, setGames] = useState([])

  // ============= HANDLERS =============
  const handleAddNew = () => {
    alert('Add New Game')
    // navigate('/personal-games/disawar/add-game')
  }

  const handleEdit = (id) => alert(`Edit game: ${id}`)
  const handleDelete = (id) => {
    if (window.confirm('Delete this game?')) {
      setGames(prev => prev.filter(g => g.id !== id))
    }
  }

  // ============= TOOLBAR =============
  const handleCopy = () => {
    if (games.length === 0) { alert('No data to copy'); return }
    const text = games.map(g => `${g.gameName}\t${g.closeTime}\t${g.status}`).join('\n')
    navigator.clipboard.writeText(text).then(() => alert('✅ Copied!'))
  }

  const handleCSV = () => {
    if (games.length === 0) { alert('No data to export'); return }
    const headers = ['#', 'Game Name', 'Close Time', 'Game Status']
    const rows = games.map((g, i) =>
      `${i + 1},${g.gameName},${g.closeTime},${g.status}`
    ).join('\n')
    const blob = new Blob([`${headers.join(',')}\n${rows}`], { type: 'text/csv' })
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.download = `disawar_games_${Date.now()}.csv`
    link.click()
  }

  const handleExcel = () => {
    if (games.length === 0) { alert('No data to export'); return }
    let html = '<table><thead><tr><th>#</th><th>Game Name</th><th>Close Time</th><th>Game Status</th></tr></thead><tbody>'
    games.forEach((g, i) => {
      html += `<tr><td>${i + 1}</td><td>${g.gameName}</td><td>${g.closeTime}</td><td>${g.status}</td></tr>`
    })
    html += '</tbody></table>'
    const blob = new Blob([html], { type: 'application/vnd.ms-excel' })
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.download = `disawar_games_${Date.now()}.xls`
    link.click()
  }

  const handlePrint = () => {
    if (games.length === 0) { alert('No data to print'); return }
    const w = window.open('', '_blank')
    let html = `<html><head><title>Game List</title>
      <style>body{font-family:Arial;padding:20px}table{width:100%;border-collapse:collapse}
      th,td{border:1px solid #ddd;padding:8px}th{background:#f5f5f5}</style></head><body>
      <h2>Game List</h2>
      <table><thead><tr><th>#</th><th>Game Name</th><th>Close Time</th><th>Game Status</th></tr></thead><tbody>`
    games.forEach((g, i) => {
      html += `<tr><td>${i + 1}</td><td>${g.gameName}</td><td>${g.closeTime}</td><td>${g.status}</td></tr>`
    })
    html += `</tbody></table></body></html>`
    w.document.write(html)
    w.document.close()
    w.focus()
    setTimeout(() => { w.print(); w.close() }, 250)
  }

  const filteredGames = games.filter(g =>
    g.gameName.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="dgl-page">
      {/* ✅ Breadcrumb */}
      <div className="dgl-breadcrumb">
        <HomeIcon size={14} />
        <span>Home</span>
        <span className="dgl-breadcrumb-sep">/</span>
        <span>Game List</span>
      </div>

      {/* ✅ Page Title with Icon */}
      <div className="dgl-page-title-wrapper">
        <Swords size={26} className="dgl-page-title-icon" />
        <h1 className="dgl-page-title">Game List</h1>
      </div>

      {/* ✅ Main Card */}
      <div className="dgl-card">
        {/* +Add New Button */}
        <div className="dgl-card-top">
          <button className="dgl-add-btn" onClick={handleAddNew} type="button">
            +Add New
          </button>
        </div>

        {/* Toolbar */}
        <div className="dgl-toolbar">
          <div className="dgl-toolbar-buttons">
            <button className="dgl-toolbar-btn" onClick={handleCopy} type="button">Copy</button>
            <button className="dgl-toolbar-btn" onClick={handleCSV} type="button">CSV</button>
            <button className="dgl-toolbar-btn" onClick={handleExcel} type="button">Excel</button>
            <button className="dgl-toolbar-btn" onClick={handlePrint} type="button">PDF</button>
            <button className="dgl-toolbar-btn" onClick={handlePrint} type="button">Print</button>
          </div>
          <div className="dgl-toolbar-search">
            <label>Search:</label>
            <input
              type="text"
              className="dgl-search-input"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Table */}
        <div className="dgl-table-wrapper">
          <table className="dgl-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Game Name</th>
                <th>Close Time</th>
                <th>Game Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredGames.length === 0 ? (
                <tr>
                  <td colSpan="4" className="dgl-table-empty">
                    No data available in table
                  </td>
                </tr>
              ) : (
                filteredGames.map((game, i) => (
                  <tr key={game.id}>
                    <td>{i + 1}</td>
                    <td>{game.gameName}</td>
                    <td>{game.closeTime}</td>
                    <td>{game.status}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="dgl-pagination">
          <button className="dgl-page-btn" type="button">
            <ChevronLeft size={16} />
          </button>
          <button className="dgl-page-btn active" type="button">1</button>
          <button className="dgl-page-btn" type="button">
            <ChevronRight size={16} />
          </button>
        </div>
      </div>
    </div>
  )
}