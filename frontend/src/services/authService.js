import api from './api'

export const signup = (data) => api.post('/auth/signup', data)
export const login = (data) => api.post('/auth/login', data)
export const logout = () => api.post('/auth/logout')
export const getProfile = () => api.get('/auth/profile')
export const updateProfile = (data) => api.put('/auth/profile', data)
export const forgotPassword = (data) => api.post('/auth/forgot-password', data)
