import { useState, useEffect, useRef } from 'react'
import { Outlet, NavLink, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { useTheme } from '../../context/ThemeContext'
import { logout } from '../../services/authService'

/* ─── Nav config ──────────────────────────────────────── */
const STUDENT_NAV = [
  { to: '/dashboard',     icon: 'dashboard',        label: 'Dashboard'     },
  { to: '/courses',       icon: 'school',           label: 'Courses'       },
  { to: '/registrations', icon: 'app_registration', label: 'Registrations' },
  { to: '/profile',       icon: 'person',           label: 'Profile'       },
]
const ADMIN_NAV = [
  { to: '/admin',               icon: 'dashboard',        label: 'Overview'      },
  { to: '/admin/courses',       icon: 'school',           label: 'Courses'       },
  { to: '/admin/students',      icon: 'group',            label: 'Students'      },
  { to: '/admin/registrations', icon: 'app_registration', label: 'Registrations' },
]

/* ─── Notification config ────────────────────────────── */
const MOCK_NOTIFS = [
  {
    id: 1, type: 'success', icon: 'check_circle',
    title: 'Registration Confirmed',
    desc: 'You have been registered for CSE 3101 – Database Management Systems.',
    time: '2 min ago', unread: true,
  },
  {
    id: 2, type: 'info', icon: 'notifications_active',
    title: 'Registration Window Open',
    desc: 'Course registration for Spring 2025 is now open. Register before seats fill up.',
    time: '1 hr ago', unread: true,
  },
  {
    id: 3, type: 'warning', icon: 'warning',
    title: 'Seat Limit Alert',
    desc: 'ETE 3163 is almost full — only 3 seats remaining.',
    time: '3 hrs ago', unread: true,
  },
  {
    id: 4, type: 'default', icon: 'info',
    title: 'Maintenance Notice',
    desc: 'Scheduled maintenance this Sunday 2:00–4:00 AM. Portal may be temporarily unavailable.',
    time: 'Yesterday', unread: false,
  },
]

const NOTIF_STYLES = {
  success: { icon: 'bg-tertiary-fixed/60 text-tertiary',  dot: 'bg-tertiary'  },
  error:   { icon: 'bg-error-container/60 text-error',    dot: 'bg-error'     },
  warning: { icon: 'bg-[#fff3e0] text-[#e65100] dark:bg-[#3d2800] dark:text-[#ffb74d]', dot: 'bg-[#e65100]' },
  info:    { icon: 'bg-primary-fixed/60 text-primary',    dot: 'bg-primary'   },
  default: { icon: 'bg-surface-container-high text-on-surface-variant', dot: 'bg-outline' },
}

export default function AppLayout() {
  const { user }                = useAuth()
  const { isDark, toggleTheme } = useTheme()
  const navigate                = useNavigate()
  const location                = useLocation()
  const isAdmin                 = user?.role === 'admin' || user?.isAdmin
  const navItems                = isAdmin ? ADMIN_NAV : STUDENT_NAV

  /* drawer */
  const [drawerOpen, setDrawerOpen] = useState(false)

  /* notifications */
  const [notifOpen, setNotifOpen] = useState(false)
  const [notifs, setNotifs]       = useState(MOCK_NOTIFS)
  const notifRef                  = useRef(null)
  const unread                    = notifs.filter(n => n.unread).length

  /* user menu */
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const userMenuRef                     = useRef(null)

  /* avatar */
  const avatarSrc = user?.id ? localStorage.getItem(`avatar_${user.id}`) : null

  /* close drawer on route change */
  useEffect(() => { setDrawerOpen(false) }, [location.pathname])

  /* close dropdowns on outside click */
  useEffect(() => {
    const h = (e) => {
      if (notifRef.current    && !notifRef.current.contains(e.target))    setNotifOpen(false)
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) setUserMenuOpen(false)
    }
    document.addEventListener('mousedown', h)
    return () => document.removeEventListener('mousedown', h)
  }, [])

  /* logout */
  const handleLogout = async () => {
    try { await logout() } catch { /* ignore */ }
    localStorage.clear()
    window.location.href = '/login'
  }

  const initials = user?.name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || 'U'

  return (
    <div className="min-h-screen bg-background text-on-background font-body-md flex flex-col transition-colors duration-300">

      {/* ── Top Navigation Bar ──────────────────────────── */}
      <header className="sticky top-0 z-40 bg-surface-container-lowest/95 backdrop-blur-md border-b border-outline-variant flex items-center justify-between px-4 md:px-6 h-16 w-full transition-colors duration-300">

        {/* Left: Hamburger + Logo */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => setDrawerOpen(v => !v)}
            className="p-2 rounded-xl hover:bg-surface-container transition-colors text-on-surface-variant hover:text-primary active:scale-95"
            aria-label="Toggle navigation"
          >
            <span className="material-symbols-outlined text-[22px]">
              {drawerOpen ? 'close' : 'menu'}
            </span>
          </button>
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-primary flex items-center justify-center shadow-burgundy">
              <span className="material-symbols-outlined text-on-primary text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>school</span>
            </div>
            <span className="font-bold text-primary text-base tracking-tight hidden sm:block">CourseSphere</span>
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-1 shrink-0">

          {/* Theme toggle */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-xl hover:bg-surface-container text-on-surface-variant hover:text-primary transition-colors active:scale-95"
            aria-label="Toggle theme"
          >
            <span className="material-symbols-outlined text-[22px]">
              {isDark ? 'light_mode' : 'dark_mode'}
            </span>
          </button>

          {/* Notifications */}
          <div className="relative" ref={notifRef}>
            <button
              onClick={() => { setNotifOpen(v => !v); setUserMenuOpen(false) }}
              className="p-2 rounded-xl hover:bg-surface-container text-on-surface-variant hover:text-primary transition-colors relative active:scale-95"
              aria-label="Notifications"
            >
              <span className="material-symbols-outlined text-[22px]">notifications</span>
              {unread > 0 && (
                <span className="absolute top-1.5 right-1.5 min-w-[8px] h-2 bg-error rounded-full border-2 border-surface-container-lowest animate-pulse-glow" />
              )}
            </button>

            {/* Notification Panel */}
            {notifOpen && (
              <div className="absolute right-0 top-[calc(100%+8px)] w-[360px] bg-surface-container-lowest border border-outline-variant rounded-[20px] shadow-[0_20px_60px_rgba(0,0,0,0.15)] z-50 overflow-hidden animate-scale-in">
                {/* Header */}
                <div className="flex items-center justify-between px-5 py-4 border-b border-outline-variant bg-surface-container-low/50">
                  <div className="flex items-center gap-2.5">
                    <span className="material-symbols-outlined text-primary text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>notifications</span>
                    <h3 className="font-semibold text-on-surface text-sm">Notifications</h3>
                    {unread > 0 && (
                      <span className="bg-primary text-on-primary text-[10px] font-bold px-2 py-0.5 rounded-full min-w-[20px] text-center">
                        {unread}
                      </span>
                    )}
                  </div>
                  {unread > 0 && (
                    <button
                      onClick={() => setNotifs(p => p.map(n => ({ ...n, unread: false })))}
                      className="text-xs font-semibold text-primary hover:text-primary-container transition-colors flex items-center gap-1"
                    >
                      <span className="material-symbols-outlined text-[14px]">done_all</span>
                      Mark all read
                    </button>
                  )}
                </div>

                {/* Notification items */}
                <div className="max-h-[320px] overflow-y-auto divide-y divide-outline-variant/50">
                  {notifs.map((n, i) => {
                    const style = NOTIF_STYLES[n.type] || NOTIF_STYLES.default
                    return (
                      <div
                        key={n.id}
                        className={`flex items-start gap-3 px-4 py-3.5 cursor-pointer transition-colors group animate-fade-in stagger-${Math.min(i + 1, 4)} ${
                          n.unread
                            ? 'bg-secondary-fixed/20 hover:bg-secondary-fixed/40'
                            : 'hover:bg-surface-container'
                        }`}
                        onClick={() => setNotifs(p => p.map(x => x.id === n.id ? { ...x, unread: false } : x))}
                      >
                        {/* Icon */}
                        <div className={`w-9 h-9 rounded-full ${style.icon} flex items-center justify-center shrink-0 mt-0.5 transition-transform group-hover:scale-105`}>
                          <span className="material-symbols-outlined text-[18px]" style={{ fontVariationSettings: n.type === 'success' ? "'FILL' 1" : "'FILL' 0" }}>
                            {n.icon}
                          </span>
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-0.5">
                            <p className="text-[13px] font-semibold text-on-surface truncate leading-tight">{n.title}</p>
                            {n.unread && (
                              <span className={`w-2 h-2 rounded-full shrink-0 ${style.dot}`} />
                            )}
                          </div>
                          <p className="text-xs text-on-surface-variant leading-relaxed line-clamp-2">{n.desc}</p>
                          <p className="text-[10px] text-outline mt-1.5 flex items-center gap-1">
                            <span className="material-symbols-outlined text-[12px]">schedule</span>
                            {n.time}
                          </p>
                        </div>
                      </div>
                    )
                  })}
                </div>

                {/* Footer */}
                <div className="px-5 py-3 border-t border-outline-variant bg-surface-container-low/30 text-center">
                  <button className="text-xs font-semibold text-primary hover:text-primary-container transition-colors inline-flex items-center gap-1">
                    <span className="material-symbols-outlined text-[14px]">open_in_new</span>
                    View all notifications
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* User avatar menu */}
          <div className="relative ml-1 pl-3 border-l border-outline-variant" ref={userMenuRef}>
            <button
              onClick={() => { setUserMenuOpen(v => !v); setNotifOpen(false) }}
              className="w-8 h-8 rounded-full overflow-hidden border-2 border-outline-variant hover:border-primary transition-all active:scale-95"
              aria-label="User menu"
            >
              {avatarSrc ? (
                <img src={avatarSrc} alt="avatar" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full bg-primary-container text-on-primary-container flex items-center justify-center text-xs font-bold">
                  {initials}
                </div>
              )}
            </button>

            {userMenuOpen && (
              <div className="absolute right-0 top-[calc(100%+8px)] w-56 bg-surface-container-lowest border border-outline-variant rounded-[16px] shadow-[0_12px_40px_rgba(0,0,0,0.12)] z-50 overflow-hidden animate-scale-in">
                {/* User info header */}
                <div className="px-4 py-3 border-b border-outline-variant flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full overflow-hidden border border-outline-variant shrink-0">
                    {avatarSrc ? (
                      <img src={avatarSrc} alt="avatar" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full bg-primary-container text-on-primary-container flex items-center justify-center text-xs font-bold">
                        {initials}
                      </div>
                    )}
                  </div>
                  <div className="min-w-0">
                    <p className="font-semibold text-on-surface text-sm truncate">{user?.name || 'User'}</p>
                    <p className="text-xs text-on-surface-variant truncate">{user?.email || ''}</p>
                  </div>
                </div>

                <div className="py-1">
                  <button
                    onClick={() => { navigate(isAdmin ? '/admin' : '/profile'); setUserMenuOpen(false) }}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-on-surface-variant hover:bg-surface-container hover:text-on-surface transition-colors"
                  >
                    <span className="material-symbols-outlined text-[18px]">person</span>
                    My Profile
                  </button>
                  <button
                    onClick={() => { toggleTheme(); setUserMenuOpen(false) }}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-on-surface-variant hover:bg-surface-container hover:text-on-surface transition-colors"
                  >
                    <span className="material-symbols-outlined text-[18px]">{isDark ? 'light_mode' : 'dark_mode'}</span>
                    {isDark ? 'Light mode' : 'Dark mode'}
                  </button>
                  <div className="border-t border-outline-variant my-1" />
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-error hover:bg-error-container/30 transition-colors"
                  >
                    <span className="material-symbols-outlined text-[18px]">logout</span>
                    Sign out
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* ── Drawer Overlay ──────────────────────────────── */}
      {drawerOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/40 backdrop-blur-sm animate-fade-in"
          onClick={() => setDrawerOpen(false)}
        />
      )}

      {/* ── Slide-out Drawer ────────────────────────────── */}
      <aside
        className={`fixed top-0 left-0 h-full w-[280px] z-50 flex flex-col bg-surface-container-low border-r border-outline-variant transition-transform duration-300 ease-in-out ${
          drawerOpen ? 'translate-x-0 shadow-[8px_0_40px_rgba(0,0,0,0.15)]' : '-translate-x-full'
        }`}
      >
        {/* Drawer header */}
        <div className="flex items-center justify-between px-5 h-16 border-b border-outline-variant shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center shadow-burgundy">
              <span className="material-symbols-outlined text-on-primary text-base" style={{ fontVariationSettings: "'FILL' 1" }}>school</span>
            </div>
            <div>
              <p className="font-bold text-primary text-sm leading-tight">CourseSphere</p>
              <p className="text-[9px] text-on-surface-variant uppercase tracking-wider">RUET Academic Portal</p>
            </div>
          </div>
          <button
            onClick={() => setDrawerOpen(false)}
            className="p-1.5 rounded-lg hover:bg-surface-container text-on-surface-variant transition-colors"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Nav links */}
        <nav className="flex-1 overflow-y-auto py-3 px-3">
          <div className="space-y-0.5">
            {navItems.map(({ to, icon, label }, i) => (
              <NavLink
                key={to}
                to={to}
                end={to === '/admin'}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3 rounded-xl font-body-md transition-all duration-200 ${
                    isActive
                      ? 'bg-secondary-fixed text-primary border-l-4 border-primary font-body-md-bold shadow-sm'
                      : 'text-on-surface-variant hover:bg-surface-variant hover:text-on-surface border-l-4 border-transparent'
                  } animate-fade-in stagger-${i + 1}`
                }
              >
                {({ isActive }) => (
                  <>
                    <span
                      className="material-symbols-outlined text-[22px] transition-transform duration-200"
                      style={{ fontVariationSettings: isActive ? "'FILL' 1" : "'FILL' 0" }}
                    >
                      {icon}
                    </span>
                    <span>{label}</span>
                  </>
                )}
              </NavLink>
            ))}
          </div>
        </nav>

        {/* Drawer footer */}
        <div className="px-3 py-4 border-t border-outline-variant shrink-0 space-y-0.5">
          <div className="px-4 py-2 mb-2">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full overflow-hidden border border-outline-variant shrink-0">
                {avatarSrc ? (
                  <img src={avatarSrc} alt="avatar" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full bg-primary-container text-on-primary-container flex items-center justify-center text-xs font-bold">
                    {initials}
                  </div>
                )}
              </div>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-on-surface truncate">{user?.name}</p>
                <span className={`text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${isAdmin ? 'bg-primary-fixed text-primary' : 'bg-secondary-fixed text-primary'}`}>
                  {isAdmin ? 'Admin' : 'Student'}
                </span>
              </div>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-on-surface-variant hover:bg-error-container/30 hover:text-error transition-colors text-body-md"
          >
            <span className="material-symbols-outlined text-[20px]">logout</span>
            Sign out
          </button>
        </div>
      </aside>

      {/* ── Main content ─────────────────────────────────── */}
      <main className="flex-1 px-4 md:px-8 py-6 max-w-[1440px] mx-auto w-full page-enter">
        <Outlet />
      </main>

      {/* ── Footer ───────────────────────────────────────── */}
      <footer className="border-t border-outline-variant bg-surface-container-lowest py-6 px-6 flex flex-col sm:flex-row justify-between items-center gap-3 transition-colors duration-300">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-primary text-[18px]">school</span>
          <span className="text-label-caps text-on-surface-variant text-[10px] uppercase tracking-wider">© 2025 RUET CourseSphere</span>
        </div>
        <div className="flex gap-5">
          <a href="#" className="text-body-md text-on-surface-variant hover:text-primary transition-colors text-xs">Institutional Privacy</a>
          <a href="#" className="text-body-md text-on-surface-variant hover:text-primary transition-colors text-xs">Contact Support</a>
          <a href="#" className="text-body-md text-on-surface-variant hover:text-primary transition-colors text-xs">RUET Home</a>
        </div>
      </footer>
    </div>
  )
}
