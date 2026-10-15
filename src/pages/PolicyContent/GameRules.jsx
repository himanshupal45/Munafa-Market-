import React from 'react'
import { useNavigate } from 'react-router-dom'
import { X, FileCheck, Edit2, Save, FileText } from 'lucide-react'
import './PolicyPage.css'

export default function GameRules({ dark, onClose }) {
  const navigate = useNavigate()

  const handleBack = () => {
    navigate('/policy-content')
  }

  return (
    <div className={`policy-page ${dark ? 'dark' : 'light'}`}>
      <div className="policy-page-header">
        <div className="policy-page-header-left">
          <FileCheck size={24} className="policy-page-icon" />
          <h1 className="policy-page-title">Game Rules</h1>
        </div>
        {/* <button className="policy-page-close-btn" onClick={handleBack} type="button">
          <X size={20} />
        </button> */}
      </div>

      <div className="policy-page-content">
        <div className="policy-page-card">
          <div className="policy-page-card-header">
            <h2>Game Rules</h2>
            <button className="edit-btn">
              <Edit2 size={16} />
              Edit
            </button>
          </div>
          <div className="policy-page-card-body">
            <h3>1. Jodi (Two-Digit)</h3>
            <p>Players bet on a two-digit number from 00 to 99. If your chosen number matches the result, you win.</p>

            <h3>2. Haruf (Single Digit)</h3>
            <p>Players bet on a single digit from 0 to 9. You can bet on one digit (Ander) or multiple digits (Baher).</p>

            <h3>3. Betting Rules</h3>
            <ul>
              <li><strong>Minimum bet amount:</strong> ₹10</li>
              <li><strong>Maximum bet amount:</strong> ₹10,000</li>
              <li><strong>Winning payout:</strong> Jodi - ₹100 per ₹1 bet</li>
              <li><strong>Winning payout:</strong> Haruf - ₹10 per ₹1 bet</li>
            </ul>

            <h3>4. Result Timing</h3>
            <ul>
              <li><strong>FARIDABAD:</strong> 06:30 PM</li>
              <li><strong>GHAZIABAD:</strong> 09:45 PM</li>
              <li><strong>GALI:</strong> 11:45 PM</li>
              <li><strong>DISAWAR:</strong> 05:30 AM</li>
            </ul>

            <h3>5. Fair Play</h3>
            <p>All results are generated using a certified random number generator. The platform is audited regularly to ensure fairness.</p>
          </div>
        </div>
      </div>
    </div>
  )
}