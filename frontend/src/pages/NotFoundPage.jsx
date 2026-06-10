import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function NotFoundPage() {
  const { user }   = useAuth()
  const navigate   = useNavigate()
  const homeRoute  = user
    ? user.role === 'admin' ? '/admin' : '/dashboard'
    : '/'

  return (
    <div className="min-h-screen flex items-center justify-center bg-cs-bg p-4 relative overflow-hidden">
      {/* Decorative blobs */}
      <div
        className="blob-bg w-96 h-96 rounded-full top-[-10%] right-[-5%]"
        style={{ background: 'var(--primary-fixed)' }}
      />
      <div
        className="blob-bg w-72 h-72 rounded-full bottom-[-5%] left-[-5%]"
        style={{ background: 'var(--primary-dim)', opacity: 0.15 }}
      />

      <div className="relative z-10 flex flex-col items-center text-center max-w-md">
        {/* Logo */}
        <div className="flex items-center gap-3 mb-12">
          <div className="w-9 h-9 rounded-xl bg-cs-primary flex items-center justify-center">
            <span className="material-symbols-outlined fill text-white text-lg">school</span>
          </div>
          <span className="font-black text-cs-on-surface text-lg tracking-tight">CourseSphere</span>
        </div>

        {/* 404 display */}
        <div className="w-24 h-24 rounded-3xl bg-cs-primary-light border border-cs-primary/20 flex items-center justify-center mb-6">
          <span className="material-symbols-outlined text-cs-primary" style={{ fontSize: '48px' }}>
            search_off
          </span>
        </div>

        <p className="text-[10px] font-bold text-cs-primary uppercase tracking-widest mb-2">
          Error 404
        </p>
        <h1 className="text-3xl font-black text-cs-on-surface mb-3 tracking-tight">
          Page not found
        </h1>
        <p className="text-sm text-cs-on-sv leading-relaxed mb-8">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
          Let&apos;s get you back on track.
        </p>

        <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
          <Link
            to={homeRoute}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-cs-primary text-white font-bold px-6 py-2.5 rounded-xl hover:opacity-90 active:scale-95 transition-all text-sm"
          >
            <span className="material-symbols-outlined text-sm">home</span>
            Go to Dashboard
          </Link>
          <button
            onClick={() => navigate(-1)}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 border border-cs-border text-cs-on-sv font-semibold px-6 py-2.5 rounded-xl hover:bg-cs-surface-hi transition-colors text-sm"
          >
            <span className="material-symbols-outlined text-sm">arrow_back</span>
            Go Back
          </button>
        </div>
      </div>
    </div>
  )
}
