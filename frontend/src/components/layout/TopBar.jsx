import { useState, useRef, useEffect } from 'react'
import { Search, Sun, Moon } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { useTheme } from '../../context/ThemeContext'

const MOCK_NOTIFICATIONS = [
  {
    id: 1,
    icon: 'check_circle',
    iconBg: 'bg-[#e9f5ee]',
    iconColor: 'text-[#2e7d32]',
    title: 'Registration Confirmed',
    desc: 'You have been registered for CSE 3101 – Database Management Systems.',
    time: '2 min ago',
    unread: true,
  },
  {
    id: 2,
    icon: 'notifications_active',
    iconBg: 'bg-cs-primary-light',
    iconColor: 'text-cs-primary',
    title: 'Registration Window Open',
    desc: 'Course registration for Spring 2025 semester is now open.',
    time: '1 hour ago',
    unread: true,
  },
  {
    id: 3,
    icon: 'warning',
    iconBg: 'bg-[#fff3e0]',
    iconColor: 'text-[#e65100]',
    title: 'Seat Limit Alert',
    desc: 'ETE 3163 is almost full — only 3 seats remaining.',
    time: '3 hours ago',
    unread: true,
  },
  {
    id: 4,
    icon: 'info',
    iconBg: 'bg-cs-surface-hi',
    iconColor: 'text-cs-on-sv',
    title: 'System Maintenance',
    desc: 'Scheduled maintenance on Sunday 2:00 AM – 4:00 AM BDT.',
    time: '1 day ago',
    unread: false,
  },
]

export default function TopBar() {
  const { user } = useAuth()
  const { isDark, toggleTheme } = useTheme()
  const [notifOpen, setNotifOpen] = useState(false)
  const [notifications, setNotifications] = useState(MOCK_NOTIFICATIONS)
  const notifRef = useRef(null)

  const unreadCount = notifications.filter(n => n.unread).length

  const markAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, unread: false })))
  }

  // Close panel on outside click
  useEffect(() => {
    const handler = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setNotifOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  return (
    <header className="fixed top-0 right-0 w-[calc(100%-280px)] h-16 bg-cs-bg/80 backdrop-blur-md border-b border-cs-border flex items-center justify-between px-6 z-20">
      {/* Search */}
      <div className="flex items-center gap-2 bg-cs-surface border border-cs-border rounded-full px-4 py-2 w-72 focus-within:ring-2 focus-within:ring-[color:var(--primary)]/20 transition-all">
        <Search className="w-4 h-4 text-cs-muted shrink-0" />
        <input
          type="text"
          placeholder="Search..."
          className="bg-transparent border-none outline-none text-sm text-cs-on-surface w-full placeholder:text-cs-muted"
        />
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2">
        {/* Dark mode toggle */}
        <button
          onClick={toggleTheme}
          className="p-2 rounded-full hover:bg-cs-surface-hi text-cs-on-sv hover:text-cs-primary transition-colors"
          title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
        >
          {isDark
            ? <Sun className="w-5 h-5" />
            : <Moon className="w-5 h-5" />
          }
        </button>

        {/* Notification bell */}
        <div className="relative" ref={notifRef}>
          <button
            onClick={() => setNotifOpen(p => !p)}
            className="p-2 rounded-full hover:bg-cs-surface-hi text-cs-on-sv hover:text-cs-primary transition-colors relative"
            title="Notifications"
          >
            <span className="material-symbols-outlined text-xl">notifications</span>
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-cs-error rounded-full" />
            )}
          </button>

          {/* Notification dropdown panel */}
          {notifOpen && (
            <div className="absolute right-0 top-12 w-80 bg-cs-surface border border-cs-border rounded-3xl shadow-2xl z-50 overflow-hidden">
              {/* Panel header */}
              <div className="flex items-center justify-between px-5 py-4 border-b border-cs-border">
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-cs-on-surface text-sm">Notifications</h3>
                  {unreadCount > 0 && (
                    <span className="bg-cs-primary text-white text-xs font-bold px-2 py-0.5 rounded-full">
                      {unreadCount}
                    </span>
                  )}
                </div>
                {unreadCount > 0 && (
                  <button
                    onClick={markAllRead}
                    className="text-xs font-semibold text-cs-primary hover:underline"
                  >
                    Mark all read
                  </button>
                )}
              </div>

              {/* Notification list */}
              <div className="max-h-80 overflow-y-auto divide-y divide-cs-border">
                {notifications.map(n => (
                  <div
                    key={n.id}
                    className={`flex items-start gap-3 px-5 py-4 cursor-pointer hover:bg-cs-surface-lo transition-colors ${n.unread ? 'bg-cs-surface-lo/50' : ''}`}
                    onClick={() => setNotifications(prev => prev.map(x => x.id === n.id ? { ...x, unread: false } : x))}
                  >
                    <div className={`w-9 h-9 rounded-full ${n.iconBg} ${n.iconColor} flex items-center justify-center shrink-0 mt-0.5`}>
                      <span className="material-symbols-outlined text-base">{n.icon}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-semibold text-cs-on-surface truncate">{n.title}</p>
                        {n.unread && <span className="w-1.5 h-1.5 bg-cs-primary rounded-full shrink-0" />}
                      </div>
                      <p className="text-xs text-cs-on-sv mt-0.5 leading-relaxed">{n.desc}</p>
                      <p className="text-xs text-cs-muted mt-1">{n.time}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Panel footer */}
              <div className="px-5 py-3 border-t border-cs-border text-center">
                <button className="text-xs font-semibold text-cs-primary hover:underline">
                  View all notifications
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Avatar */}
        <div className="w-8 h-8 rounded-full bg-cs-primary flex items-center justify-center text-white text-xs font-bold ml-1">
          {user?.name?.charAt(0)?.toUpperCase() || 'U'}
        </div>
      </div>
    </header>
  )
}
