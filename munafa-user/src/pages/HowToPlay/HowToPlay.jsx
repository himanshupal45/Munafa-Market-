import React from 'react';
import './HowToPlay.css';

const HowToPlay = () => {
  const stepsData = [
    { step: 'STEP 1', label: 'Download App', icon: 'download' },
    { step: 'STEP 2', label: 'Click On Sign In', icon: 'signin' },
    { step: 'STEP 3', label: 'Enter User Id & Password', icon: 'user' },
    { step: 'STEP 4', label: 'Select & Play The Game', icon: 'play' },
  ];

  // SVG Icon Component
  const StepIcon = ({ type }) => {
    const icons = {
      download: (
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
          <polyline points="7 10 12 15 17 10" />
          <line x1="12" y1="15" x2="12" y2="3" />
        </svg>
      ),
      signin: (
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
          <polyline points="10 17 15 12 10 7" />
          <line x1="15" y1="12" x2="3" y2="12" />
        </svg>
      ),
      user: (
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
          <circle cx="12" cy="7" r="4" />
        </svg>
      ),
      play: (
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polygon points="5 3 19 12 5 21 5 3" />
        </svg>
      ),
    };
    return icons[type] || icons.download;
  };

  return (
    <div className="htp-page">
      <div className="htp-container">
        {/* Header */}
        <div className="htp-header">
          <h1 className="htp-title">HOW TO PLAY</h1>
          <p className="htp-subtitle">Follow these simple steps to start playing</p>
        </div>

        {/* Steps */}
        <div className="htp-steps-grid">
          {stepsData.map((item, idx) => (
            <div key={idx} className="htp-step-card">
              <div className={`htp-step-number ${idx % 2 === 0 ? 'orange' : 'navy'}`}>
                {idx + 1}
              </div>
              <div className={`htp-hex-icon ${idx % 2 === 0 ? 'hex-orange' : 'hex-navy'}`}>
                <StepIcon type={item.icon} />
              </div>
              <div className="htp-step-label">{item.step}</div>
              <div className="htp-step-desc">{item.label}</div>
            </div>
          ))}
        </div>

        {/* Footer Note */}
        <div className="htp-footer">
          <p>💡 Start winning today! Download the app and join millions of players.</p>
        </div>
      </div>
    </div>
  );
};

export default HowToPlay;