import React from 'react'
import { useNavigate } from 'react-router-dom'
import { X, Info, Edit2, Save, FileText } from 'lucide-react'
import './PolicyPage.css'

export default function AboutUs({ dark, onClose }) {
  const navigate = useNavigate()

  const handleBack = () => {
    navigate('/policy-content')
  }

  return (
    <div className={`policy-page ${dark ? 'dark' : 'light'}`}>
      <div className="policy-page-header">
        <div className="policy-page-header-left">
          <Info size={24} className="policy-page-icon" />
          <h1 className="policy-page-title">About Us</h1>
        </div>
        {/* <button className="policy-page-close-btn" onClick={handleBack} type="button">
          <X size={20} />
        </button> */}
      </div>

      <div className="policy-page-content">
        <div className="policy-page-card">
          <div className="policy-page-card-header">
            <h2>About Hindustan Matka</h2>
            <button className="edit-btn">
              <Edit2 size={16} />
              Edit
            </button>
          </div>
          <div className="policy-page-card-body">
            <p>
              Hindustan Matka is India's most trusted online matka platform. We provide a secure and fair gaming experience to our users across the country.
            </p>
            <p>
              Our mission is to deliver a transparent, reliable, and entertaining platform for matka enthusiasts. With years of experience in the industry, we understand the needs of our users and strive to exceed their expectations.
            </p>
            <p>
              We are committed to responsible gaming and provide tools to help our users maintain control over their gaming activities.
            </p>
            <div className="policy-features">
              <div className="feature-item">
                <span className="feature-icon">✓</span>
                <span>100% Trusted Platform</span>
              </div>
              <div className="feature-item">
                <span className="feature-icon">✓</span>
                <span>Secure & Fair Gaming</span>
              </div>
              <div className="feature-item">
                <span className="feature-icon">✓</span>
                <span>24/7 Customer Support</span>
              </div>
              <div className="feature-item">
                <span className="feature-icon">✓</span>
                <span>Fast Withdrawals</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}