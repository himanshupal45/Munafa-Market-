import React from 'react'
import { useNavigate } from 'react-router-dom'
import { X, StickyNote, Edit2, Save, FileText } from 'lucide-react'
import './PolicyPage.css'

export default function Notes({ dark, onClose }) {
  const navigate = useNavigate()

  const handleBack = () => {
    navigate('/policy-content')
  }

  return (
    <div className={`policy-page ${dark ? 'dark' : 'light'}`}>
      <div className="policy-page-header">
        <div className="policy-page-header-left">
          <StickyNote size={24} className="policy-page-icon" />
          <h1 className="policy-page-title">Notes</h1>
        </div>
        {/* <button className="policy-page-close-btn" onClick={handleBack} type="button">
          <X size={20} />
        </button> */}
      </div>

      <div className="policy-page-content">
        <div className="policy-page-card">
          <div className="policy-page-card-header">
            <h2>Important Notes</h2>
            <button className="edit-btn">
              <Edit2 size={16} />
              Edit
            </button>
          </div>
          <div className="policy-page-card-body">
            <h3>1. Account Security</h3>
            <ul>
              <li>Never share your password with anyone</li>
              <li>Use a strong, unique password</li>
              <li>Enable two-factor authentication if available</li>
            </ul>

            <h3>2. Transactions</h3>
            <ul>
              <li><strong>Minimum deposit:</strong> ₹100</li>
              <li><strong>Minimum withdrawal:</strong> ₹500</li>
              <li><strong>Processing time:</strong> 24-48 hours for withdrawals</li>
              <li>All transactions are secure and encrypted</li>
            </ul>

            <h3>3. Customer Support</h3>
            <ul>
              <li>Available 24/7 via WhatsApp and Email</li>
              <li>Response time: 2-4 hours</li>
              <li>Support team is trained to handle all your queries</li>
            </ul>

            <h3>4. Responsible Gaming</h3>
            <ul>
              <li>Set deposit limits to control spending</li>
              <li>Take breaks regularly</li>
              <li>Seek help if you feel you're losing control</li>
              <li>Self-exclusion options are available</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}