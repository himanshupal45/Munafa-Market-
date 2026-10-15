import React from 'react'
import { Home as HomeIcon, Layers } from 'lucide-react'
import './JodiDigit.css'

export default function JodiDigit() {
  // ✅ Generate 00-99 jodi digits
  const jodiDigits = Array.from({ length: 100 }, (_, i) =>
    String(i).padStart(2, '0')
  )

  const handleDigitClick = (digit) => {
    alert(`You clicked: ${digit}`)
    // Ya koi action perform karo
  }

  return (
    <div className="jd-page">
      {/* ✅ Breadcrumb */}
      <div className="jd-breadcrumb">
        <HomeIcon size={14} />
        <span>Home</span>
        <span className="jd-breadcrumb-sep">/</span>
        <span>Single Digits</span>
      </div>

      {/* ✅ Page Title with Icon */}
      <div className="jd-page-title-wrapper">
        <Layers size={26} className="jd-page-title-icon" />
        <h1 className="jd-page-title">Jodi Digits</h1>
      </div>

      {/* ✅ Main Card */}
      <div className="jd-card">
        <h3 className="jd-card-title">Jodi Digit Number</h3>

        {/* Digits Grid (00-99) */}
        <div className="jd-digits-grid">
          {jodiDigits.map((digit) => (
            <button
              key={digit}
              className="jd-digit-box"
              onClick={() => handleDigitClick(digit)}
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