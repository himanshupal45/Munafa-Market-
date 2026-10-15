import React from 'react'
import { Home as HomeIcon, CreditCard } from 'lucide-react'
import './SinglePana.css'

// ✅ Single Pana data grouped by leading digit
const panaGroups = [
  { digit: '0', panas: ['127', '136', '145', '190', '235', '280', '370', '389', '460', '479', '569', '578'] },
  { digit: '1', panas: ['128', '137', '146', '236', '245', '290', '380', '470', '489', '560', '579', '678'] },
  { digit: '2', panas: ['129', '138', '147', '156', '237', '246', '345', '390', '480', '570', '589', '679'] },
  { digit: '3', panas: ['120', '139', '148', '157', '238', '247', '256', '346', '490', '580', '670', '689'] },
  { digit: '4', panas: ['130', '149', '158', '167', '239', '248', '257', '347', '356', '590', '680', '789'] },
  { digit: '5', panas: ['140', '159', '168', '230', '249', '258', '267', '348', '357', '456', '690', '780'] },
  { digit: '6', panas: ['150', '169', '178', '240', '259', '268', '349', '358', '367', '457', '790', '890'] },
  { digit: '7', panas: ['160', '179', '250', '269', '278', '340', '359', '368', '458', '467', '890', '908'] },
  { digit: '8', panas: ['170', '180', '260', '279', '350', '369', '378', '459', '468', '567', '909', '990'] },
  { digit: '9', panas: ['190', '280', '370', '389', '460', '479', '569', '578', '670', '689', '780', '890'] },
]

export default function SinglePana() {
  const handlePanaClick = (pana) => {
    alert(`You clicked: ${pana}`)
    // Ya koi action perform karo
  }

  return (
    <div className="sp-page">
      {/* ✅ Breadcrumb */}
      <div className="sp-breadcrumb">
        <HomeIcon size={14} />
        <span>Home</span>
        <span className="sp-breadcrumb-sep">/</span>
        <span>Double Pana</span>
      </div>

      {/* ✅ Page Title with Icon */}
      <div className="sp-page-title-wrapper">
        <CreditCard size={26} className="sp-page-title-icon" />
        <h1 className="sp-page-title">Single Pana</h1>
      </div>

      {/* ✅ Main Card */}
      <div className="sp-card">
        {/* Pana Groups */}
        {panaGroups.map((group) => (
          <div key={group.digit} className="sp-group">
            {/* Digit Header (Red Bar) */}
            <div className="sp-digit-header">
              <span className="sp-digit-number">{group.digit}</span>
            </div>

            {/* Pana Numbers */}
            <div className="sp-panas-grid">
              {group.panas.map((pana) => (
                <button
                  key={pana}
                  className="sp-pana-box"
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