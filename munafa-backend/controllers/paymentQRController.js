const PaymentQR = require('../models/PaymentQR')

exports.getAllQR = async (req, res) => {
  try {
    const qrs = await PaymentQR.find().sort({ createdAt: -1 })
    res.json({ success: true, qrs })
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
}

exports.getActiveQR = async (req, res) => {
  try {
    const qr = await PaymentQR.findOne({ status: 'Active' }).sort({
      createdAt: -1,
    })
    if (!qr) {
      return res.status(404).json({
        success: false,
        message: 'Koi active QR available nahi hai',
      })
    }
    res.json({ success: true, qr })
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
}

exports.createQR = async (req, res) => {
  try {
    const { title, upiId, status } = req.body

    if (!title || !upiId) {
      return res.status(400).json({
        success: false,
        message: 'Title aur UPI ID required hain',
      })
    }
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'QR image required hai',
      })
    }

    const qr = await PaymentQR.create({
      title,
      upiId,
      qrImage: `/uploads/${req.file.filename}`,
      status: status || 'Active',
    })

    res.status(201).json({ success: true, message: 'QR added', qr })
  } catch (err) {
    console.error('createQR error:', err)
    res.status(500).json({ success: false, message: err.message })
  }
}

exports.updateQR = async (req, res) => {
  try {
    const { title, upiId, status } = req.body
    const update = {}
    if (title) update.title = title
    if (upiId) update.upiId = upiId
    if (status) update.status = status
    if (req.file) update.qrImage = `/uploads/${req.file.filename}`

    const qr = await PaymentQR.findByIdAndUpdate(req.params.id, update, {
      new: true,
    })

    if (!qr) {
      return res.status(404).json({ success: false, message: 'QR nahi mila' })
    }

    res.json({ success: true, message: 'QR updated', qr })
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
}

exports.deleteQR = async (req, res) => {
  try {
    const qr = await PaymentQR.findByIdAndDelete(req.params.id)
    if (!qr) {
      return res.status(404).json({ success: false, message: 'QR nahi mila' })
    }
    res.json({ success: true, message: 'QR deleted' })
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
}