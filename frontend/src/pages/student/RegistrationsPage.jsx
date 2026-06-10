import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { toast } from 'react-toastify'
import { getMyRegistrations, dropCourse } from '../../services/registrationService'
import { useAuth } from '../../context/AuthContext'
import Loader from '../../components/common/Loader'
import Modal from '../../components/common/Modal'
import Button from '../../components/common/Button'
import { generateRegistrationPDF } from '../../utils/generateRegistrationPDF'

export default function RegistrationsPage() {
  const { user } = useAuth()
  const [registrations, setRegistrations] = useState([])
  const [loading, setLoading] = useState(true)
  const [dropping, setDropping] = useState(null)
  const [confirmModal, setConfirmModal] = useState({ open: false, reg: null })
  const [generatingPDF, setGeneratingPDF] = useState(false)

  useEffect(() => {
    fetchRegistrations()
  }, [])

  const fetchRegistrations = () => {
    setLoading(true)
    getMyRegistrations()
      .then(res => setRegistrations(res.data.data || res.data || []))
      .catch(() => {
        setRegistrations([])
        toast.error('Failed to load registrations')
      })
      .finally(() => setLoading(false))
  }

  const getRegId = (reg) => reg.id || reg.registration_id

  const handleDropClick = (reg) => {
    setConfirmModal({ open: true, reg })
  }

  const handleConfirmDrop = async () => {
    const reg = confirmModal.reg
    if (!reg) return
    const regId = getRegId(reg)
    setDropping(regId)
    setConfirmModal({ open: false, reg: null })
    try {
      await dropCourse(regId)
      setRegistrations(prev => prev.filter(r => getRegId(r) !== regId))
      toast.success(`Dropped ${reg.course?.course_no || 'course'} successfully`)
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to drop course')
    } finally {
      setDropping(null)
    }
  }

  const totalCredits = registrations.reduce((sum, r) => sum + (r.course?.credit_hours || 0), 0)

  const formatDate = (dateStr) => {
    if (!dateStr) return '—'
    return new Date(dateStr).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
  }

  const handleGeneratePDF = async () => {
    if (registrations.length === 0) {
      toast.info('No registered courses to include in the form.')
      return
    }
    setGeneratingPDF(true)
    try {
      const extras = {
        registrationNo:  user?.registration_no  || '',
        academicSession: user?.academic_session  || '',
        earnedCredits:   user?.earned_credits    != null ? Number(user.earned_credits) : null,
        backlogCount:    user?.backlog_count      != null ? Number(user.backlog_count)  : null,
      }
      generateRegistrationPDF(user, registrations, extras)
      toast.success('Registration form downloaded!')
    } catch {
      toast.error('Failed to generate PDF. Please try again.')
    } finally {
      setGeneratingPDF(false)
    }
  }

  if (loading) return <Loader size="lg" />

  return (
    <div className="pt-4 space-y-8">
      {/* Page Header */}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="font-display text-display text-on-background mb-2">My Registrations</h1>
          <p className="text-on-surface-variant font-body-md">Manage your enrolled courses for this semester.</p>
        </div>

        {/* Summary Chips + PDF Button */}
        <div className="flex items-center gap-3 flex-wrap">
          <span className="inline-flex items-center gap-2 px-4 py-2 bg-surface-container-high rounded-full border border-outline-variant shadow-sm font-body-md text-sm text-on-surface">
            <span className="material-symbols-outlined text-primary text-[18px]">menu_book</span>
            <span className="font-body-md-bold text-primary">{registrations.length}</span>
            Courses
          </span>
          <span className="inline-flex items-center gap-2 px-4 py-2 bg-surface-container-high rounded-full border border-outline-variant shadow-sm font-body-md text-sm text-on-surface">
            <span className="material-symbols-outlined text-tertiary text-[18px]">military_tech</span>
            <span className="font-body-md-bold text-tertiary">{totalCredits.toFixed(1)}</span>
            Credits
          </span>

          {/* Generate PDF button — only shows when there are registrations */}
          {registrations.length > 0 && (
            <button
              onClick={handleGeneratePDF}
              disabled={generatingPDF}
              className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-on-primary rounded-full font-body-md-bold text-sm shadow-sm hover:bg-primary/90 active:scale-95 transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              <span className="material-symbols-outlined text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                {generatingPDF ? 'progress_activity' : 'picture_as_pdf'}
              </span>
              {generatingPDF ? 'Generating…' : 'Download Form'}
            </button>
          )}
        </div>
      </div>

      {/* Content */}
      {registrations.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="w-16 h-16 rounded-2xl bg-surface-container flex items-center justify-center mx-auto mb-4">
            <span className="material-symbols-outlined text-3xl text-on-surface-variant">assignment</span>
          </div>
          <h3 className="font-h2 text-h2 text-on-background mb-2">No registrations yet</h3>
          <p className="text-on-surface-variant font-body-md mb-6 max-w-sm">
            You haven&apos;t registered for any courses. Visit Browse Courses to get started.
          </p>
          <Link
            to="/courses"
            className="inline-flex items-center gap-2 bg-primary text-on-primary rounded-btn font-body-md-bold px-5 py-2.5 hover:bg-primary-container transition-colors"
          >
            <span className="material-symbols-outlined text-[18px]">explore</span>
            Browse Courses
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {registrations.map((reg, idx) => {
            const regId = getRegId(reg)
            const isDropping = dropping === regId
            return (
              <div
                key={regId ?? idx}
                className="bg-surface-container-lowest rounded-[16px] border border-outline-variant shadow-[0_4px_20px_rgba(0,0,0,0.05)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.08)] transition-all duration-300 flex flex-col overflow-hidden relative group"
              >
                {/* Accent bar */}
                <div className="absolute top-0 left-0 w-full h-[6px] bg-tertiary-container" />

                <div className="p-6 pt-8 flex flex-col flex-1">
                  {/* Category + course no */}
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex flex-wrap gap-1.5">
                      <span className="font-label-caps text-primary text-[10px] uppercase tracking-wider bg-primary-fixed px-2 py-0.5 rounded">
                        {reg.course?.course_no}
                      </span>
                      {reg.course?.academic_year && (
                        <span className="font-label-caps text-on-surface-variant text-[10px] uppercase tracking-wider bg-surface-container-high px-2 py-0.5 rounded border border-outline-variant">
                          {reg.course.academic_year}
                        </span>
                      )}
                    </div>
                    <button
                      onClick={() => handleDropClick(reg)}
                      disabled={isDropping}
                      className="p-1.5 rounded-lg text-error hover:bg-error-container transition-colors disabled:opacity-50"
                      title="Drop course"
                    >
                      <span className="material-symbols-outlined text-[18px]">delete_outline</span>
                    </button>
                  </div>

                  {/* Title */}
                  <h3 className="font-h2 text-h2 text-on-background text-[16px] mb-4 flex-grow leading-snug">
                    {reg.course?.course_title || reg.course?.title}
                  </h3>

                  {/* Key-value rows */}
                  <div className="space-y-2 mb-4">
                    {reg.course?.credit_hours && (
                      <div className="flex items-center justify-between py-2 border-b border-outline-variant">
                        <span className="font-label-caps text-on-surface-variant text-[10px] uppercase tracking-wider flex items-center gap-1.5">
                          <span className="material-symbols-outlined text-[14px]">military_tech</span>
                          Credits
                        </span>
                        <span className="font-body-md-bold text-on-background text-sm">{reg.course.credit_hours}</span>
                      </div>
                    )}
                    {reg.course?.semester && (
                      <div className="flex items-center justify-between py-2 border-b border-outline-variant">
                        <span className="font-label-caps text-on-surface-variant text-[10px] uppercase tracking-wider flex items-center gap-1.5">
                          <span className="material-symbols-outlined text-[14px]">swap_vert</span>
                          Semester
                        </span>
                        <span className="font-body-md-bold text-on-background text-sm">{reg.course.semester}</span>
                      </div>
                    )}
                    {reg.course?.academic_year && (
                      <div className="flex items-center justify-between py-2 border-b border-outline-variant">
                        <span className="font-label-caps text-on-surface-variant text-[10px] uppercase tracking-wider flex items-center gap-1.5">
                          <span className="material-symbols-outlined text-[14px]">school</span>
                          Year
                        </span>
                        <span className="font-body-md-bold text-on-background text-sm">{reg.course.academic_year}</span>
                      </div>
                    )}
                    <div className="flex items-center justify-between py-2">
                      <span className="font-label-caps text-on-surface-variant text-[10px] uppercase tracking-wider flex items-center gap-1.5">
                        <span className="material-symbols-outlined text-[14px]">calendar_today</span>
                        Registered
                      </span>
                      <span className="font-body-md text-on-surface-variant text-sm">
                        {formatDate(reg.registered_at || reg.created_at)}
                      </span>
                    </div>
                  </div>

                  {/* Drop button */}
                  <button
                    onClick={() => handleDropClick(reg)}
                    disabled={isDropping}
                    className="w-full py-3 px-4 rounded-lg border border-error text-error font-body-md-bold hover:bg-error-container flex items-center justify-center gap-2 transition-colors disabled:opacity-50 mt-auto"
                  >
                    {isDropping
                      ? <div className="w-4 h-4 border-2 border-error border-t-transparent rounded-full animate-spin" />
                      : <span className="material-symbols-outlined text-[18px]">remove_circle_outline</span>}
                    {isDropping ? 'Dropping…' : 'Drop Course'}
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Confirm Drop Modal */}
      <Modal
        isOpen={confirmModal.open}
        onClose={() => setConfirmModal({ open: false, reg: null })}
        title="Drop Course"
        size="sm"
      >
        <div className="space-y-6">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-full bg-error-container flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-error text-[20px]">warning</span>
            </div>
            <p className="text-on-surface-variant font-body-md text-sm leading-relaxed pt-1">
              Are you sure you want to drop{' '}
              <span className="font-body-md-bold text-on-background">
                {confirmModal.reg?.course?.course_no} &mdash; {confirmModal.reg?.course?.title || confirmModal.reg?.course?.course_title}
              </span>
              ? This action cannot be undone.
            </p>
          </div>
          <div className="flex gap-3 justify-end">
            <Button
              variant="ghost"
              onClick={() => setConfirmModal({ open: false, reg: null })}
            >
              Cancel
            </Button>
            <Button variant="danger" onClick={handleConfirmDrop}>
              <span className="material-symbols-outlined text-[18px]">delete</span>
              Drop Course
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
