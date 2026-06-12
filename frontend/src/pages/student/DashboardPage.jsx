// Tarik's student Panel Frontend
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { getMyRegistrations } from '../../services/registrationService'
import Loader from '../../components/common/Loader'

const COURSE_ICONS = ['computer', 'memory', 'calculate', 'biotech', 'science', 'engineering']
const ICON_BG_VARIANTS = [
  'bg-cs-primary-light text-cs-primary',
  'bg-[#ecdfe1] text-[#655c5e]',
  'bg-[#e9f5e9] text-[#2e7d32]',
  'bg-[#fff3e0] text-[#e65100]',
]

const CHART_BARS = [
  { day: 'Mon', label: '2h',   height: '40%', active: false },
  { day: 'Tue', label: '3h',   height: '60%', active: false },
  { day: 'Wed', label: '5h',   height: '90%', active: true  },
  { day: 'Thu', label: '2.5h', height: '50%', active: false },
  { day: 'Fri', label: '1.5h', height: '30%', active: false },
]

export default function DashboardPage() {
  const { user } = useAuth()
  const [registrations, setRegistrations] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getMyRegistrations()
      .then(res => setRegistrations(res.data.data || res.data || []))
      .catch(() => setRegistrations([]))
      .finally(() => setLoading(false))
  }, [])

  const totalCredits = registrations.reduce((sum, r) => sum + (r.course?.credit_hours || 0), 0)

  if (loading) return <Loader />

  return (
    <div className="space-y-6 pt-4">
      {/* Welcome Header */}
      <header className="mt-2">
        <h1 className="text-4xl font-bold text-cs-primary tracking-tight">
          Welcome back, {user?.name?.split(' ')[0] || 'Student'} 👋
        </h1>
        <p className="text-cs-on-sv mt-1 text-base">
          Jump into your coursework and track your progress.
        </p>
      </header>

      {/* Metric Cards — Bento Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* Card 1: Courses Registered */}
        <div className="bg-cs-primary-light border border-cs-primary/20 rounded-xl p-5 flex flex-col gap-3 shadow-card hover:shadow-card-hover transition-shadow">
          <div className="w-10 h-10 rounded-full bg-cs-surface flex items-center justify-center text-cs-primary shadow-sm">
            <span className="material-symbols-outlined fill">book</span>
          </div>
          <div>
            <p className="text-[10px] font-bold text-cs-on-sv uppercase tracking-wider">
              Courses Registered
            </p>
            <p className="text-3xl font-bold text-cs-on-surface mt-1">{registrations.length}</p>
          </div>
        </div>

        {/* Card 2: Credits Taken */}
        <div className="bg-[#f5ece7] border border-cs-border/50 rounded-xl p-5 flex flex-col gap-3 shadow-card hover:shadow-card-hover transition-shadow">
          <div className="w-10 h-10 rounded-full bg-cs-surface flex items-center justify-center text-[#655c5e] shadow-sm">
            <span className="material-symbols-outlined fill">grade</span>
          </div>
          <div>
            <p className="text-[10px] font-bold text-cs-on-sv uppercase tracking-wider">
              Credits Taken
            </p>
            <p className="text-3xl font-bold text-cs-on-surface mt-1">{totalCredits.toFixed(1)}</p>
          </div>
        </div>

        {/* Card 3: Current Semester */}
        <div className="bg-[#ecdfe1]/30 border border-cs-border/50 rounded-xl p-5 flex flex-col gap-3 shadow-card hover:shadow-card-hover transition-shadow">
          <div className="w-10 h-10 rounded-full bg-cs-surface flex items-center justify-center text-[#655c5e] shadow-sm">
            <span className="material-symbols-outlined fill">calendar_month</span>
          </div>
          <div>
            <p className="text-[10px] font-bold text-cs-on-sv uppercase tracking-wider">
              Current Semester
            </p>
            <p className="text-lg font-bold text-cs-on-surface mt-1">Spring 2025</p>
          </div>
        </div>

        {/* Card 4: Registration Deadline */}
        <div className="bg-cs-surface border border-cs-border/50 rounded-xl p-5 flex flex-col gap-3 shadow-card hover:shadow-card-hover transition-shadow">
          <div className="w-10 h-10 rounded-full bg-[#ffdad6]/50 flex items-center justify-center text-[#ba1a1a] shadow-sm">
            <span className="material-symbols-outlined fill">timer</span>
          </div>
          <div>
            <p className="text-[10px] font-bold text-cs-on-sv uppercase tracking-wider">
              Registration Deadline
            </p>
            <p className="text-lg font-bold text-cs-on-surface mt-1">June 30</p>
          </div>
        </div>
      </div>

      {/* Content Split */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Keep Learning — 2/3 */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-cs-on-surface">Keep Learning</h2>
            <Link
              to="/courses"
              className="p-2 hover:bg-cs-surface-hi rounded-full text-cs-on-sv transition-colors"
            >
              <span className="material-symbols-outlined">more_vert</span>
            </Link>
          </div>

          {registrations.length === 0 ? (
            <div className="bg-cs-surface border border-cs-border rounded-xl p-8 text-center shadow-card">
              <span className="material-symbols-outlined text-4xl text-cs-muted mb-2 block">
                menu_book
              </span>
              <p className="text-sm text-cs-on-sv mb-3">No courses registered yet.</p>
              <Link
                to="/courses"
                className="inline-flex items-center gap-2 bg-cs-primary text-white px-4 py-2 rounded-xl text-sm font-semibold hover:opacity-90 transition-opacity active:scale-95 duration-150"
              >
                Browse Courses
              </Link>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {registrations.slice(0, 4).map((reg, i) => (
                <div
                  key={reg.id}
                  className="bg-cs-surface border border-cs-border rounded-xl p-4 flex items-center gap-4 hover:shadow-card-hover transition-all cursor-pointer group"
                >
                  <div
                    className={`w-12 h-12 rounded-lg flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform ${ICON_BG_VARIANTS[i % ICON_BG_VARIANTS.length]}`}
                  >
                    <span className="material-symbols-outlined">
                      {COURSE_ICONS[i % COURSE_ICONS.length]}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-cs-on-surface text-sm truncate">
                      {reg.course?.course_title || reg.course?.title || 'Course'}
                    </h4>
                    <p className="text-xs text-cs-on-sv mt-0.5">
                      {reg.course?.course_no} · {reg.course?.credit_hours || reg.course?.credits} credits
                    </p>
                  </div>
                  <div className="px-3 py-1 bg-cs-surface-hi border border-cs-border rounded-full flex items-center gap-1.5 shrink-0">
                    <span className="w-2 h-2 rounded-full bg-[#E5B869]" />
                    <span className="text-[10px] font-bold text-cs-on-sv">In Progress</span>
                  </div>
                </div>
              ))}
              {registrations.length > 4 && (
                <Link
                  to="/registrations"
                  className="text-sm text-cs-primary font-semibold hover:underline text-center mt-1"
                >
                  View all {registrations.length} courses →
                </Link>
              )}
            </div>
          )}
        </div>

        {/* Learning Analytics — 1/3 */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-cs-on-surface">Learning Analytics</h2>
          <div
            className="bg-cs-surface border border-cs-border rounded-xl p-5 flex flex-col shadow-card"
            style={{ minHeight: '300px' }}
          >
            <div>
              <p className="text-[10px] font-bold text-cs-on-sv uppercase tracking-wider">
                Weekly Progress
              </p>
              <p className="font-semibold text-cs-on-surface mt-1">Avg 4 hours per day</p>
            </div>
            <div className="flex items-end justify-between flex-1 mt-6 gap-2">
              {CHART_BARS.map(({ day, label, height, active }) => (
                <div key={day} className="flex-1 relative group cursor-pointer">
                  <div
                    className={`w-full rounded-t-md transition-colors ${
                      active
                        ? 'bg-cs-primary'
                        : 'bg-cs-surface-hi hover:bg-cs-primary-light'
                    }`}
                    style={{
                      height,
                      boxShadow: active ? '0 4px 12px rgba(108,22,39,0.3)' : undefined,
                    }}
                  />
                  <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-cs-on-surface text-cs-surface text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap">
                    {label}
                  </div>
                </div>
              ))}
            </div>
            <div className="flex justify-between text-[10px] font-bold text-cs-on-sv uppercase tracking-wider mt-3 pt-2 border-t border-cs-border/30">
              {CHART_BARS.map(({ day, active }) => (
                <span key={day} className={active ? 'text-cs-primary font-black' : ''}>
                  {day}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
