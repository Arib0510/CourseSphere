import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { getMyRegistrations } from '../../services/registrationService'
import Loader from '../../components/common/Loader'

const COURSE_ICONS = ['computer', 'memory', 'calculate', 'biotech', 'science', 'engineering']

// Typical full-semester credit load; used as the 100% benchmark
const FULL_LOAD = 21

// Category colour tokens (Tailwind classes)
const CAT_COLORS = {
  Core:      { bg: 'bg-primary',             text: 'text-primary',             bar: 'bg-primary' },
  Elective:  { bg: 'bg-tertiary-fixed',       text: 'text-tertiary',            bar: 'bg-tertiary' },
  Optional:  { bg: 'bg-secondary-container',  text: 'text-on-secondary-container', bar: 'bg-secondary-container' },
  Theory:    { bg: 'bg-primary-fixed',        text: 'text-primary',             bar: 'bg-primary' },
  Sessional: { bg: 'bg-tertiary-fixed',       text: 'text-tertiary',            bar: 'bg-tertiary' },
  Other:     { bg: 'bg-surface-container',    text: 'text-on-surface-variant',  bar: 'bg-outline-variant' },
}
const catColor = (cat) => CAT_COLORS[cat] || CAT_COLORS.Other

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

  // ── Derived metrics ────────────────────────────────────────────────────
  const totalCredits = useMemo(
    () => registrations.reduce((s, r) => s + Number(r.course?.credits || r.course?.credit_hours || 0), 0),
    [registrations]
  )

  // Dominant semester: most-frequent academic_year × semester pair
  const semesterInfo = useMemo(() => {
    if (!registrations.length) return null
    const freq = {}
    registrations.forEach(r => {
      const y = r.course?.academic_year || ''
      const s = r.course?.semester      || ''
      if (y || s) {
        const k = `${y}|||${s}`
        freq[k] = (freq[k] || 0) + 1
      }
    })
    const top = Object.entries(freq).sort((a, b) => b[1] - a[1])[0]
    if (!top) return null
    const [y, s] = top[0].split('|||')
    return { year: y, sem: s }
  }, [registrations])

  const semLabel = semesterInfo
    ? [semesterInfo.year, semesterInfo.sem ? `${semesterInfo.sem} Sem` : ''].filter(Boolean).join(' · ')
    : '—'

  // Credits grouped by category, sorted descending
  const creditsByCategory = useMemo(() => {
    const map = {}
    registrations.forEach(r => {
      const cat = r.course?.category || 'Other'
      if (!map[cat]) map[cat] = { credits: 0, count: 0 }
      map[cat].credits += Number(r.course?.credits || r.course?.credit_hours || 0)
      map[cat].count   += 1
    })
    return Object.entries(map)
      .map(([cat, v]) => ({ cat, ...v }))
      .sort((a, b) => b.credits - a.credits)
  }, [registrations])

  const maxCatCredits = creditsByCategory.reduce((m, c) => Math.max(m, c.credits), 0)
  const creditPct     = Math.min((totalCredits / FULL_LOAD) * 100, 100)

  if (loading) return <Loader />

  return (
    <div className="space-y-6 pt-4">
      {/* Welcome Header */}
      <header className="mt-2">
        <h1 className="font-display text-display text-primary tracking-tight">
          Welcome back, {user?.name?.split(' ')[0] || 'Student'}
        </h1>
        <p className="text-on-surface-variant font-body-md mt-1">
          Jump into your coursework and track your progress.
        </p>
      </header>

      {/* Metric Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {/* Courses Registered */}
        <div className="bg-surface-container-lowest rounded-[24px] p-6 border border-secondary-fixed-dim shadow-[0_4px_20px_rgba(0,0,0,0.03)] flex flex-col gap-4 hover:shadow-[0_6px_24px_rgba(0,0,0,0.06)] transition-shadow">
          <div className="w-10 h-10 rounded-full bg-secondary-container flex items-center justify-center">
            <span className="material-symbols-outlined fill text-on-secondary-container text-[20px]">menu_book</span>
          </div>
          <div>
            <p className="font-label-caps text-on-surface-variant uppercase tracking-wider text-[10px]">Courses Registered</p>
            <p className="font-h1 text-h1 text-on-background mt-1">{registrations.length}</p>
          </div>
        </div>

        {/* Credits Taken */}
        <div className="bg-surface-container-lowest rounded-[24px] p-6 border border-secondary-fixed-dim shadow-[0_4px_20px_rgba(0,0,0,0.03)] flex flex-col gap-4 hover:shadow-[0_6px_24px_rgba(0,0,0,0.06)] transition-shadow">
          <div className="w-10 h-10 rounded-full bg-tertiary-fixed flex items-center justify-center">
            <span className="material-symbols-outlined fill text-tertiary text-[20px]">military_tech</span>
          </div>
          <div>
            <p className="font-label-caps text-on-surface-variant uppercase tracking-wider text-[10px]">Credits Enrolled</p>
            <p className="font-h1 text-h1 text-tertiary mt-1">{totalCredits.toFixed(1)}</p>
          </div>
        </div>

        {/* Current Semester — dynamic from registered courses */}
        <div className="bg-surface-container-lowest rounded-[24px] p-6 border border-secondary-fixed-dim shadow-[0_4px_20px_rgba(0,0,0,0.03)] flex flex-col gap-4 hover:shadow-[0_6px_24px_rgba(0,0,0,0.06)] transition-shadow">
          <div className="w-10 h-10 rounded-full bg-primary-fixed flex items-center justify-center">
            <span className="material-symbols-outlined fill text-primary text-[20px]">calendar_month</span>
          </div>
          <div>
            <p className="font-label-caps text-on-surface-variant uppercase tracking-wider text-[10px]">Current Semester</p>
            {semesterInfo ? (
              <>
                <p className="font-h1 text-h1 text-primary mt-1 leading-tight">{semesterInfo.year}</p>
                {semesterInfo.sem && (
                  <p className="font-body-md-bold text-on-surface-variant text-xs mt-0.5">{semesterInfo.sem} Semester</p>
                )}
              </>
            ) : (
              <p className="font-h1 text-h1 text-on-surface-variant mt-1">—</p>
            )}
          </div>
        </div>

        {/* Registration Deadline */}
        <div className="bg-surface-container-lowest rounded-[24px] p-6 border border-secondary-fixed-dim shadow-[0_4px_20px_rgba(0,0,0,0.03)] flex flex-col gap-4 hover:shadow-[0_6px_24px_rgba(0,0,0,0.06)] transition-shadow">
          <div className="w-10 h-10 rounded-full bg-error-container flex items-center justify-center">
            <span className="material-symbols-outlined fill text-error text-[20px]">timer</span>
          </div>
          <div>
            <p className="font-label-caps text-on-surface-variant uppercase tracking-wider text-[10px]">Registration Deadline</p>
            <p className="font-h1 text-h1 text-error mt-1 text-[22px]">June 30</p>
          </div>
        </div>
      </div>

      {/* Content Split */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Keep Learning — 2/3 */}
        <div className="lg:col-span-2 bg-surface-container-lowest rounded-[24px] border border-outline-variant shadow-[0_4px_20px_rgba(0,0,0,0.03)] p-6">
          <div className="flex justify-between items-center mb-5">
            <h2 className="font-h2 text-h2 text-on-background">Keep Learning</h2>
            <Link to="/courses" className="text-primary font-body-md-bold hover:underline text-sm flex items-center gap-1">
              View All
              <span className="material-symbols-outlined text-base">arrow_forward</span>
            </Link>
          </div>

          {registrations.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-10 text-center">
              <span className="material-symbols-outlined text-5xl text-on-surface-variant mb-3 block">menu_book</span>
              <p className="text-on-surface-variant font-body-md mb-4">No courses registered yet.</p>
              <Link to="/courses" className="inline-flex items-center gap-2 bg-primary text-on-primary rounded-btn font-body-md-bold px-5 py-2.5 hover:bg-primary-container transition-colors">
                Browse Courses
              </Link>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {registrations.slice(0, 4).map((reg, i) => (
                <div
                  key={reg.id ?? reg.registration_id ?? i}
                  className="border border-outline-variant rounded-lg p-4 flex items-center justify-between hover:bg-surface-bright transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-lg bg-surface-container flex items-center justify-center text-primary shrink-0">
                      <span className="material-symbols-outlined text-[20px]">{COURSE_ICONS[i % COURSE_ICONS.length]}</span>
                    </div>
                    <div className="min-w-0">
                      <h4 className="font-body-md-bold text-on-background truncate">
                        {reg.course?.course_title || reg.course?.title || 'Course'}
                      </h4>
                      <p className="text-on-surface-variant font-body-md text-sm mt-0.5">
                        {reg.course?.course_no} &middot; {reg.course?.credits || reg.course?.credit_hours} cr
                      </p>
                    </div>
                  </div>
                  <span className="bg-tertiary-fixed text-tertiary text-xs rounded-full font-body-md-bold px-3 py-1 shrink-0 ml-3">
                    In Progress
                  </span>
                </div>
              ))}
              {registrations.length > 4 && (
                <Link to="/registrations" className="text-sm text-primary font-body-md-bold hover:underline text-center mt-1">
                  View all {registrations.length} courses &rarr;
                </Link>
              )}
            </div>
          )}
        </div>

        {/* Semester Progress — 1/3 */}
        <div className="lg:col-span-1 bg-surface-container-lowest rounded-[24px] border border-outline-variant shadow-[0_4px_20px_rgba(0,0,0,0.03)] p-6 flex flex-col gap-5">
          {/* Header */}
          <div>
            <h2 className="font-h2 text-h2 text-on-background">Semester Progress</h2>
            <p className="font-label-caps text-on-surface-variant uppercase tracking-wider text-[10px] mt-0.5">
              {semLabel}
            </p>
          </div>

          {registrations.length === 0 ? (
            <div className="flex flex-col items-center justify-center flex-1 py-6 text-center gap-2">
              <span className="material-symbols-outlined text-[36px] text-on-surface-variant">bar_chart</span>
              <p className="text-on-surface-variant font-body-md text-xs">Register for courses to see progress</p>
            </div>
          ) : (
            <>
              {/* Credit progress bar */}
              <div className="space-y-2">
                <div className="flex items-end justify-between">
                  <span className="font-label-caps text-on-surface-variant uppercase tracking-wider text-[10px]">Credits Enrolled</span>
                  <span className="font-body-md-bold text-on-surface text-xs">{totalCredits.toFixed(1)} / {FULL_LOAD} cr</span>
                </div>
                <div className="h-3 w-full bg-surface-container rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${creditPct >= 90 ? 'bg-error' : creditPct >= 70 ? 'bg-tertiary' : 'bg-primary'}`}
                    style={{ width: `${creditPct}%` }}
                  />
                </div>
                <p className="text-right font-body-md text-on-surface-variant text-[11px]">
                  {creditPct.toFixed(0)}% of full load
                </p>
              </div>

              {/* Category bar chart */}
              {creditsByCategory.length > 0 && (
                <div className="flex-1 flex flex-col gap-3">
                  <p className="font-label-caps text-on-surface-variant uppercase tracking-wider text-[10px]">By Category</p>

                  {/* Vertical bars */}
                  <div className="flex items-end gap-2 flex-1" style={{ minHeight: '80px' }}>
                    {creditsByCategory.map(({ cat, credits, count }) => {
                      const pct = maxCatCredits > 0 ? (credits / maxCatCredits) * 100 : 0
                      const { bar } = catColor(cat)
                      return (
                        <div key={cat} className="flex-1 flex flex-col items-center gap-1 group relative cursor-default">
                          {/* Tooltip */}
                          <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-on-surface text-surface text-[10px] py-1 px-2 rounded-md opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-10">
                            {cat}: {credits.toFixed(1)} cr · {count} course{count !== 1 ? 's' : ''}
                          </div>
                          {/* Bar */}
                          <div
                            className={`w-full rounded-t-md transition-all duration-500 ${bar}`}
                            style={{
                              height: `${Math.max(pct, 8)}%`,
                              minHeight: '8px',
                              boxShadow: pct === 100 ? '0 4px 12px rgba(108,22,39,0.25)' : undefined,
                            }}
                          />
                        </div>
                      )
                    })}
                  </div>

                  {/* Labels */}
                  <div className="flex gap-2">
                    {creditsByCategory.map(({ cat, credits }) => {
                      const { text } = catColor(cat)
                      return (
                        <div key={cat} className="flex-1 text-center">
                          <p className={`font-label-caps uppercase tracking-wider text-[9px] truncate ${text}`}>{cat}</p>
                          <p className="font-body-md-bold text-on-surface text-[10px]">{credits.toFixed(1)}</p>
                        </div>
                      )
                    })}
                  </div>
                </div>
              )}

              {/* Summary row */}
              <div className="pt-3 border-t border-outline-variant flex justify-between">
                <div className="text-center">
                  <p className="font-label-caps text-on-surface-variant uppercase tracking-wider text-[9px]">Courses</p>
                  <p className="font-body-md-bold text-on-surface text-sm mt-0.5">{registrations.length}</p>
                </div>
                <div className="text-center">
                  <p className="font-label-caps text-on-surface-variant uppercase tracking-wider text-[9px]">Credits</p>
                  <p className="font-body-md-bold text-tertiary text-sm mt-0.5">{totalCredits.toFixed(1)}</p>
                </div>
                <div className="text-center">
                  <p className="font-label-caps text-on-surface-variant uppercase tracking-wider text-[9px]">Remaining</p>
                  <p className={`font-body-md-bold text-sm mt-0.5 ${totalCredits >= FULL_LOAD ? 'text-primary' : 'text-on-surface-variant'}`}>
                    {totalCredits >= FULL_LOAD ? 'Full ✓' : `${(FULL_LOAD - totalCredits).toFixed(1)} cr`}
                  </p>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
