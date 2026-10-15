import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Users as UsersIcon, Eye,
  ChevronLeft, ChevronRight, Home as HomeIcon, RefreshCw, Loader
} from 'lucide-react'
import './AllUsers.css'
import { usersAPI } from '../../services/api'

export default function Users({ dark }) {
  const navigate = useNavigate()
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10

  // ─── Fetch from backend ───────────────────
  const fetchUsers = async () => {
    setLoading(true)
    setError('')
    try {
      const data = await usersAPI.getAll()
      const mapped = (data.users || []).map(u => ({
        id: u._id,
        name: u.name || '-',
        mobile: u.mobile || '-',
        points: (u.wallet || 0).toFixed(2),
        regDate: u.createdAt ? new Date(u.createdAt).toLocaleDateString('en-IN') : '-',
        betting: u.status !== 'Blocked',
        paytm: true,
        pointTransfer: false,
        active: u.status === 'Active',
        password: '••••••',
        status: u.status === 'Active' ? 'approved' : 'unapproved',
        _raw: u,
      }))
      setUsers(mapped)
    } catch (err) {
      setError(err.message || 'Users load nahi ho sake')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchUsers() }, [])
  useEffect(() => { setCurrentPage(1) }, [searchTerm])

  // ─── Toggle status ────────────────────────
  const handleToggle = async (id, field) => {
    const user = users.find(u => u.id === id)
    if (!user) return
    setUsers(prev => prev.map(u => u.id === id ? { ...u, [field]: !u[field] } : u))
    try {
      if (field === 'active' || field === 'betting') {
        const newStatus = user.active ? 'Blocked' : 'Active'
        await usersAPI.updateStatus(id, newStatus)
      }
    } catch (err) {
      setUsers(prev => prev.map(u => u.id === id ? { ...u, [field]: !u[field] } : u))
      alert('Update fail: ' + err.message)
    }
  }

  const handleView = (user) => {
    navigate('/user-profile', { state: { user: user._raw || user } })
  }

  // ─── Filter (sirf search, no tab) ─────────
  const filteredUsers = users.filter(u => {
    const matchesSearch =
      u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.mobile.includes(searchTerm)
    return matchesSearch
  })

  // ─── Pagination ───────────────────────────
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = Math.min(startIndex + itemsPerPage, filteredUsers.length)
  const currentUsers = filteredUsers.slice(startIndex, endIndex)

  const goToPage = (page) => setCurrentPage(Math.max(1, Math.min(page, totalPages)))

  const getPageNumbers = () => {
    const pages = []
    const maxVisible = 5
    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) pages.push(i)
    } else {
      let start = Math.max(1, currentPage - Math.floor(maxVisible / 2))
      let end = Math.min(totalPages, start + maxVisible - 1)
      if (end - start + 1 < maxVisible) start = Math.max(1, end - maxVisible + 1)
      for (let i = start; i <= end; i++) pages.push(i)
    }
    return pages
  }

  // ─── Export helpers ───────────────────────
  const handleCopy = () => {
    const header = '#\tName\tUser Mobile\tPoints\tRegistration Date\tBetting\tActive'
    const rows = filteredUsers.map((u, i) =>
      `${i+1}\t${u.name}\t${u.mobile}\t${u.points}\t${u.regDate}\t${u.betting?'ON':'OFF'}\t${u.active?'ON':'OFF'}`
    ).join('\n')
    navigator.clipboard.writeText(`${header}\n${rows}`)
      .then(() => alert('✅ Copied!')).catch(() => alert('❌ Copy fail'))
  }

  const handleCSV = () => {
    const header = '#,Name,User Mobile,Points,Registration Date,Betting,Active'
    const rows = filteredUsers.map((u, i) =>
      `${i+1},${u.name},${u.mobile},${u.points},${u.regDate},${u.betting?'ON':'OFF'},${u.active?'ON':'OFF'}`
    ).join('\n')
    const blob = new Blob([`${header}\n${rows}`], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.download = `users_${Date.now()}.csv`
    link.click()
  }

  const handlePrint = () => {
    const win = window.open('', '_blank')
    let html = `<html><head><title>Users</title><style>body{font-family:Arial;padding:20px}table{width:100%;border-collapse:collapse}th,td{border:1px solid #ddd;padding:8px}th{background:#f5f5f5}</style></head><body><h2>Users</h2><table><thead><tr><th>#</th><th>Name</th><th>Mobile</th><th>Points</th><th>Reg Date</th><th>Active</th></tr></thead><tbody>`
    filteredUsers.forEach((u, i) => {
      html += `<tr><td>${i+1}</td><td>${u.name}</td><td>${u.mobile}</td><td>${u.points}</td><td>${u.regDate}</td><td>${u.active?'ON':'OFF'}</td></tr>`
    })
    html += '</tbody></table></body></html>'
    win.document.write(html)
    win.document.close()
    setTimeout(() => { win.print(); win.close() }, 250)
  }

  // ─── Loading / Error ──────────────────────
  if (loading) return (
    <div style={{ display:'flex', justifyContent:'center', alignItems:'center', minHeight:'300px', gap:'12px', color:'#6b7280' }}>
      <Loader size={24} style={{ animation:'spin 1s linear infinite' }} />
      <span>Users load ho rahe hain...</span>
    </div>
  )

  if (error) return (
    <div style={{ display:'flex', flexDirection:'column', justifyContent:'center', alignItems:'center', minHeight:'300px', gap:'12px', color:'#ef4444' }}>
      <p>{error}</p>
      <button onClick={fetchUsers} style={{ display:'flex', alignItems:'center', gap:'8px', padding:'8px 16px', background:'#3b82f6', color:'#fff', border:'none', borderRadius:'8px', cursor:'pointer' }}>
        <RefreshCw size={16} /> Dobara Try Karein
      </button>
    </div>
  )

  return (
    <div className={`users-page ${dark ? 'dark' : 'light'}`}>
      {/* Breadcrumb */}
      <div className="users-breadcrumb">
        <HomeIcon size={14} />
        <span>Home</span>
        <span className="breadcrumb-sep">/</span>
        <span>User</span>
      </div>

      {/* Title */}
      <div className="users-page-title-wrapper">
        <UsersIcon size={26} className="users-page-title-icon" />
        <h1 className="users-page-title">User</h1>
        <button onClick={fetchUsers} style={{ marginLeft:'auto', display:'flex', alignItems:'center', gap:'6px', padding:'6px 12px', background:'#3b82f6', color:'#fff', border:'none', borderRadius:'8px', cursor:'pointer', fontSize:'13px' }}>
          <RefreshCw size={14} /> Refresh
        </button>
      </div>

      {/* ❌ Tabs hata diye — sirf ek list */}

      {/* Toolbar */}
      <div className="users-toolbar">
        <div className="users-toolbar-left">
          <button className="users-toolbar-btn" onClick={handleCopy}>Copy</button>
          <button className="users-toolbar-btn" onClick={handleCSV}>CSV</button>
          <button className="users-toolbar-btn" onClick={handlePrint}>Print</button>
        </div>
        <div className="users-toolbar-right">
          <label className="users-search-label">Search:</label>
          <input type="text" className="users-search-input" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} placeholder="Name ya mobile..." />
        </div>
      </div>

      {/* Table */}
      <div className="users-table-wrapper">
        <table className="users-data-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Name</th>
              <th>User Mobile</th>
              <th>Points</th>
              <th>Registration Date</th>
              <th>Betting</th>
              <th>Paytm</th>
              <th>Point Transfer</th>
              <th>Active</th>
              <th>View</th>
            </tr>
          </thead>
          <tbody>
            {currentUsers.length === 0 ? (
              <tr><td colSpan="10" className="users-table-empty">Koi user nahi mila</td></tr>
            ) : currentUsers.map((user, index) => (
              <tr key={user.id}>
                <td>{startIndex + index + 1}</td>
                <td className="user-name-cell">{user.name}</td>
                <td>{user.mobile}</td>
                <td>{user.points}</td>
                <td>{user.regDate}</td>
                <td>
                  <label className="toggle-switch">
                    <input type="checkbox" checked={user.betting} onChange={() => handleToggle(user.id, 'betting')} />
                    <span className="toggle-slider"></span>
                  </label>
                </td>
                <td>
                  <label className="toggle-switch">
                    <input type="checkbox" checked={user.paytm} onChange={() => handleToggle(user.id, 'paytm')} />
                    <span className="toggle-slider"></span>
                  </label>
                </td>
                <td>
                  <label className="toggle-switch">
                    <input type="checkbox" checked={user.pointTransfer} onChange={() => handleToggle(user.id, 'pointTransfer')} />
                    <span className="toggle-slider"></span>
                  </label>
                </td>
                <td>
                  <label className="toggle-switch">
                    <input type="checkbox" checked={user.active} onChange={() => handleToggle(user.id, 'active')} />
                    <span className="toggle-slider"></span>
                  </label>
                </td>
                <td>
                  <button className="user-view-btn" onClick={() => handleView(user)} title="View Profile">
                    <Eye size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="users-pagination-wrapper">
        <span className="users-pagination-info">
          Showing {filteredUsers.length === 0 ? 0 : startIndex + 1} to {Math.min(endIndex, filteredUsers.length)} of {filteredUsers.length} entries
        </span>
        {totalPages > 1 && (
          <div className="users-pagination">
            <button className="users-page-btn" onClick={() => goToPage(currentPage - 1)} disabled={currentPage === 1}><ChevronLeft size={16} /></button>
            {getPageNumbers().map(page => (
              <button key={page} className={`users-page-btn ${page === currentPage ? 'active' : ''}`} onClick={() => goToPage(page)}>{page}</button>
            ))}
            <button className="users-page-btn" onClick={() => goToPage(currentPage + 1)} disabled={currentPage === totalPages}><ChevronRight size={16} /></button>
          </div>
        )}
      </div>
    </div>
  )
}