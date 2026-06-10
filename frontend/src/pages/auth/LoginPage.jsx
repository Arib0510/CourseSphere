import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Eye, EyeOff, Sun, Moon } from 'lucide-react'
import { toast } from 'react-toastify'
import { login } from '../../services/authService'
import { useAuth } from '../../context/AuthContext'
import { useTheme } from '../../context/ThemeContext'

export default function LoginPage() {
  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')
  const [showPw, setShowPw]     = useState(false)
  const [loading, setLoading]   = useState(false)
  const [error, setError]       = useState('')
  const { loginUser }           = useAuth()
  const { isDark, toggleTheme } = useTheme()
  const navigate                = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const res     = await login({ email, password })
      const payload = res.data.data || res.data
      const token   = payload.token || payload.session?.access_token
      const user    = payload.user
      loginUser(token, user)
      toast.success('Welcome back!')
      navigate(user.isAdmin || user.role === 'admin' ? '/admin' : '/dashboard')
    } catch (err) {
      const msg = err.response?.data?.message || 'Invalid credentials'
      setError(msg)
      toast.error(msg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4 relative overflow-hidden">
      {/* Decorative blobs */}
      <div className="absolute w-96 h-96 rounded-full opacity-60 blur-[80px] -z-10 top-[-8%] left-[-6%] bg-secondary-container" />
      <div className="absolute w-80 h-80 rounded-full opacity-60 blur-[80px] -z-10 bottom-[-6%] right-[-5%] bg-primary-fixed" />
      <div className="absolute w-64 h-64 rounded-full opacity-60 blur-[80px] -z-10 top-1/2 left-1/3 bg-tertiary-container/20" />

      {/* Theme toggle */}
      <button
        onClick={toggleTheme}
        className="fixed top-4 right-4 p-2.5 rounded-full bg-surface-container border border-outline-variant text-on-surface-variant hover:text-primary transition-colors z-10"
        aria-label="Toggle theme"
      >
        {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
      </button>

      {/* Card */}
      <div className="bg-surface-container-lowest/80 backdrop-blur-xl rounded-[32px] shadow-2xl border border-outline-variant p-8 w-full max-w-md relative z-10">

        {/* Header */}
        <div className="flex flex-col items-center gap-3 mb-8">
          <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
            <span
              className="material-symbols-outlined text-on-primary"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              school
            </span>
          </div>
          <span className="font-body-md-bold text-on-surface-variant tracking-wide text-sm">CourseSphere</span>
        </div>

        <h1 className="text-2xl font-black text-on-surface text-center mb-1">Welcome back</h1>
        <p className="text-sm text-on-surface-variant text-center mb-7">
          Sign in to access your academic portal.
        </p>

        {/* Error banner */}
        {error && (
          <div className="bg-error-container text-on-error-container text-sm rounded-2xl px-4 py-3 mb-5 border border-error/20">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Email */}
          <div>
            <label htmlFor="email" className="block font-label-caps text-label-caps text-on-surface-variant uppercase tracking-wider mb-1.5">
              Email
            </label>
            <div className="relative">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-xl">
                mail
              </span>
              <input
                id="email"
                name="email"
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                autoComplete="email"
                placeholder="your@email.com"
                className="w-full bg-surface border border-outline-variant rounded-input pl-10 pr-4 py-3 focus:ring-2 focus:ring-primary focus:border-primary text-on-surface font-body-md placeholder:text-outline outline-none transition-colors"
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label htmlFor="password" className="block font-label-caps text-label-caps text-on-surface-variant uppercase tracking-wider mb-1.5">
              Password
            </label>
            <div className="relative">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-xl">
                lock
              </span>
              <input
                id="password"
                name="password"
                type={showPw ? 'text' : 'password'}
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                autoComplete="current-password"
                placeholder="••••••••"
                className="w-full bg-surface border border-outline-variant rounded-input pl-10 pr-10 py-3 focus:ring-2 focus:ring-primary focus:border-primary text-on-surface font-body-md placeholder:text-outline outline-none transition-colors"
              />
              <button
                type="button"
                onClick={() => setShowPw(!showPw)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-outline hover:text-on-surface-variant transition-colors"
              >
                {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {/* Forgot password link */}
            <div className="flex justify-end mt-1.5">
              <Link
                to="/forgot-password"
                className="text-xs text-primary hover:underline font-medium"
              >
                Forgot password?
              </Link>
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary text-on-primary py-3 px-4 rounded-btn font-body-md-bold hover:bg-primary-container transition-colors disabled:opacity-50 active:scale-[0.98] mt-1"
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        {/* Sign up link */}
        <p className="text-sm text-center text-on-surface-variant mt-6">
          Don&apos;t have an account?{' '}
          <Link to="/signup" className="text-primary font-semibold hover:underline">
            Sign up
          </Link>
        </p>

        {/* Back to home */}
        <div className="border-t border-outline-variant mt-5 pt-5">
          <p className="text-sm text-center">
            <Link
              to="/"
              className="text-on-surface-variant hover:text-primary transition-colors inline-flex items-center gap-1"
            >
              ← Back to home
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
