import { apiCall } from '../context/AuthContext'

export const resultsAPI = {
  getAll: (params = {}) => apiCall(`/games/results?${new URLSearchParams(params)}`),
}

export const bannersAPI = {
  getAll: () => apiCall('/banners'),
}

export const gamesAPI = {
  getAll: () => apiCall('/games'),
}

export const siteAPI = {
  getSettings: () => apiCall('/site-settings'),
}
