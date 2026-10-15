import React, { useState, useRef, useEffect, useMemo, useCallback } from 'react'
import {
  Home as HomeIcon,
  Minus,
  X,
  Calendar,
  ChevronDown,
  Edit3,
  CheckCircle,
} from 'lucide-react'
import { gamesAPI } from '../../services/api'
import './DeclareResult.css'

// ============================================
// HELPERS
// ============================================
const todayStr = () => {
  const d = new Date()
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

const toDateStr = (value) => {
  if (!value) return ''
  const d = new Date(value)
  if (isNaN(d)) return ''
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

// Saari valid 3-digit panna (220). Digit order: 1..9 phir 0 (0 ko 10 mana jata hai)
const generatePanas = () => {
  const rank = (d) => (d === 0 ? 10 : d)
  const list = []
  for (let a = 0; a <= 9; a++)
    for (let b = 0; b <= 9; b++)
      for (let c = 0; c <= 9; c++)
        if (rank(a) <= rank(b) && rank(b) <= rank(c)) list.push(`${a}${b}${c}`)
  return list.sort((x, y) => Number(x) - Number(y))
}
const PANA_OPTIONS = generatePanas()

const digitFromPana = (pana) =>
  pana && pana.length === 3
    ? String([...pana].reduce((s, n) => s + Number(n), 0) % 10)
    : ''

const gameLabel = (g) =>
  g.closeTime ? `${g.name} (${g.openTime} - ${g.closeTime})` : `${g.name} (${g.openTime || '--'})`

// Backend ke alag-alag result shapes ko ek table row me badalna.
// Dono support: (openPana/closePana fields) ya (session + result fields)
const normalizeResults = (results) => {
  const map = new Map()
  results.forEach((r) => {
    const dateStr = toDateStr(r.date || r.createdAt)
    const key = `${r.gameId || r.gameName}_${dateStr}`
    const row = map.get(key) || {
      id: r._id,
      ids: [],
      gameName: r.gameName,
      resultDate: dateStr,
      openPana: '',
      closePana: '',
      published: true,
    }
    row.ids.push(r._id)
    if (!r.isPublished) row.published = false
    if (r.openPana) row.openPana = r.openPana
    if (r.closePana) row.closePana = r.closePana
    const s = String(r.session || '').toLowerCase()
    if (s.startsWith('open') && r.result) row.openPana = r.pana || r.result
    if (s.startsWith('close') && r.result) row.closePana = r.pana || r.result
    if (!s && !r.openPana && !r.closePana && r.result) row.openPana = r.result
    map.set(key, row)
  })
  return [...map.values()].sort((a, b) => b.resultDate.localeCompare(a.resultDate))
}

// ============================================
// SEARCHABLE DROPDOWN
// ============================================
const SearchableDropdown = ({ value, onChange, options, placeholder = 'Select', disabled = false }) => {
  const [isOpen, setIsOpen] = useState(false)
  const [searchText, setSearchText] = useState('')
  const dropdownRef = useRef(null)
  const searchInputRef = useRef(null)

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false)
        setSearchText('')
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  useEffect(() => {
    if (isOpen && searchInputRef.current) {
      setTimeout(() => searchInputRef.current?.focus(), 50)
    }
  }, [isOpen])

  const filteredOptions = options.filter((opt) =>
    String(opt).toLowerCase().includes(searchText.toLowerCase())
  )

  const handleSelect = (option) => {
    onChange(option)
    setIsOpen(false)
    setSearchText('')
  }

  return (
    <div className="sd-wrapper" ref={dropdownRef}>
      <button
        type="button"
        disabled={disabled}
        className={`sd-trigger ${isOpen ? 'sd-trigger-open' : ''}`}
        onClick={() => setIsOpen((p) => !p)}
      >
        <span className={value ? 'sd-value' : 'sd-placeholder'}>{value || placeholder}</span>
        <ChevronDown size={16} className={`sd-arrow ${isOpen ? 'sd-arrow-open' : ''}`} />
      </button>

      {isOpen && (
        <div className="sd-menu">
          <div className="sd-search-wrapper">
            <input
              ref={searchInputRef}
              type="text"
              className="sd-search-input"
              placeholder="Search..."
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
            />
          </div>
          <div className="sd-options">
            {filteredOptions.length === 0 ? (
              <div className="sd-no-match">No match found</div>
            ) : (
              filteredOptions.map((option) => (
                <div
                  key={option}
                  className={`sd-option ${value === option ? 'sd-option-selected' : ''}`}
                  onClick={() => handleSelect(option)}
                >
                  {option}
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  )
}

// ============================================
// MAIN COMPONENT
// ============================================
const PAGE_SIZE = 10

export default function DeclareResult() {
  const [filtersOpen, setFiltersOpen] = useState(true)

  // Form
  const [date, setDate] = useState(todayStr())
  const [game, setGame] = useState('') // label string
  const [session, setSession] = useState('')
  const [pana, setPana] = useState('')
  const [digit, setDigit] = useState('')

  // API data
  const [games, setGames] = useState([])
  const [results, setResults] = useState([])
  const [loadingGames, setLoadingGames] = useState(true)
  const [loadingResults, setLoadingResults] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState(null) // { type: 'ok' | 'err', text }

  // Table
  const [tableDate, setTableDate] = useState(todayStr())
  const [searchTerm, setSearchTerm] = useState('')
  const [page, setPage] = useState(1)

  const sessionOptions = ['Open Market', 'Close Market']

  const showMsg = (type, text) => {
    setMessage({ type, text })
    setTimeout(() => setMessage(null), 4000)
  }

  // ---------- Fetch games ----------
  useEffect(() => {
    let active = true
    ;(async () => {
      try {
        const res = await gamesAPI.getAll()
        if (active && res?.success) setGames(res.games || [])
      } catch (err) {
        if (active) showMsg('err', err.message || 'Games load nahi hue')
      } finally {
        if (active) setLoadingGames(false)
      }
    })()
    return () => { active = false }
  }, [])

  // ---------- Fetch results ----------
  const fetchResults = useCallback(async () => {
    setLoadingResults(true)
    try {
      const res = await gamesAPI.getResults({ limit: 500 })
      if (res?.success) setResults(res.results || [])
    } catch (err) {
      showMsg('err', err.message || 'Results load nahi hue')
      setResults([])
    } finally {
      setLoadingResults(false)
    }
  }, [])

  useEffect(() => { fetchResults() }, [fetchResults])

  // ---------- Derived ----------
  const gameOptions = useMemo(() => games.map(gameLabel), [games])
  const selectedGame = useMemo(() => games.find((g) => gameLabel(g) === game), [games, game])

  const rows = useMemo(() => normalizeResults(results), [results])

  const filteredRows = useMemo(() => {
    const q = searchTerm.trim().toLowerCase()
    return rows.filter((r) => {
      if (tableDate && r.resultDate !== tableDate) return false
      if (!q) return true
      return [r.gameName, r.resultDate, r.openPana, r.closePana]
        .join(' ')
        .toLowerCase()
        .includes(q)
    })
  }, [rows, tableDate, searchTerm])

  const totalPages = Math.max(1, Math.ceil(filteredRows.length / PAGE_SIZE))
  const pageRows = filteredRows.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  useEffect(() => { setPage(1) }, [tableDate, searchTerm])

  // Pana chunne par digit apne aap nikal aaye
  const handlePanaChange = (p) => {
    setPana(p)
    setDigit(digitFromPana(p))
  }

  // ---------- Save (declare) ----------
  const handleSave = async () => {
    if (!selectedGame) return showMsg('err', 'Pehle Game select karo')
    if (!session) return showMsg('err', 'Session select karo')
    if (!pana) return showMsg('err', 'Pana select karo')

    setSaving(true)
    try {
      const res = await gamesAPI.addResult(selectedGame._id, pana, {
        date,
        session: session === 'Open Market' ? 'open' : 'close',
        pana,
        digit,
      })
      if (res?.success === false) throw new Error(res.message)

      // Naya result bana to use publish bhi kar do (response me result ka _id ho to)
      const newId = res?.result?._id
      if (newId) await gamesAPI.publishResult(newId)

      const st = res?.settled
      showMsg(
        'ok',
        st
          ? `Result declare ho gaya ✅  Jeete: ${st.won}, Haare: ${st.lost}, Payout: ₹${Math.round(st.payout).toLocaleString('en-IN')}`
          : 'Result declare ho gaya ✅'
      )
      setPana('')
      setDigit('')
      await fetchResults()
    } catch (err) {
      showMsg('err', err.message || 'Result save nahi hua')
    } finally {
      setSaving(false)
    }
  }

  // ---------- Publish ----------
  const handlePublish = async (row) => {
    try {
      await Promise.all(row.ids.map((id) => gamesAPI.publishResult(id)))
      showMsg('ok', 'Result publish ho gaya ✅')
      await fetchResults()
    } catch (err) {
      showMsg('err', err.message || 'Publish nahi hua')
    }
  }

  // ---------- Export ----------
  const exportData = filteredRows.map((r, i) => ({
    '#': i + 1,
    'Game Name': r.gameName,
    'Result Date': r.resultDate,
    'Open Pana': r.openPana,
    'Close Pana': r.closePana,
  }))

  const handleCopy = () => {
    if (!exportData.length) return showMsg('err', 'Copy karne ke liye data nahi hai')
    const text = exportData.map((row) => Object.values(row).join('\t')).join('\n')
    navigator.clipboard.writeText(text).then(() => showMsg('ok', 'Copied ✅'))
  }

  const handleCSV = () => {
    if (!exportData.length) return showMsg('err', 'Export ke liye data nahi hai')
    const headers = Object.keys(exportData[0]).join(',')
    const body = exportData
      .map((row) => Object.values(row).map((v) => `"${String(v).replace(/"/g, '""')}"`).join(','))
      .join('\n')
    const blob = new Blob([`${headers}\n${body}`], { type: 'text/csv' })
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.download = `declare_result_${Date.now()}.csv`
    link.click()
    URL.revokeObjectURL(link.href)
  }

  const handleExcel = () => {
    if (!exportData.length) return showMsg('err', 'Export ke liye data nahi hai')
    let html = '<table><thead><tr>'
    Object.keys(exportData[0]).forEach((k) => (html += `<th>${k}</th>`))
    html += '</tr></thead><tbody>'
    exportData.forEach((row) => {
      html += '<tr>' + Object.values(row).map((v) => `<td>${v}</td>`).join('') + '</tr>'
    })
    html += '</tbody></table>'
    const blob = new Blob([html], { type: 'application/vnd.ms-excel' })
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.download = `declare_result_${Date.now()}.xls`
    link.click()
    URL.revokeObjectURL(link.href)
  }

  const handlePrint = () => {
    if (!exportData.length) return showMsg('err', 'Print ke liye data nahi hai')
    const w = window.open('', '_blank')
    if (!w) return showMsg('err', 'Popup block hai, allow karo')
    w.document.write(`<html><head><title>Declare Result</title>
      <style>body{font-family:Arial;padding:20px}table{width:100%;border-collapse:collapse}
      th,td{border:1px solid #ddd;padding:8px}th{background:#f5f5f5}</style></head><body>
      <h2>Declare Result</h2>
      <table><thead><tr>${Object.keys(exportData[0]).map((k) => `<th>${k}</th>`).join('')}</tr></thead>
      <tbody>${exportData.map((row) => `<tr>${Object.values(row).map((v) => `<td>${v}</td>`).join('')}</tr>`).join('')}</tbody>
      </table></body></html>`)
    w.document.close()
    w.focus()
    setTimeout(() => { w.print(); w.close() }, 250)
  }

  // ============================================
  // RENDER
  // ============================================
  return (
    <div className="dr-page">
      <div className="dr-breadcrumb">
        <HomeIcon size={14} />
        <span>Home</span>
        <span className="dr-breadcrumb-sep">/</span>
        <span>Declare Result</span>
      </div>

      <div className="dr-page-title-wrapper">
        <Edit3 size={26} className="dr-page-title-icon" />
        <h1 className="dr-page-title">Declare Result</h1>
      </div>

      {message && (
        <div
          role="status"
          style={{
            margin: '0 0 12px',
            padding: '10px 14px',
            borderRadius: 8,
            fontSize: 14,
            background: message.type === 'ok' ? '#dcfce7' : '#fee2e2',
            color: message.type === 'ok' ? '#166534' : '#991b1b',
          }}
        >
          {message.text}
        </div>
      )}

      {filtersOpen && (
        <div className="dr-card dr-filters-card">
          <div className="dr-filters-header">
            <h3 className="dr-filters-title">Filters</h3>
            <div className="dr-filters-actions">
              <button className="dr-icon-btn" onClick={() => setFiltersOpen(false)} title="Minimize" type="button">
                <Minus size={16} />
              </button>
              <button className="dr-icon-btn" onClick={() => setFiltersOpen(false)} title="Close" type="button">
                <X size={16} />
              </button>
            </div>
          </div>

          <div className="dr-filters-body">
            <div className="dr-filters-row">
              <div className="dr-form-group">
                <label className="dr-label">Date</label>
                <input type="date" className="dr-input" value={date} onChange={(e) => setDate(e.target.value)} />
              </div>

              <div className="dr-form-group">
                <label className="dr-label">Game</label>
                <SearchableDropdown
                  value={game}
                  onChange={setGame}
                  options={gameOptions}
                  disabled={loadingGames}
                  placeholder={loadingGames ? 'Loading games...' : 'Select Game'}
                />
              </div>

              <div className="dr-form-group">
                <label className="dr-label">Session</label>
                <SearchableDropdown
                  value={session}
                  onChange={setSession}
                  options={sessionOptions}
                  placeholder="Select Session"
                />
              </div>

              <div className="dr-form-group">
                <label className="dr-label">Pana</label>
                <SearchableDropdown
                  value={pana}
                  onChange={handlePanaChange}
                  options={PANA_OPTIONS}
                  placeholder="Select Pana"
                />
              </div>

              <div className="dr-form-group">
                <label className="dr-label">Digit</label>
                <input
                  type="text"
                  className="dr-input dr-input-digit"
                  maxLength="1"
                  value={digit}
                  readOnly
                  title="Pana se apne aap nikalta hai"
                />
              </div>

              <div className="dr-form-group dr-form-btn-group">
                <button className="dr-save-btn" onClick={handleSave} type="button" disabled={saving}>
                  {saving ? 'SAVING...' : 'SAVE'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="dr-card dr-table-card">
        <div className="dr-date-selector">
          <div className="dr-date-input-wrapper">
            <input type="date" className="dr-date-input" value={tableDate} onChange={(e) => setTableDate(e.target.value)} />
            <Calendar size={16} className="dr-date-icon" />
          </div>
          {!filtersOpen && (
            <button className="dr-toolbar-btn" type="button" onClick={() => setFiltersOpen(true)}>
              Show Filters
            </button>
          )}
        </div>

        <div className="dr-toolbar">
          <div className="dr-toolbar-buttons">
            <button className="dr-toolbar-btn" onClick={handleCopy} type="button">Copy</button>
            <button className="dr-toolbar-btn" onClick={handleCSV} type="button">CSV</button>
            <button className="dr-toolbar-btn" onClick={handleExcel} type="button">Excel</button>
            <button className="dr-toolbar-btn" onClick={handlePrint} type="button">PDF</button>
            <button className="dr-toolbar-btn" onClick={handlePrint} type="button">Print</button>
          </div>
          <div className="dr-toolbar-search">
            <label>Search:</label>
            <input
              type="text"
              className="dr-search-input"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="dr-table-wrapper">
          <table className="dr-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Game Name</th>
                <th>Result Date</th>
                <th>Open Pana</th>
                <th>Close Pana</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {loadingResults ? (
                <tr><td colSpan="6" className="dr-table-empty">Loading...</td></tr>
              ) : pageRows.length === 0 ? (
                <tr><td colSpan="6" className="dr-table-empty">No data available in table</td></tr>
              ) : (
                pageRows.map((row, i) => (
                  <tr key={row.ids.join('-')}>
                    <td>{(page - 1) * PAGE_SIZE + i + 1}</td>
                    <td>{row.gameName}</td>
                    <td>{row.resultDate}</td>
                    <td>{row.openPana || '-'}</td>
                    <td>{row.closePana || '-'}</td>
                    <td>
                      {row.published ? (
                        <span style={{ color: '#16a34a', fontSize: 13 }}>Published</span>
                      ) : (
                        <button
                          type="button"
                          className="dr-toolbar-btn"
                          title="Publish"
                          onClick={() => handlePublish(row)}
                        >
                          <CheckCircle size={14} /> Publish
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="dr-pagination">
          <button className="dr-page-btn" type="button" disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>‹</button>
          <span style={{ padding: '0 10px', fontSize: 13 }}>{page} / {totalPages}</span>
          <button className="dr-page-btn" type="button" disabled={page >= totalPages} onClick={() => setPage((p) => p + 1)}>›</button>
        </div>
      </div>
    </div>
  )
}