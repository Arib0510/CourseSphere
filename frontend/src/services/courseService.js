import api from './api'

export const getCourses = (params) => api.get('/courses', { params })
export const getCourseById = (id) => api.get(`/courses/${id}`)
export const createCourse = (data) => api.post('/courses', data)
export const updateCourse = (id, data) => api.put(`/courses/${id}`, data)
export const deleteCourse = (id) => api.delete(`/courses/${id}`)

export const uploadCoursePDF = (file, type) => {
  const fd = new FormData()
  fd.append('pdf', file)
  return api.post(`/courses/upload-pdf?type=${type}`, fd, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
}
