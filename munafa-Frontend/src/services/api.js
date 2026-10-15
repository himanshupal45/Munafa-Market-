// =============================================
// Munafa Market - API Service (JWT Only)
// No localStorage — token only in memory
// =============================================
import { apiCall } from '../context/AuthContext'

// ==================== DASHBOARD ====================
export const dashboardAPI = {
  getStats: () => apiCall('/dashboard/stats'),
}

// ==================== USERS ====================
export const usersAPI = {
  getAll: (params = {}) => apiCall(`/users?${new URLSearchParams(params)}`),
  getById: (id) => apiCall(`/users/${id}`),
  updateStatus: (id, status) => apiCall(`/users/${id}/status`, 'PUT', { status }),
  assignRole: (id, data) => apiCall(`/users/${id}/assign-role`, 'PUT', data),
  updateWallet: (id, amount, type) => apiCall(`/users/${id}/wallet`, 'PUT', { amount, type }),
  delete: (id) => apiCall(`/users/${id}`, 'DELETE'),
  getRoles: () => apiCall('/users/roles/all'),
  createRole: (data) => apiCall('/users/roles/create', 'POST', data),
  updateRole: (id, data) => apiCall(`/users/roles/${id}`, 'PUT', data),
  deleteRole: (id) => apiCall(`/users/roles/${id}`, 'DELETE'),
}

// ==================== GAMES ====================
export const gamesAPI = {
  getAll: () => apiCall('/games'),
  create: (data) => apiCall('/games', 'POST', data),
  update: (id, data) => apiCall(`/games/${id}`, 'PUT', data),
  delete: (id) => apiCall(`/games/${id}`, 'DELETE'),
  getResults: (params = {}) => apiCall(`/games/results?${new URLSearchParams(params)}`),
  addResult: (gameId, result, extra = {}) =>
    apiCall('/games/results', 'POST', { gameId, result, ...extra }),
  publishResult: (id) => apiCall(`/games/results/${id}/publish`, 'PUT'),
  getBets: (params = {}) => apiCall(`/games/bets?${new URLSearchParams(params)}`),
  getAllBets: (params = {}) => apiCall(`/games/bets/all?${new URLSearchParams(params)}`),
}

// ==================== RESULTS (compat) ====================
export const resultsAPI = {
  getAll: (params = {}) => apiCall(`/games/results?${new URLSearchParams(params)}`),
}

// ==================== SITE ====================
export const siteAPI = {
  getSettings: () => apiCall('/site-settings'),
}

// ==================== WALLET (ADMIN) ====================
export const walletAPI = {
  getDeposits: (params = {}) => apiCall(`/wallet/deposits?${new URLSearchParams(params)}`),
  getWithdrawals: (params = {}) => apiCall(`/wallet/withdrawals?${new URLSearchParams(params)}`),
  processDeposit: (id, status, note) => apiCall(`/wallet/deposits/${id}`, 'PUT', { status, note }),
  processWithdrawal: (id, status, note) => apiCall(`/wallet/withdrawals/${id}`, 'PUT', { status, note }),
  getSummary: () => apiCall('/wallet/summary'),
}

// ==================== NOTIFICATIONS ====================
export const notificationsAPI = {
  getAll: () => apiCall('/notifications'),
  create: (formData) => apiCall('/notifications', 'POST', formData, true),
  delete: (id) => apiCall(`/notifications/${id}`, 'DELETE'),
}

// ==================== ENQUIRY ====================
export const enquiryAPI = {
  getAll: (params = {}) => apiCall(`/enquiries?${new URLSearchParams(params)}`),
  reply: (id, reply) => apiCall(`/enquiries/${id}/reply`, 'PUT', { reply }),
  delete: (id) => apiCall(`/enquiries/${id}`, 'DELETE'),
}

// ==================== BANNERS ====================
export const bannersAPI = {
  getAll: () => apiCall('/banners'),
  create: (formData) => apiCall('/banners', 'POST', formData, true),
  update: (id, formData) => apiCall(`/banners/${id}`, 'PUT', formData, true),
  delete: (id) => apiCall(`/banners/${id}`, 'DELETE'),
}

// ==================== PAYMENT QR ====================
export const paymentQRAPI = {
  getAll: () => apiCall('/payment-qr'),
  create: (formData) => apiCall('/payment-qr', 'POST', formData, true),
  update: (id, formData) => apiCall(`/payment-qr/${id}`, 'PUT', formData, true),
  delete: (id) => apiCall(`/payment-qr/${id}`, 'DELETE'),
}

// ==================== SITE SETTINGS ====================
export const siteSettingsAPI = {
  get: () => apiCall('/site-settings'),
  update: (formData) => apiCall('/site-settings', 'PUT', formData, true),
}

// ==================== GAME RATES ====================
export const gameRatesAPI = {
  getAll: () => apiCall('/game-rates'),
  updateAll: (rates) => apiCall('/game-rates', 'PUT', { rates }),
  add: (data) => apiCall('/game-rates', 'POST', data),
  delete: (key) => apiCall(`/game-rates/${key}`, 'DELETE'),
}

// ==================== WALLET HISTORY / LEDGER ====================
export const ledgerAPI = {
  ofUser: (id, params = {}) => apiCall(`/ledger/user/${id}?${new URLSearchParams(params)}`),
  profile: (id) => apiCall(`/ledger/user/${id}/profile`),
  adjust: (id, data) => apiCall(`/ledger/user/${id}/adjust`, 'POST', data),
  mine: (params = {}) => apiCall(`/ledger/me?${new URLSearchParams(params)}`),
}

// ==================== DEPOSIT REQUESTS (ADMIN) ====================
export const depositRequestsAPI = {
  getAll: (params = {}) => apiCall(`/deposit-requests?${new URLSearchParams(params)}`),
  process: (id, status, note = '') => apiCall(`/deposit-requests/${id}`, 'PUT', { status, note }),
}

// ==================== PAYMENTS (USER — Test + Razorpay) ====================
export const paymentsAPI = {
  config: () => apiCall('/payments/config'),
  createOrder: (payload) => apiCall('/payments/create-order', 'POST', payload),
  verify: (payload) => apiCall('/payments/verify', 'POST', payload),
}

// ==================== USER DEPOSITS (UPI Manual) ====================
export const myDepositsAPI = {
  create: (payload) => apiCall('/deposit-requests', 'POST', payload),
  mine: () => apiCall('/deposit-requests/mine'),
}