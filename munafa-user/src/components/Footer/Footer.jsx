import React from 'react'
import { Link } from 'react-router-dom'
import './Footer.css'
import munahalogo from '../../../public/munafalogo.png'

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="dm-footer">
      <div className="footer-container">
        {/* Top Branding Section */}
        <div className="footer-top">
          <div className="footer-brand">
            <div className="brand-logo-large">
              <img
                src={munahalogo}
                alt="Munafa Market"
                className="footer-logo-img"
              />
            </div>
            <h2 className="footer-brand-title">Munafa Market</h2>
          </div>
          <p className="footer-description">
            India's fastest and most trusted Matka result platform.
            Get live results, charts, and updates instantly.
          </p>
        </div>

        {/* Links Grid */}
        <div className="footer-links-grid">
          <div className="link-column">
            <h4 className="link-heading">Quick Links</h4>
            <ul>
              <li><Link to="/">Home</Link></li>
              <li><Link to="/results">Results</Link></li>
              <li><Link to="/how-to-play">How to Play</Link></li>
              <li><Link to="/rate-chart">Rate Chart</Link></li>
            </ul>
          </div>

          <div className="link-column">
            <h4 className="link-heading">Games</h4>
            <ul>
              <li><Link to="/satta-matka">Satta Matka</Link></li>
              <li><Link to="/dp-boss">DpBoss</Link></li>
              <li><Link to="/results">Matka Result</Link></li>
              <li><Link to="/results">Gali Result</Link></li>
            </ul>
          </div>

          <div className="link-column">
            <h4 className="link-heading">Support</h4>
            <ul>
              <li><Link to="/dp-boss">Privacy Policy</Link></li>
              <li><Link to="/how-to-play">Help Center</Link></li>
              <li><Link to="/rate-chart">Rate Chart</Link></li>
              <li><Link to="/profile">My Account</Link></li>
            </ul>
          </div>
        </div>

        {/* Disclaimer */}
        <div className="footer-disclaimer">
          <p>
            <strong>Disclaimer:</strong> This website is for entertainment purposes only.
            We do not promote or encourage gambling. Please play responsibly and within your limits.
          </p>
        </div>

        {/* Copyright */}
        <div className="footer-bottom">
          <p>© {currentYear} Munafa Market. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}