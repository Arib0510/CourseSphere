import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { toast } from 'react-toastify'
import { getStats, getAllRegistrations } from '../../services/adminService'
import Loader from '../../components/common/Loader'

export default function AdminDashboardPage() {
  const [stats, setStats] = useState(null)
  const [recentRegs, setRecentRegs] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      getStats(),
      getAllRegistrations({ limit: 10 })
    ])
      .then(([statsRes, regsRes]) => {
        setStats(statsRes.data.data || statsRes.data)
        const regs = regsRes.data.data || regsRes.data || []
        setRecentRegs(Array.isArray(regs) ? regs.slice(0, 10) : [])
      })
      .catch(() => toast.error('Failed to load dashboard data'))
      .finally(() => setLoading(false))
  }, [])

  const formatDate = (dateStr) => {
    if (!dateStr) return '—'
    return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  }

  if (loading) return <Loader size="lg" />

  const yearGroups = recentRegs.reduce((acc, reg) => {
    const year = reg.course?.academic_year || 'Unknown'
    acc[year] = (acc[year] || 0) + 1
    return acc
  }, {})

  const yearEntries = Object.entries(yearGroups)
  const maxCount = Math.max(...Object.values(yearGroups), 1)

  const PLACEHOLDER_BARS = [
    { label: 'Mon', count: 400, height: '40%' },
    { label: 'Tue', count: 600, height: '60%' },
    { label: 'Wed', count: 300, height: '30%' },
    { label: 'Thu', count: 900, height: '90%' },
    { label: 'Fri', count: 700, height: '70%' },
    { label: 'Sat', count: 500, height: '50%' },
    { label: 'Sun', count: 800, height: '80%' },
  ]

  const barData = yearEntries.length > 0
    ? yearEntries.map(([label, count]) => ({
        label: label.replace(' Year', '').replace('Unknown', 'N/A'),
        count,
        height: `${Math.max((count / maxCount) * 90, 8)}%`,
      }))
    : PLACEHOLDER_BARS

  const highlightIdx = barData.reduce(
    (best, b, i) => (b.count > barData[best].count ? i : best), 0
  )

  const ACTIVITY_VARIANTS = [
    { icon: 'person_add', bg: 'bg-secondary-container', text: 'text-on-secondary-container' },
    { icon: 'task_alt',   bg: 'bg-tertiary-fixed',      text: 'text-tertiary' },
    { icon: 'warning',    bg: 'bg-error-container',      text: 'text-error' },
    { icon: 'download',   bg: 'bg-primary-fixed',        text: 'text-primary' },
  ]

  const today = new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })

  const statCards = [
    {
      label: 'Total Students',
      value: stats?.total_students ?? stats?.totalStudents ?? '—',
      icon: 'people',
      iconBg: 'bg-secondary-container',
      iconText: 'text-on-secondary-container',
      trend: '+5 this month',
    },
    {
      label: 'Total Courses',
      value: stats?.total_courses ?? stats?.totalCourses ?? '—',
      icon: 'menu_book',
      iconBg: 'bg-primary-fixed',
      iconText: 'text-primary',
      trend: '+2 this month',
    },
    {
      label: 'Registrations',
      value: stats?.total_registrations ?? stats?.totalRegistrations ?? '—',
      icon: 'app_registration',
      iconBg: 'bg-tertiary-fixed',
      iconText: 'text-tertiary',
      trend: '+12 this month',
    },
    {
      label: 'Pending',
      value: recentRegs.filter(r => r.status === 'pending').length || '—',
      icon: 'pending_actions',
      iconBg: 'bg-error-container',
      iconText: 'text-error',
      trend: 'Needs review',
    },
  ]

  const quickActions = [
    { label: 'Manage Courses', icon: 'menu_book', to: '/admin/courses', desc: 'Add, edit, or remove courses' },
    { label: 'Manage Students', icon: 'people', to: '/admin/students', desc: 'View student profiles and details' },
    { label: 'Registrations', icon: 'app_registration', to: '/admin/registrations', desc: 'Review and approve requests' },
  ]

  const statusBadge = (status) => {
    if (!status || status === 'pending') return <span className="bg-secondary-fixed text-primary text-xs rounded-full px-2.5 py-0.5 font-body-md-bold">Pending</span>
    if (status === 'approved') return <span className="bg-tertiary-fixed text-tertiary text-xs rounded-full px-2.5 py-0.5 font-body-md-bold">Approved</span>
    return <span className="bg-error-container text-error text-xs rounded-full px-2.5 py-0.5 font-body-md-bold">Dropped</span>
  }

  return (
    <div className="space-y-8 pb-10">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
        <h1 className="font-display text-display text-on-background">Admin Overview</h1>
        <span className="text-on-surface-variant font-body-md text-sm">{today}</span>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
        {statCards.map((card) => (
          <div
            key={card.label}
            className="bg-surface-container-lowest rounded-[24px] border border-outline-variant shadow-[0_4px_20px_rgba(0,0,0,0.03)] p-6 flex flex-col gap-3"
          >
            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${card.iconBg}`}>
              <span className={`material-symbols-outlined text-[20px] ${card.iconText}`}>{card.icon}</span>
            </div>
            <div>
              <p className="font-label-caps text-on-surface-variant uppercase tracking-wider text-xs mb-1">{card.label}</p>
              <p className="font-display text-primary text-[36px] font-[800] leading-none">{card.value}</p>
            </div>
            <p className="text-xs text-on-surface-variant">{card.trend}</p>
          </div>
        ))}
      </div>

      {/* Two-col layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Registrations — 2 cols */}
        <div className="lg:col-span-2 bg-surface-container-lowest rounded-2xl border border-outline-variant p-6 shadow-[0_4px_20px_rgba(0,0,0,0.03)]">
          <h2 className="font-h1 text-h1 text-on-surface mb-4">Recent Registrations</h2>
          {recentRegs.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 gap-2">
              <span className="material-symbols-outlined text-[40px] text-on-surface-variant">app_registration</span>
              <p className="text-on-surface-variant font-body-md text-sm">No registrations yet</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr>
                    <th className="bg-surface-container border-b border-outline-variant font-label-caps text-on-surface-variant uppercase tracking-wider h-[48px] px-4 text-left text-xs">Student</th>
                    <th className="bg-surface-container border-b border-outline-variant font-label-caps text-on-surface-variant uppercase tracking-wider h-[48px] px-4 text-left text-xs">Course</th>
                    <th className="bg-surface-container border-b border-outline-variant font-label-caps text-on-surface-variant uppercase tracking-wider h-[48px] px-4 text-left text-xs">Status</th>
                    <th className="bg-surface-container border-b border-outline-variant font-label-caps text-on-surface-variant uppercase tracking-wider h-[48px] px-4 text-left text-xs">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {recentRegs.map(reg => (
                    <tr key={reg.id} className="hover:bg-surface transition-colors h-[56px] border-b border-outline-variant">
                      <td className="px-4 font-body-md text-on-surface text-sm">
                        {reg.user?.name || reg.student?.name || '—'}
                      </td>
                      <td className="px-4 font-body-md text-on-surface text-sm">
                        <span className="bg-secondary-fixed text-primary text-xs rounded-full px-2.5 py-0.5 font-body-md-bold">
                          {reg.course?.course_no || '—'}
                        </span>
                      </td>
                      <td className="px-4 font-body-md text-on-surface text-sm">
                        {statusBadge(reg.status)}
                      </td>
                      <td className="px-4 font-body-md text-on-surface text-sm text-on-surface-variant">
                        {formatDate(reg.created_at || reg.registered_at)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Quick Actions — 1 col */}
        <div className="lg:col-span-1 bg-surface-container-lowest rounded-2xl border border-outline-variant p-6 shadow-[0_4px_20px_rgba(0,0,0,0.03)]">
          <h2 className="font-h1 text-h1 text-on-surface mb-4">Quick Actions</h2>
          <div className="space-y-0">
            {quickActions.map((action) => (
              <Link
                key={action.to}
                to={action.to}
                className="flex items-center gap-3 p-3 rounded-xl hover:bg-surface-container transition-colors border border-outline-variant mb-3 group"
              >
                <div className="w-10 h-10 rounded-full bg-primary-fixed flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-[20px] text-primary">{action.icon}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-body-md-bold text-on-surface text-sm">{action.label}</p>
                  <p className="text-xs text-on-surface-variant truncate">{action.desc}</p>
                </div>
                <span className="material-symbols-outlined text-[18px] text-on-surface-variant group-hover:text-primary transition-colors">chevron_right</span>
              </Link>
            ))}
          </div>

          {/* Recent Activity */}
          <h3 className="font-label-caps text-on-surface-variant uppercase tracking-wider text-xs mt-6 mb-3">Recent Activity</h3>
          <div className="space-y-3">
            {recentRegs.length === 0 ? (
              <p className="text-sm text-on-surface-variant text-center py-4">No recent activity</p>
            ) : (
              recentRegs.slice(0, 4).map((reg, i) => {
                const v = ACTIVITY_VARIANTS[i % ACTIVITY_VARIANTS.length]
                return (
                  <div key={reg.id} className="flex items-start gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${v.bg}`}>
                      <span className={`material-symbols-outlined text-sm ${v.text}`}>{v.icon}</span>
                    </div>
                    <div>
                      <p className="text-xs text-on-surface">
                        <span className="font-body-md-bold">{reg.user?.name || reg.student?.name || 'Student'}</span>
                        {' '}registered for{' '}
                        <span className="font-body-md-bold">{reg.course?.course_no || 'a course'}</span>
                      </p>
                      <p className="text-xs text-on-surface-variant mt-0.5">
                        {formatDate(reg.created_at || reg.registered_at)}
                      </p>
                    </div>
                  </div>
                )
              })
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
