import React, { useState, useMemo, useEffect, useCallback } from 'react'

// ============================================
// Admin pages ke liye shared helpers
// Is file ko  src/utils/adminTable.jsx  me rakho
// ============================================

export const PAGE_SIZE = 10

export const fmtDateTime = (v) =>
  v
    ? new Date(v).toLocaleString('en-IN', {
        day: '2-digit', month: '2-digit', year: 'numeric',
        hour: '2-digit', minute: '2-digit', hour12: true,
      })
    : '-'

// Backend ki relative file path (/uploads/...) ko poora URL banana
export const fileUrl = (p) => {
  if (!p) return ''
  if (/^https?:\/\//i.test(p)) return p
  const api = import.meta.env.DEV
    ? import.meta.env.VITE_DEV_API_URL || 'http://localhost:5000/api'
    : import.meta.env.VITE_API_URL || 'https://astroconnect.co.in/api'
  return api.replace(/\/api\/?$/, '') + p
}

// ---------- Search + pagination ----------
export function usePagedSearch(rows, getText) {
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    if (!q) return rows
    return rows.filter((r) => String(getText(r)).toLowerCase().includes(q))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rows, search])

  useEffect(() => { setPage(1) }, [search, rows])

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const pageRows = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)
  return { search, setSearch, page, setPage, filtered, pageRows, totalPages }
}

// ---------- Message banner ----------
export function useNotify() {
  const [message, setMessage] = useState(null)
  const notify = useCallback((type, text) => {
    setMessage({ type, text })
    setTimeout(() => setMessage(null), 4000)
  }, [])
  return { message, notify }
}

export const Banner = ({ message }) =>
  message ? (
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
  ) : null

// ---------- Export (rows = [{ 'Column': value }, ...]) ----------
const cell = (v) => `"${String(v ?? '').replace(/"/g, '""')}"`

const download = (content, type, name) => {
  const blob = new Blob([content], { type })
  const a = document.createElement('a')
  a.href = URL.createObjectURL(blob)
  a.download = name
  a.click()
  URL.revokeObjectURL(a.href)
}

const html = (rows) =>
  '<table><thead><tr>' +
  Object.keys(rows[0]).map((k) => `<th>${k}</th>`).join('') +
  '</tr></thead><tbody>' +
  rows.map((r) => '<tr>' + Object.values(r).map((v) => `<td>${v}</td>`).join('') + '</tr>').join('') +
  '</tbody></table>'

export const exporter = (rows, name, title, notify) => ({
  copy: () => {
    if (!rows.length) return notify('err', 'Copy karne ke liye data nahi hai')
    navigator.clipboard
      .writeText(rows.map((r) => Object.values(r).join('\t')).join('\n'))
      .then(() => notify('ok', 'Copied ✅'))
  },
  csv: () => {
    if (!rows.length) return notify('err', 'Export ke liye data nahi hai')
    const head = Object.keys(rows[0]).map(cell).join(',')
    const body = rows.map((r) => Object.values(r).map(cell).join(',')).join('\n')
    download(`${head}\n${body}`, 'text/csv;charset=utf-8;', `${name}_${Date.now()}.csv`)
  },
  excel: () => {
    if (!rows.length) return notify('err', 'Export ke liye data nahi hai')
    download(html(rows), 'application/vnd.ms-excel', `${name}_${Date.now()}.xls`)
  },
  print: () => {
    if (!rows.length) return notify('err', 'Print ke liye data nahi hai')
    const w = window.open('', '_blank')
    if (!w) return notify('err', 'Popup block hai, allow karo')
    w.document.write(`<html><head><title>${title}</title>
      <style>body{font-family:Arial;padding:20px}table{width:100%;border-collapse:collapse}
      th,td{border:1px solid #ddd;padding:8px}th{background:#f5f5f5}</style></head><body>
      <h2>${title}</h2>${html(rows)}</body></html>`)
    w.document.close()
    w.focus()
    setTimeout(() => { w.print(); w.close() }, 250)
  },
})

// ---------- Chhota details modal ----------
export const DetailsModal = ({ title, rows, onClose }) => (
  <div
    onClick={onClose}
    style={{
      position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 1000,
      display: 'grid', placeItems: 'center', padding: 16,
    }}
  >
    <div
      onClick={(e) => e.stopPropagation()}
      style={{ background: '#fff', color: '#111', borderRadius: 12, padding: 20, width: '100%', maxWidth: 420 }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
        <h3 style={{ margin: 0 }}>{title}</h3>
        <button onClick={onClose} style={{ border: 0, background: 'none', fontSize: 20, cursor: 'pointer' }}>×</button>
      </div>
      {rows.map(([k, v]) => (
        <div key={k} style={{ display: 'flex', justifyContent: 'space-between', gap: 12, padding: '8px 0', borderBottom: '1px solid #eee', fontSize: 14 }}>
          <span style={{ opacity: 0.7 }}>{k}</span>
          <b style={{ textAlign: 'right', wordBreak: 'break-all' }}>{v || '-'}</b>
        </div>
      ))}
    </div>
  </div>
)