import React, { useState, useEffect } from 'react'
import { Home as HomeIcon, ArrowUpRight, Loader, RefreshCw } from 'lucide-react'
import { apiCall } from '../../../context/AuthContext'
import './WalletPoints.css'

export default function AddPoints() {
  const [users, setUsers] = useState([])
  const [selectedUser, setSelectedUser] = useState('')
  const [points, setPoints] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  // ✅ Fetch users from API
  const fetchUsers = async () => {
    setLoading(true)
    setError('')
    try {
      const res = await apiCall('/users?limit=1000')
      if (res?.success) {
        setUsers(res.users || [])
      } else {
        setError(res?.message || 'Users load nahi ho sake')
      }
    } catch (err) {
      console.error('Fetch users error:', err)
      setError(err.message || 'Network error')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchUsers()
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!selectedUser) {
      alert('Please select a user / कृपया उपयोगकर्ता चुनें')
      return
    }
    if (!points || Number(points) <= 0) {
      alert('Please enter a valid points value / कृपया वैध पॉइंट्स दर्ज करें')
      return
    }

    const user = users.find((u) => u._id === selectedUser)
    if (!user) {
      alert('User not found')
      return
    }

    setSubmitting(true)
    try {
      const res = await apiCall('/wallet/add-points', 'POST', {
        userId: selectedUser,
        points: Number(points),
      })

      if (res?.success) {
        alert(`✅ ${points} points added to ${user.name || 'user'} successfully!`)
        // Reset form
        setSelectedUser('')
        setPoints('')
      } else {
        alert(res?.message || 'Failed to add points')
      }
    } catch (err) {
      alert(err.message || 'Server error')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="ap-page">
      {/* Breadcrumb */}
      <div className="ap-breadcrumb">
        <HomeIcon size={14} />
        <span>Home</span>
        <span className="ap-breadcrumb-sep">/</span>
        <span>Add Points (User Wallet)</span>
      </div>

      {/* Page Title */}
      <div className="ap-page-title-wrapper">
        <ArrowUpRight size={26} className="ap-page-title-icon" />
        <h1 className="ap-page-title">Add Points (User Wallet)</h1>
        <button
          className="ap-refresh-btn"
          onClick={fetchUsers}
          type="button"
          disabled={loading}
        >
          <RefreshCw size={14} /> Refresh
        </button>
      </div>

      {/* Main Card */}
      <div className="ap-card">
        {loading ? (
          <div className="ap-state-box">
            <Loader size={22} className="ap-spin" />
            <span>Users load ho rahe hain...</span>
          </div>
        ) : error ? (
          <div className="ap-state-box ap-state-error">
            <span>⚠️ {error}</span>
            <button className="ap-retry-btn" onClick={fetchUsers} type="button">
              <RefreshCw size={14} /> Retry
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="ap-form">
            {/* Users Select */}
            <div className="ap-form-group">
              <label className="ap-label">Users</label>
              <select
                className="ap-select"
                value={selectedUser}
                onChange={(e) => setSelectedUser(e.target.value)}
                disabled={submitting}
              >
                <option value="">Select User</option>
                {users.map((user) => (
                  <option key={user._id} value={user._id}>
                    {user.name || 'N/A'} ({user.mobile || 'N/A'})
                  </option>
                ))}
              </select>
            </div>

            {/* Points Input */}
            <div className="ap-form-group">
              <label className="ap-label">Points</label>
              <input
                type="number"
                className="ap-input"
                placeholder="Enter Points"
                value={points}
                onChange={(e) => setPoints(e.target.value)}
                disabled={submitting}
              />
            </div>

            {/* Submit */}
            <div className="ap-actions">
              <button
                type="submit"
                className="ap-submit-btn"
                disabled={submitting}
              >
                {submitting ? 'Submitting...' : 'Submit'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}