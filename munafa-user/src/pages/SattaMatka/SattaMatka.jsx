import React, { useState, useEffect, useRef } from 'react';
import './SattaMatka.css';

// ============= SVG ICONS =============
const Icons = {
  BackArrow: () => (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M15 18l-6-6 6-6" />
    </svg>
  ),
  Wallet: () => (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 12V7H5a2 2 0 0 1 0-4h14v4" />
      <path d="M3 5v14a2 2 0 0 0 2 2h16v-5" />
      <path d="M18 12a2 2 0 0 0 0 4h4v-4z" />
    </svg>
  ),
  ChevronDown: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="6 9 12 15 18 9" />
    </svg>
  ),
  ArrowRight: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <line x1="5" y1="12" x2="19" y2="12" />
      <polyline points="12 5 19 12 12 19" />
    </svg>
  ),
  // Game icons
  SingleDigit: () => (
    <svg width="55" height="55" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <rect x="4" y="4" width="16" height="16" rx="1" />
      <circle cx="12" cy="12" r="2" fill="currentColor" />
    </svg>
  ),
  DoubleDigit: () => (
    <svg width="55" height="55" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <rect x="4" y="4" width="16" height="16" rx="1" />
      <circle cx="9" cy="9" r="1.5" fill="currentColor" />
      <circle cx="15" cy="15" r="1.5" fill="currentColor" />
    </svg>
  ),
  SinglePana: () => (
    <svg width="55" height="55" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <rect x="6" y="3" width="12" height="18" rx="1.5" transform="rotate(-15 12 12)" />
      <circle cx="12" cy="12" r="2" fill="currentColor" />
    </svg>
  ),
  DoublePana: () => (
    <svg width="55" height="55" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <rect x="4" y="4" width="10" height="15" rx="1.5" transform="rotate(-15 9 11)" />
      <rect x="10" y="5" width="10" height="15" rx="1.5" transform="rotate(15 15 12)" />
    </svg>
  ),
  TriplePana: () => (
    <svg width="55" height="55" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <rect x="3" y="6" width="8" height="12" rx="1" transform="rotate(-15 7 12)" />
      <rect x="8" y="6" width="8" height="12" rx="1" />
      <rect x="13" y="6" width="8" height="12" rx="1" transform="rotate(15 17 12)" />
    </svg>
  ),
  PanelGroup: () => (
    <svg width="55" height="55" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <circle cx="8" cy="8" r="2.5" />
      <circle cx="16" cy="8" r="2.5" />
      <circle cx="8" cy="16" r="2.5" />
      <circle cx="16" cy="16" r="2.5" />
    </svg>
  ),
  SpDpTp: () => (
    <svg width="55" height="55" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <circle cx="12" cy="12" r="9" />
      <circle cx="12" cy="6" r="1.5" fill="currentColor" />
      <circle cx="8" cy="14" r="1.5" fill="currentColor" />
      <circle cx="16" cy="14" r="1.5" fill="currentColor" />
    </svg>
  ),
  ChoicePana: () => (
    <svg width="55" height="55" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <rect x="3" y="5" width="10" height="15" rx="1.5" transform="rotate(-15 8 12)" />
      <rect x="11" y="5" width="10" height="15" rx="1.5" transform="rotate(15 16 12)" fill="currentColor" fillOpacity="0.3" />
    </svg>
  ),
  SpMotor: () => (
    <svg width="55" height="55" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <rect x="4" y="6" width="16" height="14" rx="2" />
      <path d="M8 6V4h8v2" />
      <text x="12" y="15" textAnchor="middle" fontSize="6" fill="currentColor" fontWeight="bold" stroke="none">777</text>
    </svg>
  ),
  DpMotor: () => (
    <svg width="55" height="55" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <circle cx="12" cy="12" r="9" />
      <circle cx="12" cy="12" r="6" />
      <circle cx="12" cy="12" r="2" fill="currentColor" />
      <line x1="12" y1="3" x2="12" y2="21" />
      <line x1="3" y1="12" x2="21" y2="12" />
    </svg>
  ),
  OddEven: () => (
    <svg width="55" height="55" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <rect x="4" y="4" width="16" height="16" rx="2" />
      <circle cx="9" cy="9" r="1.2" fill="currentColor" />
      <circle cx="15" cy="9" r="1.2" fill="currentColor" />
      <circle cx="9" cy="15" r="1.2" fill="currentColor" />
      <circle cx="15" cy="15" r="1.2" fill="currentColor" />
    </svg>
  ),
  TwoDigitsPanel: () => (
    <svg width="55" height="55" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <rect x="4" y="4" width="16" height="16" rx="1" />
      <circle cx="10" cy="10" r="1.8" fill="currentColor" />
      <circle cx="15" cy="15" r="1.8" fill="currentColor" />
    </svg>
  ),
  GroupJodi: () => (
    <svg width="55" height="55" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <circle cx="7" cy="7" r="3" />
      <circle cx="17" cy="7" r="3" />
      <circle cx="7" cy="17" r="3" />
      <circle cx="17" cy="17" r="3" />
    </svg>
  ),
  DigitBasedJodi: () => (
    <svg width="55" height="55" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <rect x="3" y="5" width="9" height="14" rx="1" />
      <rect x="13" y="5" width="9" height="14" rx="1" fill="currentColor" fillOpacity="0.3" />
    </svg>
  ),
  Jodi: () => (
    <svg width="55" height="55" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <rect x="4" y="4" width="16" height="16" rx="1" />
      <circle cx="10" cy="10" r="1.8" fill="currentColor" />
      <circle cx="15" cy="15" r="1.8" fill="currentColor" />
    </svg>
  ),
};

