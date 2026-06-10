import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

const navItems = [
  { to: '/dashboard',     icon: 'dashboard',    label: 'Dashboard',        end: true },
  { to: '/courses',       icon: 'school',       label: 'Browse Courses' },
  { to: '/registrations', icon: 'how_to_reg',   label: 'My Registrations' },
  { to: '/profile',       icon: 'person',       label: 'Profile' },
]

export default function StudentSidebar() {
  const { user, logoutUser } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logoutUser()
    navigate('/login')
  }

  return (
    <aside className="fixed left-0 top-0 h-full w-[280px] bg-cs-sidebar border-r border-cs-border flex flex-col z-30">
      {/* Logo */}
      <div className="flex items-center gap-3 px-6 py-5 border-b border-cs-border">
        <div className="w-10 h-10 rounded-xl bg-cs-primary flex items-center justify-center">
          <span className="material-symbols-outlined fill text-white">school</span>
        </div>
        <div>
          <h1 className="font-bold text-cs-on-surface text-lg leading-tight">CourseSphere</h1>
          <p className="text-xs text-cs-muted">RUET Academic Portal</p>
        </div>
      </div>

      {/* User info */}
      {user && (
        <div className="mx-4 mt-4 mb-1 flex items-center gap-3 p-3 rounded-xl bg-cs-surface-lo border border-cs-border">
          <div className="w-8 h-8 rounded-full bg-cs-primary flex items-center justify-center text-white text-xs font-bold shrink-0">
            {user.name?.charAt(0)?.toUpperCase() || 'S'}
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-cs-on-surface truncate">{user.name || 'Student'}</p>
            <p className="text-xs text-cs-muted truncate">{user.department || user.email}</p>
          </div>
        </div>
      )}

      {/* Nav */}
      <nav className="flex-1 py-3 px-3 overflow-y-auto space-y-1">
        {navItems.map(({ to, icon, label, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-r-xl transition-all duration-150 font-medium text-sm border-l-4 ${
                isActive
                  ? 'bg-cs-primary-light text-cs-primary border-cs-primary'
                  : 'text-cs-on-sv hover:bg-cs-surface-hi hover:text-cs-on-surface border-transparent'
              }`
            }
          >
            <span className="material-symbols-outlined text-lg shrink-0">{icon}</span>
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>

      {/* Logout */}
      <div className="px-3 pb-5 pt-3 border-t border-cs-border">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 w-full px-4 py-3 rounded-r-xl text-sm font-medium text-cs-error hover:bg-cs-surface-hi transition-colors border-l-4 border-transparent"
        >
          <span className="material-symbols-outlined text-lg">logout</span>
          <span>Logout</span>
        </button>
      </div>
    </aside>
  )
}
