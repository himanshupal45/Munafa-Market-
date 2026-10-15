import React from 'react';
import './GaliResultGrid.css';

const ResultCard = ({ title, value = '-', time, status = 'open' }) => {
  const isOpen = status === 'open';

  return (
    <div className="gali-card">
      {/* Top Row: Title + Status */}
      <div className="card-top">
        <div className="title-row">
          <h3 className="card-heading">
            {title} {time} <span className="info-icon">ⓘ</span>
          </h3>
          <span className={`status-tag ${isOpen ? 'open' : 'closed'}`}>
            {isOpen ? 'Open Today' : 'Closed for Today'}
          </span>
        </div>
      </div>

      {/* Middle Row: Value + Play Button */}
      <div className="card-middle">
        <span className="value-dash">{value}</span>
        <button className="play-btn" aria-label="Play">
          <svg viewBox="0 0 24 24" width="22" height="22" fill="#fff">
            <path d="M8 5v14l11-7z" />
          </svg>
        </button>
      </div>

      {/* Bottom Row: Chart Buttons */}
      <div className="card-bottom">
        <button className="chart-btn">Pana Chart</button>
        <button className="chart-btn">Jodi Chart</button>
      </div>
    </div>
  );
};

const GaliResultGrid = () => {
  const cardData = [
    { title: 'Haryana Club', time: '05:15 PM', status: 'open' },
    { title: 'Kolkata ff', time: '09:59 PM', status: 'open' },
    { title: 'FF Kolkata', time: '11:30 PM', status: 'open' },
    { title: 'SRIDEVI DAY', time: '11:35 AM', status: 'closed' },
    { title: 'KALYAN MORNING', time: '11:40 AM', status: 'closed' },
    { title: 'TIME BAZAR', time: '01:00 PM', status: 'closed' },
    { title: 'MADHUR DAY', time: '01:30 PM', status: 'closed' },
    { title: 'MILAN DAY', time: '02:55 PM', status: 'open' },
    { title: 'RAJDHANI DAY', time: '02:55 PM', status: 'open' },
  ];

  return (
    <div className="gali-container">
      <main className="main-content">
        {/* Header */}
        <div className="section-header">
          <h1 className="section-title">Available Games</h1>
        </div>

        {/* Cards Grid */}
        <div className="cards-grid">
          {cardData.map((card, idx) => (
            <ResultCard
              key={idx}
              title={card.title}
              time={card.time}
              status={card.status}
            />
          ))}
        </div>
      </main>
    </div>
  );
};

export default GaliResultGrid;