// ============= GAME TYPES =============
const GAME_TYPES = [
  { id: 'single-digits', label: 'Single Digits', icon: Icons.SingleDigit },
  { id: 'single-digits-bulk', label: 'Single Digits Bulk', icon: Icons.DoubleDigit },
  { id: 'jodi', label: 'Jodi', icon: Icons.Jodi },
  { id: 'jodi-bulk', label: 'Jodi Bulk', icon: Icons.DoubleDigit },
  { id: 'single-pana', label: 'Single Pana', icon: Icons.SinglePana },
  { id: 'single-pana-bulk', label: 'Single Pana Bulk', icon: Icons.SinglePana },
  { id: 'double-pana', label: 'Double Pana', icon: Icons.DoublePana },
  { id: 'double-pana-bulk', label: 'Double Pana Bulk', icon: Icons.DoublePana },
  { id: 'triple-pana', label: 'Triple Pana', icon: Icons.TriplePana },
  { id: 'panel-group', label: 'Panel Group', icon: Icons.PanelGroup },
  { id: 'sp-dp-tp', label: 'SP DP TP', icon: Icons.SpDpTp },
  { id: 'choice-pana', label: 'Choice Panna SP DP', icon: Icons.ChoicePana },
  { id: 'sp-motor', label: 'SP Motor', icon: Icons.SpMotor },
  { id: 'dp-motor', label: 'DP Motor', icon: Icons.DpMotor },
  { id: 'odd-even', label: 'Odd Even', icon: Icons.OddEven },
  { id: 'two-digits-panel', label: 'Two Digits Panel', icon: Icons.TwoDigitsPanel },
  { id: 'group-jodi', label: 'Group Jodi', icon: Icons.GroupJodi },
  { id: 'digit-based-jodi', label: 'Digit Based Jodi', icon: Icons.DigitBasedJodi },
];

