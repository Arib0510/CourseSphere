import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

const navItems = [
  { to: '/admin',                icon: 'dashboard',    label: 'Dashboard',            end: true },
  { to: '/admin/courses',        icon: 'school',       label: 'Manage Courses' },
  { to: '/admin/students',       icon: 'group',        label: 'Manage Students' },
  { to: '/admin/registrations',  icon: 'how_to_reg',   label: 'Registrations' },
]

export default function AdminSidebar() {
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
          <p className="text-xs text-cs-muted">Admin Portal</p>
        </div>
      </div>

      {/* Admin badge */}
      <div className="mx-4 mt-4 mb-1 flex items-center gap-2 p-2.5 rounded-xl bg-cs-primary-light border border-cs-primary/20">
        <span className="material-symbols-outlined fill text-cs-primary text-base">shield</span>
        <span className="text-xs font-bold text-cs-primary uppercase tracking-widest">Administrator</span>
      </div>

      {user && (
        <div className="mx-4 mt-2 mb-1 flex items-center gap-3 p-3 rounded-xl bg-cs-surface-lo border border-cs-border">
          <div className="w-8 h-8 rounded-full bg-cs-primary flex items-center justify-center text-white text-xs font-bold shrink-0">
            {user.name?.charAt(0)?.toUpperCase() || 'A'}
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-cs-on-surface truncate">{user.name || 'Admin'}</p>
            <p className="text-xs text-cs-muted truncate">{user.email}</p>
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
