import React from 'react'
import { Home as HomeIcon, Hash } from 'lucide-react'
import './SingleDigit.css'

export default function SingleDigit() {
  // ✅ 0-9 digits array
  const digits = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9']

  return (
    <div className="sdig-page">
      {/* ✅ Breadcrumb */}
      <div className="sdig-breadcrumb">
        <HomeIcon size={14} />
        <span>Home</span>
        <span className="sdig-breadcrumb-sep">/</span>
        <span>Single Digits</span>
      </div>

      {/* ✅ Page Title with Icon */}
      <div className="sdig-page-title-wrapper">
        <Hash size={26} className="sdig-page-title-icon" />
        <h1 className="sdig-page-title">Single Digits</h1>
      </div>

      {/* ✅ Main Card */}
      <div className="sdig-card">
        <h3 className="sdig-card-title">Single Digit Number</h3>

        {/* Digits Grid */}
        <div className="sdig-digits-grid">
          {digits.map((digit) => (
            <button
              key={digit}
              className="sdig-digit-box"
              type="button"
            >
              {digit}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}