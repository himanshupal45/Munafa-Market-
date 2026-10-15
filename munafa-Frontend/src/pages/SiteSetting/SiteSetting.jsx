import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Home as HomeIcon, Settings, Upload } from 'lucide-react'
import './SiteSetting.css'

export default function SiteSetting({ dark }) {
  const navigate = useNavigate()

  // ============= FORM STATE =============
  const [formData, setFormData] = useState({
    signupReward: '0',
    minimumDeposit: '100',
    minimumWithdraw: '1000',
    userUpiAddress: 'Getepay.ucbqrapp693384@icici',
    userUpiReceiverName: 'Iqbal',
    paytmUpiAddress: 'Getepay.ucbqrapp693384@icici',
    paytmUpiMcc: '0000',
    phonepeUpiAddress: 'Getepay.ucbqrapp693384@icici',
    phonepeUpiMcc: '0000',
    gpayUpiAddress: 'Getepay.ucbqrapp693384@icici',
    gpayUpiMcc: '0000',
    telegramEnable: 'ON',
    telegramDetails: 'https://t.me/lol',
    whatsappSupport: 'OFF',
    whatsapp: '919794227187',
    withdrawOpenTime: '10:00',
    withdrawCloseTime: '23:00',
    autoVerify: 'ON',
    upiManualVerify: 'ON',
    whatsappInReset: 'ON',
    gpay: 'ON',
    phonepe: 'ON',
    paytm: 'ON',
    otpVerification: 'OFF',
    galiDisawar: 'OFF',
  })

  const [qrPreview, setQrPreview] = useState(
    'https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=bharatmatka'
  )
  const [qrFile, setQrFile] = useState(null)

  // ============= HANDLERS =============
  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleQRUpload = (e) => {
    const file = e.target.files[0]
    if (file) {
      setQrFile(file)
      const reader = new FileReader()
      reader.onloadend = () => setQrPreview(reader.result)
      reader.readAsDataURL(file)
    }
  }

  const handleDeleteQR = () => {
    if (window.confirm('Delete this QR code?')) {
      setQrFile(null)
      setQrPreview(null)
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    alert('✅ Site Settings saved successfully!')
  }

  return (
    <div className={`ss-page ${dark ? 'dark' : 'light'}`}>
      {/* ============ BREADCRUMB ============ */}
      <div className="ss-breadcrumb">
        <HomeIcon size={14} />
        <span>Home</span>
        <span className="ss-breadcrumb-sep">/</span>
        <span>Site Settings</span>
      </div>

      {/* ============ PAGE TITLE ============ */}
      <div className="ss-page-title-wrapper">
        <Settings size={26} className="ss-page-title-icon" />
        <h1 className="ss-page-title">Site Settings</h1>
      </div>

      {/* ============ FORM ============ */}
      <form onSubmit={handleSubmit} className="ss-form">

        {/* ===== Section: Add Value's Limit ===== */}
        <div className="ss-section">
          <div className="ss-section-header">
            <h3 className="ss-section-title">Add Value's Limit</h3>
          </div>

          <div className="ss-section-body ss-grid-3">
            <div className="ss-form-group">
              <label className="ss-label">Signup Reward</label>
              <input
                type="number"
                name="signupReward"
                value={formData.signupReward}
                onChange={handleChange}
                className="ss-input"
              />
            </div>

            <div className="ss-form-group">
              <label className="ss-label">Minimum Deposit</label>
              <input
                type="number"
                name="minimumDeposit"
                value={formData.minimumDeposit}
                onChange={handleChange}
                className="ss-input"
              />
            </div>

            <div className="ss-form-group">
              <label className="ss-label">Minimum Withdraw</label>
              <input
                type="number"
                name="minimumWithdraw"
                value={formData.minimumWithdraw}
                onChange={handleChange}
                className="ss-input"
              />
            </div>

            <div className="ss-form-group">
              <label className="ss-label">User UPI Address</label>
              <input
                type="text"
                name="userUpiAddress"
                value={formData.userUpiAddress}
                onChange={handleChange}
                className="ss-input"
              />
            </div>

            <div className="ss-form-group">
              <label className="ss-label">User UPI Receiver Name</label>
              <input
                type="text"
                name="userUpiReceiverName"
                value={formData.userUpiReceiverName}
                onChange={handleChange}
                className="ss-input"
              />
            </div>

            <div className="ss-form-group">
              <label className="ss-label">Paytm UPI Address</label>
              <input
                type="text"
                name="paytmUpiAddress"
                value={formData.paytmUpiAddress}
                onChange={handleChange}
                className="ss-input"
              />
            </div>

            <div className="ss-form-group">
              <label className="ss-label">Paytm UPI MCC</label>
              <input
                type="text"
                name="paytmUpiMcc"
                value={formData.paytmUpiMcc}
                onChange={handleChange}
                className="ss-input"
              />
            </div>

            <div className="ss-form-group">
              <label className="ss-label">PhonePe UPI Address</label>
              <input
                type="text"
                name="phonepeUpiAddress"
                value={formData.phonepeUpiAddress}
                onChange={handleChange}
                className="ss-input"
              />
            </div>

            <div className="ss-form-group">
              <label className="ss-label">PhonePe UPI MCC</label>
              <input
                type="text"
                name="phonepeUpiMcc"
                value={formData.phonepeUpiMcc}
                onChange={handleChange}
                className="ss-input"
              />
            </div>

            <div className="ss-form-group">
              <label className="ss-label">GPAY UPI Address</label>
              <input
                type="text"
                name="gpayUpiAddress"
                value={formData.gpayUpiAddress}
                onChange={handleChange}
                className="ss-input"
              />
            </div>

            <div className="ss-form-group">
              <label className="ss-label">GPAY UPI MCC</label>
              <input
                type="text"
                name="gpayUpiMcc"
                value={formData.gpayUpiMcc}
                onChange={handleChange}
                className="ss-input"
              />
            </div>

            <div className="ss-form-group">
              <label className="ss-label">telegram Enable/Disable</label>
              <input
                type="text"
                name="telegramEnable"
                value={formData.telegramEnable}
                onChange={handleChange}
                className="ss-input"
              />
            </div>

            <div className="ss-form-group">
              <label className="ss-label">Telegram details</label>
              <input
                type="text"
                name="telegramDetails"
                value={formData.telegramDetails}
                onChange={handleChange}
                className="ss-input"
              />
            </div>

            <div className="ss-form-group">
              <label className="ss-label">Whatsapp Support</label>
              <input
                type="text"
                name="whatsappSupport"
                value={formData.whatsappSupport}
                onChange={handleChange}
                className="ss-input"
              />
            </div>

            <div className="ss-form-group">
              <label className="ss-label">Whatsapp</label>
              <input
                type="text"
                name="whatsapp"
                value={formData.whatsapp}
                onChange={handleChange}
                className="ss-input"
              />
            </div>

            <div className="ss-form-group">
              <label className="ss-label">Withdraw Open Time</label>
              <input
                type="time"
                name="withdrawOpenTime"
                value={formData.withdrawOpenTime}
                onChange={handleChange}
                className="ss-input ss-input-time"
              />
            </div>

            <div className="ss-form-group">
              <label className="ss-label">Withdraw Close Time</label>
              <input
                type="time"
                name="withdrawCloseTime"
                value={formData.withdrawCloseTime}
                onChange={handleChange}
                className="ss-input ss-input-time"
              />
            </div>

            <div className="ss-form-group">
              <label className="ss-label">Auto verify</label>
              <input
                type="text"
                name="autoVerify"
                value={formData.autoVerify}
                onChange={handleChange}
                className="ss-input"
              />
            </div>

            <div className="ss-form-group">
              <label className="ss-label">UPI Manual verify</label>
              <input
                type="text"
                name="upiManualVerify"
                value={formData.upiManualVerify}
                onChange={handleChange}
                className="ss-input"
              />
            </div>

            <div className="ss-form-group">
              <label className="ss-label">Whatsapp in reset</label>
              <input
                type="text"
                name="whatsappInReset"
                value={formData.whatsappInReset}
                onChange={handleChange}
                className="ss-input"
              />
            </div>

            <div className="ss-form-group">
              <label className="ss-label">GPay</label>
              <input
                type="text"
                name="gpay"
                value={formData.gpay}
                onChange={handleChange}
                className="ss-input"
              />
            </div>

            <div className="ss-form-group">
              <label className="ss-label">PhonePe</label>
              <input
                type="text"
                name="phonepe"
                value={formData.phonepe}
                onChange={handleChange}
                className="ss-input"
              />
            </div>

            <div className="ss-form-group">
              <label className="ss-label">PayTM</label>
              <input
                type="text"
                name="paytm"
                value={formData.paytm}
                onChange={handleChange}
                className="ss-input"
              />
            </div>

            <div className="ss-form-group">
              <label className="ss-label">OTP Verification</label>
              <input
                type="text"
                name="otpVerification"
                value={formData.otpVerification}
                onChange={handleChange}
                className="ss-input"
              />
            </div>

            <div className="ss-form-group">
              <label className="ss-label">Gali Disawar</label>
              <input
                type="text"
                name="galiDisawar"
                value={formData.galiDisawar}
                onChange={handleChange}
                className="ss-input"
              />
            </div>

            {/* ===== QR Code Upload (Full Width Row) ===== */}
            <div className="ss-form-group ss-form-group-qr ss-grid-span-3">
              <label className="ss-label">Qr Pay</label>

              {qrPreview && (
                <div className="ss-qr-preview">
                  <div className="ss-qr-image-wrapper">
                    <img src={qrPreview} alt="QR Code" className="ss-qr-image" />
                  </div>
                  <button
                    type="button"
                    className="ss-qr-delete-btn"
                    onClick={handleDeleteQR}
                  >
                    Delete
                  </button>
                </div>
              )}

              <div className="ss-file-upload">
                <label className="ss-file-upload-btn">
                  <Upload size={16} />
                  <span>Choose file</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleQRUpload}
                    className="ss-file-input"
                  />
                </label>
                <span className="ss-file-name">
                  {qrFile ? qrFile.name : 'No file chosen'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* ===== Submit Button ===== */}
        <div className="ss-actions">
          <button type="submit" className="ss-submit-btn">
            Submit
          </button>
        </div>
      </form>
    </div>
  )
}