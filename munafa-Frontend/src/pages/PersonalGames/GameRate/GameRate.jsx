import React, { useState } from 'react'
import { Home as HomeIcon, Percent } from 'lucide-react'
import './GameRate.css'

export default function GameRate() {
  const [leftDigit, setLeftDigit] = useState('10')
  const [jodiDigit, setJodiDigit] = useState('20')
  const [rightDigit, setRightDigit] = useState('30')

  const handleSubmit = (e) => {
    e.preventDefault()

    if (!leftDigit || !jodiDigit || !rightDigit) {
      alert('Please fill all fields')
      return
    }

    alert(`✅ Game Rates saved!\nLeft Digit: ${leftDigit}\nJodi Digit: ${jodiDigit}\nRight Digit: ${rightDigit}`)
  }

  return (
    <div className="dgr-page">
      {/* ✅ Breadcrumb */}
      <div className="dgr-breadcrumb">
        <HomeIcon size={14} />
        <span>Home</span>
        <span className="dgr-breadcrumb-sep">/</span>
        <span>Disawar Game Rates</span>
      </div>

      {/* ✅ Page Title with Icon */}
      <div className="dgr-page-title-wrapper">
        <Percent size={26} className="dgr-page-title-icon" />
        <h1 className="dgr-page-title">Disawar Game Rates</h1>
      </div>

      {/* ✅ Main Card */}
      <div className="dgr-card-wrapper">
        <form onSubmit={handleSubmit} className="dgr-card">
          {/* Blue Header */}
          <div className="dgr-card-header">
            <h2 className="dgr-card-title">GameRates</h2>
          </div>

          {/* Card Body */}
          <div className="dgr-card-body">
            {/* Left Digit */}
            <div className="dgr-form-group">
              <label className="dgr-label">Left Digit</label>
              <input
                type="number"
                className="dgr-input"
                value={leftDigit}
                onChange={(e) => setLeftDigit(e.target.value)}
                placeholder="Enter Left Digit Rate"
              />
            </div>

            {/* Jodi Digit */}
            <div className="dgr-form-group">
              <label className="dgr-label">Jodi Digit</label>
              <input
                type="number"
                className="dgr-input"
                value={jodiDigit}
                onChange={(e) => setJodiDigit(e.target.value)}
                placeholder="Enter Jodi Digit Rate"
              />
            </div>

            {/* Right Digit */}
            <div className="dgr-form-group">
              <label className="dgr-label">Right Digit</label>
              <input
                type="number"
                className="dgr-input"
                value={rightDigit}
                onChange={(e) => setRightDigit(e.target.value)}
                placeholder="Enter Right Digit Rate"
              />
            </div>

            {/* Submit Button */}
            <div className="dgr-actions">
              <button type="submit" className="dgr-submit-btn">
                Submit
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}