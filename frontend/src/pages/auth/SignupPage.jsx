import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Eye, EyeOff, Sun, Moon } from 'lucide-react'
import { toast } from 'react-toastify'
import { signup } from '../../services/authService'
import { useAuth } from '../../context/AuthContext'
import { useTheme } from '../../context/ThemeContext'

const DEPARTMENTS = ['CSE', 'EEE', 'ETE', 'ME', 'CE', 'IPE', 'GCE', 'URP', 'ARCH', 'MSE', 'MME', 'BECM']

const fieldClass = (err) =>
  `w-full bg-surface border rounded-input pl-10 pr-4 py-3 text-on-surface font-body-md placeholder:text-outline outline-none focus:ring-2 transition-colors ${
    err
      ? 'border-error focus:ring-error focus:border-error'
      : 'border-outline-variant focus:ring-primary focus:border-primary'
  }`

export default function SignupPage() {
  const [formData, setFormData] = useState({
    name: '', email: '', student_id: '', department: '', password: '', confirmPassword: '',
  })
  const [showPw, setShowPw]               = useState(false)
  const [showConfirmPw, setShowConfirmPw] = useState(false)
  const [loading, setLoading]             = useState(false)
  const [errors, setErrors]               = useState({})
  const { loginUser }                     = useAuth()
  const { isDark, toggleTheme }           = useTheme()
  const navigate                          = useNavigate()

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }))
  }

  const validate = () => {
    const e = {}
    if (!formData.name.trim())        e.name            = 'Full name is required'
    if (!formData.email.trim())       e.email           = 'Email is required'
    if (!formData.student_id.trim())  e.student_id      = 'Student ID is required'
    if (!formData.department)         e.department      = 'Department is required'
    if (!formData.password)           e.password        = 'Password is required'
    if (formData.password.length < 6) e.password        = 'Password must be at least 6 characters'
    if (formData.password !== formData.confirmPassword)
                                      e.confirmPassword = 'Passwords do not match'
    return e
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const validationErrors = validate()
    if (Object.keys(validationErrors).length > 0) { setErrors(validationErrors); return }
    setLoading(true)
    try {
      const { confirmPassword, name, ...rest } = formData
      const res = await signup({ ...rest, full_name: name })
      const payload = res.data.data || res.data
      if (payload?.token && payload?.user) {
        loginUser(payload.token, payload.user)
        toast.success('Account created successfully!')
        navigate('/dashboard')
      } else {
        toast.success('Account created! Please sign in.')
        navigate('/login')
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Registration failed. Please try again.'
      toast.error(msg)
      setErrors({ general: msg })
    } finally {
      setLoading(false)
    }
  }

  const iconCls = 'material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-xl'

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
      <div className="bg-surface-container-lowest/80 backdrop-blur-xl rounded-[32px] shadow-2xl border border-outline-variant p-8 w-full max-w-md relative z-10 my-8">

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

        <h1 className="text-2xl font-black text-on-surface text-center mb-1">Create account</h1>
        <p className="text-sm text-on-surface-variant text-center mb-7">
          Join CourseSphere today.
        </p>

        {/* General error banner */}
        {errors.general && (
          <div className="bg-error-container text-on-error-container text-sm rounded-2xl px-4 py-3 mb-5 border border-error/20">
            {errors.general}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Full Name */}
          <div>
            <label htmlFor="name" className="block font-label-caps text-label-caps text-on-surface-variant uppercase tracking-wider mb-1.5">
              Full Name
            </label>
            <div className="relative">
              <span className={iconCls}>person</span>
              <input
                id="name"
                name="name"
                type="text"
                autoComplete="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Your full name"
                className={fieldClass(errors.name)}
              />
            </div>
            {errors.name && <p className="text-xs text-error mt-1">{errors.name}</p>}
          </div>

          {/* Email */}
          <div>
            <label htmlFor="email" className="block font-label-caps text-label-caps text-on-surface-variant uppercase tracking-wider mb-1.5">
              Email
            </label>
            <div className="relative">
              <span className={iconCls}>mail</span>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="your@email.com"
                className={fieldClass(errors.email)}
              />
            </div>
            {errors.email && <p className="text-xs text-error mt-1">{errors.email}</p>}
          </div>

          {/* Student ID */}
          <div>
            <label htmlFor="student_id" className="block font-label-caps text-label-caps text-on-surface-variant uppercase tracking-wider mb-1.5">
              Student ID
            </label>
            <div className="relative">
              <span className={iconCls}>tag</span>
              <input
                id="student_id"
                name="student_id"
                type="text"
                value={formData.student_id}
                onChange={handleChange}
                placeholder="e.g. 2003012"
                className={fieldClass(errors.student_id)}
              />
            </div>
            {errors.student_id && <p className="text-xs text-error mt-1">{errors.student_id}</p>}
          </div>

          {/* Department */}
          <div>
            <label htmlFor="department" className="block font-label-caps text-label-caps text-on-surface-variant uppercase tracking-wider mb-1.5">
              Department
            </label>
            <select
              id="department"
              name="department"
              value={formData.department}
              onChange={handleChange}
              className={`w-full bg-surface border rounded-input px-3 py-3 text-on-surface font-body-md outline-none focus:ring-2 transition-colors ${
                errors.department
                  ? 'border-error focus:ring-error focus:border-error'
                  : 'border-outline-variant focus:ring-primary focus:border-primary'
              }`}
            >
              <option value="">Select Department</option>
              {DEPARTMENTS.map(d => <option key={d} value={d}>{d}</option>)}
            </select>
            {errors.department && <p className="text-xs text-error mt-1">{errors.department}</p>}
          </div>

          {/* Password */}
          <div>
            <label htmlFor="password" className="block font-label-caps text-label-caps text-on-surface-variant uppercase tracking-wider mb-1.5">
              Password
            </label>
            <div className="relative">
              <span className={iconCls}>lock</span>
              <input
                id="password"
                name="password"
                type={showPw ? 'text' : 'password'}
                autoComplete="new-password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Min. 6 characters"
                className={`${fieldClass(errors.password)} pr-10`}
              />
              <button
                type="button"
                onClick={() => setShowPw(!showPw)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-outline hover:text-on-surface-variant transition-colors"
              >
                {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {errors.password && <p className="text-xs text-error mt-1">{errors.password}</p>}
          </div>

          {/* Confirm Password */}
          <div>
            <label htmlFor="confirmPassword" className="block font-label-caps text-label-caps text-on-surface-variant uppercase tracking-wider mb-1.5">
              Confirm Password
            </label>
            <div className="relative">
              <span className={iconCls}>lock</span>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type={showConfirmPw ? 'text' : 'password'}
                autoComplete="new-password"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Repeat your password"
                className={`${fieldClass(errors.confirmPassword)} pr-10`}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPw(!showConfirmPw)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-outline hover:text-on-surface-variant transition-colors"
              >
                {showConfirmPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {errors.confirmPassword && <p className="text-xs text-error mt-1">{errors.confirmPassword}</p>}
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary text-on-primary py-3 px-4 rounded-btn font-body-md-bold hover:bg-primary-container transition-colors disabled:opacity-50 active:scale-[0.98] mt-1"
          >
            {loading ? 'Creating account...' : 'Create Account'}
          </button>
        </form>

        {/* Sign in link */}
        <p className="text-sm text-center text-on-surface-variant mt-6">
          Already have an account?{' '}
          <Link to="/login" className="text-primary font-semibold hover:underline">
            Sign in
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
