import React from 'react';
import './DeepMatkaSections.css';

const DeepMatkaSections = () => {
  // 1. Matka Jodi List Data
  const jodiListData = [
    { title: 'Matka Jodi Count Chart', color: 'red' },
    { title: 'Dhanvarsha Daily Fix Open To Close', color: 'navy' },
    { title: 'Matka Jodi Family Chart', color: 'red' },
    { title: 'Panel Count Chart', color: 'navy' },
    { title: 'Panel Total Chart', color: 'red' },
    { title: 'ALL 220 Card List', color: 'navy' },
    { title: 'CP Pana', color: 'red' },
    { title: 'SP Panel Chart', color: 'navy' },
    { title: 'DP Panel Chart', color: 'red' },
  ];

  // 2. Free Game Zone Data
  const freeGameData = [
    { title: 'SUPER DAY', val: '*****' },
    { title: 'TIME BAZAR', val: '*****' },
    { title: 'SUPER MORNING', val: '*****' },
    { title: 'MILAN MORNING', val: '*****' },
    { title: 'KALYAN MORNING', val: '*****' },
    { title: 'MADHUR MORNING', val: '*****' },
    { title: 'SRIDEVI DAY', val: '*****' },
    { title: 'MADHUR DAY', val: '*****' },
    { title: 'MILAN DAY', val: '*****' },
    { title: 'RAJDHANI DAY', val: '*****' },
    { title: 'SUPREME DAY', val: '*****' },
  ];

  // 3. Jodi Chart Data
  const jodiChartItems = [
    'RUDRAKSHA MORNING', 'MILAN MORNING', 'KALYAN MORNING', 'SRIDEVI DAY',
    'MADHUR MORNING', 'TIME BAZAR', 'MADHUR DAY', 'MILAN DAY',
    'RUDRAKSHA DAY', 'RAJDHANI DAY', 'SUPREME DAY', 'KALYAN',
    'SRIDEVI NIGHT', 'SUPER NIGHT', 'RUDRAKSHA NIGHT', 'MADHUR NIGHT'
  ];

  // 4. Panel Chart Data
  const panelChartItems = [
    'RUDRAKSHA MORNING', 'MILAN MORNING', 'KALYAN MORNING', 'SRIDEVI DAY',
    'MADHUR MORNING', 'TIME BAZAR', 'MADHUR DAY', 'MILAN DAY',
    'RUDRAKSHA DAY', 'RAJDHANI DAY', 'SUPREME DAY', 'KALYAN',
    'SRIDEVI NIGHT', 'SUPER NIGHT', 'RUDRAKSHA NIGHT', 'MADHUR NIGHT'
  ];

  // 5. How To Play Data - Updated with SVG icons
  const stepsData = [
    { step: 'STEP 1', label: 'Download App', icon: 'download' },
    { step: 'STEP 2', label: 'Click On Sign In', icon: 'signin' },
    { step: 'STEP 3', label: 'Enter User Id & Password', icon: 'user' },
    { step: 'STEP 4', label: 'Select & Play The Game', icon: 'play' },
  ];

  // 6. Game Play Rates Data - Updated with SVG icons
  const gameRatesData = [
    { title: 'SINGAL DIGIT', rate: '10 ka 95', icon: 'single' },
    { title: 'JODI DIGIT', rate: '10 ka 950', icon: 'jodi' },
    { title: 'SINGLE PANA', rate: '10 ka 1400', icon: 'singlepana' },
    { title: 'DOUBLE PANA', rate: '10 ka 2800', icon: 'doublepana' },
    { title: 'TRIPLE PANA', rate: '10 ka 7000', icon: 'triplepana' },
    { title: 'HALF SANGAM', rate: '10 ka 10000', icon: 'halfsangam' },
    { title: 'FULL SANGAM', rate: '10 ka 100000', icon: 'fullsangam' },
  ];

  

 
  return (
    <div className="dm-page-wrapper">

      {/* SECTION 1: Matka Jodi List */}
      <section className="dm-section max-w-container">
        <h2 className="dm-section-title dark-title">Matka Jodi List</h2>
        <div className="grid-3-col">
          {jodiListData.map((item, idx) => (
            <div key={idx} className={`jodi-list-card card-${item.color}`}>
              <div className="card-content">
                <h3>{item.title}</h3>
                <button className="view-link-btn">
                  View <span>→</span>
                </button>
              </div>
              <div className="graphic-circles">
                <span className="circle c1"></span>
                <span className="circle c2"></span>
                <span className="circle c3"></span>
                <span className="square s1"></span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* SECTION 2: Free Game Zone Open-Close */}
      <section className="dm-section bg-white-card border-y">
        <div className="max-w-container">
          <h2 className="dm-section-title red-title">FREE GAME ZONE OPEN-CLOSE</h2>
          
          <div className="sub-header-pills">
            <span>● DATE: 2026-08-31</span>
            <span>● FREE GUESSING DAILY</span>
            <span>● OPEN TO CLOSE FIX ANK</span>
          </div>

          <div className="grid-3-col">
            {freeGameData.map((item, idx) => (
              <div key={idx} className="free-game-card">
                <div className="game-card-header">{item.title}</div>
                <div className="game-card-body">{item.val}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 3: Deep Matka Jodi Chart */}
      <section className="dm-section max-w-container">
        <h2 className="dm-section-title dark-title">MUNAFA MARKET JODI CHART</h2>
        <div className="grid-4-col">
          {jodiChartItems.map((title, idx) => (
            <div key={idx} className="chart-navy-card">
              <h3>{title}</h3>
              <button className="view-link-btn light-btn">
                View <span>→</span>
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* SECTION 4: Deep Matka Panel Chart */}
      <section className="dm-section max-w-container">
        <h2 className="dm-section-title red-title">MUNAFA MARKET PANEL CHART</h2>
        <div className="grid-4-col">
          {panelChartItems.map((title, idx) => (
            <div key={idx} className="chart-red-card">
              <h3>{title}</h3>
              <button className="view-link-btn light-btn">
                View <span>→</span>
              </button>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
};

export default DeepMatkaSections;