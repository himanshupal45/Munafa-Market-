import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronLeft, Wallet, ArrowRight, ChevronDown } from 'lucide-react';
import { apiCall, useAuth } from '../../context/AuthContext';
import './PlayOptionPage.css';

// ============================================
// HELPERS
// ============================================
const slugify = (s) => String(s || '').toLowerCase().trim().replace(/\s+/g, '-');

// Valid 3-digit panna list (digit order 1..9 phir 0) — validation ke liye
const VALID_PANAS = (() => {
  const rank = (d) => (d === 0 ? 10 : d);
  const out = [];
  for (let a = 0; a <= 9; a++)
    for (let b = 0; b <= 9; b++)
      for (let c = 0; c <= 9; c++)
        if (rank(a) <= rank(b) && rank(b) <= rank(c)) out.push(`${a}${b}${c}`);
  return new Set(out);
})();

const panaKind = (p) => {
  const u = new Set(p).size;
  return u === 1 ? 'triple' : u === 2 ? 'double' : 'single';
};

// Option (game-rate) ke key/label se rule nikalna
const getRule = (rate) => {
  const t = `${rate?.key || ''} ${rate?.label || ''}`.toLowerCase();
  if (t.includes('panel') || t.includes('group')) return { len: 3, kind: 'panel' };
  if (t.includes('triple')) return { len: 3, kind: 'triple' };
  if (t.includes('double')) return { len: 3, kind: 'double' };
  if (t.includes('pana') || t.includes('patti') || t.includes('panna'))
    return { len: 3, kind: 'single' };
  if (t.includes('jodi')) return { len: 2, kind: 'jodi' };
  return { len: 1, kind: 'digit' };
};

const validateDigit = (digit, rule) => {
  if (!/^\d+$/.test(digit) || digit.length !== rule.len)
    return `${rule.len} ank ka number daalo`;
  if (['single', 'double', 'triple'].includes(rule.kind)) {
    if (!VALID_PANAS.has(digit)) return 'Ye valid pana nahi hai';
    if (panaKind(digit) !== rule.kind) return `Ye ${rule.kind} pana nahi hai`;
  }
  return null;
};

