import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronLeft, Wallet } from 'lucide-react';
import { apiCall, useAuth } from '../../context/AuthContext';
import './PlayPage.css';

// ============================================
// HELPERS
// ============================================
const slugify = (s) =>
  String(s || '').toLowerCase().trim().replace(/\s+/g, '-');

// API ke rate (key/label) se icon ka type nikalna
const iconTypeFor = (rate) => {
  const t = `${rate.key || ''} ${rate.label || ''}`.toLowerCase();
  if (t.includes('panel') || t.includes('group')) return 'panel-group';
  if (t.includes('triple')) return 'triple-pana';
  if (t.includes('double')) return 'double-pana';
  if (t.includes('pana') || t.includes('patti') || t.includes('panna')) return 'single-pana';
  if (t.includes('jodi')) return 'jodi';
  return 'single-digits';
};

// ============================================
// ICONS
// ============================================
const GameIcon = ({ type }) => {
  const stroke = '#f5a623';
  const commonProps = {
    width: 60,
    height: 60,
    viewBox: '0 0 64 64',
    fill: 'none',
    stroke,
    strokeWidth: 2.8,
    strokeLinecap: 'round',
    strokeLinejoin: 'round',
  };

  switch (type) {
    case 'single-digits':
      return (
        <svg {...commonProps}>
          <rect x="12" y="12" width="40" height="40" rx="3" />
          <circle cx="32" cy="32" r="5" fill={stroke} stroke="none" />
        </svg>
      );

    case 'jodi':
      return (
        <svg {...commonProps}>
          <rect x="12" y="12" width="40" height="40" rx="3" />
          <circle cx="24" cy="24" r="4.5" fill={stroke} stroke="none" />
          <circle cx="40" cy="40" r="4.5" fill={stroke} stroke="none" />
        </svg>
      );

    case 'single-pana':
      return (
        <svg {...commonProps}>
          <g transform="rotate(-15 32 32)">
            <rect x="20" y="10" width="24" height="44" rx="3" />
            <path
              d="M32 22 C 28 26, 24 28, 24 32 C 24 35, 27 36, 29 34 C 29 36, 28 38, 27 40 L 37 40 C 36 38, 35 36, 35 34 C 37 36, 40 35, 40 32 C 40 28, 36 26, 32 22 Z"
              fill={stroke}
              stroke="none"
            />
          </g>
        </svg>
      );

    case 'double-pana':
      return (
        <svg {...commonProps}>
          <g transform="rotate(-18 28 32)">
            <rect x="16" y="12" width="22" height="38" rx="3" />
            <text x="27" y="24" fontSize="9" textAnchor="middle" fill={stroke} stroke="none" fontWeight="700">A</text>
            <path
              d="M27 30 C 24 33, 21 34, 21 37 C 21 39, 23 40, 25 38 C 25 40, 24 42, 23 43 L 31 43 C 30 42, 29 40, 29 38 C 31 40, 33 39, 33 37 C 33 34, 30 33, 27 30 Z"
              fill={stroke}
              stroke="none"
            />
          </g>
          <g transform="rotate(12 40 34)">
            <rect x="30" y="14" width="22" height="38" rx="3" />
            <text x="41" y="26" fontSize="9" textAnchor="middle" fill={stroke} stroke="none" fontWeight="700">A</text>
            <path
              d="M41 32 C 38 35, 35 36, 35 39 C 35 41, 37 42, 39 40 C 39 42, 38 44, 37 45 L 45 45 C 44 44, 43 42, 43 40 C 45 42, 47 41, 47 39 C 47 36, 44 35, 41 32 Z"
              fill={stroke}
              stroke="none"
            />
          </g>
          <g>
            <circle cx="46" cy="46" r="10" fill="#fff" />
            <circle cx="46" cy="46" r="10" stroke={stroke} strokeWidth="2.5" fill="none" />
            <circle cx="46" cy="46" r="7" stroke={stroke} strokeWidth="1" fill="none" strokeDasharray="2 2" />
            <text x="46" y="50" fontSize="11" textAnchor="middle" fill={stroke} stroke="none" fontWeight="700">7</text>
          </g>
        </svg>
      );

    case 'triple-pana':
      return (
        <svg {...commonProps}>
          <rect x="8" y="14" width="15" height="26" rx="2" />
          <rect x="24" y="14" width="15" height="26" rx="2" />
          <rect x="40" y="14" width="15" height="26" rx="2" />
          <path
            d="M32 42 C 28 46, 24 47, 24 50 C 24 52, 27 53, 29 51 C 29 53, 28 55, 27 56 L 37 56 C 36 55, 35 53, 35 51 C 37 53, 40 52, 40 50 C 40 47, 36 46, 32 42 Z"
            fill={stroke}
            stroke="none"
          />
        </svg>
      );

    case 'panel-group':
      return (
        <svg {...commonProps}>
          <circle cx="18" cy="26" r="5" fill={stroke} stroke="none" />
          <path d="M10 44 C 10 38, 14 34, 18 34 C 22 34, 26 38, 26 44" stroke={stroke} strokeWidth="3" fill="none" />
          <circle cx="46" cy="26" r="5" fill={stroke} stroke="none" />
          <path d="M38 44 C 38 38, 42 34, 46 34 C 50 34, 54 38, 54 44" stroke={stroke} strokeWidth="3" fill="none" />
          <circle cx="32" cy="22" r="5.5" fill={stroke} stroke="none" />
          <path d="M22 46 C 22 38, 26 32, 32 32 C 38 32, 42 38, 42 46" stroke={stroke} strokeWidth="3" fill="none" />
        </svg>
      );

    default:
      return null;
  }
};

