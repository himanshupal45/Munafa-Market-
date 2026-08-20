import React, { useState } from 'react'
import { 
  Save, X, DollarSign, TrendingUp, 
  TrendingDown, HelpCircle, CheckCircle
} from 'lucide-react'
import './SetAmount.css'

export default function SetAmount({ dark, onClose }) {
  const [amounts, setAmounts] = useState({
    jodiAmount: '92',
    harufAnderAmount: '10',
    harufBaherAmount: '10',
  })

  const [saved, setSaved] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    // Only allow numbers
    if (value === '' || /^\d+$/.test(value)) {
      setAmounts(prev => ({ ...prev, [name]: value }))
      setSaved(false)
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
    alert('✅ Amount settings saved successfully!')
  }

  return (
    <div className={`set-amount ${dark ? 'dark' : 'light'}`}>
      <div className="set-amount-header">
        <div className="set-amount-header-left">
          <DollarSign size={24} className="set-amount-icon" />
          <h1 className="set-amount-title">Set Amount</h1>
        </div>
        {/* <button className="set-amount-close-btn" onClick={onClose} type="button">
          <X size={20} />
        </button> */}
      </div>

      <form onSubmit={handleSubmit} className="set-amount-form">
        {/* Jodi Amount */}
        <div className="amount-card">
          <div className="amount-card-header">
            <div className="amount-card-title">
              <TrendingUp size={20} className="amount-card-icon" />
              <h3>Jodi Amount</h3>
            </div>
            <span className="amount-badge">Jodi</span>
          </div>
          
          <div className="amount-input-group">
            <div className="amount-input-wrapper">
              <span className="amount-currency">₹</span>
              <input
                type="text"
                name="jodiAmount"
                value={amounts.jodiAmount}
                onChange={handleChange}
                className="amount-input"
                placeholder="Enter amount"
              />
            </div>
            <div className="amount-example">
              <HelpCircle size={14} />
              <span>Ex:- ₹1 = ₹{parseInt(amounts.jodiAmount) || 0}</span>
            </div>
          </div>
        </div>

        {/* Haruf Ander Amount */}
        <div className="amount-card">
          <div className="amount-card-header">
            <div className="amount-card-title">
              <TrendingUp size={20} className="amount-card-icon" />
              <h3>Haruf Ander Amount</h3>
            </div>
            <span className="amount-badge amount-badge-ander">Ander</span>
          </div>
          
          <div className="amount-input-group">
            <div className="amount-input-wrapper">
              <span className="amount-currency">₹</span>
              <input
                type="text"
                name="harufAnderAmount"
                value={amounts.harufAnderAmount}
                onChange={handleChange}
                className="amount-input"
                placeholder="Enter amount"
              />
            </div>
            <div className="amount-example">
              <HelpCircle size={14} />
              <span>Ex:- ₹1 = ₹{parseInt(amounts.harufAnderAmount) || 0}</span>
            </div>
          </div>
        </div>

        {/* Haruf Baher Amount */}
        <div className="amount-card">
          <div className="amount-card-header">
            <div className="amount-card-title">
              <TrendingDown size={20} className="amount-card-icon" />
              <h3>Haruf Baher Amount</h3>
            </div>
            <span className="amount-badge amount-badge-baher">Baher</span>
          </div>
          
          <div className="amount-input-group">
            <div className="amount-input-wrapper">
              <span className="amount-currency">₹</span>
              <input
                type="text"
                name="harufBaherAmount"
                value={amounts.harufBaherAmount}
                onChange={handleChange}
                className="amount-input"
                placeholder="Enter amount"
              />
            </div>
            <div className="amount-example">
              <HelpCircle size={14} />
              <span>Ex:- ₹1 = ₹{parseInt(amounts.harufBaherAmount) || 0}</span>
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="set-amount-actions">
          <button type="submit" className="set-amount-submit-btn">
            {saved ? (
              <>
                <CheckCircle size={18} />
                Saved!
              </>
            ) : (
              <>
                <Save size={18} />
                Submit
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  )
}