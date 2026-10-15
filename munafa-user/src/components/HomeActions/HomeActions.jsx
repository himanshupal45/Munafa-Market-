import React from 'react'
import { useNavigate } from 'react-router-dom'
import { Phone, Plus, Minus } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import './HomeActions.css'

// ✅ Real WhatsApp Icon (SVG)
const WhatsAppIcon = ({ size = 20 }) => (
  <svg
    viewBox="0 0 32 32"
    width={size}
    height={size}
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M16.003 2.667c-7.36 0-13.336 5.973-13.336 13.333 0 2.352.613 4.65 1.777 6.673L2.667 29.333l6.827-1.787a13.28 13.28 0 006.509 1.697h.005c7.36 0 13.336-5.973 13.336-13.333S23.363 2.667 16.003 2.667zm0 24.32h-.004a11.04 11.04 0 01-5.626-1.541l-.404-.24-4.052 1.061 1.083-3.95-.263-.406a10.99 10.99 0 01-1.687-5.864c0-6.076 4.948-11.02 11.03-11.02 2.945 0 5.712 1.148 7.793 3.23a10.94 10.94 0 013.228 7.797c-.003 6.077-4.95 11.02-11.03 11.02zm6.04-8.254c-.331-.165-1.96-.967-2.263-1.078-.303-.11-.524-.165-.745.165-.221.331-.855 1.078-1.049 1.3-.193.221-.386.248-.717.083-.331-.165-1.397-.515-2.66-1.64-.983-.877-1.646-1.96-1.839-2.291-.193-.331-.02-.51.145-.674.149-.149.331-.386.496-.579.165-.193.221-.331.331-.552.11-.221.055-.413-.028-.579-.083-.165-.745-1.795-1.02-2.458-.269-.646-.542-.559-.745-.569l-.634-.011a1.22 1.22 0 00-.883.413c-.303.331-1.158 1.13-1.158 2.76 0 1.63 1.185 3.203 1.35 3.424.165.221 2.331 3.561 5.65 4.994.789.341 1.405.545 1.886.697.793.252 1.514.216 2.084.131.637-.095 1.96-.8 2.236-1.573.276-.772.276-1.434.193-1.573-.083-.138-.303-.221-.634-.386z" />
  </svg>
)

const HomeActions = () => {
  const navigate = useNavigate()
  const { user } = useAuth()

  const handleWithdraw = () => {
    navigate('/withdraw')
  }

  const handleWhatsApp = () => {
    window.open('https://wa.me/919999999999', '_blank')
  }

  const handleCall = () => {
    window.location.href = 'tel:+919999999999'
  }

  const handleAddPoints = () => {
    navigate('/add-points')
  }

  return (
    <div className="ha-wrapper">
      <div className="ha-actions">
        <button className="ha-action-btn" onClick={handleWithdraw} aria-label="Withdraw">
          <span className="ha-btn-label">Withdraw</span>
          <span className="ha-btn-icon ha-icon-red">
            <Minus size={18} strokeWidth={3} />
          </span>
        </button>

        <button
          className="ha-icon-only-btn ha-icon-whatsapp"
          onClick={handleWhatsApp}
          aria-label="WhatsApp"
        >
          <WhatsAppIcon size={22} />
        </button>

        <button
          className="ha-icon-only-btn ha-icon-call"
          onClick={handleCall}
          aria-label="Call"
        >
          <Phone size={20} strokeWidth={2.5} />
        </button>

        <button className="ha-action-btn" onClick={handleAddPoints} aria-label="Add Points">
          <span className="ha-btn-icon ha-icon-blue">
            <Plus size={18} strokeWidth={3} />
          </span>
          <span className="ha-btn-label">Add Points</span>
        </button>
      </div>
    </div>
  )
}

export default HomeActions