// ============================================
// MAIN
// ============================================
const PlayOptionPage = () => {
  const { gameId, optionId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [game, setGame] = useState(null);
  const [rate, setRate] = useState(null);
  const [balance, setBalance] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [gameType, setGameType] = useState('');
  const [digit, setDigit] = useState('');
  const [points, setPoints] = useState('');
  const [bets, setBets] = useState([]);          // ✅ database se aati hain
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState(null);

  const showMsg = (type, text) => {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 4000);
  };

  // ---------- Game + option (rate) ----------
  const loadData = useCallback(async () => {
    setLoading(true);
    setError(null);
    const [gamesRes, ratesRes] = await Promise.allSettled([
      apiCall('/games'),
      apiCall('/game-rates'),
    ]);

    let foundGame = null;
    if (gamesRes.status === 'fulfilled' && gamesRes.value?.success) {
      foundGame = (gamesRes.value.games || []).find(
        (g) => g._id === gameId || slugify(g.name) === gameId
      );
      setGame(foundGame || null);
      if (!foundGame) setError('Ye game nahi mila');
    } else {
      setError(gamesRes.reason?.message || 'Game load nahi hua');
    }

    if (ratesRes.status === 'fulfilled' && ratesRes.value?.success) {
      const foundRate = (ratesRes.value.rates || []).find((r) => r.key === optionId);
      setRate(foundRate || null);
      if (!foundRate) setError((p) => p || 'Ye game option nahi mila');
    } else {
      setError((p) => p || ratesRes.reason?.message || 'Option load nahi hua');
    }

    if (foundGame) setGameType(`${foundGame.name} OPEN`.toUpperCase());
    setLoading(false);
  }, [gameId, optionId]);

  useEffect(() => { loadData(); }, [loadData]);

  // ---------- Wallet balance ----------
  const loadBalance = useCallback(async () => {
    if (!user) { setBalance(null); return; }
    try {
      const res = await apiCall('/ledger/me');
      if (res?.success && res.balance != null) { setBalance(Number(res.balance)); return; }
    } catch { /* fallback neeche */ }
    const b = user.wallet ?? user.walletBalance ?? user.balance;
    setBalance(b != null ? Number(b) : 0);
  }, [user]);

  useEffect(() => { loadBalance(); }, [loadBalance]);

  // ---------- Aaj ki meri bets (database se) ----------
  const loadBets = useCallback(async () => {
    if (!game?._id) return;
    try {
      const res = await apiCall(
        `/games/bets/mine?gameId=${game._id}&type=${encodeURIComponent(optionId)}&today=1`
      );
      if (res?.success) setBets(res.bets || []);
    } catch (err) {
      showMsg('err', err.message || 'Bets load nahi hui');
    }
  }, [game, optionId]);

  useEffect(() => { loadBets(); }, [loadBets]);

  // ---------- Derived ----------
  const optionTitle = (rate?.label || '').toUpperCase();
  const rule = useMemo(() => getRule(rate), [rate]);

  const sessionOptions = useMemo(() => {
    if (!game) return [];
    const name = game.name.toUpperCase();
    return game.closeTime ? [`${name} OPEN`, `${name} CLOSE`] : [`${name} OPEN`];
  }, [game]);

  const totalPoints = bets.reduce((s, b) => s + Number(b.betAmount || 0), 0);

  // ---------- ADD = seedha database me save ----------
  const handleAdd = async () => {
    const err = validateDigit(digit, rule);
    if (err) return showMsg('err', err);
    const pts = Number(points);
    if (!pts || pts <= 0) return showMsg('err', 'Points daalo');
    if (balance != null && pts > balance) return showMsg('err', 'Wallet balance kam hai');

    setSaving(true);
    try {
      const res = await apiCall('/games/bets', 'POST', {
        gameId: game._id,
        session: gameType.endsWith('CLOSE') ? 'close' : 'open',
        type: optionId,
        bets: [{ digit, points: pts }],
      });
      if (res?.success === false) throw new Error(res.message);

      setDigit('');
      setPoints('');
      if (res?.balance != null) setBalance(Number(res.balance));
      else await loadBalance();
      await loadBets();
      showMsg('ok', 'Bet save ho gayi ✅');
    } catch (e) {
      showMsg('err', e.message || 'Bet save nahi hui');
    } finally {
      setSaving(false);
    }
  };

  // ============================================
  // RENDER
  // ============================================
  return (
    <div className="po-page">
      <div className="po-header">
        <button className="po-back-btn" onClick={() => navigate(-1)} aria-label="Back">
          <ChevronLeft size={28} strokeWidth={2.2} />
        </button>
        <h1 className="po-title">{loading ? 'LOADING...' : `${optionTitle || 'GAME'} BOARD`}</h1>
        <div className="po-wallet">
          <Wallet size={24} strokeWidth={2} />
          <span className="po-wallet-balance">
            {balance == null ? '--' : balance.toLocaleString('en-IN')}
          </span>
        </div>
      </div>

      {message && (
        <div
          role="status"
          style={{
            margin: '10px 16px',
            padding: '10px 14px',
            borderRadius: 8,
            fontSize: 14,
            background: message.type === 'ok' ? '#dcfce7' : '#fee2e2',
            color: message.type === 'ok' ? '#166534' : '#991b1b',
          }}
        >
          {message.text}
        </div>
      )}

      {loading && (
        <div style={{ textAlign: 'center', padding: '40px 0' }}><p>Loading...</p></div>
      )}

      {!loading && error && (
        <div style={{ textAlign: 'center', padding: '40px 0', color: '#c00' }}>
          <p>⚠ {error}</p>
          <button onClick={loadData} style={{ marginTop: 10, padding: '8px 16px', cursor: 'pointer' }}>
            ↺ Retry
          </button>
        </div>
      )}

      {!loading && !error && game && rate && (
        <>
          <div className="po-form">
            {/* Game Type */}
            <div className="po-row">
              <label className="po-label">Select Game Type :</label>
              <div className="po-input-wrap po-select-wrap">
                <select
                  className="po-select"
                  value={gameType}
                  onChange={(e) => setGameType(e.target.value)}
                >
                  {sessionOptions.map((o) => (
                    <option key={o} value={o}>{o}</option>
                  ))}
                </select>
                <ChevronDown size={18} className="po-select-icon" />
              </div>
            </div>

            {/* Enter Digit */}
            <div className="po-row">
              <label className="po-label">Enter {optionTitle.replace(' BULK', '')} :</label>
              <div className="po-input-wrap">
                <input
                  type="text"
                  className="po-input"
                  value={digit}
                  maxLength={rule.len}
                  onChange={(e) => setDigit(e.target.value.replace(/\D/g, ''))}
                  inputMode="numeric"
                />
                <button className="po-arrow-btn" type="button" aria-label="Next">
                  <ArrowRight size={18} />
                </button>
              </div>
            </div>

            {/* Enter Points */}
            <div className="po-row">
              <label className="po-label">Enter Points :</label>
              <div className="po-input-wrap">
                <input
                  type="text"
                  className="po-input"
                  value={points}
                  onChange={(e) => setPoints(e.target.value.replace(/\D/g, ''))}
                  inputMode="numeric"
                />
                <button className="po-arrow-btn" type="button" aria-label="Next">
                  <ArrowRight size={18} />
                </button>
              </div>
            </div>

            <p style={{ fontSize: 12, opacity: 0.75, margin: '4px 0 0' }}>
              Rate: {Number(rate.value1 || 1)} KA {Number(rate.value2 || 0)}
            </p>

            <button className="po-add-btn" onClick={handleAdd} disabled={saving} type="button">
              {saving ? 'SAVING...' : 'ADD'}
            </button>
          </div>

          {/* Table — database se */}
          <div className="po-table-header">
            <span className="po-th">Digit</span>
            <span className="po-th">Points</span>
            <span className="po-th">Type</span>
          </div>

          <div className="po-table-body">
            {bets.length === 0 ? (
              <div className="po-empty" />
            ) : (
              bets.map((b) => (
                <div key={b._id} className="po-table-row">
                  <span className="po-td">{b.betNumber}</span>
                  <span className="po-td">{b.betAmount}</span>
                  <span className="po-td po-td-type">
                    {(b.typeLabel || optionTitle)} {b.session ? `(${b.session.toUpperCase()})` : ''}
                  </span>
                </div>
              ))
            )}
          </div>

          {bets.length > 0 && (
            <p style={{ padding: '12px 16px', margin: 0, fontWeight: 600 }}>
              Aaj ki bets: {bets.length} • {totalPoints.toLocaleString('en-IN')} points
            </p>
          )}
        </>
      )}
    </div>
  );
};

export default PlayOptionPage;