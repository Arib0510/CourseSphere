import api from './api'

export const getStats = () => api.get('/admin/stats')
export const getAllStudents = () => api.get('/admin/students')
export const getAllRegistrations = (params) => api.get('/admin/registrations', { params })

export const createStudent = (data) => api.post('/admin/students', data)
export const updateStudent = (id, data) => api.put(`/admin/students/${id}`, data)
export const deleteStudent = (id) => api.delete(`/admin/students/${id}`)
export const rejectRegistration = (id) => api.delete(`/admin/registrations/${id}`)
