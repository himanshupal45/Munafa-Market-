import React from 'react'
import { Sparkles, Coins } from 'lucide-react'
import munafalogo from '/munafalogo.png?url'
import './Login.css'

export default function LoginSplash() {
  return (
    <div className="login-splash-screen">
      <div className="login-splash-container">
        <div className="login-splash-flash"></div>

        <div className="login-splash-particles">
          {[...Array(30)].map((_, i) => (
            <div key={i} className={`login-splash-particle particle-${i}`}></div>
          ))}
        </div>

        <div className="login-splash-content">
          <div className="login-splash-logo-wrapper">
            <div className="login-splash-logo-ring">
              <div className="login-splash-logo-ring-inner">
                <div className="login-splash-logo-icon">
                  <img
                    src={munafalogo}
                    alt="Munafa Market"
                    style={{ width: 70, height: 70, objectFit: 'contain', borderRadius: '50%' }}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="login-splash-text">
            <h1 className="login-splash-title">
              <span className="login-splash-title-word">Munafa</span>
              <span className="login-splash-title-word">Market</span>
            </h1>
            <p className="login-splash-subtitle">Welcome back! Loading your dashboard...</p>
          </div>

          <div className="login-splash-progress">
            <div className="login-splash-progress-bar">
              <div className="login-splash-progress-fill"></div>
            </div>
          </div>

          <div className="login-splash-loading-dots">
            <span className="dot"></span>
            <span className="dot"></span>
            <span className="dot"></span>
          </div>
        </div>

        <div className="login-splash-coins">
          <Coins size={24} className="login-splash-coin coin-1" />
          <Coins size={20} className="login-splash-coin coin-2" />
          <Coins size={28} className="login-splash-coin coin-3" />
          <Coins size={18} className="login-splash-coin coin-4" />
          <Coins size={22} className="login-splash-coin coin-5" />
          <Coins size={16} className="login-splash-coin coin-6" />
        </div>

        <div className="login-splash-sparkles">
          <Sparkles size={18} className="login-splash-sparkle sp-1" />
          <Sparkles size={22} className="login-splash-sparkle sp-2" />
          <Sparkles size={14} className="login-splash-sparkle sp-3" />
          <Sparkles size={20} className="login-splash-sparkle sp-4" />
          <Sparkles size={16} className="login-splash-sparkle sp-5" />
          <Sparkles size={24} className="login-splash-sparkle sp-6" />
          <Sparkles size={12} className="login-splash-sparkle sp-7" />
          <Sparkles size={18} className="login-splash-sparkle sp-8" />
        </div>

        <div className="login-splash-footer">
          <span>Munafa Market v2.0</span>
        </div>
      </div>
    </div>
  )
}
