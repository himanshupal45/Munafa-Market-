import React from 'react'
import { Home as HomeIcon, Moon } from 'lucide-react'
import './HalfSangam.css'

export default function HalfSangam() {
  // ✅ OpenAnk digits (0-9)
  const openAnks = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9']

  // ✅ ClosePana list (from screenshot + extended)
  const closePanas = [
    '000', '100', '111', '112', '113', '114', '115', '116', '117', '118', '119', '120',
    '122', '123', '124', '125', '126', '127', '128', '129', '130', '133', '134', '135',
    '136', '137', '138', '139', '140', '144', '145', '146', '147', '148', '149', '150',
    '155', '156', '157', '158', '159', '160', '166', '167', '168', '169', '170', '177',
    '178', '179', '180', '188', '189', '190', '199', '200', '220', '222', '223', '224',
    '225', '226', '227', '228', '229', '230', '233', '234', '235', '236', '237', '238',
    '239', '240', '244', '245', '246', '247', '248', '249', '250', '255', '256', '257',
    '258', '259', '260', '266', '267', '268', '269', '270', '277', '278', '279', '280',
    '288', '289', '290', '299', '300', '330', '333', '334', '335', '336', '337', '338',
    '339', '340', '344', '345', '346', '347', '348', '349', '350', '355', '356', '357',
    '358', '359', '360', '366', '367', '368', '369', '370', '377', '378', '379', '380',
    '388', '389', '390', '399', '400', '440', '444', '445', '446', '447', '448', '449',
    '450', '455', '456', '457', '458', '459', '460', '466', '467', '468', '469', '470',
    '477', '478', '479', '480', '488', '489', '490', '499', '500', '550', '555', '556',
    '557', '558', '559', '560', '566', '567', '568', '569', '570', '577', '578', '579',
    '580', '588', '589', '590', '599', '600', '660', '666', '667', '668', '669', '670',
    '677', '678', '679', '680', '688', '689', '690', '699', '700', '770', '777', '778',
    '779', '780', '788', '789', '790', '799', '800', '880', '888', '889', '890', '899',
    '900', '990', '999'
  ]

  const handleAnkClick = (ank) => alert(`OpenAnk: ${ank}`)
  const handlePanaClick = (pana) => alert(`ClosePana: ${pana}`)

  return (
    <div className="hs-page">
      {/* ✅ Breadcrumb */}
      <div className="hs-breadcrumb">
        <HomeIcon size={14} />
        <span>Home</span>
        <span className="hs-breadcrumb-sep">/</span>
        <span>Half Sangam</span>
      </div>

      {/* ✅ Page Title with Icon */}
      <div className="hs-page-title-wrapper">
        <Moon size={26} className="hs-page-title-icon" />
        <h1 className="hs-page-title">Half Sangam</h1>
      </div>

      {/* ✅ Main Card */}
      <div className="hs-card">
        {/* ===== OpenAnk Section ===== */}
        <div className="hs-section">
          <div className="hs-section-header">
            <h3 className="hs-section-title">OpenAnk</h3>
          </div>
          <div className="hs-anks-grid">
            {openAnks.map((ank) => (
              <button
                key={ank}
                className="hs-ank-box"
                onClick={() => handleAnkClick(ank)}
                type="button"
              >
                {ank}
              </button>
            ))}
          </div>
        </div>

        {/* ===== ClosePana Section ===== */}
        <div className="hs-section">
          <div className="hs-section-header">
            <h3 className="hs-section-title">ClosePana</h3>
          </div>
          <div className="hs-panas-grid">
            {closePanas.map((pana) => (
              <button
                key={pana}
                className="hs-pana-box"
                onClick={() => handlePanaClick(pana)}
                type="button"
              >
                {pana}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}