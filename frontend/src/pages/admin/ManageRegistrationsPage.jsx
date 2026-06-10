import { useEffect, useState, useCallback } from 'react'
import { toast } from 'react-toastify'
import { getAllRegistrations, rejectRegistration } from '../../services/adminService'
import Loader from '../../components/common/Loader'

const STATUS_FILTERS = ['All', 'Pending', 'Approved', 'Dropped']

export default function ManageRegistrationsPage() {
  const [registrations, setRegistrations] = useState([])
  const [loading, setLoading]             = useState(true)
  const [search, setSearch]               = useState('')
  const [yearFilter, setYearFilter]       = useState('')
  const [semFilter, setSemFilter]         = useState('')
  const [statusFilter, setStatusFilter]   = useState('All')

  // Locally track approved + rejecting IDs
  const [approvedIds, setApprovedIds]   = useState(new Set())
  const [rejectingId, setRejectingId]   = useState(null)

  const fetchRegistrations = useCallback(() => {
    setLoading(true)
    const params = {}
    if (yearFilter) params.academic_year = yearFilter
    if (semFilter)  params.semester      = semFilter

    getAllRegistrations(params)
      .then(res => setRegistrations(res.data.data || res.data || []))
      .catch(() => toast.error('Failed to load registrations'))
      .finally(() => setLoading(false))
  }, [yearFilter, semFilter])

  useEffect(() => { fetchRegistrations() }, [fetchRegistrations])

  const handleApprove = (id) => {
    setApprovedIds(prev => new Set([...prev, id]))
    toast.success('Registration approved.')
  }

  const handleReject = async (id) => {
    setRejectingId(id)
    try {
      await rejectRegistration(id)
      setRegistrations(prev => prev.filter(r => (r.registration_id || r.id) !== id))
      setApprovedIds(prev => { const n = new Set(prev); n.delete(id); return n })
      toast.success('Registration rejected and removed.')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to reject registration.')
    } finally {
      setRejectingId(null)
    }
  }

  const fmt = (d) => d
    ? new Date(d).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
    : '—'

  const getEffectiveStatus = (reg) => {
    const id = reg.registration_id || reg.id
    if (approvedIds.has(id)) return 'approved'
    return (reg.status || 'pending').toLowerCase()
  }

  const filtered = registrations.filter(reg => {
    const q = search.toLowerCase()
    const matchesSearch = !search || (
      reg.user?.name?.toLowerCase().includes(q) ||
      reg.student?.name?.toLowerCase().includes(q) ||
      reg.user?.student_id?.toLowerCase().includes(q) ||
      reg.student?.student_id?.toLowerCase().includes(q) ||
      reg.course?.course_no?.toLowerCase().includes(q) ||
      reg.course?.course_title?.toLowerCase().includes(q)
    )
    const effStatus = getEffectiveStatus(reg)
    const matchesStatus =
      statusFilter === 'All' ||
      effStatus === statusFilter.toLowerCase()
    return matchesSearch && matchesStatus
  })

  const getInitials = (name) =>
    name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || '?'

  const statusBadge = (status) => {
    if (status === 'approved') return <span className="bg-tertiary-fixed text-tertiary text-xs rounded-full px-2.5 py-0.5 font-body-md-bold">Approved</span>
    if (status === 'dropped' || status === 'rejected') return <span className="bg-error-container text-error text-xs rounded-full px-2.5 py-0.5 font-body-md-bold">Dropped</span>
    return <span className="bg-secondary-fixed text-primary text-xs rounded-full px-2.5 py-0.5 font-body-md-bold">Pending</span>
  }

  const pillClass = (active) =>
    `px-3 py-1.5 rounded-full text-xs font-body-md-bold transition-colors ${
      active
        ? 'bg-primary text-on-primary shadow-sm'
        : 'bg-surface-container-low border border-outline-variant text-on-surface hover:bg-surface-container-high'
    }`

  return (
    <div className="space-y-8 pb-10">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="font-display text-display text-on-background">Manage Registrations</h1>
        <span className="bg-tertiary-fixed text-tertiary text-sm rounded-full px-3 py-1 font-body-md-bold">
          {filtered.length} registration{filtered.length !== 1 ? 's' : ''}
        </span>
      </div>

      {/* Filter Bar */}
      <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant p-4 flex flex-wrap items-center gap-3">
        {/* Status pills */}
        <div className="flex items-center gap-2 flex-wrap">
          {STATUS_FILTERS.map(s => (
            <button key={s} onClick={() => setStatusFilter(s)} className={pillClass(statusFilter === s)}>
              {s}
            </button>
          ))}
        </div>

        <div className="h-6 w-px bg-outline-variant hidden sm:block" />

        {/* Search */}
        <div className="relative flex items-center gap-3 bg-surface-container-low border border-outline-variant rounded-2xl px-4 py-2.5 flex-1 min-w-[200px] max-w-sm">
          <span className="material-symbols-outlined text-[20px] text-on-surface-variant">search</span>
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search by student, course..."
            className="bg-transparent outline-none text-sm text-on-surface w-full placeholder:text-on-surface-variant font-body-md"
          />
          {search && (
            <button onClick={() => setSearch('')} className="text-on-surface-variant hover:text-on-surface">
              <span className="material-symbols-outlined text-[18px]">close</span>
            </button>
          )}
        </div>

        {/* Year + Semester selects */}
        <select
          value={yearFilter}
          onChange={e => setYearFilter(e.target.value)}
          className="bg-surface-container-low border border-outline-variant rounded-input px-4 py-2.5 focus:ring-2 focus:ring-primary focus:border-transparent text-on-surface font-body-md outline-none text-sm"
        >
          <option value="">All Years</option>
          <option value="1st">1st Year</option>
          <option value="2nd">2nd Year</option>
          <option value="3rd">3rd Year</option>
          <option value="4th">4th Year</option>
          <option value="Elective">Elective</option>
        </select>

        <select
          value={semFilter}
          onChange={e => setSemFilter(e.target.value)}
          className="bg-surface-container-low border border-outline-variant rounded-input px-4 py-2.5 focus:ring-2 focus:ring-primary focus:border-transparent text-on-surface font-body-md outline-none text-sm"
        >
          <option value="">All Semesters</option>
          <option value="Odd">Odd</option>
          <option value="Even">Even</option>
        </select>
      </div>

      {/* Table */}
      {loading ? (
        <Loader />
      ) : filtered.length === 0 ? (
        <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant p-16 flex flex-col items-center justify-center gap-3">
          <span className="material-symbols-outlined text-[48px] text-on-surface-variant">assignment</span>
          <p className="text-on-surface-variant font-body-md text-sm">No registrations found</p>
          {(search || statusFilter !== 'All') && (
            <button
              onClick={() => { setSearch(''); setStatusFilter('All') }}
              className="border border-outline-variant text-on-surface-variant px-4 py-2 rounded-btn font-body-md hover:bg-surface-container transition-colors text-sm"
            >
              Clear filters
            </button>
          )}
        </div>
      ) : (
        <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant overflow-hidden shadow-[0_4px_20px_rgba(0,0,0,0.03)]">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr>
                  <th className="bg-surface-container border-b border-outline-variant font-label-caps text-on-surface-variant uppercase tracking-wider h-[48px] px-4 text-left text-xs">Student</th>
                  <th className="bg-surface-container border-b border-outline-variant font-label-caps text-on-surface-variant uppercase tracking-wider h-[48px] px-4 text-left text-xs hidden md:table-cell">Student ID</th>
                  <th className="bg-surface-container border-b border-outline-variant font-label-caps text-on-surface-variant uppercase tracking-wider h-[48px] px-4 text-left text-xs">Course</th>
                  <th className="bg-surface-container border-b border-outline-variant font-label-caps text-on-surface-variant uppercase tracking-wider h-[48px] px-4 text-left text-xs">Status</th>
                  <th className="bg-surface-container border-b border-outline-variant font-label-caps text-on-surface-variant uppercase tracking-wider h-[48px] px-4 text-left text-xs hidden lg:table-cell">Date</th>
                  <th className="bg-surface-container border-b border-outline-variant font-label-caps text-on-surface-variant uppercase tracking-wider h-[48px] px-4 text-right text-xs">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(reg => {
                  const student   = reg.user || reg.student
                  const id        = reg.registration_id || reg.id
                  const effStatus = getEffectiveStatus(reg)
                  const isPending = effStatus === 'pending'
                  const isApproved = effStatus === 'approved'
                  const isRejecting = rejectingId === id

                  return (
                    <tr key={id} className="hover:bg-surface transition-colors h-[56px] border-b border-outline-variant last:border-0">
                      {/* Student */}
                      <td className="px-4 font-body-md text-on-surface text-sm">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-primary-container text-primary text-xs font-body-md-bold flex items-center justify-center shrink-0">
                            {getInitials(student?.name)}
                          </div>
                          <div className="min-w-0">
                            <p className="font-body-md-bold text-on-surface text-sm truncate">{student?.name || '—'}</p>
                            <p className="text-xs text-on-surface-variant truncate hidden sm:block">{student?.email || ''}</p>
                          </div>
                        </div>
                      </td>

                      {/* Student ID */}
                      <td className="px-4 font-body-md text-on-surface text-sm hidden md:table-cell">
                        <span className="font-mono text-xs text-on-surface-variant">{student?.student_id || '—'}</span>
                      </td>

                      {/* Course */}
                      <td className="px-4 font-body-md text-on-surface text-sm">
                        <div>
                          <span className="bg-secondary-fixed text-primary text-xs rounded-full px-2.5 py-0.5 font-body-md-bold">
                            {reg.course?.course_no || '—'}
                          </span>
                          <p className="text-xs text-on-surface-variant mt-0.5 truncate max-w-[160px] hidden sm:block">
                            {reg.course?.course_title || reg.course?.title || '—'}
                          </p>
                        </div>
                      </td>

                      {/* Status */}
                      <td className="px-4 font-body-md text-on-surface text-sm">
                        {statusBadge(effStatus)}
                      </td>

                      {/* Date */}
                      <td className="px-4 font-body-md text-on-surface-variant text-xs hidden lg:table-cell">
                        {fmt(reg.registered_at || reg.created_at)}
                      </td>

                      {/* Actions */}
                      <td className="px-4 text-right">
                        {(isPending || isApproved) ? (
                          <div className="flex items-center justify-end gap-2">
                            {isPending && (
                              <button
                                onClick={() => handleApprove(id)}
                                className="bg-primary text-on-primary px-3 py-1.5 rounded-btn font-body-md-bold hover:bg-primary/90 transition-colors text-xs"
                              >
                                Approve
                              </button>
                            )}
                            {isApproved && (
                              <span className="text-xs text-tertiary font-body-md-bold bg-tertiary-fixed rounded-full px-2.5 py-0.5">
                                Approved
                              </span>
                            )}
                            <button
                              onClick={() => handleReject(id)}
                              disabled={isRejecting}
                              className="border border-error text-error px-3 py-1.5 rounded-btn font-body-md-bold hover:bg-error-container transition-colors text-xs disabled:opacity-60 flex items-center gap-1"
                            >
                              {isRejecting
                                ? <div className="w-3 h-3 border-2 border-error border-t-transparent rounded-full animate-spin" />
                                : null}
                              Reject
                            </button>
                          </div>
                        ) : (
                          <span className="text-xs text-on-surface-variant font-body-md italic">Closed</span>
                        )}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