// ============================================
// MAIN PLAY PAGE
// ============================================
const PlayPage = () => {
  const { gameId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [game, setGame] = useState(null);
  const [rates, setRates] = useState([]);
  const [balance, setBalance] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadData = useCallback(async () => {
    setLoading(true);
    setError(null);

    // Game + rates ek saath; balance alag (fail ho to page na toote)
    const [gamesRes, ratesRes] = await Promise.allSettled([
      apiCall('/games'),
      apiCall('/game-rates'),
    ]);

    if (gamesRes.status === 'fulfilled' && gamesRes.value?.success) {
      const found = (gamesRes.value.games || []).find(
        (g) => g._id === gameId || slugify(g.name) === gameId
      );
      setGame(found || null);
      if (!found) setError('Ye game nahi mila');
    } else {
      setError(gamesRes.reason?.message || 'Game load nahi hua');
    }

    if (ratesRes.status === 'fulfilled' && ratesRes.value?.success) {
      setRates(ratesRes.value.rates || []);
    } else if (ratesRes.status === 'rejected') {
      setError((prev) => prev || ratesRes.reason?.message || 'Game options load nahi hue');
    }

    setLoading(false);
  }, [gameId]);

  useEffect(() => { loadData(); }, [loadData]);

  // Wallet balance: pehle server se (/auth/me), na mile to login ke user object se
  useEffect(() => {
    if (!user) { setBalance(null); return; }
    let active = true;
    (async () => {
      try {
        const res = await apiCall('/ledger/me');
        if (active && res?.success && res.balance != null) { setBalance(Number(res.balance)); return; }
      } catch {
        /* neeche fallback */
      }
      const b = user.wallet ?? user.walletBalance ?? user.balance;
      if (active) setBalance(b != null ? Number(b) : 0);
    })();
    return () => { active = false; };
  }, [user]);

  const title = game
    ? `${game.name}${game.closeTime ? ' - OPEN CLOSE' : ''}`.toUpperCase()
    : loading ? 'LOADING...' : 'GAME';

  const handleOptionClick = (rate) => {
    navigate(`/play/${gameId}/${rate.key}`);
  };

  return (
    <div className="play-page">
      {/* Header */}
      <div className="play-header">
        <button className="play-back-btn" onClick={() => navigate(-1)} aria-label="Back">
          <ChevronLeft size={28} strokeWidth={2.2} />
        </button>
        <h1 className="play-title">{title}</h1>
        <div className="play-wallet">
          <Wallet size={24} strokeWidth={2} />
          <span className="play-wallet-balance">
            {balance == null ? '--' : balance.toLocaleString('en-IN')}
          </span>
        </div>
      </div>

      {/* Loading */}
      {loading && (
        <div style={{ textAlign: 'center', padding: '40px 0' }}>
          <p>Loading...</p>
        </div>
      )}

      {/* Error */}
      {!loading && error && (
        <div style={{ textAlign: 'center', padding: '40px 0', color: '#c00' }}>
          <p>⚠ {error}</p>
          <button
            onClick={loadData}
            style={{ marginTop: 10, padding: '8px 16px', cursor: 'pointer' }}
          >
            ↺ Retry
          </button>
        </div>
      )}

      {/* Empty */}
      {!loading && !error && rates.length === 0 && (
        <div style={{ textAlign: 'center', padding: '40px 0', color: '#888' }}>
          <p>Abhi koi game option available nahi hai.</p>
        </div>
      )}

      {/* Grid — options API ke game-rates se */}
      {!loading && !error && rates.length > 0 && (
        <div className="play-grid">
          {rates.map((rate) => (
            <button
              key={rate.key}
              className="play-grid-item"
              onClick={() => handleOptionClick(rate)}
            >
              <div className="play-grid-circle">
                <GameIcon type={iconTypeFor(rate)} />
              </div>
              <span className="play-grid-label">{rate.label}</span>
              <span style={{ fontSize: 11, opacity: 0.75 }}>
                {Number(rate.value1 || 1)} KA {Number(rate.value2 || 0)}
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default PlayPage;