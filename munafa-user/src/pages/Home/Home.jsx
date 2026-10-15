import React, { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Trophy, Clock, ChevronRight, RefreshCw,
  Target, Dice1, Dice2, CircleDot, Gem, Sparkles,
  Sun, Cloud, Moon, Play, Info
} from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { resultsAPI, gamesAPI } from '../../services/api'
import BannerSlider from '../../components/BannerSlider/BannerSlider'
import HomeActions from '../../components/HomeActions/HomeActions'
import { getBettingState, formatTime } from '../../utils/gameTime' // ✅ naya
import './Home.css'

// ✅ Splash sirf ek baar dikhane ke liye
// sessionStorage  -> tab/browser band karne par dobara dikhega, refresh par nahi
// localStorage    -> sirf user ki bilkul pehli visit par dikhega
// Agar sirf pehli visit chahiye to niche 3 jagah sessionStorage ko localStorage kar do
const SPLASH_KEY = 'munafa_splash_seen'

const hasSeenSplash = () => {
  try {
    return sessionStorage.getItem(SPLASH_KEY) === '1'
  } catch {
    return false
  }
}

const markSplashSeen = () => {
  try {
    sessionStorage.setItem(SPLASH_KEY, '1')
  } catch {
    /* storage blocked — ignore */
  }
}

// ✅ Splash
function HomeSplash() {
  return (
    <div className="home-splash">
      <div className="home-splash-glow" />
      <div className="home-splash-particles">
        {[...Array(10)].map((_, i) => <div key={i} className="home-splash-particle" />)}
      </div>
      <div className="home-splash-content">
        <div className="home-splash-ring">
          <div className="home-splash-ring-inner">
            <img src="/munafalogo.png" alt="Munafa" style={{ width: '70px', height: '70px', borderRadius: '50%', objectFit: 'cover' }} />
          </div>
        </div>
        <h1 className="home-splash-title">
          <span>Munafa</span><span>Market</span>
        </h1>
        <p className="home-splash-sub">Loading today's games...</p>
        <div className="home-splash-progress-wrap">
          <div className="home-splash-progress-bar" />
        </div>
        <div className="home-splash-dots">
          <div className="home-splash-dot" />
          <div className="home-splash-dot" />
          <div className="home-splash-dot" />
        </div>
      </div>
      <p className="home-splash-footer">Munafa Market v2.0</p>
    </div>
  )
}

// ✅ Game Icons & Colors
const getGameIcon = (gameName) => {
  const icons = {
    'Single': <Target size={20} className="game-icon-single" />,
    'Jodi': <Dice1 size={20} className="game-icon-jodi" />,
    'Panna': <Dice2 size={20} className="game-icon-panna" />,
    'Half Sangam': <CircleDot size={20} className="game-icon-half" />,
    'Full Sangam': <Gem size={20} className="game-icon-full" />,
  }
  return icons[gameName] || <Sparkles size={20} className="game-icon-default" />
}

const getGameColor = (gameName) => {
  const colors = {
    'Single': '#ff6b00',
    'Jodi': '#00b894',
    'Panna': '#0984e3',
    'Half Sangam': '#6c5ce7',
    'Full Sangam': '#fdcb6e',
  }
  return colors[gameName] || '#636e72'
}

// ✅ Greeting
const getGreetingIcon = (hour) => {
  if (hour < 12) return <Sun size={20} className="greeting-icon morning" />
  if (hour < 17) return <Cloud size={20} className="greeting-icon afternoon" />
  return <Moon size={20} className="greeting-icon evening" />
}
const getGreetingText = (hour) => {
  if (hour < 12) return 'Good Morning'
  if (hour < 17) return 'Good Afternoon'
  return 'Good Evening'
}

