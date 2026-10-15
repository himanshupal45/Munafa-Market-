import React from 'react'
import { useNavigate } from 'react-router-dom'
import { ChevronLeft, Send } from 'lucide-react'
import './Transfer.css'

const Transfer = () => {
  const navigate = useNavigate()

  return (
    <div className="tr-page">
      <div className="tr-header">
        <button className="tr-back-btn" onClick={() => navigate(-1)} aria-label="Back">
          <ChevronLeft size={28} strokeWidth={2.2} />
        </button>
        <h1 className="tr-title">Transfer Points</h1>
        <div className="tr-header-spacer" />
      </div>

      <div className="tr-content">
        <div className="tr-icon-wrap">
          <Send size={48} strokeWidth={2} className="tr-icon" />
        </div>
        <h2 className="tr-heading">Transfer Points</h2>
        <p className="tr-text">
          Yahan aap apne points kisi aur user ko transfer kar sakte ho.
        </p>
      </div>
    </div>
  )
}

export default Transfer