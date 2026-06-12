// Tarik's student Panel Frontend
import { useEffect, useState } from 'react'
import { ClipboardList, Trash2, BookOpen, CreditCard, Calendar } from 'lucide-react'
import { toast } from 'react-toastify'
import { getMyRegistrations, dropCourse } from '../../services/registrationService'
import Loader from '../../components/common/Loader'
import Modal from '../../components/common/Modal'
import Button from '../../components/common/Button'

export default function RegistrationsPage() {
  const [registrations, setRegistrations] = useState([])
  const [loading, setLoading] = useState(true)
  const [dropping, setDropping] = useState(null)
  const [confirmModal, setConfirmModal] = useState({ open: false, reg: null })

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

  const handleDropClick = (reg) => {
    setConfirmModal({ open: true, reg })
  }

  const handleConfirmDrop = async () => {
    const reg = confirmModal.reg
    if (!reg) return
    setDropping(reg.id)
    setConfirmModal({ open: false, reg: null })
    try {
      await dropCourse(reg.id)
      setRegistrations(prev => prev.filter(r => r.id !== reg.id))
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

  if (loading) return <Loader size="lg" />

  return (
    <div className="pt-4 space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#2E2A27] mb-1">My Registrations</h1>
          <p className="text-[#6B625C] text-sm">Manage your enrolled courses for this semester.</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="bg-[#F9ECEE] border border-[#8B2E3C]/20 rounded-xl px-4 py-2 flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-[#8B2E3C]" />
            <span className="text-sm font-semibold text-[#8B2E3C]">{registrations.length} Courses</span>
          </div>
          <div className="bg-[#F5F3FF] border border-violet-200 rounded-xl px-4 py-2 flex items-center gap-2">
            <CreditCard className="w-4 h-4 text-[#A78BCF]" />
            <span className="text-sm font-semibold text-[#A78BCF]">{totalCredits.toFixed(1)} Credits</span>
          </div>
        </div>
      </div>

      {registrations.length === 0 ? (
        <div className="bg-white rounded-xl border border-[#E7DED6] p-12 text-center shadow-sm">
          <div className="w-14 h-14 rounded-2xl bg-[#F0F9FF] flex items-center justify-center mx-auto mb-4">
            <ClipboardList className="w-7 h-7 text-[#7CB9C8]" />
          </div>
          <h3 className="font-semibold text-[#2E2A27] mb-2">No registrations yet</h3>
          <p className="text-sm text-[#6B625C]">
            You haven&apos;t registered for any courses. Visit Browse Courses to get started.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {registrations.map(reg => (
            <div
              key={reg.id}
              className="bg-white rounded-xl border border-[#E7DED6] border-l-4 border-l-[#4C956C] p-5 shadow-sm hover:shadow-md transition-shadow flex flex-col"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex flex-wrap gap-1.5">
                  <span className="bg-[#F9ECEE] text-[#8B2E3C] text-xs font-semibold px-2 py-0.5 rounded-full">
                    {reg.course?.course_no}
                  </span>
                  {reg.course?.academic_year && (
                    <span className="bg-[#F0F9FF] text-[#7CB9C8] text-xs font-semibold px-2 py-0.5 rounded-full">
                      {reg.course.academic_year}
                    </span>
                  )}
                </div>
                <button
                  onClick={() => handleDropClick(reg)}
                  disabled={dropping === reg.id}
                  className="p-1.5 rounded-lg text-[#C65A5A] hover:bg-red-50 transition-colors disabled:opacity-50"
                  title="Drop course"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
              <h3 className="font-bold text-[#2E2A27] text-sm mb-2 flex-grow">{reg.course?.title}</h3>
              <div className="flex flex-wrap gap-3 text-xs text-[#6B625C] mt-1">
                <span className="flex items-center gap-1">
                  <CreditCard className="w-3.5 h-3.5" />
                  {reg.course?.credit_hours} credits
                </span>
                {reg.course?.class_hours && (
                  <span className="flex items-center gap-1">
                    <BookOpen className="w-3.5 h-3.5" />
                    {reg.course.class_hours} hrs/wk
                  </span>
                )}
                {reg.course?.semester && (
                  <span>{reg.course.semester} Sem</span>
                )}
              </div>
              <div className="mt-3 pt-3 border-t border-[#E7DED6] flex items-center gap-1.5 text-xs text-[#9A9189]">
                <Calendar className="w-3.5 h-3.5" />
                Registered {formatDate(reg.created_at || reg.registered_at)}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Confirm Drop Modal */}
      <Modal
        isOpen={confirmModal.open}
        onClose={() => setConfirmModal({ open: false, reg: null })}
        title="Drop Course"
        size="sm"
      >
        <div className="space-y-4">
          <p className="text-sm text-[#6B625C]">
            Are you sure you want to drop{' '}
            <span className="font-semibold text-[#2E2A27]">
              {confirmModal.reg?.course?.course_no} — {confirmModal.reg?.course?.title}
            </span>
            ? This action cannot be undone.
          </p>
          <div className="flex gap-3 justify-end">
            <Button
              variant="ghost"
              onClick={() => setConfirmModal({ open: false, reg: null })}
            >
              Cancel
            </Button>
            <Button variant="danger" onClick={handleConfirmDrop}>
              <Trash2 className="w-4 h-4" />
              Drop Course
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
