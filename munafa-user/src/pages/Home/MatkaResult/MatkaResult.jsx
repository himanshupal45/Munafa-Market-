import React, { useState, useEffect } from 'react';
import { apiCall } from '../../../context/AuthContext';
import './MatkaResult.css';

// ── Single Card ────────────────────────────────────────────────────
const MarketCard = ({ title, numbers }) => {
  return (
    <div className="market-card">
      <div className="card-header">
        <h3 className="card-title">{title}</h3>
        <div className="number-pill">{numbers}</div>
      </div>
    </div>
  );
};

// ── Main Grid ──────────────────────────────────────────────────────
const MarketGrid = () => {
  const [rates, setRates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchRates = async () => {
    setLoading(true);
    setError(null);
    try {
      // ✅ NO /api prefix — API_BASE already ends with /api
      const data = await apiCall('/game-rates');
      if (data && data.success && Array.isArray(data.rates)) {
        setRates(data.rates);
      } else {
        setRates([]);
      }
    } catch (err) {
      setError(err.message || 'Rates load nahi hue');
      setRates([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRates();
  }, []);

  // Format: "1 RS KA 100.00 Rs" using value2 (Win ₹)
  const formatRate = (rate) => {
    const betValue = Number(rate.value1 || 1);
    const winValue = Number(rate.value2 || 0);
    return `${betValue} RS KA ${winValue.toFixed(2)} Rs`;
  };

  return (
    <div className="market-container">
      <main className="main-content">
        {/* Banner Section */}
        <div className="banner">
          <h1 className="banner-title">Game Rates</h1>
          <p className="banner-subtitle">Sabse Tezz Live Result Yahi Milega</p>
        </div>

        {/* Loading */}
        {loading && (
          <div style={{ textAlign: 'center', padding: '40px 0' }}>
            <p>Loading rates...</p>
          </div>
        )}

        {/* Error */}
        {!loading && error && (
          <div style={{ textAlign: 'center', padding: '40px 0', color: '#c00' }}>
            <p>⚠ {error}</p>
            <button
              onClick={fetchRates}
              style={{ marginTop: '10px', padding: '8px 16px', cursor: 'pointer' }}
            >
              ↺ Retry
            </button>
          </div>
        )}

        {/* Empty */}
        {!loading && !error && rates.length === 0 && (
          <div style={{ textAlign: 'center', padding: '40px 0', color: '#888' }}>
            <p>Koi game rate available nahi hai.</p>
          </div>
        )}

        {/* Cards */}
        {!loading && !error && rates.length > 0 && (
          <div className="cards-grid">
            {rates.map((rate, idx) => (
              <MarketCard
                key={rate.key || idx}
                title={rate.label}
                numbers={formatRate(rate)}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default MarketGrid;