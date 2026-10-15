import React, { useState, useEffect } from 'react'
import { bannersAPI } from '../../services/api'
import './BannerSlider.css'

export default function BannerSlider() {
  const [banners, setBanners] = useState([])
  const [current, setCurrent] = useState(0)
  const API_BASE = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5000'

  useEffect(() => {
    bannersAPI.getAll().then(res => {
      if (res.success) setBanners(res.banners.filter(b => b.status === 'Active'))
    }).catch(() => {})
  }, [])

  useEffect(() => {
    if (banners.length <= 1) return
    const t = setInterval(() => setCurrent(p => (p + 1) % banners.length), 4000)
    return () => clearInterval(t)
  }, [banners.length])

  if (!banners.length) return null

  return (
    <div className="banner-slider">
      {banners.map((b, i) => (
        <div 
          key={b._id} 
          className={`banner-slide ${i === current ? 'active' : ''}`}
        >
          

          {/* Right Side - Content (50%) */}
          <div className="banner-content">
            <div className="banner-content-inner">
              {b.tag && <span className="banner-tag">{b.tag}</span>}
              {b.subtitle && <p className="banner-subtitle">{b.subtitle}</p>}
              {b.title && <h2 className="banner-title">{b.title}</h2>}
              {b.description && <p className="banner-description">{b.description}</p>}
              {b.ctaText && (
                <button className="banner-cta">
                  {b.ctaText} →
                </button>
              )}
            </div>
          </div>
          {/* Left Side - Image (50%) */}
          <div className="banner-image-wrapper">
            <img
              src={`${API_BASE}${b.image}`}
              alt={b.title || 'Banner'}
              className="banner-image"
              onError={e => { e.target.style.display = 'none' }}
            />
          </div>
        </div>
      ))}

      {/* Dots */}
      {banners.length > 1 && (
        <div className="banner-dots">
          {banners.map((_, i) => (
            <div
              key={i}
              className={`banner-dot ${i === current ? 'active' : ''}`}
              onClick={() => setCurrent(i)}
            />
          ))}
        </div>
      )}
    </div>
  )
}