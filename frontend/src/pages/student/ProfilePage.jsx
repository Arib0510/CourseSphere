// Tarik's student Panel Frontend
import { useEffect, useState } from 'react'
import { User, Mail, Hash, Building2, Save, CheckCircle } from 'lucide-react'
import { toast } from 'react-toastify'
import { useAuth } from '../../context/AuthContext'
import { updateProfile } from '../../services/authService'
import Button from '../../components/common/Button'
import Loader from '../../components/common/Loader'

const departments = [
  'CSE', 'EEE', 'ETE', 'ME', 'CE', 'IPE', 'GCE', 'URP', 'ARCH', 'MSE', 'MME', 'BECM'
]

export default function ProfilePage() {
  const { user, setUser } = useAuth()
  const [formData, setFormData] = useState({
    name: '',
    student_id: '',
    department: '',
  })
  const [loading, setLoading] = useState(false)
  const [saved, setSaved] = useState(false)
  const [errors, setErrors] = useState({})

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        student_id: user.student_id || '',
        department: user.department || '',
      })
    }
  }, [user])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }))
  }

  const validate = () => {
    const newErrors = {}
    if (!formData.name.trim()) newErrors.name = 'Full name is required'
    return newErrors
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const validationErrors = validate()
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      return
    }
    setLoading(true)
    try {
      const res = await updateProfile(formData)
      const updatedUser = res.data.data || res.data
      setUser({ ...user, ...updatedUser })
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

  const initials = user.name
    ?.split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2) || 'U'

  return (
    <div className="pt-4 max-w-2xl">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[#2E2A27] mb-1">My Profile</h1>
        <p className="text-[#6B625C] text-sm">Manage your personal information and account settings.</p>
      </div>

      {/* Avatar & Info Card */}
      <div className="bg-white rounded-xl border border-[#E7DED6] shadow-sm mb-6 overflow-hidden">
        <div className="bg-gradient-to-r from-[#F9ECEE] to-[#F8F6F3] px-6 py-8 flex items-center gap-5">
          <div className="w-16 h-16 rounded-2xl bg-[#8B2E3C] flex items-center justify-center text-white text-2xl font-bold shadow-md">
            {initials}
          </div>
          <div>
            <h2 className="text-xl font-bold text-[#2E2A27]">{user.name}</h2>
            <p className="text-[#6B625C] text-sm">{user.email}</p>
            <div className="flex items-center gap-2 mt-1">
              <span className="bg-[#F9ECEE] text-[#8B2E3C] text-xs font-semibold px-2 py-0.5 rounded-full capitalize">
                {user.role || 'student'}
              </span>
              {user.department && (
                <span className="bg-[#F0F9FF] text-[#7CB9C8] text-xs font-semibold px-2 py-0.5 rounded-full">
                  {user.department}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Edit Form */}
      <div className="bg-white rounded-xl border border-[#E7DED6] shadow-sm p-6">
        <h3 className="font-bold text-[#2E2A27] mb-5 flex items-center gap-2">
          <User className="w-5 h-5 text-[#8B2E3C]" />
          Edit Profile
        </h3>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Full Name */}
          <div>
            <label className="block text-sm font-medium text-[#2E2A27] mb-1.5">Full Name</label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9A9189]" />
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Your full name"
                className={`w-full bg-[#F8F6F3] border rounded-lg pl-10 pr-4 py-2.5 text-sm text-[#2E2A27] placeholder:text-[#9A9189] focus:outline-none focus:ring-2 transition-colors ${
                  errors.name ? 'border-[#C65A5A] focus:ring-[#C65A5A]/30' : 'border-[#E7DED6] focus:ring-[#8B2E3C]/30 focus:border-[#8B2E3C]'
                }`}
              />
            </div>
            {errors.name && <p className="text-xs text-[#C65A5A] mt-1">{errors.name}</p>}
          </div>

          {/* Email (read-only) */}
          <div>
            <label className="block text-sm font-medium text-[#2E2A27] mb-1.5">
              Email <span className="text-[#9A9189] font-normal">(read-only)</span>
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9A9189]" />
              <input
                type="email"
                value={user.email || ''}
                readOnly
                className="w-full bg-[#F5F1EC] border border-[#E7DED6] rounded-lg pl-10 pr-4 py-2.5 text-sm text-[#9A9189] cursor-not-allowed"
              />
            </div>
          </div>

          {/* Student ID */}
          <div>
            <label className="block text-sm font-medium text-[#2E2A27] mb-1.5">Student ID</label>
            <div className="relative">
              <Hash className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9A9189]" />
              <input
                type="text"
                name="student_id"
                value={formData.student_id}
                onChange={handleChange}
                placeholder="e.g. 2003012"
                className="w-full bg-[#F8F6F3] border border-[#E7DED6] rounded-lg pl-10 pr-4 py-2.5 text-sm text-[#2E2A27] placeholder:text-[#9A9189] focus:outline-none focus:ring-2 focus:ring-[#8B2E3C]/30 focus:border-[#8B2E3C] transition-colors"
              />
            </div>
          </div>

          {/* Department */}
          <div>
            <label className="block text-sm font-medium text-[#2E2A27] mb-1.5">Department</label>
            <div className="relative">
              <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9A9189]" />
              <select
                name="department"
                value={formData.department}
                onChange={handleChange}
                className="w-full bg-[#F8F6F3] border border-[#E7DED6] rounded-lg pl-10 pr-4 py-2.5 text-sm text-[#2E2A27] focus:outline-none focus:ring-2 focus:ring-[#8B2E3C]/30 focus:border-[#8B2E3C] transition-colors appearance-none"
              >
                <option value="">Select Department</option>
                {departments.map(dept => (
                  <option key={dept} value={dept}>{dept}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="pt-2">
            <Button
              type="submit"
              disabled={loading}
              variant={saved ? 'success' : 'primary'}
              size="md"
              className="min-w-[140px]"
            >
              {saved ? (
                <>
                  <CheckCircle className="w-4 h-4" />
                  Saved!
                </>
              ) : loading ? (
                'Saving...'
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  Save Changes
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
