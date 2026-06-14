import { useEffect, useState, useRef } from 'react'
import { toast } from 'react-toastify'
import { useAuth } from '../../context/AuthContext'
import { updateProfile } from '../../services/authService'
import Loader from '../../components/common/Loader'

const DEPARTMENTS = ['CSE', 'EEE', 'ETE', 'ME', 'CE', 'IPE', 'GCE', 'URP', 'ARCH', 'MSE', 'MME', 'BECM']

export default function ProfilePage() {
  const { user, setUser } = useAuth()

  const [formData, setFormData] = useState({ name: '', student_id: '', department: '', registration_no: '', academic_session: '', earned_credits: '', backlog_count: '', name_bangla: '', father_name: '', father_name_bangla: '', address_current: '' })
  const [loading, setLoading] = useState(false)
  const [saved, setSaved] = useState(false)
  const [errors, setErrors] = useState({})
  const [avatarSrc, setAvatarSrc] = useState(null)
  const [avatarHover, setAvatarHover] = useState(false)
  const fileRef = useRef(null)

  /* populate form + avatar from localStorage */
  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        student_id: user.student_id || '',
        department: user.department || '',
        registration_no: user.registration_no || '',
        academic_session: user.academic_session || '',
        earned_credits: user.earned_credits != null ? String(user.earned_credits) : '',
        backlog_count: user.backlog_count != null ? String(user.backlog_count) : '',
        name_bangla: user.name_bangla || '',
        father_name: user.father_name || '',
        father_name_bangla: user.father_name_bangla || '',
        address_current: user.address_current || '',
      })
      const stored = localStorage.getItem(`avatar_${user.id}`)
      if (stored) setAvatarSrc(stored)
    }
  }, [user])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }))
    setSaved(false)
  }

  const validate = () => {
    const e = {}
    if (!formData.name.trim()) e.name = 'Full name is required'
    return e
  }

  const hasChanges =
    formData.name !== (user?.name || '') ||
    formData.student_id !== (user?.student_id || '') ||
    formData.department !== (user?.department || '') ||
    formData.registration_no !== (user?.registration_no || '') ||
    formData.academic_session !== (user?.academic_session || '') ||
    formData.earned_credits !== (user?.earned_credits != null ? String(user.earned_credits) : '') ||
    formData.backlog_count !== (user?.backlog_count != null ? String(user.backlog_count) : '') ||
    formData.name_bangla !== (user?.name_bangla || '') ||
    formData.father_name !== (user?.father_name || '') ||
    formData.father_name_bangla !== (user?.father_name_bangla || '') ||
    formData.address_current !== (user?.address_current || '')

  /* avatar file pick */
  const handleAvatarClick = () => fileRef.current?.click()

  const handleAvatarChange = (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (file.size > 2 * 1024 * 1024) {
      toast.error('Image must be under 2 MB')
      return
    }
    const reader = new FileReader()
    reader.onload = (ev) => {
      const base64 = ev.target.result
      setAvatarSrc(base64)
      if (user?.id) {
        localStorage.setItem(`avatar_${user.id}`, base64)
        toast.success('Profile photo updated!')
      }
    }
    reader.readAsDataURL(file)
    e.target.value = ''
  }

  const handleRemoveAvatar = () => {
    setAvatarSrc(null)
    if (user?.id) localStorage.removeItem(`avatar_${user.id}`)
    toast.success('Profile photo removed')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const validationErrors = validate()
    if (Object.keys(validationErrors).length > 0) { setErrors(validationErrors); return }
    setLoading(true)
    try {
      const payload = {
        full_name: formData.name,
        student_id: formData.student_id,
        department: formData.department,
        registration_no: formData.registration_no.trim() || null,
        academic_session: formData.academic_session.trim() || null,
        earned_credits: formData.earned_credits !== '' ? Number(formData.earned_credits) : null,
        backlog_count: formData.backlog_count !== '' ? Number(formData.backlog_count) : null,
        name_bangla: formData.name_bangla.trim() || null,
        father_name: formData.father_name.trim() || null,
        father_name_bangla: formData.father_name_bangla.trim() || null,
        address_current: formData.address_current.trim() || null,
      }
      const res = await updateProfile(payload)
      const updated = res.data?.data || res.data
      setUser({
        ...user, ...updated,
        name: formData.name, full_name: formData.name,
        registration_no: payload.registration_no,
        academic_session: payload.academic_session,
        earned_credits: payload.earned_credits,
        backlog_count: payload.backlog_count,
        name_bangla: payload.name_bangla,
        father_name: payload.father_name,
        father_name_bangla: payload.father_name_bangla,
        address_current: payload.address_current,
      })
      setSaved(true)
      toast.success('Profile updated successfully!')
      setTimeout(() => setSaved(false), 3000)
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update profile')
    } finally {
      setLoading(false)
    }
  }

  if (!user) return <Loader size="lg" />

  const initials = user.name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || 'U'

  return (
    <div className="pt-4 pb-10 page-enter">
      {/* Page header */}
      <div className="mb-8 animate-fade-in-up">
        <h1 className="font-display text-display text-on-background">My Profile</h1>
        <p className="text-on-surface-variant font-body-md mt-1">
          Manage your personal information and account settings.
        </p>
      </div>

      <div className="max-w-2xl mx-auto space-y-6">

        {/* ── Avatar Card ──────────────────────────────── */}
        <div className="bg-surface-container-lowest rounded-[20px] border border-outline-variant shadow-card p-6 flex flex-col sm:flex-row items-center gap-6 animate-fade-in-up stagger-1 transition-colors duration-300">

          {/* Avatar with upload overlay */}
          <div
            className="relative shrink-0 cursor-pointer group"
            onMouseEnter={() => setAvatarHover(true)}
            onMouseLeave={() => setAvatarHover(false)}
            onClick={handleAvatarClick}
          >
            <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-primary-fixed transition-all duration-300 group-hover:border-primary group-hover:shadow-burgundy">
              {avatarSrc ? (
                <img src={avatarSrc} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full bg-primary-container text-on-primary-container flex items-center justify-center text-[28px] font-bold select-none">
                  {initials}
                </div>
              )}
            </div>

            {/* Upload overlay */}
            <div className={`absolute inset-0 rounded-full bg-black/50 flex flex-col items-center justify-center transition-all duration-200 ${avatarHover ? 'opacity-100' : 'opacity-0'}`}>
              <span className="material-symbols-outlined text-white text-[22px]" style={{ fontVariationSettings: "'FILL' 1" }}>photo_camera</span>
              <span className="text-white text-[10px] font-semibold mt-0.5">Change</span>
            </div>

            {/* Camera badge */}
            <div className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-primary text-on-primary flex items-center justify-center border-2 border-surface-container-lowest shadow-sm pointer-events-none">
              <span className="material-symbols-outlined text-[14px]" style={{ fontVariationSettings: "'FILL' 1" }}>photo_camera</span>
            </div>

            {/* Hidden file input */}
            <input
              ref={fileRef}
              type="file"
              accept="image/png,image/jpeg,image/webp"
              className="hidden"
              onChange={handleAvatarChange}
            />
          </div>

          {/* User info */}
          <div className="text-center sm:text-left flex-1 min-w-0">
            <h2 className="font-h2 text-h2 text-on-background truncate">{formData.name || user.name}</h2>
            <p className="text-on-surface-variant font-body-md text-sm mt-0.5 truncate">{user.email}</p>

            <div className="flex items-center gap-2 mt-2.5 flex-wrap justify-center sm:justify-start">
              <span className="bg-secondary-fixed text-primary border border-secondary-fixed-dim px-2.5 py-0.5 rounded-full font-label-caps text-[10px] uppercase tracking-wider capitalize">
                {user.role || 'student'}
              </span>
              {(formData.department || user.department) && (
                <span className="bg-surface-container-high text-on-surface-variant border border-outline-variant px-2.5 py-0.5 rounded-full font-label-caps text-[10px] uppercase tracking-wider">
                  {formData.department || user.department}
                </span>
              )}
            </div>

            {/* Avatar actions */}
            <div className="flex gap-2 mt-3 justify-center sm:justify-start">
              <button
                type="button"
                onClick={handleAvatarClick}
                className="text-xs font-semibold text-primary hover:text-primary-container transition-colors flex items-center gap-1 bg-primary-fixed px-3 py-1.5 rounded-full"
              >
                <span className="material-symbols-outlined text-[14px]">upload</span>
                Upload Photo
              </button>
              {avatarSrc && (
                <button
                  type="button"
                  onClick={handleRemoveAvatar}
                  className="text-xs font-semibold text-error hover:text-error/80 transition-colors flex items-center gap-1 bg-error-container/30 px-3 py-1.5 rounded-full"
                >
                  <span className="material-symbols-outlined text-[14px]">delete</span>
                  Remove
                </button>
              )}
            </div>
            <p className="text-[10px] text-outline mt-1.5">JPG, PNG or WebP · Max 2 MB</p>
          </div>
        </div>

        {/* ── Form Card ────────────────────────────────── */}
        <div className="bg-surface-container-lowest rounded-[20px] border border-outline-variant shadow-card p-6 animate-fade-in-up stagger-2 transition-colors duration-300">

          <h3 className="font-body-md-bold text-primary mb-6 border-b border-outline-variant pb-3 flex items-center gap-2">
            <span className="material-symbols-outlined text-[18px]">manage_accounts</span>
            Edit Profile
          </h3>

          <form onSubmit={handleSubmit} noValidate>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-6">

              {/* Full Name */}
              <div className="sm:col-span-2">
                <label className="block font-label-caps text-on-surface-variant text-[10px] uppercase tracking-wider mb-1.5">
                  Full Name
                </label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-[18px]">person</span>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Your full name"
                    className={`w-full px-4 py-2.5 pl-10 bg-surface-container-low border rounded-input font-body-md text-on-background focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all ${errors.name ? 'border-error focus:ring-error' : 'border-outline-variant'
                      }`}
                  />
                </div>
                {errors.name && (
                  <p className="text-error text-xs mt-1 flex items-center gap-1">
                    <span className="material-symbols-outlined text-[13px]">error</span>
                    {errors.name}
                  </p>
                )}
              </div>

              {/* Email (read-only) */}
              <div className="sm:col-span-2">
                <label className="block font-label-caps text-on-surface-variant text-[10px] uppercase tracking-wider mb-1.5">
                  Email <span className="normal-case text-outline font-normal">(read-only)</span>
                </label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-[18px]">mail</span>
                  <input
                    type="email"
                    value={user.email || ''}
                    readOnly
                    className="w-full px-4 py-2.5 pl-10 bg-surface-container border border-outline-variant/50 rounded-input font-body-md text-on-surface-variant cursor-not-allowed outline-none"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2">
                    <span className="material-symbols-outlined text-[16px] text-outline">lock</span>
                  </span>
                </div>
              </div>

              {/* Student ID */}
              <div>
                <label className="block font-label-caps text-on-surface-variant text-[10px] uppercase tracking-wider mb-1.5">
                  Student ID
                </label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-[18px]">badge</span>
                  <input
                    type="text"
                    name="student_id"
                    value={formData.student_id}
                    onChange={handleChange}
                    placeholder="e.g. 2003012"
                    className="w-full px-4 py-2.5 pl-10 bg-surface-container-low border border-outline-variant rounded-input font-body-md text-on-background focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                  />
                </div>
              </div>

              {/* Department */}
              <div>
                <label className="block font-label-caps text-on-surface-variant text-[10px] uppercase tracking-wider mb-1.5">
                  Department
                </label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-[18px]">corporate_fare</span>
                  <select
                    name="department"
                    value={formData.department}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 pl-10 bg-surface-container-low border border-outline-variant rounded-input font-body-md text-on-background focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all appearance-none"
                  >
                    <option value="">Select Department</option>
                    {DEPARTMENTS.map(d => <option key={d} value={d}>{d}</option>)}
                  </select>
                  <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-outline text-[18px] pointer-events-none">expand_more</span>
                </div>
              </div>
            </div>

            {/* ── Registration Details for PDF Form ──── */}
            <div className="border-t border-outline-variant pt-5 mb-6">
              <div className="flex items-center gap-2 mb-1">
                <span className="material-symbols-outlined text-[16px] text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>picture_as_pdf</span>
                <h4 className="font-body-md-bold text-primary text-sm">Registration Details</h4>
              </div>
              <p className="text-[11px] text-on-surface-variant mb-4 font-body-md">
                Fill these fields to auto-populate your official RUET Course Registration PDF form.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">

                {/* Registration No. */}
                <div className="sm:col-span-2">
                  <label className="block font-label-caps text-on-surface-variant text-[10px] uppercase tracking-wider mb-1.5">
                    Registration Number <span className="normal-case font-normal">(নিবন্ধন সংখ্যা)</span>
                  </label>
                  <div className="relative">
                    <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-[18px]">tag</span>
                    <input
                      type="text"
                      name="registration_no"
                      value={formData.registration_no}
                      onChange={handleChange}
                      placeholder="e.g. 744 / 2022-23"
                      className="w-full px-4 py-2.5 pl-10 bg-surface-container-low border border-outline-variant rounded-input font-body-md text-on-background focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                    />
                  </div>
                </div>

                {/* Academic Session with Semester */}
                <div className="sm:col-span-2">
                  <label className="block font-label-caps text-on-surface-variant text-[10px] uppercase tracking-wider mb-1.5">
                    Academic Session with Semester
                  </label>
                  <div className="relative">
                    <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-[18px]">calendar_month</span>
                    <input
                      type="text"
                      name="academic_session"
                      value={formData.academic_session}
                      onChange={handleChange}
                      placeholder="e.g. 3rd year ODD semester"
                      className="w-full px-4 py-2.5 pl-10 bg-surface-container-low border border-outline-variant rounded-input font-body-md text-on-background focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                    />
                  </div>
                </div>

                {/* Previously Earned Credits */}
                <div>
                  <label className="block font-label-caps text-on-surface-variant text-[10px] uppercase tracking-wider mb-1.5">
                    Previously Earned Credits
                  </label>
                  <div className="relative">
                    <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-[18px]">military_tech</span>
                    <input
                      type="number"
                      name="earned_credits"
                      min="0"
                      step="0.5"
                      value={formData.earned_credits}
                      onChange={handleChange}
                      placeholder="e.g. 72.5"
                      className="w-full px-4 py-2.5 pl-10 bg-surface-container-low border border-outline-variant rounded-input font-body-md text-on-background focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                    />
                  </div>
                </div>

                {/* No. of Backlog Courses */}
                <div>
                  <label className="block font-label-caps text-on-surface-variant text-[10px] uppercase tracking-wider mb-1.5">
                    No. of Backlog Courses
                  </label>
                  <div className="relative">
                    <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-[18px]">report_problem</span>
                    <input
                      type="number"
                      name="backlog_count"
                      min="0"
                      value={formData.backlog_count}
                      onChange={handleChange}
                      placeholder="e.g. 2"
                      className="w-full px-4 py-2.5 pl-10 bg-surface-container-low border border-outline-variant rounded-input font-body-md text-on-background focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                    />
                  </div>
                </div>

              </div>
            </div>

            {/* ── Exam Form Details ───────────────────── */}
            <div className="border-t border-outline-variant pt-5 mb-6">
              <div className="flex items-center gap-2 mb-1">
                <span className="material-symbols-outlined text-[16px] text-secondary" style={{ fontVariationSettings: "'FILL' 1" }}>assignment</span>
                <h4 className="font-body-md-bold text-secondary text-sm">Exam Form Details</h4>
              </div>
              <p className="text-[11px] text-on-surface-variant mb-4 font-body-md">
                Fill these fields to auto-populate the official RUET B.Sc. Engineering Exam Application Form.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">

                {/* Name in Bengali */}
                <div className="sm:col-span-2">
                  <label className="block font-label-caps text-on-surface-variant text-[10px] uppercase tracking-wider mb-1.5">
                    Full Name in Bengali (বাংলা নাম)
                  </label>
                  <div className="relative">
                    <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-[18px]">translate</span>
                    <input
                      type="text"
                      name="name_bangla"
                      value={formData.name_bangla}
                      onChange={handleChange}
                      placeholder="যেমন: মোহাম্মদ রাফি"
                      className="w-full px-4 py-2.5 pl-10 bg-surface-container-low border border-outline-variant rounded-input font-body-md text-on-background focus:ring-2 focus:ring-secondary focus:border-transparent outline-none transition-all"
                    />
                  </div>
                </div>

                {/* Father's Name in English */}
                <div>
                  <label className="block font-label-caps text-on-surface-variant text-[10px] uppercase tracking-wider mb-1.5">
                    Father&apos;s Name (English)
                  </label>
                  <div className="relative">
                    <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-[18px]">person_outline</span>
                    <input
                      type="text"
                      name="father_name"
                      value={formData.father_name}
                      onChange={handleChange}
                      placeholder="e.g. Md. Rafiqul Islam"
                      className="w-full px-4 py-2.5 pl-10 bg-surface-container-low border border-outline-variant rounded-input font-body-md text-on-background focus:ring-2 focus:ring-secondary focus:border-transparent outline-none transition-all"
                    />
                  </div>
                </div>

                {/* Father's Name in Bengali */}
                <div>
                  <label className="block font-label-caps text-on-surface-variant text-[10px] uppercase tracking-wider mb-1.5">
                    Father&apos;s Name in Bengali (পিতার নাম)
                  </label>
                  <div className="relative">
                    <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-[18px]">person_outline</span>
                    <input
                      type="text"
                      name="father_name_bangla"
                      value={formData.father_name_bangla}
                      onChange={handleChange}
                      placeholder="যেমন: মোঃ রফিকুল ইসলাম"
                      className="w-full px-4 py-2.5 pl-10 bg-surface-container-low border border-outline-variant rounded-input font-body-md text-on-background focus:ring-2 focus:ring-secondary focus:border-transparent outline-none transition-all"
                    />
                  </div>
                </div>

                {/* Current Address */}
                <div className="sm:col-span-2">
                  <label className="block font-label-caps text-on-surface-variant text-[10px] uppercase tracking-wider mb-1.5">
                    Current Address (বর্তমান ঠিকানা)
                  </label>
                  <div className="relative">
                    <span className="material-symbols-outlined absolute left-3 top-3 text-outline text-[18px]">home</span>
                    <textarea
                      name="address_current"
                      value={formData.address_current}
                      onChange={handleChange}
                      rows={2}
                      placeholder="Village/Area, Post Office, District"
                      className="w-full px-4 py-2.5 pl-10 bg-surface-container-low border border-outline-variant rounded-input font-body-md text-on-background focus:ring-2 focus:ring-secondary focus:border-transparent outline-none transition-all resize-none"
                    />
                  </div>
                </div>

              </div>
            </div>

            {/* Save Row */}
            <div className="flex items-center justify-between pt-4 border-t border-outline-variant">
              <div className="min-h-[24px]">
                {hasChanges && !saved && (
                  <span className="font-body-md text-on-surface-variant text-sm flex items-center gap-1.5 animate-fade-in">
                    <span className="w-1.5 h-1.5 bg-primary rounded-full animate-pulse" />
                    Unsaved changes
                  </span>
                )}
                {saved && (
                  <span className="font-body-md text-sm flex items-center gap-1.5 text-tertiary animate-bounce-in">
                    <span className="material-symbols-outlined fill text-[16px]">check_circle</span>
                    All changes saved
                  </span>
                )}
              </div>
              <button
                type="submit"
                disabled={loading || (!hasChanges && !saved) || saved}
                className="bg-primary text-on-primary px-6 py-2.5 rounded-btn font-body-md-bold hover:bg-primary-container transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 active:scale-95"
              >
                {saved ? (
                  <>
                    <span className="material-symbols-outlined fill text-[18px]">check_circle</span>
                    Saved!
                  </>
                ) : loading ? (
                  <>
                    <span className="material-symbols-outlined text-[18px] animate-spin">progress_activity</span>
                    Saving...
                  </>
                ) : (
                  <>
                    <span className="material-symbols-outlined text-[18px]">save</span>
                    Save Changes
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* ── Account Meta ─────────────────────────────── */}
        <div className="bg-surface-container-lowest rounded-[20px] border border-outline-variant shadow-card p-5 animate-fade-in-up stagger-3 transition-colors duration-300">
          <h4 className="font-label-caps text-on-surface-variant uppercase tracking-wider text-[10px] mb-3 flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[14px]">info</span>
            Account Information
          </h4>
          <div className="space-y-0">
            {[
              { label: 'Account ID', value: user.id ? `${user.id.slice(0, 8)}...` : '—' },
              { label: 'Role', value: user.role || 'student' },
              {
                label: 'Member Since', value: user.created_at
                  ? new Date(user.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long' })
                  : '—'
              },
            ].map(({ label, value }) => (
              <div key={label} className="flex justify-between items-center py-3 border-b border-outline-variant/50 last:border-0">
                <span className="text-[11px] font-label-caps text-on-surface-variant uppercase tracking-wider">{label}</span>
                <span className="text-[11px] text-on-background font-medium capitalize">{value}</span>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  )
}
