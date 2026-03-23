import { create } from 'zustand'
import axios from 'axios'

export const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  timeout: 15000,
})

API.interceptors.request.use(cfg => {
  const t = localStorage.getItem('agri_token')
  if (t) cfg.headers.Authorization = `Bearer ${t}`
  return cfg
})

API.interceptors.response.use(r => r, err => {
  if (err.response?.status === 401) {
    localStorage.removeItem('agri_token')
    useStore.getState().setUser(null)
  }
  return Promise.reject(err)
})

export const useStore = create((set) => ({
  user: null,
  loading: true,

  setUser: (user) => set({ user }),

  init: async () => {
    const token = localStorage.getItem('agri_token')
    if (!token) return set({ loading: false })
    try {
      const { data } = await API.get('/auth/me')
      set({ user: data, loading: false })
    } catch {
      localStorage.removeItem('agri_token')
      set({ user: null, loading: false })
    }
  },

  login: async (phone, password) => {
    const { data } = await API.post('/auth/login', { phone, password })
    localStorage.setItem('agri_token', data.token)
    set({ user: data.user })
    return data.user
  },

  register: async (payload) => {
    const { data } = await API.post('/auth/register', payload)
    localStorage.setItem('agri_token', data.token)
    set({ user: data.user })
    return data.user
  },

  logout: () => {
    localStorage.removeItem('agri_token')
    set({ user: null })
  },

  updateUser: (updates) => set(s => ({ user: { ...s.user, ...updates } })),
}))
