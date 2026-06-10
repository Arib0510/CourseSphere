import api from './api'

export const getMyRegistrations = () => api.get('/registrations')
export const registerCourse = (courseId) => api.post('/registrations', { course_id: courseId })
export const dropCourse = (regId) => api.delete(`/registrations/${regId}`)
