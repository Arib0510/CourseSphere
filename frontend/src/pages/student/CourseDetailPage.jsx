import { useEffect, useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { toast } from 'react-toastify'
import { getCourseById } from '../../services/courseService'
import { getMyRegistrations, registerCourse, dropCourse } from '../../services/registrationService'
import Loader from '../../components/common/Loader'

/* ── SVG Circular progress gauge ─────────────────── */
function EnrollmentGauge({ pct, enrolled, capacity, isFull }) {
  const r   = 52
  const circ = 2 * Math.PI * r
  const dash = (pct / 100) * circ
  const color = isFull ? 'rgb(var(--m3-error))' : pct >= 75 ? '#d89b3d' : 'rgb(var(--m3-primary))'

  return (
    <div className="flex flex-col items-center">
      <div className="relative w-36 h-36">
        <svg className="enrollment-ring w-full h-full" viewBox="0 0 120 120">
          {/* Track */}
          <circle className="enrollment-ring-track" cx="60" cy="60" r={r} />
          {/* Fill */}
          <circle
            className="enrollment-ring-fill"
            cx="60" cy="60" r={r}
            stroke={color}
            strokeDasharray={`${dash} ${circ}`}
            strokeDashoffset={0}
          />
        </svg>
        {/* Center text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-[26px] font-black text-on-background leading-none">{enrolled}</span>
          <span className="text-[11px] text-on-surface-variant font-medium">/ {capacity} ENROLLED</span>
        </div>
      </div>
    </div>
  )
}

/* ── Badge maps ───────────────────────────────────── */
const CAT_BADGE = {
  Core:     'bg-secondary-fixed text-primary border border-secondary-fixed-dim',
  Elective: 'bg-surface-container-high text-on-surface border border-outline-variant',
  Optional: 'bg-surface-container-high text-on-surface border border-outline-variant',
}
const SEM_BADGE = {
  Odd:  'bg-tertiary-fixed/60 text-tertiary border border-tertiary-fixed-dim',
  Even: 'bg-primary-fixed text-primary border border-primary-fixed-dim',
}

export default function CourseDetailPage() {
  const { id }       = useParams()
  const navigate     = useNavigate()

  const [course, setCourse]               = useState(null)
  const [myRegs, setMyRegs]               = useState([])
  const [loading, setLoading]             = useState(true)
  const [actionLoading, setActionLoading] = useState(false)
  const [dropModal, setDropModal]         = useState(false)

  useEffect(() => {
    Promise.all([getCourseById(id), getMyRegistrations()])
      .then(([cRes, rRes]) => {
        setCourse(cRes.data.data || cRes.data)
        setMyRegs(rRes.data.data || rRes.data || [])
      })
      .catch(() => {
        toast.error('Failed to load course details.')
        navigate('/courses')
      })
      .finally(() => setLoading(false))
  }, [id, navigate])

  const myReg      = course ? myRegs.find(r => r.course_id === course.id || r.course?.id === course.id) : null
  const enrolled   = course?.enrolled_count ?? course?.enrolled ?? 0
  const capacity   = course?.capacity ?? 40
  const available  = course?.available_seats ?? Math.max(0, capacity - enrolled)
  const fillPct    = capacity > 0 ? Math.min(100, Math.round((enrolled / capacity) * 100)) : 0
  const isFull     = available <= 0
  const isRegistered = !!myReg

  const handleRegister = async () => {
    setActionLoading(true)
    try {
      await registerCourse(course.id)
      toast.success(`Registered for ${course.course_no}!`)
      setMyRegs(prev => [...prev, { course_id: course.id, course }])
      setCourse(prev => ({ ...prev, enrolled_count: (prev.enrolled_count || 0) + 1 }))
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed.')
    } finally {
      setActionLoading(false)
    }
  }

  const handleDrop = async () => {
    if (!myReg) return
    setActionLoading(true)
    try {
      await dropCourse(myReg.id)
      toast.success('Course dropped successfully.')
      setMyRegs(prev => prev.filter(r => r.id !== myReg.id))
      setCourse(prev => ({ ...prev, enrolled_count: Math.max(0, (prev.enrolled_count || 1) - 1) }))
      setDropModal(false)
    } catch {
      toast.error('Failed to drop course.')
    } finally {
      setActionLoading(false)
    }
  }

  if (loading) return <Loader />
  if (!course)  return null

  const instructor = course.teacher_name || course.instructor_name || course.instructor || null
  const instrInitials = instructor
    ? instructor.split(' ').filter(w => w.match(/^[A-Z]/)).map(w => w[0]).join('').slice(0, 2)
    : null

  /* Info cards data */
  const INFO_CARDS = [
    {
      icon: 'military_tech', label: 'ACADEMIC WEIGHT',
      primary: `${course.credits ?? course.credit_hours ?? '—'} Credits`,
      secondary: course.credit_hours ? `Theory: ${course.credit_hours} hrs` : null,
    },
    {
      icon: 'calendar_month', label: 'ACADEMIC YEAR',
      primary: course.academic_year || '—',
      secondary: course.semester ? `${course.semester} Semester` : null,
    },
    {
      icon: 'category', label: 'CATEGORY',
      primary: course.category || '—',
      secondary: null,
    },
    instructor ? {
      icon: 'person', label: 'LEAD INSTRUCTOR',
      primary: instructor,
      secondary: null,
      isInstructor: true,
    } : {
      icon: 'people', label: 'CAPACITY',
      primary: `${capacity} seats`,
      secondary: `${available} available`,
    },
  ]

  return (
    <>
      <div className="pt-4 pb-28 md:pb-12 page-enter">

        {/* Back link */}
        <Link
          to="/courses"
          className="inline-flex items-center gap-1.5 text-sm text-on-surface-variant font-body-md hover:text-primary transition-colors mb-6 group"
        >
          <span className="material-symbols-outlined text-base transition-transform group-hover:-translate-x-0.5">arrow_back</span>
          Back to Courses
        </Link>

        {/* ── Hero section ─────────────────────────────── */}
        <div className="bg-surface-container-lowest rounded-[24px] border border-outline-variant shadow-card p-6 mb-6 animate-fade-in-up transition-colors duration-300">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
            <div className="flex-1 min-w-0">
              {/* Badges */}
              <div className="flex flex-wrap gap-2 mb-3">
                {course.academic_year && (
                  <span className="inline-flex items-center gap-1.5 bg-secondary-fixed text-primary border border-secondary-fixed-dim px-3 py-1 rounded-full text-[11px] font-semibold">
                    <span className="material-symbols-outlined text-[14px]" style={{ fontVariationSettings: "'FILL' 1" }}>rotate_right</span>
                    {course.academic_year.toUpperCase()}
                  </span>
                )}
                {course.category && (
                  <span className={`px-3 py-1 rounded-full text-[11px] font-semibold ${CAT_BADGE[course.category] || 'bg-surface-container-high text-on-surface border border-outline-variant'}`}>
                    {course.category}
                  </span>
                )}
                {course.semester && (
                  <span className={`px-3 py-1 rounded-full text-[11px] font-semibold ${SEM_BADGE[course.semester] || 'bg-surface-container-high text-on-surface border border-outline-variant'}`}>
                    {course.semester} Semester
                  </span>
                )}
              </div>

              {/* Title */}
              <h1 className="font-bold text-[22px] sm:text-[26px] text-on-background leading-snug mb-2">
                {course.course_title}
              </h1>

              {/* Description */}
              {course.description && (
                <p className="text-on-surface-variant font-body-md text-sm leading-relaxed mb-4 max-w-xl">
                  {course.description}
                </p>
              )}

              {/* Course No + Dept row */}
              <div className="flex flex-wrap items-center gap-4 text-sm text-on-surface-variant">
                <span className="inline-flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[16px]">tag</span>
                  {course.course_no}
                </span>
                {course.department && (
                  <span className="inline-flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-[16px]">business</span>
                    {course.department}
                  </span>
                )}
              </div>
            </div>

            {/* Action — desktop */}
            <div className="hidden sm:flex flex-col items-end gap-2 shrink-0">
              {isRegistered ? (
                <div className="inline-flex items-center gap-2 bg-secondary-fixed border border-secondary-fixed-dim text-primary px-5 py-2.5 rounded-xl text-sm font-body-md-bold">
                  <span className="material-symbols-outlined fill text-base">check_circle</span>
                  Enrolled
                </div>
              ) : (
                <button
                  onClick={handleRegister}
                  disabled={isFull || actionLoading}
                  className="bg-primary text-on-primary font-body-md-bold px-6 py-2.5 rounded-xl hover:bg-primary-container transition-all active:scale-95 disabled:opacity-50 text-sm shadow-burgundy inline-flex items-center gap-2"
                >
                  <span className="material-symbols-outlined text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>how_to_reg</span>
                  {actionLoading ? 'Registering...' : isFull ? 'Course Full' : 'Register'}
                </button>
              )}
              {isRegistered && (
                <button
                  onClick={() => setDropModal(true)}
                  className="text-xs text-error hover:text-error/80 transition-colors font-medium flex items-center gap-1"
                >
                  <span className="material-symbols-outlined text-[14px]">remove_circle_outline</span>
                  Drop course
                </button>
              )}
            </div>
          </div>
        </div>

        {/* ── Main 2-col layout ────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* LEFT column (spans 2) */}
          <div className="lg:col-span-2 space-y-5">

            {/* 2×2 info card grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {INFO_CARDS.map(({ icon, label, primary, secondary, isInstructor }, i) => (
                <div
                  key={label}
                  className={`bg-surface-container-lowest rounded-[16px] border border-outline-variant p-4 shadow-card flex items-start gap-4 animate-fade-in-up transition-colors duration-300 stagger-${i + 1}`}
                >
                  {isInstructor && instrInitials ? (
                    <div className="w-10 h-10 rounded-full bg-primary-container text-on-primary-container flex items-center justify-center shrink-0 text-sm font-bold border border-primary-fixed-dim">
                      {instrInitials}
                    </div>
                  ) : (
                    <div className="w-10 h-10 rounded-xl bg-primary-fixed flex items-center justify-center shrink-0">
                      <span className="material-symbols-outlined text-primary text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                        {icon}
                      </span>
                    </div>
                  )}
                  <div className="min-w-0">
                    <p className="font-label-caps text-on-surface-variant uppercase tracking-wider text-[10px] mb-0.5">{label}</p>
                    <p className="font-body-md-bold text-on-background text-sm leading-snug">{primary}</p>
                    {secondary && (
                      <p className="text-xs text-on-surface-variant mt-0.5">{secondary}</p>
                    )}
                    {isInstructor && (
                      <button className="text-xs text-primary hover:underline mt-1 flex items-center gap-0.5 transition-colors">
                        <span className="material-symbols-outlined text-[12px]">mail</span>
                        Contact
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Course Overview card */}
            <div className="bg-surface-container-lowest rounded-[16px] border border-outline-variant p-5 shadow-card animate-fade-in-up stagger-2 transition-colors duration-300">
              <h2 className="font-semibold text-on-background text-[15px] mb-3 flex items-center gap-2">
                <span className="w-1.5 h-5 bg-primary rounded-full inline-block" />
                Course Overview
              </h2>
              <p className="text-sm text-on-surface-variant leading-relaxed">
                {course.description
                  || 'This course provides a comprehensive introduction to the subject matter, covering theoretical foundations and practical applications. Students will gain hands-on experience through lab work and projects.'}
              </p>

              {/* Prerequisites */}
              {course.prerequisites && (
                <div className="mt-4 pt-4 border-t border-outline-variant">
                  <p className="text-sm text-on-background">
                    <span className="font-semibold">Prerequisites: </span>
                    <span className="text-on-surface-variant">{course.prerequisites}</span>
                  </p>
                </div>
              )}

              {/* Key topics as pills */}
              {course.topics && Array.isArray(course.topics) && course.topics.length > 0 && (
                <div className="mt-4 flex flex-wrap gap-2">
                  {course.topics.map(t => (
                    <span key={t} className="text-xs bg-secondary-fixed text-primary px-2.5 py-1 rounded-full border border-secondary-fixed-dim font-medium">
                      {t}
                    </span>
                  ))}
                </div>
              )}
            </div>

          </div>

          {/* RIGHT column */}
          <div className="space-y-5">

            {/* Enrollment Status card */}
            <div className="bg-surface-container-lowest rounded-[20px] border border-outline-variant shadow-card p-6 animate-fade-in-up stagger-1 transition-colors duration-300">
              <h3 className="font-semibold text-on-background text-sm mb-5 text-center">Enrollment Status</h3>

              {/* Circular gauge */}
              <div className="flex justify-center mb-4">
                <EnrollmentGauge pct={fillPct} enrolled={enrolled} capacity={capacity} isFull={isFull} />
              </div>

              {/* Progress bar */}
              <div className="w-full h-1.5 bg-surface-variant rounded-full overflow-hidden mb-2">
                <div
                  className={`h-full rounded-full transition-all duration-700 ${isFull ? 'bg-error' : fillPct >= 75 ? 'bg-[#d89b3d]' : 'bg-primary'}`}
                  style={{ width: `${fillPct}%` }}
                />
              </div>

              {/* Seats remaining */}
              <p className="text-center text-sm text-on-surface-variant">
                {isFull ? (
                  <span className="text-error font-semibold">No seats available</span>
                ) : (
                  <><span className="font-semibold text-on-background">{available}</span> seat{available !== 1 ? 's' : ''} remaining</>
                )}
              </p>

              {/* Status badge */}
              <div className="mt-4 flex justify-center">
                {isFull ? (
                  <span className="bg-error-container text-error text-xs font-semibold px-4 py-1.5 rounded-full border border-error/30">
                    Class Full
                  </span>
                ) : fillPct >= 75 ? (
                  <span className="bg-[#fff3e0] text-[#c67c00] text-xs font-semibold px-4 py-1.5 rounded-full border border-[#c67c00]/20 dark:bg-[#3d2800] dark:text-[#ffb74d]">
                    Filling Up Fast
                  </span>
                ) : (
                  <span className="bg-tertiary-fixed/60 text-tertiary text-xs font-semibold px-4 py-1.5 rounded-full border border-tertiary-fixed-dim">
                    Open for Registration
                  </span>
                )}
              </div>
            </div>

            {/* Need more info / Download Syllabus card */}
            <div className="bg-surface-container-lowest rounded-[16px] border border-outline-variant shadow-card p-5 animate-fade-in-up stagger-2 transition-colors duration-300">
              <h3 className="font-semibold text-on-background text-sm mb-1.5">Need more information?</h3>
              <p className="text-xs text-on-surface-variant mb-4 leading-relaxed">
                Download the detailed course syllabus containing grading rubrics, reading lists, and weekly schedules.
              </p>
              <button
                onClick={() => toast.info('Syllabus download will be available soon.')}
                className="w-full flex items-center justify-center gap-2 border-2 border-outline-variant text-on-surface font-body-md-bold py-2.5 rounded-xl hover:bg-surface-container hover:border-primary hover:text-primary transition-all text-sm group"
              >
                <span className="material-symbols-outlined text-[18px] group-hover:animate-bounce">download</span>
                Download Syllabus
              </button>
            </div>

            {/* Instructor card (if available) */}
            {instructor && (
              <div className="bg-surface-container-lowest rounded-[16px] border border-outline-variant shadow-card p-5 animate-fade-in-up stagger-3 transition-colors duration-300">
                <h3 className="font-label-caps text-on-surface-variant uppercase tracking-wider text-[10px] mb-3">Instructor</h3>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-primary-container text-on-primary-container flex items-center justify-center text-sm font-bold border border-primary-fixed-dim shrink-0">
                    {instrInitials || '?'}
                  </div>
                  <div>
                    <p className="font-semibold text-on-background text-sm">{instructor}</p>
                    <p className="text-xs text-on-surface-variant">Lead Instructor</p>
                  </div>
                </div>
              </div>
            )}

          </div>
        </div>

        {/* Mobile action area */}
        <div className="sm:hidden mt-6 space-y-3 animate-fade-in-up stagger-4">
          {isRegistered ? (
            <>
              <div className="flex items-center justify-center gap-2 bg-secondary-fixed border border-secondary-fixed-dim text-primary px-4 py-3.5 rounded-xl text-sm font-body-md-bold">
                <span className="material-symbols-outlined fill text-base">check_circle</span>
                You&apos;re Enrolled
              </div>
              <button
                onClick={() => setDropModal(true)}
                className="w-full border border-error text-error font-body-md-bold py-3 rounded-xl hover:bg-error-container/30 transition-colors text-sm"
              >
                Drop Course
              </button>
            </>
          ) : (
            <button
              onClick={handleRegister}
              disabled={isFull || actionLoading}
              className="w-full bg-primary text-on-primary font-body-md-bold py-3.5 rounded-xl hover:bg-primary-container transition-all active:scale-95 disabled:opacity-50 shadow-burgundy"
            >
              {actionLoading ? 'Registering...' : isFull ? 'Course Full' : 'Register for this Course'}
            </button>
          )}
        </div>
      </div>

      {/* ── Bottom CTA bar (desktop, not registered) ──── */}
      {!isRegistered && (
        <div className="fixed bottom-0 left-0 right-0 z-30 hidden sm:block">
          <div className="bg-surface-container-low/95 backdrop-blur-md border-t border-outline-variant px-6 py-4 shadow-up">
            <div className="max-w-[1440px] mx-auto flex items-center justify-between gap-6">
              <div>
                <p className="font-semibold text-on-background text-sm">Ready to secure your spot?</p>
                <p className="text-xs text-on-surface-variant mt-0.5">
                  {isFull
                    ? 'This course is currently full.'
                    : `${available} seat${available !== 1 ? 's' : ''} remaining — register before it fills up.`
                  }
                </p>
              </div>
              <button
                onClick={handleRegister}
                disabled={isFull || actionLoading}
                className="bg-primary text-on-primary font-body-md-bold px-8 py-3 rounded-xl hover:bg-primary-container transition-all active:scale-95 disabled:opacity-50 text-sm shadow-burgundy inline-flex items-center gap-2 shrink-0"
              >
                <span className="material-symbols-outlined text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>how_to_reg</span>
                {actionLoading ? 'Registering...' : 'Register for this Course'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Drop confirm modal ───────────────────────── */}
      {dropModal && (
        <div
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in"
          onClick={() => setDropModal(false)}
        >
          <div
            className="bg-surface-container-lowest border border-outline-variant rounded-[24px] shadow-[0_20px_60px_rgba(0,0,0,0.2)] max-w-sm w-full p-6 animate-scale-in"
            onClick={e => e.stopPropagation()}
          >
            <div className="w-12 h-12 rounded-full bg-error-container/50 flex items-center justify-center mb-4">
              <span className="material-symbols-outlined text-error text-[22px]">warning</span>
            </div>
            <h3 className="font-bold text-on-background mb-1 text-[18px]">Drop this course?</h3>
            <p className="text-on-surface-variant font-body-md text-sm mb-6 leading-relaxed">
              Are you sure you want to drop{' '}
              <span className="font-semibold text-on-background">{course.course_title}</span>?
              This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setDropModal(false)}
                className="flex-1 border border-outline-variant text-on-surface-variant font-body-md-bold py-2.5 rounded-xl hover:bg-surface-container transition-colors text-sm"
              >
                Cancel
              </button>
              <button
                onClick={handleDrop}
                disabled={actionLoading}
                className="flex-1 bg-error text-on-error font-body-md-bold py-2.5 rounded-xl hover:opacity-90 active:scale-95 transition-all disabled:opacity-50 text-sm"
              >
                {actionLoading ? 'Dropping...' : 'Drop Course'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
