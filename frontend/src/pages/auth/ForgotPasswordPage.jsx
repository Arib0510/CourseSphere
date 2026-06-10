import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Sun, Moon, CheckCircle, ArrowLeft, RefreshCw } from 'lucide-react'
import { useTheme } from '../../context/ThemeContext'
import { forgotPassword } from '../../services/authService'

export default function ForgotPasswordPage() {
  const [email, setEmail]             = useState('')
  const [submitted, setSubmitted]     = useState(false)
  const [loading, setLoading]         = useState(false)
  const [resendTimer, setResendTimer] = useState(0)
  const [error, setError]             = useState('')
  const { isDark, toggleTheme }       = useTheme()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await forgotPassword({ email })
      setSubmitted(true)
      startResendTimer()
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send reset link. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const startResendTimer = () => {
    setResendTimer(60)
    const interval = setInterval(() => {
      setResendTimer(prev => {
        if (prev <= 1) { clearInterval(interval); return 0 }
        return prev - 1
      })
    }, 1000)
  }

  const handleResend = async () => {
    if (resendTimer > 0) return
    setLoading(true)
    try {
      await forgotPassword({ email })
      startResendTimer()
    } catch {
      setError('Failed to resend. Please try again.')
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
      <div className="bg-surface-container-lowest/80 backdrop-blur-xl rounded-[32px] shadow-2xl border border-outline-variant p-8 w-full max-w-sm relative z-10">

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

        {!submitted ? (
          /* Email input state */
          <>
            <h1 className="text-2xl font-black text-on-surface text-center mb-1">Forgot password?</h1>
            <p className="text-sm text-on-surface-variant text-center mb-7">
              Enter your email and we&apos;ll send reset instructions.
            </p>

            {/* Error banner */}
            {error && (
              <div className="bg-error-container text-on-error-container text-sm rounded-2xl px-4 py-3 mb-5 border border-error/20">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label htmlFor="email" className="block font-label-caps text-label-caps text-on-surface-variant uppercase tracking-wider mb-1.5">
                  Email address
                </label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-xl">
                    mail
                  </span>
                  <input
                    id="email"
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

              <button
                type="submit"
                disabled={loading || !email}
                className="w-full bg-primary text-on-primary py-3 px-4 rounded-btn font-body-md-bold hover:bg-primary-container transition-colors disabled:opacity-50 active:scale-[0.98]"
              >
                {loading ? 'Sending...' : 'Send Reset Link'}
              </button>
            </form>

            <div className="border-t border-outline-variant mt-6 pt-5">
              <p className="text-sm text-center">
                <Link
                  to="/login"
                  className="inline-flex items-center gap-1.5 text-on-surface-variant hover:text-primary transition-colors"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  Back to sign in
                </Link>
              </p>
            </div>
          </>
        ) : (
          /* Success state */
          <div className="text-center">
            <div className="w-16 h-16 rounded-full bg-tertiary-container flex items-center justify-center mx-auto mb-5">
              <CheckCircle className="w-8 h-8 text-tertiary" />
            </div>

            <h2 className="text-xl font-black text-on-surface mb-2">Check your email</h2>
            <p className="text-sm text-on-surface-variant mb-1">We sent a reset link to</p>
            <p className="text-sm font-semibold text-primary mb-6 break-all">{email}</p>

            <p className="text-xs text-on-surface-variant mb-5">
              Didn&apos;t receive it? Check spam or request a new link.
            </p>

            <button
              onClick={handleResend}
              disabled={resendTimer > 0 || loading}
              className="w-full flex items-center justify-center gap-2 border border-outline-variant text-on-surface-variant font-semibold py-3 rounded-btn hover:bg-surface-container transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              {resendTimer > 0 ? `Resend in ${resendTimer}s` : 'Resend email'}
            </button>

            <div className="border-t border-outline-variant mt-6 pt-5">
              <p className="text-sm text-center">
                <Link
                  to="/login"
                  className="inline-flex items-center gap-1.5 text-on-surface-variant hover:text-primary transition-colors"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  Back to sign in
                </Link>
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