// ============================================
// ✅ Live Result Card (Pana/Jodi buttons WORKING)
// ============================================
function LiveResultCard({
  games,
  getGameResult,
  todayResults,
  onRefresh,
  refreshing,
  onPanaChart,
  onJodiChart,
}) {
  const gamesWithResult = games.filter(g => getGameResult(g.name) !== null)
  const displayGame = gamesWithResult.length > 0
    ? [...gamesWithResult].sort((a, b) => {
        const rA = todayResults.find(r => r.gameName === a.name && r.isPublished)
        const rB = todayResults.find(r => r.gameName === b.name && r.isPublished)
        return new Date(rB?.updatedAt || rB?.createdAt || 0) - new Date(rA?.updatedAt || rA?.createdAt || 0)
      })[0]
    : null
  const result = displayGame ? getGameResult(displayGame.name) : null

  if (!displayGame) return null

  return (
    <div className="lr-wrapper">
      <div className="lr-top">
        <h2 className="lr-heading">Live Result</h2>
        <p className="lr-sub">Sabse Tezz Live Result Yahi Milega</p>
      </div>

      <div className="lr-card">
        <div className="lr-card-header">
          <span className="lr-game-name">{displayGame.name.toUpperCase()}</span>
        </div>

        <div className={`lr-result-bar ${!result ? 'loading' : ''}`}>
          {!result ? (
            <div className="lr-loading-row">
              <span className="lr-loading-text">Loading...</span>
              <span className="lr-dot" />
              <span className="lr-dot" />
              <span className="lr-dot" />
            </div>
          ) : (
            <span className="lr-result-number">{result}</span>
          )}
        </div>

        <div className="lr-card-body">
          <div className="lr-times">
            <span className="lr-time-item">
              <Clock size={13} /> {formatTime(displayGame.openTime)}
            </span>
            {displayGame.closeTime && (
              <span className="lr-time-item">
                <Clock size={13} /> {formatTime(displayGame.closeTime)}
              </span>
            )}
          </div>
          <p className="lr-tagline">सबसे तेज सबसे सही</p>
        </div>

        <div className="lr-chart-row">
          <button
            className="lr-chart-btn jodi"
            onClick={() => onJodiChart?.(displayGame)}
          >
            Jodi Chart
          </button>
          <button
            className="lr-chart-btn panel"
            onClick={() => onPanaChart?.(displayGame)}
          >
            Pana Chart
          </button>
        </div>
      </div>
    </div>
  )
}

// ✅ Gali Result Card (time ke hisaab se Open / Upcoming / Closed)
function GaliResultCard({ game, result, onPlay, onPanaChart, onJodiChart }) {
  const state = getBettingState(game) // open | upcoming | closed | unknown
  const canPlay = state === 'open' || state === 'unknown'

  const TAGS = {
    open: { text: 'Open Today', cls: 'open' },
    unknown: { text: 'Open Today', cls: 'open' },
    upcoming: { text: `Opens ${formatTime(game.openTime)}`, cls: 'closed' },
    closed: { text: 'Closed for Today', cls: 'closed' },
  }
  const tag = TAGS[state]

  return (
    <div className="gali-card">
      <div className="gali-card-top">
        <div className="gali-title-row">
          <h3 className="gali-card-heading">
            {game.name.toUpperCase()} {formatTime(game.openTime)}
            <span className="gali-info-icon"><Info size={13} /></span>
          </h3>
          <span className={`gali-status-tag ${tag.cls}`}>{tag.text}</span>
        </div>
      </div>

      <div className="gali-card-middle">
        <span className="gali-value">{result || '-'}</span>
        <button
          className="gali-play-btn"
          aria-label="Play"
          disabled={!canPlay}
          style={!canPlay ? { opacity: 0.4, cursor: 'not-allowed' } : undefined}
          onClick={() => canPlay && onPlay?.(game)}
        >
          <svg viewBox="0 0 24 24" width="22" height="22" fill="#fff">
            <path d="M8 5v14l11-7z" />
          </svg>
        </button>
      </div>

      <div className="gali-card-bottom">
        <button className="gali-chart-btn" onClick={() => onPanaChart?.(game)}>
          Pana Chart
        </button>
        <button className="gali-chart-btn" onClick={() => onJodiChart?.(game)}>
          Jodi Chart
        </button>
      </div>
    </div>
  )
}

// ✅ Gali Result Section
function GaliResultSection({ games, getGameResult, onPlay, onPanaChart, onJodiChart, navigate }) {
  if (!games || games.length === 0) return null

  const sortedGames = [
    ...games.filter(g => getGameResult(g.name) !== null),
    ...games.filter(g => getGameResult(g.name) === null)
  ].slice(0, 9)

  return (
    <div className="gali-section">
      <BannerSlider />
      <button className="home-view-all" onClick={() => navigate('#')}>
        <Trophy size={16} /> download <ChevronRight size={16} />
      </button>
      <div className="gali-header">
        <h3 className="gali-title">Available Games</h3>
      </div>

      <div className="gali-grid">
        {sortedGames.map((game) => (
          <GaliResultCard
            key={game._id || game.name}
            game={game}
            result={getGameResult(game.name)}
            onPlay={onPlay}
            onPanaChart={onPanaChart}
            onJodiChart={onJodiChart}
          />
        ))}
      </div>
    </div>
  )
}

