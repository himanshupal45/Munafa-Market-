import React from 'react'
import { 
  Clock, Zap, Rocket, Sparkles,
  Calendar, ArrowRight, Mail, Bell,
  Award, Star
} from 'lucide-react'
import munafalogo from "../../../public/munafalogo.png"
import './ComingSoon.css'

export default function ComingSoon({ dark }) {
  return (
    <div className={`coming-soon ${dark ? 'dark' : 'light'}`}>
      <div className="coming-soon-container">
        {/* Animated background elements */}
        <div className="cs-bg-elements">
          <div className="cs-circle cs-circle-1"></div>
          <div className="cs-circle cs-circle-2"></div>
          <div className="cs-circle cs-circle-3"></div>
          <div className="cs-circle cs-circle-4"></div>
        </div>

        <div className="cs-content">
          {/* Logo */}
          <div className="cs-logo-wrapper">
            <img 
              src={munafalogo} 
              alt="Munafa Market" 
              className="cs-logo"
            />
          </div>

          {/* Badge */}
          <div className="cs-badge">
            <Zap size={14} />
            <span>New Feature</span>
          </div>

          {/* Title */}
          <h1 className="cs-title">COMING SOON</h1>

          {/* Subtitle */}
          <p className="cs-subtitle">
            We're working on something amazing. Stay tuned for updates!
          </p>

          {/* Features */}
          <div className="cs-features">
            <div className="cs-feature-item">
              <div className="cs-feature-icon">
                <Sparkles size={18} />
              </div>
              <span>New Games</span>
            </div>
            <div className="cs-feature-item">
              <div className="cs-feature-icon">
                <Award size={18} />
              </div>
              <span>Better Rewards</span>
            </div>
            <div className="cs-feature-item">
              <div className="cs-feature-icon">
                <Star size={18} />
              </div>
              <span>Enhanced Experience</span>
            </div>
          </div>

          {/* Notify Button */}
          <button className="cs-notify-btn">
            <Bell size={18} />
            Notify Me
          </button>

          {/* Footer */}
          <p className="cs-footer">
            <Sparkles size={14} />
            Stay Tuned
            <Sparkles size={14} />
          </p>
        </div>
      </div>
    </div>
  )
}