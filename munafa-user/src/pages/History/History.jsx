import React, { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { 
  Calendar, Trophy, Clock, ChevronRight, 
  RefreshCw, Filter, X, Search, TrendingUp,
  Award, Zap, Flame, Star, Crown, Target,
  Dice1, Dice2, Dice3, Dice4, Dice5, Dice6,
  Sparkles, CircleDot, Gem
} from 'lucide-react'
import { resultsAPI, gamesAPI } from '../../services/api'
import './History.css'

export default function History() {
  const navigate = useNavigate()
  const [results, setResults] = useState([])
  const [games, setGames] = useState([])
  const [filteredResults, setFilteredResults] = useState([])
  const [selectedGame, setSelectedGame] = useState('all')
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [visibleCount, setVisibleCount] = useState(20)
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [showDatePicker, setShowDatePicker] = useState(false)
  const resultsEndRef = useRef(null)

  const today = new Date().toDateString()

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true)
    else setLoading(true)
    
    try {
      const [rRes, gRes] = await Promise.all([
        resultsAPI.getAll({ limit: 100 }),
        gamesAPI.getAll()
      ])

      if (rRes.success && rRes.results) {
        setResults(rRes.results)
        setFilteredResults(rRes.results)
      }
      if (gRes.success && gRes.games) {
        setGames(gRes.games)
      }
    } catch (error) {
      console.error('Error fetching history:', error)
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  // Filter results
  useEffect(() => {
    let filtered = [...results]

    if (selectedGame !== 'all') {
      filtered = filtered.filter(r => r.gameName === selectedGame)
    }

    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase().trim()
      filtered = filtered.filter(r => 
        r.gameName?.toLowerCase().includes(term) ||
        r.result?.toLowerCase().includes(term)
      )
    }

    filtered = filtered.filter(r => {
      const date = new Date(r.date || r.createdAt).toDateString()
      return date === today
    })

    filtered.sort((a, b) => 
      new Date(b.date || b.createdAt) - new Date(a.date || a.createdAt)
    )

    setFilteredResults(filtered)
    setVisibleCount(20)
  }, [results, selectedGame, searchTerm])

  // ✅ SVG Icons for Games
  const getGameIcon = (gameName) => {
    const icons = {
      'Single': <Target size={16} className="game-icon-single" />,
      'Jodi': <Dice1 size={16} className="game-icon-jodi" />,
      'Panna': <Dice2 size={16} className="game-icon-panna" />,
      'Half Sangam': <CircleDot size={16} className="game-icon-half" />,
      'Full Sangam': <Gem size={16} className="game-icon-full" />,
    }
    return icons[gameName] || <Sparkles size={16} className="game-icon-default" />
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

  const getStatusBadge = (result) => {
    if (result.isPublished) {
      return <span className="history-status-published"><Award size={12} /> Published</span>
    }
    return <span className="history-status-pending"><Clock size={12} /> Pending</span>
  }

  const getGameStats = (gameName) => {
    const gameResults = results.filter(r => 
      r.gameName === gameName && 
      new Date(r.date || r.createdAt).toDateString() === today
    )
    return {
      total: gameResults.length,
      published: gameResults.filter(r => r.isPublished).length,
      latest: gameResults[0]?.result || '--'
    }
  }

  const formatDate = (date) => {
    const d = new Date(date)
    return d.toLocaleString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const loadMore = () => {
    setVisibleCount(prev => prev + 20)
    setTimeout(() => {
      resultsEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }, 100)
  }

  if (loading) {
    return (
      <div className="history-page">
        <div className="history-loading">
          <div className="spinner"></div>
          <p>Loading history...</p>
        </div>
      </div>
    )
  }

  const visibleResults = filteredResults.slice(0, visibleCount)

  return (
    <div className="history-page">
      {/* Header */}
      <div className="history-header">
        <div className="history-header-icon">
          <Trophy size={22} />
        </div>
        <div>
          <h1 className="history-title">Results History</h1>
          <p className="history-subtitle">
            {new Date().toLocaleDateString('en-IN', { 
              weekday: 'long', 
              day: 'numeric', 
              month: 'long', 
              year: 'numeric' 
            })}
          </p>
        </div>
        <button 
          className={`history-refresh ${refreshing ? 'spinning' : ''}`}
          onClick={() => fetchData(true)}
        >
          <RefreshCw size={18} />
        </button>
      </div>

      {/* Stats Cards */}
      <div className="history-stats-grid">
        <div className="history-stat-card">
          <div className="history-stat-icon"><Trophy size={18} /></div>
          <div className="history-stat-info">
            <span className="history-stat-label">Total Results</span>
            <span className="history-stat-value">{filteredResults.length}</span>
          </div>
        </div>
        <div className="history-stat-card">
          <div className="history-stat-icon"><Award size={18} /></div>
          <div className="history-stat-info">
            <span className="history-stat-label">Published</span>
            <span className="history-stat-value">
              {filteredResults.filter(r => r.isPublished).length}
            </span>
          </div>
        </div>
        <div className="history-stat-card">
          <div className="history-stat-icon"><Clock size={18} /></div>
          <div className="history-stat-info">
            <span className="history-stat-label">Pending</span>
            <span className="history-stat-value">
              {filteredResults.filter(r => !r.isPublished).length}
            </span>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="history-filters">
        <div className="history-search">
          <Search size={16} />
          <input
            type="text"
            placeholder="Search game or result..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {searchTerm && (
            <button onClick={() => setSearchTerm('')}>
              <X size={14} />
            </button>
          )}
        </div>

        <div className="history-game-filter">
          <button
            className={`filter-chip ${selectedGame === 'all' ? 'active' : ''}`}
            onClick={() => setSelectedGame('all')}
          >
            <Star size={14} /> All
          </button>
          {games.map(game => (
            <button
              key={game._id}
              className={`filter-chip ${selectedGame === game.name ? 'active' : ''}`}
              onClick={() => setSelectedGame(game.name)}
            >
              {getGameIcon(game.name)}
              {game.name}
            </button>
          ))}
        </div>
      </div>

      {/* Results List */}
      {visibleResults.length === 0 ? (
        <div className="history-empty">
          <div className="history-empty-icon">
            <Search size={48} />
          </div>
          <h3>No Results Found</h3>
          <p>No results available for today. Check back later!</p>
        </div>
      ) : (
        <>
          <div className="history-count">
            Showing {visibleResults.length} of {filteredResults.length} results
          </div>

          <div className="history-list">
            {visibleResults.map((result, index) => (
              <div 
                className="history-item" 
                key={result._id || index}
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                <div className="history-item-left">
                  <div 
                    className="history-item-icon"
                    style={{ background: getGameColor(result.gameName) + '20' }}
                  >
                    {getGameIcon(result.gameName)}
                  </div>
                  <div className="history-item-info">
                    <div className="history-item-name">
                      {result.gameName || 'Unknown Game'}
                      <span className="history-item-time">
                        <Clock size={12} />
                        {formatDate(result.date || result.createdAt)}
                      </span>
                    </div>
                    <div className="history-item-meta">
                      {getStatusBadge(result)}
                      <span className="history-item-number">
                        #{result.number || index + 1}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="history-item-right">
                  <div className="history-item-result">
                    <span className="history-item-result-label">Result</span>
                    <span className="history-item-result-value">
                      {result.result || '--'}
                    </span>
                  </div>
                  <ChevronRight size={16} className="history-item-arrow" />
                </div>
              </div>
            ))}
          </div>

          {visibleCount < filteredResults.length && (
            <button className="history-load-more" onClick={loadMore}>
              Load More Results ({filteredResults.length - visibleCount} left)
            </button>
          )}
          <div ref={resultsEndRef} />
        </>
      )}
    </div>
  )
}