// ============= MAIN COMPONENT =============
export default function SattaMatka() {
  const [selectedGame, setSelectedGame] = useState(null);
  const [gameType, setGameType] = useState('A DAY OPEN');
  const [singleDigits, setSingleDigits] = useState('');
  const [points, setPoints] = useState('');
  const [entries, setEntries] = useState([]);
  const [walletBalance] = useState(0);

  // ✅ FIX: Ref for scroll container
  const pageTopRef = useRef(null);

  // ✅ FIX: Force scroll to top when screen changes
  useEffect(() => {
    // Multiple attempts to ensure scroll works
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;

    // Also scroll the specific ref if it exists
    if (pageTopRef.current) {
      pageTopRef.current.scrollIntoView({ behavior: 'instant', block: 'start' });
    }

    // Fallback with a small timeout (some browsers need a tick)
    const timer = setTimeout(() => {
      window.scrollTo(0, 0);
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
    }, 50);

    return () => clearTimeout(timer);
  }, [selectedGame]);

  // Handle game type selection (Screen 1 → Screen 2)
  const handleGameSelect = (game) => {
    // ✅ Scroll to top FIRST, then change state
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
    
    // Now change state
    setSelectedGame(game);
  };

  // Handle back button (Screen 2 → Screen 1)
  const handleBack = () => {
    // ✅ Scroll to top first
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;

    setSelectedGame(null);
    setEntries([]);
    setSingleDigits('');
    setPoints('');
  };

  // Handle Add button
  const handleAdd = () => {
    if (!singleDigits.trim()) {
      alert('Please enter single digits');
      return;
    }
    if (!points.trim()) {
      alert('Please enter points');
      return;
    }

    const newEntry = {
      id: Date.now(),
      digit: singleDigits,
      points: points,
      type: gameType,
    };

    setEntries((prev) => [...prev, newEntry]);
    setSingleDigits('');
    setPoints('');
  };

  return (
    <div className="sm-app" ref={pageTopRef}>
      {/* ==================== SCREEN 1: GAME TYPE GRID ==================== */}
      {!selectedGame && (
        <>
          {/* Header */}
          <div className="sm-header">
            <button className="sm-back-btn" onClick={() => window.history.back()}>
              <Icons.BackArrow />
            </button>
            <h1 className="sm-header-title">TATA DAY - OPEN CLOSE</h1>
            <div className="sm-wallet">
              <Icons.Wallet />
              <span className="sm-wallet-balance">{walletBalance}</span>
            </div>
          </div>

          {/* Game Grid */}
          <div className="sm-game-grid">
            {GAME_TYPES.map((game) => {
              const Icon = game.icon;
              return (
                <div
                  key={game.id}
                  className="sm-game-item"
                  onClick={() => handleGameSelect(game)}
                >
                  <div className="sm-game-icon-wrapper">
                    <Icon />
                  </div>
                  <p className="sm-game-label">{game.label}</p>
                </div>
              );
            })}
          </div>
        </>
      )}

      {/* ==================== SCREEN 2: DIGIT BOARD FORM ==================== */}
      {selectedGame && (
        <>
          {/* Header */}
          <div className="sm-header">
            <button className="sm-back-btn" onClick={handleBack}>
              <Icons.BackArrow />
            </button>
            <h1 className="sm-header-title">DIGIT BOARD</h1>
            <div className="sm-wallet">
              <Icons.Wallet />
              <span className="sm-wallet-balance">{walletBalance}</span>
            </div>
          </div>

          {/* Game Title */}
          <div className="sm-form-title">
            TATA DAY - {selectedGame.label.toUpperCase()}
          </div>

          {/* Form */}
          <div className="sm-form">
            {/* Select Game Type */}
            <div className="sm-form-row">
              <label className="sm-form-label">Select Game Type :</label>
              <div className="sm-select-wrapper">
                <select
                  value={gameType}
                  onChange={(e) => setGameType(e.target.value)}
                  className="sm-select"
                >
                  <option value="A DAY OPEN">A DAY OPEN</option>
                  <option value="A DAY CLOSE">A DAY CLOSE</option>
                  <option value="B DAY OPEN">B DAY OPEN</option>
                  <option value="B DAY CLOSE">B DAY CLOSE</option>
                </select>
                <div className="sm-select-arrow">
                  <Icons.ChevronDown />
                </div>
              </div>
            </div>

            {/* Enter Single Digits */}
            <div className="sm-form-row">
              <label className="sm-form-label">Enter Single Digits :</label>
              <div className="sm-input-wrapper">
                <input
                  type="text"
                  value={singleDigits}
                  onChange={(e) => setSingleDigits(e.target.value)}
                  className="sm-input"
                  placeholder=""
                />
                <button className="sm-input-arrow-btn" type="button">
                  <Icons.ArrowRight />
                </button>
              </div>
            </div>

            {/* Enter Points */}
            <div className="sm-form-row">
              <label className="sm-form-label">Enter Points :</label>
              <div className="sm-input-wrapper">
                <input
                  type="text"
                  value={points}
                  onChange={(e) => setPoints(e.target.value.replace(/\D/g, ''))}
                  className="sm-input"
                  placeholder=""
                />
                <button className="sm-input-arrow-btn" type="button">
                  <Icons.ArrowRight />
                </button>
              </div>
            </div>

            {/* Add Button */}
            <button className="sm-add-btn" onClick={handleAdd}>
              ADD
            </button>
          </div>

          {/* Table */}
          <div className="sm-table">
            <div className="sm-table-header">
              <div className="sm-table-cell sm-table-digit">Digit</div>
              <div className="sm-table-cell sm-table-points">Points</div>
              <div className="sm-table-cell sm-table-type">Type</div>
            </div>
            <div className="sm-table-body">
              {entries.length === 0 ? (
                <div className="sm-table-empty"></div>
              ) : (
                entries.map((entry) => (
                  <div key={entry.id} className="sm-table-row">
                    <div className="sm-table-cell sm-table-digit">{entry.digit}</div>
                    <div className="sm-table-cell sm-table-points">{entry.points}</div>
                    <div className="sm-table-cell sm-table-type">{entry.type}</div>
                  </div>
                ))
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}