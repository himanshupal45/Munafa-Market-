import React from 'react'
import { Home as HomeIcon, Package } from 'lucide-react'
import './TriplePana.css'

// ✅ Triple Pana data (single pana per digit 0-9)
const panaGroups = [
  { digit: '0', panas: ['000'] },
  { digit: '1', panas: ['777'] },
  { digit: '2', panas: ['444'] },
  { digit: '3', panas: ['111'] },
  { digit: '4', panas: ['888'] },
  { digit: '5', panas: ['555'] },
  { digit: '6', panas: ['666'] },
  { digit: '7', panas: ['222'] },
  { digit: '8', panas: ['999'] },
  { digit: '9', panas: ['333'] },
]

export default function TriplePana() {
  const handlePanaClick = (pana) => {
    alert(`You clicked: ${pana}`)
  }

  return (
    <div className="tp-page">
      {/* ✅ Breadcrumb */}
      <div className="tp-breadcrumb">
        <HomeIcon size={14} />
        <span>Home</span>
        <span className="tp-breadcrumb-sep">/</span>
        <span>Triple Pana</span>
      </div>

      {/* ✅ Page Title with Icon */}
      <div className="tp-page-title-wrapper">
        <Package size={26} className="tp-page-title-icon" />
        <h1 className="tp-page-title">Triple Pana</h1>
      </div>

      {/* ✅ Main Card */}
      <div className="tp-card">
        {panaGroups.map((group) => (
          <div key={group.digit} className="tp-group">
            {/* Digit Header (Red Bar) */}
            <div className="tp-digit-header">
              <span className="tp-digit-number">{group.digit}</span>
            </div>

            {/* Pana Numbers */}
            <div className="tp-panas-grid">
              {group.panas.map((pana) => (
                <button
                  key={pana}
                  className="tp-pana-box"
                  onClick={() => handlePanaClick(pana)}
                  type="button"
                >
                  {pana}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}