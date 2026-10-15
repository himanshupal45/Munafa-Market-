import React from 'react'
import { useNavigate } from 'react-router-dom'
import { X, Shield, Edit2, Save, FileText } from 'lucide-react'
import './PolicyPage.css'

export default function PrivacyPolicy({ dark, onClose }) {
  const navigate = useNavigate()

  const handleBack = () => {
    navigate('/policy-content')
  }

  return (
    <div className={`policy-page ${dark ? 'dark' : 'light'}`}>
      <div className="policy-page-header">
        <div className="policy-page-header-left">
          <Shield size={24} className="policy-page-icon" />
          <h1 className="policy-page-title">Privacy Policy</h1>
        </div>
        {/* <button className="policy-page-close-btn" onClick={handleBack} type="button">
          <X size={20} />
        </button> */}
      </div>

      <div className="policy-page-content">
        <div className="policy-page-card">
          <div className="policy-page-card-header">
            <h2>Privacy Policy</h2>
            <button className="edit-btn">
              <Edit2 size={16} />
              Edit
            </button>
          </div>
          <div className="policy-page-card-body">
            <p>At Hindustan Matka, we take your privacy seriously. This policy outlines how we collect, use, and protect your personal information.</p>
            
            <h3>Information We Collect</h3>
            <ul>
              <li>Name</li>
              <li>Email Address</li>
              <li>Phone Number</li>
              <li>Address</li>
            </ul>

            <h3>How We Use Your Data</h3>
            <ul>
              <li>Account management</li>
              <li>Transaction processing</li>
              <li>Customer support</li>
            </ul>

            <h3>Data Protection</h3>
            <p>We use industry-standard encryption to protect your data. All transactions are secure and encrypted.</p>

            <h3>Third-Party Sharing</h3>
            <p>We never share your data with third parties without your consent.</p>

            <h3>Your Rights</h3>
            <p>You can request to view, modify, or delete your data at any time.</p>
          </div>
        </div>
      </div>
    </div>
  )
}