// ✅ ₹500 Notes Canvas Background
function NotesBackground() {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')

    function resize() {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resize()
    window.addEventListener('resize', resize)

    function safeRoundRect(context, x, y, w, h, r) {
      if (typeof context.roundRect === 'function') {
        context.beginPath()
        context.roundRect(x, y, w, h, r)
      } else {
        const radius = typeof r === 'number' ? r : 5
        context.beginPath()
        context.moveTo(x + radius, y)
        context.lineTo(x + w - radius, y)
        context.quadraticCurveTo(x + w, y, x + w, y + radius)
        context.lineTo(x + w, y + h - radius)
        context.quadraticCurveTo(x + w, y + h, x + w - radius, y + h)
        context.lineTo(x + radius, y + h)
        context.quadraticCurveTo(x, y + h, x, y + h - radius)
        context.lineTo(x, y + radius)
        context.quadraticCurveTo(x, y, x + radius, y)
        context.closePath()
      }
    }

    function drawNote(x, y, w, h, angle, alpha) {
      ctx.save()
      ctx.translate(x, y)
      ctx.rotate(angle)
      ctx.globalAlpha = alpha

      const g = ctx.createLinearGradient(-w / 2, -h / 2, w / 2, h / 2)
      g.addColorStop(0, '#2d7a3a')
      g.addColorStop(0.5, '#3a9e4a')
      g.addColorStop(1, '#1f5c2a')
      ctx.fillStyle = g
      safeRoundRect(ctx, -w / 2, -h / 2, w, h, 5)
      ctx.fill()

      ctx.strokeStyle = 'rgba(255,255,255,0.2)'
      ctx.lineWidth = 0.8
      ctx.stroke()

      ctx.strokeStyle = 'rgba(255,255,255,0.1)'
      ctx.lineWidth = 0.5
      safeRoundRect(ctx, -w / 2 + 4, -h / 2 + 3, w - 8, h - 6, 3)
      ctx.stroke()

      ctx.fillStyle = 'rgba(0,0,0,0.28)'
      safeRoundRect(ctx, -w / 2, -h / 2, w * 0.22, h, 5)
      ctx.fill()

      ctx.fillStyle = 'rgba(255,255,255,0.88)'
      ctx.font = `bold ${h * 0.5}px serif`
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      ctx.fillText('₹', -w * 0.27, 0)

      ctx.fillStyle = 'rgba(255,255,255,0.92)'
      ctx.font = `bold ${h * 0.38}px sans-serif`
      ctx.textAlign = 'left'
      ctx.fillText('500', -w * 0.1, -h * 0.18)

      ctx.fillStyle = 'rgba(255,255,255,0.45)'
      ctx.font = `${h * 0.18}px sans-serif`
      ctx.fillText('INDIA', -w * 0.1, h * 0.12)

      ctx.strokeStyle = 'rgba(255,255,255,0.18)'
      ctx.lineWidth = 0.6
      for (let i = 0; i < 4; i++) {
        const ly = -h * 0.25 + i * h * 0.16
        ctx.beginPath()
        ctx.moveTo(w * 0.18, ly)
        ctx.lineTo(w * 0.44, ly)
        ctx.stroke()
      }

      ctx.strokeStyle = 'rgba(255,255,255,0.12)'
      ctx.lineWidth = 1
      ctx.beginPath()
      ctx.arc(w * 0.33, 0, h * 0.28, 0, Math.PI * 2)
      ctx.stroke()

      ctx.restore()
    }

    const notes = Array.from({ length: 22 }, () => {
      const w = 130 + Math.random() * 50
      return {
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height - canvas.height,
        w,
        h: w * 0.44,
        speed: 0.7 + Math.random() * 1.0,
        angle: (Math.random() - 0.5) * 0.6,
        rotSpeed: (Math.random() - 0.5) * 0.008,
        drift: (Math.random() - 0.5) * 0.5,
        alpha: 0.10 + Math.random() * 0.13,
        phase: Math.random() * Math.PI * 2,
      }
    })

    let t = 0
    let rafId

    function animate() {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      t++
      for (const n of notes) {
        n.y += n.speed
        n.angle += n.rotSpeed
        n.x += n.drift + Math.sin(t * 0.012 + n.phase) * 0.35
        if (n.y > canvas.height + 120) {
          n.y = -120
          n.x = Math.random() * canvas.width
        }
        drawNote(n.x, n.y, n.w, n.h, n.angle, n.alpha)
      }
      rafId = requestAnimationFrame(animate)
    }
    animate()

    return () => {
      cancelAnimationFrame(rafId)
      window.removeEventListener('resize', resize)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        inset: 0,
        width: '100%',
        height: '100%',
        zIndex: 0,
        pointerEvents: 'none',
      }}
    />
  )
}

// ✅ Pana ke teeno ank ka sum, aakhri ank
const panaDigit = (p) =>
  p && p.length === 3 ? String([...p].reduce((s, n) => s + Number(n), 0) % 10) : null

// ✅ "123-65-456"
const formatResultValue = (openPana, closePana, hasClose = true) => {
  const oD = panaDigit(openPana) ?? '*'
  const cD = panaDigit(closePana) ?? '*'
  if (!hasClose) return `${openPana || '***'}-${oD}`
  return `${openPana || '***'}-${oD}${cD}-${closePana || '***'}`
}

