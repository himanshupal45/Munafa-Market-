import React from 'react'
import { Home as HomeIcon, Files } from 'lucide-react'
import './DoublePana.css'

// ✅ Double Pana data grouped by leading digit
const panaGroups = [
  { digit: '0', panas: ['118', '226', '244', '299', '334', '488', '550', '668', '677'] },
  { digit: '1', panas: ['100', '119', '155', '227', '335', '344', '399', '588', '669'] },
  { digit: '2', panas: ['110', '200', '228', '255', '336', '499', '660', '688', '778'] },
  { digit: '3', panas: ['166', '229', '300', '337', '355', '445', '599', '779', '788'] },
  { digit: '4', panas: ['112', '220', '266', '338', '400', '446', '455', '699', '770'] },
  { digit: '5', panas: ['113', '122', '177', '339', '366', '447', '556', '799', '880'] },
  { digit: '6', panas: ['114', '277', '330', '448', '466', '557', '668', '800', '889'] },
  { digit: '7', panas: ['115', '133', '188', '223', '377', '449', '558', '800', '899'] },
  { digit: '8', panas: ['116', '144', '199', '233', '288', '440', '477', '559', '900'] },
  { digit: '9', panas: ['117', '225', '333', '344', '450', '477', '566', '667', '778'] },
]

export default function DoublePana() {
  const handlePanaClick = (pana) => {
    alert(`You clicked: ${pana}`)
    // Ya koi action perform karo
  }

  return (
    <div className="dpa-page">
      {/* ✅ Breadcrumb */}
      <div className="dpa-breadcrumb">
        <HomeIcon size={14} />
        <span>Home</span>
        <span className="dpa-breadcrumb-sep">/</span>
        <span>Double Pana</span>
      </div>

      {/* ✅ Page Title with Icon */}
      <div className="dpa-page-title-wrapper">
        <Files size={26} className="dpa-page-title-icon" />
        <h1 className="dpa-page-title">Double Pana</h1>
      </div>

      {/* ✅ Main Card */}
      <div className="dpa-card">
        {/* Pana Groups */}
        {panaGroups.map((group) => (
          <div key={group.digit} className="dpa-group">
            {/* Digit Header (Red Bar) */}
            <div className="dpa-digit-header">
              <span className="dpa-digit-number">{group.digit}</span>
            </div>

            {/* Pana Numbers */}
            <div className="dpa-panas-grid">
              {group.panas.map((pana) => (
                <button
                  key={pana}
                  className="dpa-pana-box"
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