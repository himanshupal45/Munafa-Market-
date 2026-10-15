import React from 'react'
import { useLocation } from 'react-router-dom'
import { Construction } from 'lucide-react'
import './Placeholder.css'

export default function Placeholder() {
  const loc = useLocation()
  const name = loc.pathname.replace(/\//g, ' ').trim()
  const dark = document.body.classList.contains('dark')

  // Format page name
  const pageName = name.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')

  return (
    <div className={`placeholder-container ${dark ? 'dark' : 'light'}`}>
      <div className="placeholder-content">
        <div className="placeholder-icon">
          <Construction size={48} />
        </div>
        <h2 className="placeholder-title">{pageName || 'Page'}</h2>
        <p className="placeholder-subtitle">This page is under construction.</p>
        <div className="placeholder-progress">
          <div className="progress-bar">
            <div className="progress-fill"></div>
          </div>
          <span className="progress-text">Coming soon...</span>
        </div>
      </div>
    </div>
  )
}