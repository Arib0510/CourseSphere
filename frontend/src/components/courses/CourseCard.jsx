import { useState } from 'react'
import { Link } from 'react-router-dom'
import { registerCourse } from '../../services/registrationService'
import { toast } from 'react-toastify'

export default function CourseCard({ course, registeredIds, onRegisterSuccess }) {
  const [loading, setLoading] = useState(false)
  const isRegistered  = registeredIds.includes(course.id)
  const enrolledCount = course.enrolled_count || 0
  const capacity      = course.capacity || 0
  const isFull        = capacity > 0 && enrolledCount >= capacity
  const enrolledPct   = capacity ? Math.min((enrolledCount / capacity) * 100, 100) : 0

  const instructor = course.teacher_name || course.instructor_name || course.instructor || null

  const handleRegister = async () => {
    if (isRegistered || isFull) return
    setLoading(true)
    try {
      await registerCourse(course.id)
      toast.success(`Registered for ${course.course_no}!`)
      onRegisterSuccess(course.id)
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <article className="bg-surface-container-lowest rounded-2xl border border-outline-variant p-5 shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:shadow-[0_8px_30px_rgba(108,22,39,0.08)] transition-all duration-300 flex flex-col h-full group relative overflow-hidden">
      {/* Badge row */}
      <div className="flex items-start justify-between mb-3 gap-2">
        <div className="flex gap-1.5 flex-wrap">
          {course.category && (
            <span className="bg-secondary-fixed text-primary px-2.5 py-1 rounded text-xs font-semibold tracking-wide">
              {course.category}
            </span>
          )}
          {course.academic_year && (
            <span className="bg-surface-container-high text-on-surface px-2.5 py-1 rounded text-xs font-semibold">
              {course.academic_year}
            </span>
          )}
        </div>
        {/* Course number top-right */}
        <span className="text-on-surface-variant text-sm font-medium shrink-0 ml-auto">
          {course.course_no}
        </span>
      </div>

      {/* Title */}
      <h3 className="text-[15px] font-[600] text-on-surface leading-tight mb-4 group-hover:text-primary transition-colors">
        {course.course_title}
      </h3>

      {/* Description */}
      {course.description ? (
        <p className="text-sm text-on-surface-variant mb-3 flex-grow line-clamp-3 leading-relaxed font-body-md">
          {course.description}
        </p>
      ) : (
        <div className="flex-grow" />
      )}

      {/* Credit / Hours chips */}
      <div className="flex flex-wrap gap-2 mb-4">
        {(course.credits ?? course.credit_hours) && (
          <span className="inline-flex items-center gap-1 text-xs text-on-surface-variant bg-surface-variant px-2 py-1 rounded">
            <span className="material-symbols-outlined text-[14px]">military_tech</span>
            {course.credits ?? course.credit_hours} credits
          </span>
        )}
        {course.class_hours && (
          <span className="inline-flex items-center gap-1 text-xs text-on-surface-variant bg-surface-variant px-2 py-1 rounded">
            <span className="material-symbols-outlined text-[14px]">schedule</span>
            {course.class_hours} hrs/wk
          </span>
        )}
        {course.semester && (
          <span className="inline-flex items-center gap-1 text-xs text-on-surface-variant bg-surface-variant px-2 py-1 rounded">
            <span className="material-symbols-outlined text-[14px]">swap_vert</span>
            {course.semester} Sem
          </span>
        )}
        {instructor && (
          <span className="inline-flex items-center gap-1 text-xs text-on-surface-variant bg-surface-variant px-2 py-1 rounded">
            <span className="material-symbols-outlined text-[14px]">person</span>
            {instructor}
          </span>
        )}
      </div>

      {/* Capacity bar */}
      {capacity > 0 && (
        <div className="mb-4">
          <div className="flex justify-between text-xs text-on-surface-variant mb-1.5">
            <span>Seats</span>
            <span>{enrolledCount}/{capacity}</span>
          </div>
          <div className="h-1.5 w-full bg-surface-variant rounded-full overflow-hidden">
            <div
              className="h-full bg-primary rounded-full transition-all"
              style={{ width: `${enrolledPct}%` }}
            />
          </div>
        </div>
      )}

      {/* Footer: details link + register button */}
      <div className="border-t border-outline-variant pt-4 flex justify-between items-center mt-auto gap-3">
        <Link
          to={`/courses/${course.id}`}
          className="text-xs font-semibold text-primary hover:underline flex items-center gap-1"
        >
          <span className="material-symbols-outlined text-sm">open_in_new</span>
          Details
        </Link>
        <button
          onClick={handleRegister}
          disabled={isRegistered || isFull || loading}
          className={`shrink-0 py-2.5 px-4 rounded-xl font-body-md-bold text-sm transition-all duration-200 active:scale-95 flex items-center justify-center gap-1.5 ${
            isRegistered
              ? 'bg-secondary-fixed text-primary border border-secondary-fixed-dim cursor-default'
              : isFull
              ? 'bg-surface-container text-on-surface-variant cursor-not-allowed'
              : loading
              ? 'bg-primary/80 text-on-primary cursor-wait'
              : 'bg-primary hover:bg-primary-container text-on-primary'
          }`}
        >
          {isRegistered ? (
            <>
              <span className="material-symbols-outlined fill text-[16px]">check_circle</span>
              Registered
            </>
          ) : isFull ? (
            'Class Full'
          ) : loading ? (
            'Registering...'
          ) : (
            'Register'
          )}
        </button>
      </div>
    </article>
  )
}
