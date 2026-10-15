import React from 'react';
import './StarlineGameZone.css';

const StarlineGameZone = () => {
  const tableData = [
    { time1: '10:00 AM', result1: '***-*-*', time2: '05:00 PM', result2: '***-*-*' },
    { time1: '11:00 AM', result1: '***-*-*', time2: '06:00 PM', result2: '***-*-*' },
    { time1: '12:00 PM', result1: '***-*-*', time2: '07:00 PM', result2: '***-*-*' },
    { time1: '01:00 PM', result1: '***-*-*', time2: '08:00 PM', result2: '***-*-*' },
    { time1: '02:00 PM', result1: '***-*-*', time2: '09:00 PM', result2: '***-*-*' },
    { time1: '03:00 PM', result1: '***-*-*', time2: '10:00 PM', result2: '***-*-*' },
    { time1: '04:00 PM', result1: '***-*-*', time2: '', result2: '' },
  ];

  const zoneCards = [
    { title: 'Munafa Market Guessing Forum' },
    { title: 'Ratan Khatri Fix Panel Chart' },
    { title: 'Matka Final Number Trick Chart' },
  ];

  return (
    <div className="starline-wrapper">
     
      <main className="starline-main">
        {/* Kalyan Starline Section */}
        <section className="starline-section">
          <div className="starline-card">
            <div className="starline-header">
              <h2>Kalyan Starline</h2>
            </div>
            
            <div className="starline-body">
              <div className="table-responsive">
                <table className="starline-table">
                  <thead>
                    <tr>
                      <th className="navy-th">Time</th>
                      <th className="navy-th">Result</th>
                      <th className="red-th">Time</th>
                      <th className="red-th">Result</th>
                    </tr>
                  </thead>
                  <tbody>
                    {tableData.map((row, index) => (
                      <tr key={index}>
                        <td className="navy-td">{row.time1}</td>
                        <td className="navy-td">{row.result1}</td>
                        <td className="red-td">{row.time2}</td>
                        <td className="red-td">{row.result2}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="chart-btn-wrapper">
                <button className="view-chart-btn">View Chart</button>
              </div>
            </div>
          </div>
        </section>

        {/* Special Game Zone Section */}
        <section className="game-zone-section">
          <h2 className="zone-title">Munafa Market Special Game Zone</h2>
          
          <div className="zone-grid">
            {zoneCards.map((card, idx) => (
              <div key={idx} className="zone-card">
                <h3 className="zone-card-title">{card.title}</h3>
                <button className="zone-view-btn">View</button>
              </div>
            ))}
          </div>
        </section>

        {/* Promo Contact Footer Banner */}
        <section className="promo-banner">
          <div className="promo-pills">
            <div className="promo-pill">🔔 आज कल्याण बाजार बम्पर धमाका</div>
            <div className="promo-pill">🔔 अचूक जोड़ी पर कमाओ लाखों 100% फिक्स 1 जोड़ी 2 पत्ती</div>
            <div className="promo-pill">🔔 सिर्फ एक दिन में आपका पूरा लॉस कवर होगा मनी बैक गारंटी</div>
            <div className="promo-pill">🔔 एडवांस चार्ज 3100 /- मात्र</div>
            
            <a href="https://wa.me/918440000840" className="whatsapp-btn">
              💬 WHATSAPP NOW 8440000840
            </a>
          </div>
        </section>
      </main>
    </div>
  );
};

export default StarlineGameZone;