// ============================================
// ✅ Main Home
// ============================================
export default function Home() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [games, setGames] = useState([])
  const [todayResults, setTodayResults] = useState([])
  const [loading, setLoading] = useState(false)
  const [refreshing, setRefreshing] = useState(false)
  const [time, setTime] = useState(new Date()) // har second re-render => Open/Closed badge live rehta hai

  // ✅ Splash sirf tab dikhao jab pehle na dekha ho
  const [showSplash, setShowSplash] = useState(() => !hasSeenSplash())

  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000)
    return () => clearInterval(t)
  }, [])

  const fetchData = async (isManualRefresh = false) => {
    if (isManualRefresh) setRefreshing(true)
    else setLoading(true)
    try {
      const [gRes, rRes] = await Promise.allSettled([
        gamesAPI.getAll(),
        resultsAPI.getAll({ limit: 50 }),
      ])

      if (gRes.status === 'fulfilled' && gRes.value?.success) {
        // ✅ Admin ne jo game Hide (Inactive) kiya wo user ko na dikhe
        setGames(gRes.value.games.filter((g) => g.status !== 'Inactive'))
      } else if (gRes.status === 'rejected') {
        console.error('Games load fail:', gRes.reason?.message)
      }

      if (rRes.status === 'fulfilled' && rRes.value?.success) {
        const today = new Date().toDateString()
        setTodayResults(
          rRes.value.results.filter(
            (r) => new Date(r.date || r.createdAt).toDateString() === today
          )
        )
      } else if (rRes.status === 'rejected') {
        console.error('Results load fail:', rRes.reason?.message)
      }
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  // ✅ Pehli load: splash dekha hua hai to seedha data, warna splash -> data
  useEffect(() => {
    if (!showSplash) {
      fetchData()
      return
    }

    const timer = setTimeout(() => {
      markSplashSeen()
      setShowSplash(false)
      fetchData()
    }, 2500)

    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    const t = setInterval(() => fetchData(), 30000)
    return () => clearInterval(t)
  }, [])

  const getGameResult = (gameName) => {
    const docs = todayResults.filter(r => r.gameName === gameName && r.isPublished)
    if (docs.length === 0) return null

    const game = games.find(g => g.name === gameName)
    const open = docs.find(d => d.openPana)?.openPana
    const close = docs.find(d => d.closePana)?.closePana

    if (!open && !close) return docs[0].result || null

    return formatResultValue(open, close, !!game?.closeTime)
  }

  // ✅ Time ke hisaab se play rokna
  const handlePlay = (game) => {
    const state = getBettingState(game)
    if (state === 'upcoming') {
      alert(`Is game me bet ${formatTime(game.openTime)} ke baad lagegi`)
      return
    }
    if (state === 'closed') {
      alert('Is game ka time khatam ho gaya hai')
      return
    }
    const slug = (game.name || 'game').toLowerCase().replace(/\s+/g, '-')
    navigate(`/play/${game._id || slug}`)
  }

  const handlePanaChart = (game) => {
    const slug = (game.name || '').toLowerCase().replace(/\s+/g, '-')
    navigate(`/pana-chart/${game._id || slug}`)
  }

  const handleJodiChart = (game) => {
    const slug = (game.name || '').toLowerCase().replace(/\s+/g, '-')
    navigate(`/jodi-chart/${game._id || slug}`)
  }

  if (showSplash) return <HomeSplash />

  return (
    <div className="home-page">
      <NotesBackground />

      <div className="home-content">
        {/* ✅ HomeActions — Wallet + Withdraw + WhatsApp + Call + Add Points */}
        <HomeActions
          balance={user?.wallet ?? user?.walletBalance ?? user?.balance ?? 0}
        />

        {!loading && games.length > 0 && (
          <LiveResultCard
            games={games}
            getGameResult={getGameResult}
            todayResults={todayResults}
            onRefresh={() => fetchData(true)}
            refreshing={refreshing}
            onPanaChart={handlePanaChart}
            onJodiChart={handleJodiChart}
          />
        )}

        {loading ? (
          <div className="home-loading">
            <div className="spinner" />
            <p>Loading...</p>
          </div>
        ) : (
          <>
            <GaliResultSection
              games={games}
              getGameResult={getGameResult}
              onPlay={handlePlay}
              onPanaChart={handlePanaChart}
              onJodiChart={handleJodiChart}
              navigate={navigate}
            />
            <button className="home-view-all" onClick={() => navigate('/results')}>
              <Trophy size={16} /> View All Results <ChevronRight size={16} />
            </button>
          </>
        )}
      </div>
    </div>
  )
}