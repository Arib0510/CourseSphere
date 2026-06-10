import { useEffect, useRef, useState } from 'react'
import { toast } from 'react-toastify'
import {
  getCourses,
  createCourse,
  updateCourse,
  deleteCourse,
  uploadCoursePDF,
} from '../../services/courseService'
import Loader from '../../components/common/Loader'

const initialForm = {
  course_no: '',
  course_title: '',
  credits: '',
  credit_hours: '',
  academic_year: '',
  semester: '',
  category: '',
  capacity: '',
  description: '',
  syllabus_url: '',
  curriculum_url: '',
}

const SEMESTERS  = ['Odd', 'Even']
const CATEGORIES = ['Core', 'Elective', 'Optional']
const YEARS      = ['1st Year', '2nd Year', '3rd Year', '4th Year', 'Elective']

// ── PDF upload field ──────────────────────────────────────────────────────
function PdfUploadField({ label, urlKey, url, uploading, onUpload, onChange }) {
  const ref = useRef(null)
  return (
    <div className="col-span-2">
      <label className="block font-label-caps text-on-surface-variant uppercase tracking-wider text-xs mb-1.5">
        {label}
      </label>
      <div className="flex gap-2 items-center">
        <input
          type="url"
          value={url}
          onChange={e => onChange(urlKey, e.target.value)}
          placeholder="Paste URL or upload PDF below"
          className="flex-1 bg-surface-container-low border border-outline-variant rounded-input px-4 py-2.5 focus:ring-2 focus:ring-primary focus:border-transparent text-on-surface font-body-md outline-none text-sm"
        />
        <button
          type="button"
          onClick={() => ref.current?.click()}
          disabled={uploading}
          className="flex items-center gap-1.5 border border-outline-variant text-on-surface-variant px-3 py-2.5 rounded-btn font-body-md hover:bg-surface-container transition-colors text-xs disabled:opacity-60 shrink-0"
        >
          {uploading
            ? <div className="w-3.5 h-3.5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
            : <span className="material-symbols-outlined text-[16px]">upload_file</span>}
          {uploading ? 'Uploading…' : 'Upload PDF'}
        </button>
        <input
          ref={ref}
          type="file"
          accept="application/pdf"
          className="hidden"
          onChange={e => e.target.files[0] && onUpload(urlKey, e.target.files[0])}
        />
      </div>
      {url && (
        <a href={url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-xs text-primary mt-1 hover:underline">
          <span className="material-symbols-outlined text-[14px]">open_in_new</span>
          View uploaded PDF
        </a>
      )}
    </div>
  )
}

// ── Course form modal ─────────────────────────────────────────────────────
function CourseFormModal({ open, onClose, editingCourse, onSuccess }) {
  const [formData, setFormData]   = useState(initialForm)
  const [formErrors, setFormErrors] = useState({})
  const [submitting, setSubmitting] = useState(false)
  const [uploading, setUploading]   = useState({ syllabus: false, curriculum: false })

  useEffect(() => {
    if (open) {
      setFormData(editingCourse ? {
        course_no:      editingCourse.course_no      || '',
        course_title:   editingCourse.course_title   || '',
        credits:        editingCourse.credits        || '',
        credit_hours:   editingCourse.credit_hours   || '',
        academic_year:  editingCourse.academic_year  || '',
        semester:       editingCourse.semester       || '',
        category:       editingCourse.category       || '',
        capacity:       editingCourse.capacity       || '',
        description:    editingCourse.description    || '',
        syllabus_url:   editingCourse.syllabus_url   || '',
        curriculum_url: editingCourse.curriculum_url || '',
      } : initialForm)
      setFormErrors({})
    }
  }, [open, editingCourse])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    if (formErrors[name]) setFormErrors(prev => ({ ...prev, [name]: '' }))
  }

  const setField = (key, val) => setFormData(prev => ({ ...prev, [key]: val }))

  const handlePdfUpload = async (urlKey, file) => {
    const typeKey = urlKey === 'syllabus_url' ? 'syllabus' : 'curriculum'
    setUploading(prev => ({ ...prev, [typeKey]: true }))
    try {
      const res = await uploadCoursePDF(file, typeKey)
      const url = res.data?.data?.url || ''
      setField(urlKey, url)
      toast.success(`${typeKey === 'syllabus' ? 'Syllabus' : 'Curriculum'} PDF uploaded.`)
    } catch (err) {
      toast.error(err.response?.data?.message || 'Upload failed. Make sure the "course-pdfs" storage bucket exists in Supabase.')
    } finally {
      setUploading(prev => ({ ...prev, [typeKey]: false }))
    }
  }

  const validate = () => {
    const errors = {}
    if (!formData.course_no.trim())    errors.course_no    = 'Course number is required'
    if (!formData.course_title.trim()) errors.course_title = 'Title is required'
    if (!formData.credits)             errors.credits      = 'Credits required'
    if (!formData.credit_hours)        errors.credit_hours = 'Credit hours required'
    return errors
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const errors = validate()
    if (Object.keys(errors).length > 0) { setFormErrors(errors); return }
    setSubmitting(true)
    const payload = {
      ...formData,
      credits:        parseFloat(formData.credits)      || 0,
      credit_hours:   parseFloat(formData.credit_hours) || 0,
      capacity:       formData.capacity ? parseInt(formData.capacity) : null,
      syllabus_url:   formData.syllabus_url   || null,
      curriculum_url: formData.curriculum_url || null,
      description:    formData.description    || null,
    }
    try {
      if (editingCourse) {
        await updateCourse(editingCourse.id, payload)
        toast.success('Course updated successfully')
      } else {
        await createCourse(payload)
        toast.success('Course created successfully')
      }
      onSuccess()
      onClose()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Operation failed')
    } finally {
      setSubmitting(false)
    }
  }

  if (!open) return null

  const inputCls = (field) =>
    `bg-surface-container-low border rounded-input px-4 py-2.5 focus:ring-2 focus:ring-primary focus:border-transparent text-on-surface font-body-md outline-none w-full text-sm ${
      formErrors[field] ? 'border-error' : 'border-outline-variant'
    }`

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-black/40 backdrop-blur-sm" onClick={onClose}>
      <div
        className="bg-surface-container-lowest border border-outline-variant rounded-[24px] shadow-xl max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-h1 text-h1 text-on-surface">
            {editingCourse ? 'Edit Course' : 'Add New Course'}
          </h2>
          <button onClick={onClose} className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-surface-container transition-colors">
            <span className="material-symbols-outlined text-[20px] text-on-surface-variant">close</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-label-caps text-on-surface-variant uppercase tracking-wider text-xs mb-1.5">Course Number *</label>
              <input type="text" name="course_no" value={formData.course_no} onChange={handleChange} placeholder="e.g. CSE 3101" className={inputCls('course_no')} />
              {formErrors.course_no && <p className="text-xs text-error mt-1">{formErrors.course_no}</p>}
            </div>

            <div>
              <label className="block font-label-caps text-on-surface-variant uppercase tracking-wider text-xs mb-1.5">Course Title *</label>
              <input type="text" name="course_title" value={formData.course_title} onChange={handleChange} placeholder="Course title" className={inputCls('course_title')} />
              {formErrors.course_title && <p className="text-xs text-error mt-1">{formErrors.course_title}</p>}
            </div>

            <div>
              <label className="block font-label-caps text-on-surface-variant uppercase tracking-wider text-xs mb-1.5">Credits *</label>
              <input type="number" name="credits" value={formData.credits} onChange={handleChange} placeholder="e.g. 3.00" step="0.25" min="0" className={inputCls('credits')} />
              {formErrors.credits && <p className="text-xs text-error mt-1">{formErrors.credits}</p>}
            </div>

            <div>
              <label className="block font-label-caps text-on-surface-variant uppercase tracking-wider text-xs mb-1.5">Credit Hours *</label>
              <input type="number" name="credit_hours" value={formData.credit_hours} onChange={handleChange} placeholder="e.g. 3" step="0.5" min="0" className={inputCls('credit_hours')} />
              {formErrors.credit_hours && <p className="text-xs text-error mt-1">{formErrors.credit_hours}</p>}
            </div>

            <div>
              <label className="block font-label-caps text-on-surface-variant uppercase tracking-wider text-xs mb-1.5">Academic Year</label>
              <select name="academic_year" value={formData.academic_year} onChange={handleChange} className={inputCls('academic_year')}>
                <option value="">Select Year</option>
                {YEARS.map(y => <option key={y} value={y}>{y}</option>)}
              </select>
            </div>

            <div>
              <label className="block font-label-caps text-on-surface-variant uppercase tracking-wider text-xs mb-1.5">Semester</label>
              <select name="semester" value={formData.semester} onChange={handleChange} className={inputCls('semester')}>
                <option value="">Select Semester</option>
                {SEMESTERS.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>

            <div>
              <label className="block font-label-caps text-on-surface-variant uppercase tracking-wider text-xs mb-1.5">Category</label>
              <select name="category" value={formData.category} onChange={handleChange} className={inputCls('category')}>
                <option value="">Select Category</option>
                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>

            <div>
              <label className="block font-label-caps text-on-surface-variant uppercase tracking-wider text-xs mb-1.5">Capacity</label>
              <input type="number" name="capacity" value={formData.capacity} onChange={handleChange} placeholder="Max students (optional)" min="0" className={inputCls('capacity')} />
            </div>

            <div className="col-span-2">
              <label className="block font-label-caps text-on-surface-variant uppercase tracking-wider text-xs mb-1.5">Description</label>
              <textarea name="description" value={formData.description} onChange={handleChange} placeholder="Optional course description..." rows={2} className={`${inputCls('description')} resize-none`} />
            </div>

            {/* PDF upload fields */}
            <PdfUploadField
              label="Syllabus PDF"
              urlKey="syllabus_url"
              url={formData.syllabus_url}
              uploading={uploading.syllabus}
              onUpload={handlePdfUpload}
              onChange={setField}
            />
            <PdfUploadField
              label="Curriculum PDF"
              urlKey="curriculum_url"
              url={formData.curriculum_url}
              uploading={uploading.curriculum}
              onUpload={handlePdfUpload}
              onChange={setField}
            />
          </div>

          <div className="flex gap-3 justify-end pt-2 border-t border-outline-variant">
            <button type="button" onClick={onClose} className="border border-outline-variant text-on-surface-variant px-4 py-2 rounded-btn font-body-md hover:bg-surface-container transition-colors text-sm">
              Cancel
            </button>
            <button type="submit" disabled={submitting} className="bg-primary text-on-primary px-4 py-2 rounded-btn font-body-md-bold hover:bg-primary/90 transition-colors text-sm disabled:opacity-60 flex items-center gap-2">
              {submitting && <div className="w-4 h-4 border-2 border-on-primary border-t-transparent rounded-full animate-spin" />}
              {submitting ? 'Saving…' : editingCourse ? 'Update Course' : 'Create Course'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

// ── Delete confirm modal ──────────────────────────────────────────────────
function DeleteConfirmModal({ open, course, onClose, onConfirm, deleting }) {
  if (!open) return null
  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-black/40 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-surface-container-lowest border border-outline-variant rounded-[24px] shadow-xl max-w-md w-full p-6" onClick={e => e.stopPropagation()}>
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-full bg-error-container flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-[20px] text-error">delete_forever</span>
          </div>
          <h2 className="font-h1 text-h1 text-on-surface">Delete Course</h2>
        </div>
        <p className="font-body-md text-on-surface-variant text-sm mb-6">
          Are you sure you want to delete{' '}
          <span className="font-body-md-bold text-on-surface">{course?.course_no} — {course?.course_title}</span>
          ? This will also remove all related registrations.
        </p>
        <div className="flex gap-3 justify-end">
          <button onClick={onClose} className="border border-outline-variant text-on-surface-variant px-4 py-2 rounded-btn font-body-md hover:bg-surface-container transition-colors text-sm">Cancel</button>
          <button onClick={onConfirm} disabled={deleting} className="border border-error text-error px-4 py-2 rounded-btn font-body-md-bold hover:bg-error-container transition-colors text-sm disabled:opacity-60">
            {deleting ? 'Deleting…' : 'Delete'}
          </button>
        </div>
      </div>
    </div>
  )
}

// ── Main page ─────────────────────────────────────────────────────────────
export default function ManageCoursesPage() {
  const [courses, setCourses]       = useState([])
  const [loading, setLoading]       = useState(true)
  const [search, setSearch]         = useState('')
  const [semesterFilter, setSemesterFilter] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('')
  const [modalOpen, setModalOpen]   = useState(false)
  const [editingCourse, setEditingCourse] = useState(null)
  const [deleteModal, setDeleteModal] = useState({ open: false, course: null })
  const [deleting, setDeleting]     = useState(false)

  useEffect(() => { fetchCourses() }, [])

  const fetchCourses = () => {
    setLoading(true)
    getCourses()
      .then(res => setCourses(res.data.data || res.data || []))
      .catch(() => toast.error('Failed to load courses'))
      .finally(() => setLoading(false))
  }

  const filteredCourses = courses.filter(c => {
    const matchesSearch =
      c.course_title?.toLowerCase().includes(search.toLowerCase()) ||
      c.course_no?.toLowerCase().includes(search.toLowerCase())
    const matchesSem = !semesterFilter || c.semester === semesterFilter
    const matchesCat = !categoryFilter || c.category === categoryFilter
    return matchesSearch && matchesSem && matchesCat
  })

  const handleConfirmDelete = async () => {
    const course = deleteModal.course
    if (!course) return
    setDeleting(true)
    try {
      await deleteCourse(course.id)
      toast.success(`Course "${course.course_no}" deleted`)
      setCourses(prev => prev.filter(c => c.id !== course.id))
      setDeleteModal({ open: false, course: null })
    } catch (err) {
      toast.error(err.response?.data?.message || 'Delete failed')
    } finally {
      setDeleting(false)
    }
  }

  const categoryBadgeClass = (cat) => {
    if (cat === 'Core')     return 'bg-primary-fixed text-primary'
    if (cat === 'Elective') return 'bg-tertiary-fixed text-tertiary'
    return 'bg-secondary-fixed text-on-secondary-container'
  }

  const enrollPct = (course) => {
    if (!course.capacity) return 0
    return Math.min(((course.enrolled_count || 0) / course.capacity) * 100, 100)
  }

  return (
    <div className="space-y-8 pb-10">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="font-display text-display text-on-background">Manage Courses</h1>
        <button
          onClick={() => { setEditingCourse(null); setModalOpen(true) }}
          className="bg-primary text-on-primary px-4 py-2 rounded-btn font-body-md-bold hover:bg-primary/90 transition-colors text-sm flex items-center gap-2"
        >
          <span className="material-symbols-outlined text-[18px]">add</span>
          Add Course
        </button>
      </div>

      {/* Filter Bar */}
      <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant p-4 flex flex-wrap items-center gap-3">
        <div className="relative flex items-center gap-3 bg-surface-container-low border border-outline-variant rounded-2xl px-4 py-2.5 flex-1 min-w-[200px] max-w-sm">
          <span className="material-symbols-outlined text-[20px] text-on-surface-variant">search</span>
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search courses..."
            className="bg-transparent outline-none text-sm text-on-surface w-full placeholder:text-on-surface-variant font-body-md"
          />
          {search && (
            <button onClick={() => setSearch('')} className="text-on-surface-variant hover:text-on-surface">
              <span className="material-symbols-outlined text-[18px]">close</span>
            </button>
          )}
        </div>

        <div className="flex items-center gap-2">
          {['', ...SEMESTERS].map(s => (
            <button
              key={s || 'all-sem'}
              onClick={() => setSemesterFilter(s)}
              className={`px-3 py-1.5 rounded-full text-xs font-body-md-bold transition-colors ${
                semesterFilter === s
                  ? 'bg-primary text-on-primary shadow-sm'
                  : 'bg-surface-container-low border border-outline-variant text-on-surface hover:bg-surface-container-high'
              }`}
            >
              {s || 'All Semesters'}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          {['', ...CATEGORIES].map(c => (
            <button
              key={c || 'all-cat'}
              onClick={() => setCategoryFilter(c)}
              className={`px-3 py-1.5 rounded-full text-xs font-body-md-bold transition-colors ${
                categoryFilter === c
                  ? 'bg-secondary-container text-on-secondary-container shadow-sm'
                  : 'bg-surface-container-low border border-outline-variant text-on-surface hover:bg-surface-container-high'
              }`}
            >
              {c || 'All Categories'}
            </button>
          ))}
        </div>
      </div>

      {/* Cards */}
      {loading ? (
        <Loader />
      ) : filteredCourses.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 gap-3">
          <span className="material-symbols-outlined text-[48px] text-on-surface-variant">menu_book</span>
          <p className="text-on-surface-variant font-body-md text-sm">No courses found</p>
          {search && (
            <button onClick={() => setSearch('')} className="border border-outline-variant text-on-surface-variant px-4 py-2 rounded-btn font-body-md hover:bg-surface-container transition-colors text-sm">Clear search</button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredCourses.map(course => {
            const pct = enrollPct(course)
            return (
              <div
                key={course.id}
                className="bg-surface-container-lowest rounded-2xl border border-outline-variant p-5 shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:shadow-[0_8px_30px_rgba(108,22,39,0.08)] transition-all duration-300 flex flex-col gap-3"
              >
                {/* Top row: category badge + Edit/Delete icon buttons */}
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2 flex-wrap min-w-0">
                    {course.category && (
                      <span className={`text-xs rounded-full px-2.5 py-0.5 font-body-md-bold ${categoryBadgeClass(course.category)}`}>
                        {course.category}
                      </span>
                    )}
                    <span className="bg-secondary-fixed text-primary text-xs rounded-full px-2.5 py-0.5 font-body-md-bold">
                      {course.course_no}
                    </span>
                  </div>
                  {/* Action buttons — always visible in top-right */}
                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      onClick={() => { setEditingCourse(course); setModalOpen(true) }}
                      className="w-8 h-8 rounded-full flex items-center justify-center border border-outline-variant text-on-surface-variant hover:bg-surface-container hover:text-primary transition-colors"
                      title="Edit course"
                    >
                      <span className="material-symbols-outlined text-[16px]">edit</span>
                    </button>
                    <button
                      onClick={() => setDeleteModal({ open: true, course })}
                      className="w-8 h-8 rounded-full flex items-center justify-center border border-outline-variant text-on-surface-variant hover:bg-error-container hover:text-error transition-colors"
                      title="Delete course"
                    >
                      <span className="material-symbols-outlined text-[16px]">delete</span>
                    </button>
                  </div>
                </div>

                {/* Title */}
                <h3 className="font-body-md-bold text-on-surface text-sm leading-snug line-clamp-2">
                  {course.course_title}
                </h3>

                {/* Info chips */}
                <div className="flex flex-wrap items-center gap-2">
                  {course.credits && (
                    <span className="flex items-center gap-1 text-xs text-on-surface-variant border border-outline-variant rounded-full px-2.5 py-0.5">
                      <span className="material-symbols-outlined text-[14px]">grade</span>
                      {course.credits} cr
                    </span>
                  )}
                  {course.semester && (
                    <span className="flex items-center gap-1 text-xs text-on-surface-variant border border-outline-variant rounded-full px-2.5 py-0.5">
                      <span className="material-symbols-outlined text-[14px]">calendar_month</span>
                      {course.semester}
                    </span>
                  )}
                  {course.academic_year && (
                    <span className="flex items-center gap-1 text-xs text-on-surface-variant border border-outline-variant rounded-full px-2.5 py-0.5">
                      <span className="material-symbols-outlined text-[14px]">school</span>
                      {course.academic_year}
                    </span>
                  )}
                </div>

                {/* PDF links */}
                {(course.syllabus_url || course.curriculum_url) && (
                  <div className="flex flex-wrap gap-2">
                    {course.syllabus_url && (
                      <a href={course.syllabus_url} target="_blank" rel="noreferrer"
                        className="flex items-center gap-1 text-xs text-primary border border-primary/30 rounded-full px-2.5 py-0.5 hover:bg-primary-fixed transition-colors">
                        <span className="material-symbols-outlined text-[14px]">picture_as_pdf</span>
                        Syllabus
                      </a>
                    )}
                    {course.curriculum_url && (
                      <a href={course.curriculum_url} target="_blank" rel="noreferrer"
                        className="flex items-center gap-1 text-xs text-tertiary border border-tertiary/30 rounded-full px-2.5 py-0.5 hover:bg-tertiary-fixed transition-colors">
                        <span className="material-symbols-outlined text-[14px]">picture_as_pdf</span>
                        Curriculum
                      </a>
                    )}
                  </div>
                )}

                {/* Enrollment bar */}
                {course.capacity ? (
                  <div className="space-y-1 mt-auto">
                    <div className="flex justify-between text-xs text-on-surface-variant">
                      <span>Enrollment</span>
                      <span>{course.enrolled_count || 0} / {course.capacity}</span>
                    </div>
                    <div className="h-1.5 bg-surface-container rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all ${pct >= 90 ? 'bg-error' : pct >= 70 ? 'bg-tertiary' : 'bg-primary'}`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                ) : null}
              </div>
            )
          })}
        </div>
      )}

      <CourseFormModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        editingCourse={editingCourse}
        onSuccess={fetchCourses}
      />

      <DeleteConfirmModal
        open={deleteModal.open}
        course={deleteModal.course}
        onClose={() => setDeleteModal({ open: false, course: null })}
        onConfirm={handleConfirmDelete}
        deleting={deleting}
      />
    </div>
  )
}
