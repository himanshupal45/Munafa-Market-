import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { resultsAPI, gamesAPI } from '../../services/api'
import './PanaChart.css'

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

export default function PanaChart() {
  const { id } = useParams()
  const [game, setGame] = useState(null)
  const [chartData, setChartData] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchChart = async () => {
      setLoading(true)
      try {
        // ✅ Game info fetch karo
        const gRes = await gamesAPI.getAll()
        let foundGame = null
        if (gRes.success) {
          foundGame = gRes.games.find(
            g =>
              String(g._id) === String(id) ||
              g.name.toLowerCase().replace(/\s+/g, '-') === id
          )
          setGame(foundGame || null)
        }

        // ✅ Results fetch karo
        const rRes = await resultsAPI.getAll({ limit: 200 })
        if (rRes.success && foundGame) {
          const filtered = rRes.results.filter(
            r => r.gameName?.toLowerCase() === foundGame.name?.toLowerCase()
          )
          setChartData(filtered)
        }
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    fetchChart()
  }, [id])

  // ✅ Group results by week (Monday to Sunday)
  const groupedByWeek = () => {
    const weeks = {}
    chartData.forEach(item => {
      const date = new Date(item.date || item.createdAt)
      // Week start (Monday)
      const day = date.getDay() // 0=Sun, 1=Mon, ... 6=Sat
      const diff = date.getDate() - day + (day === 0 ? -6 : 1)
      const weekStart = new Date(date)
      weekStart.setDate(diff)
      weekStart.setHours(0, 0, 0, 0)

      const weekEnd = new Date(weekStart)
      weekEnd.setDate(weekStart.getDate() + 6)

      const weekKey = weekStart.toISOString().split('T')[0]

      if (!weeks[weekKey]) {
        weeks[weekKey] = {
          weekStart,
          weekEnd,
          days: {},
        }
      }

      // Day index (Mon=1, Tue=2, ... Sun=0)
      weeks[weekKey].days[day] = {
        pana: item.pana || item.result || '-',
        digit: item.digit || item.single || '',
      }
    })
    return Object.values(weeks).sort((a, b) => b.weekStart - a.weekStart)
  }

  const weeks = groupedByWeek()

  const formatDate = (d) => {
    const date = new Date(d)
    const y = date.getFullYear()
    const m = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    return `${y}-${m}-${day}`
  }

  return (
    <div className="pana-chart-page">
      <div className="pana-chart-container">
        {/* ✅ Title */}
        <h1 className="pana-chart-title">
          {game?.name || 'Pana Chart'}
        </h1>

        {/* ✅ Table */}
        {loading ? (
          <div className="pana-chart-loading">
            <div className="spinner" />
            <p>Loading chart...</p>
          </div>
        ) : (
          <div className="pana-chart-table-wrap">
            <table className="pana-chart-table">
              <thead>
                <tr>
                  <th className="col-date">Date</th>
                  {DAYS.map(d => <th key={d}>{d}</th>)}
                </tr>
              </thead>
              <tbody>
                {weeks.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="no-data">
                      No chart data available
                    </td>
                  </tr>
                ) : (
                  weeks.map((week, idx) => (
                    <tr key={idx}>
                      <td className="col-date">
                        <div className="date-range">
                          <span>{formatDate(week.weekStart)}</span>
                          <span className="date-to">to</span>
                          <span>{formatDate(week.weekEnd)}</span>
                        </div>
                      </td>
                      {[1, 2, 3, 4, 5, 6, 0].map(dayNum => {
                        const cell = week.days[dayNum]
                        return (
                          <td key={dayNum} className="chart-cell">
                            {cell ? (
                              <>
                                <div className="cell-pana">{cell.pana || '-'}</div>
                                {cell.digit && (
                                  <div className="cell-digit">{cell.digit}</div>
                                )}
                              </>
                            ) : (
                              ''
                            )}
                          </td>
                        )
                      })}
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}