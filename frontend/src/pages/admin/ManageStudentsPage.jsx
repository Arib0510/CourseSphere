import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { toast } from 'react-toastify'
import {
  getAllStudents,
  getAllRegistrations,
  createStudent,
  updateStudent,
  deleteStudent,
} from '../../services/adminService'
import Loader from '../../components/common/Loader'

const DEPARTMENTS = ['CSE', 'EEE', 'ETE', 'ME', 'CE', 'IPE', 'GCE', 'URP', 'ARCH', 'MSE', 'MME', 'BECM']

// ── Shared modal shell ──────────────────────────────────────────────────────
function Modal({ title, onClose, children }) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="bg-surface-container-lowest border border-outline-variant rounded-[24px] shadow-xl max-w-lg w-full max-h-[90vh] overflow-y-auto"
        onClick={e => e.stopPropagation()}
      >
        <div className="p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-h1 text-h1 text-on-surface">{title}</h2>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-surface-container transition-colors"
            >
              <span className="material-symbols-outlined text-[20px] text-on-surface-variant">close</span>
            </button>
          </div>
          {children}
        </div>
      </div>
    </div>
  )
}

// ── Student detail view ─────────────────────────────────────────────────────
function StudentDetailModal({ student, onClose, onEdit, onDelete }) {
  const [regs, setRegs] = useState([])
  const [loadingRegs, setLoadingRegs] = useState(true)

  useEffect(() => {
    getAllRegistrations()
      .then(res => {
        const all = res.data.data || res.data || []
        setRegs(all.filter(r => r.student?.id === student.id || r.user?.id === student.id))
      })
      .catch(() => {})
      .finally(() => setLoadingRegs(false))
  }, [student.id])

  const fmt = (d) => d ? new Date(d).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }) : '—'
  const initials = (name) => name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || '?'
  const totalCredits = regs.reduce((s, r) => s + (r.course?.credits || 0), 0)

  return (
    <Modal title="Student Details" onClose={onClose}>
      {/* Avatar + name */}
      <div className="flex items-center gap-4 mb-6 pb-5 border-b border-outline-variant">
        <div className="w-16 h-16 rounded-full bg-primary-container text-primary text-xl font-body-md-bold flex items-center justify-center shrink-0">
          {initials(student.name)}
        </div>
        <div>
          <h3 className="font-body-md-bold text-on-surface text-lg">{student.name}</h3>
          <p className="text-sm text-on-surface-variant font-body-md">{student.student_id || '—'}</p>
          <span className="inline-block mt-1 bg-secondary-fixed text-primary text-xs rounded-full px-2.5 py-0.5 font-body-md-bold">
            {student.department || 'No Dept'}
          </span>
        </div>
      </div>

      {/* Info grid */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        {[
          { icon: 'tag', label: 'Student ID', value: student.student_id || '—' },
          { icon: 'apartment', label: 'Department', value: student.department || '—' },
          { icon: 'mail', label: 'Email', value: student.email || '—' },
          { icon: 'calendar_month', label: 'Member Since', value: fmt(student.created_at) },
          { icon: 'menu_book', label: 'Total Courses', value: loadingRegs ? '…' : regs.length },
          { icon: 'grade', label: 'Total Credits', value: loadingRegs ? '…' : totalCredits.toFixed(1) },
        ].map(({ icon, label, value }) => (
          <div key={label} className="border border-outline-variant rounded-xl p-3 flex items-start gap-2.5">
            <div className="w-8 h-8 rounded-full bg-primary-fixed flex items-center justify-center shrink-0 mt-0.5">
              <span className="material-symbols-outlined text-primary text-[16px]">{icon}</span>
            </div>
            <div className="min-w-0">
              <p className="font-label-caps text-on-surface-variant uppercase tracking-wider text-[10px]">{label}</p>
              <p className="font-body-md-bold text-on-surface text-sm mt-0.5 truncate">{value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Registered courses */}
      <h4 className="font-label-caps text-on-surface-variant uppercase tracking-wider text-xs mb-3">Registered Courses</h4>
      {loadingRegs ? (
        <div className="flex items-center justify-center py-8">
          <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      ) : regs.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-8 gap-2">
          <span className="material-symbols-outlined text-[36px] text-on-surface-variant">menu_book</span>
          <p className="text-sm text-on-surface-variant font-body-md">No courses registered</p>
        </div>
      ) : (
        <div className="border border-outline-variant rounded-2xl overflow-hidden mb-4">
          <table className="w-full">
            <thead>
              <tr>
                {['Course', 'Credits', 'Date'].map(h => (
                  <th key={h} className={`bg-surface-container border-b border-outline-variant font-label-caps text-on-surface-variant uppercase tracking-wider h-[40px] px-4 text-left text-xs${h === 'Date' ? ' hidden sm:table-cell' : ''}`}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {regs.slice(0, 5).map(reg => (
                <tr key={reg.registration_id || reg.id} className="hover:bg-surface transition-colors border-b border-outline-variant last:border-0">
                  <td className="px-4 py-3">
                    <p className="font-body-md-bold text-on-surface text-xs">{reg.course?.course_no || '—'}</p>
                    <p className="text-on-surface-variant text-xs truncate max-w-[200px]">{reg.course?.course_title || '—'}</p>
                  </td>
                  <td className="px-4 py-3 text-on-surface-variant text-xs font-body-md">{reg.course?.credits ?? '—'}</td>
                  <td className="px-4 py-3 text-on-surface-variant text-xs font-body-md hidden sm:table-cell">{fmt(reg.registered_at || reg.created_at)}</td>
                </tr>
              ))}
              {regs.length > 5 && (
                <tr>
                  <td colSpan={3} className="px-4 py-3 text-center text-xs text-on-surface-variant font-body-md">
                    + {regs.length - 5} more courses
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Action buttons */}
      <div className="flex gap-3 pt-2">
        <button
          onClick={() => { onClose(); onEdit(student) }}
          className="flex-1 flex items-center justify-center gap-2 bg-primary text-on-primary font-body-md-bold py-2.5 rounded-btn hover:bg-primary/90 transition-colors text-sm"
        >
          <span className="material-symbols-outlined text-[18px]">edit</span>
          Edit
        </button>
        <button
          onClick={() => { onClose(); onDelete(student) }}
          className="flex items-center justify-center gap-2 border border-error text-error font-body-md-bold px-4 py-2.5 rounded-btn hover:bg-error-container transition-colors text-sm"
        >
          <span className="material-symbols-outlined text-[18px]">delete</span>
          Delete
        </button>
        <button
          onClick={onClose}
          className="flex items-center justify-center border border-outline-variant text-on-surface-variant font-body-md-bold px-4 py-2.5 rounded-btn hover:bg-surface-container transition-colors text-sm"
        >
          Close
        </button>
      </div>
    </Modal>
  )
}

// ── Add / Edit student form modal ───────────────────────────────────────────
function StudentFormModal({ student, onClose, onSaved }) {
  const isEdit = !!student
  const [form, setForm] = useState({
    full_name: student?.name || '',
    student_id: student?.student_id || '',
    department: student?.department || '',
    email: '',
    password: '',
  })
  const [saving, setSaving] = useState(false)

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      if (isEdit) {
        await updateStudent(student.id, {
          full_name: form.full_name,
          student_id: form.student_id || null,
          department: form.department || null,
        })
        toast.success('Student updated successfully.')
      } else {
        if (!form.email || !form.password) {
          toast.error('Email and password are required.')
          setSaving(false)
          return
        }
        await createStudent({
          email: form.email,
          password: form.password,
          full_name: form.full_name,
          student_id: form.student_id || null,
          department: form.department || null,
        })
        toast.success('Student created successfully.')
      }
      onSaved()
      onClose()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Operation failed.')
    } finally {
      setSaving(false)
    }
  }

  const inputCls = 'w-full bg-surface-container-low border border-outline-variant rounded-input px-4 py-2.5 text-sm text-on-surface placeholder:text-on-surface-variant font-body-md outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all'

  return (
    <Modal title={isEdit ? 'Edit Student' : 'Add New Student'} onClose={onClose}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-label-caps text-on-surface-variant uppercase tracking-wider mb-1.5">Full Name</label>
          <input className={inputCls} value={form.full_name} onChange={e => set('full_name', e.target.value)} placeholder="e.g. Rahim Uddin" required />
        </div>

        <div>
          <label className="block text-xs font-label-caps text-on-surface-variant uppercase tracking-wider mb-1.5">Student ID</label>
          <input className={inputCls} value={form.student_id} onChange={e => set('student_id', e.target.value)} placeholder="e.g. 2001001" />
        </div>

        <div>
          <label className="block text-xs font-label-caps text-on-surface-variant uppercase tracking-wider mb-1.5">Department</label>
          <select className={inputCls} value={form.department} onChange={e => set('department', e.target.value)}>
            <option value="">— Select department —</option>
            {DEPARTMENTS.map(d => <option key={d} value={d}>{d}</option>)}
          </select>
        </div>

        {!isEdit && (
          <>
            <div>
              <label className="block text-xs font-label-caps text-on-surface-variant uppercase tracking-wider mb-1.5">Email</label>
              <input className={inputCls} type="email" value={form.email} onChange={e => set('email', e.target.value)} placeholder="student@example.com" required />
            </div>
            <div>
              <label className="block text-xs font-label-caps text-on-surface-variant uppercase tracking-wider mb-1.5">Password</label>
              <input className={inputCls} type="password" value={form.password} onChange={e => set('password', e.target.value)} placeholder="Min 6 characters" required minLength={6} />
            </div>
          </>
        )}

        <div className="flex gap-3 pt-2">
          <button
            type="submit"
            disabled={saving}
            className="flex-1 flex items-center justify-center gap-2 bg-primary text-on-primary font-body-md-bold py-2.5 rounded-btn hover:bg-primary/90 transition-colors text-sm disabled:opacity-60"
          >
            {saving ? (
              <div className="w-4 h-4 border-2 border-on-primary border-t-transparent rounded-full animate-spin" />
            ) : (
              <span className="material-symbols-outlined text-[18px]">{isEdit ? 'save' : 'person_add'}</span>
            )}
            {isEdit ? 'Save Changes' : 'Create Student'}
          </button>
          <button
            type="button"
            onClick={onClose}
            className="border border-outline-variant text-on-surface-variant font-body-md-bold px-4 py-2.5 rounded-btn hover:bg-surface-container transition-colors text-sm"
          >
            Cancel
          </button>
        </div>
      </form>
    </Modal>
  )
}

// ── Delete confirmation modal ───────────────────────────────────────────────
function StudentDeleteModal({ student, onClose, onDeleted }) {
  const [deleting, setDeleting] = useState(false)

  const handleDelete = async () => {
    setDeleting(true)
    try {
      await deleteStudent(student.id)
      toast.success('Student deleted successfully.')
      onDeleted()
      onClose()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Delete failed.')
    } finally {
      setDeleting(false)
    }
  }

  return (
    <Modal title="Delete Student" onClose={onClose}>
      <div className="flex flex-col items-center text-center gap-4 py-2">
        <div className="w-14 h-14 rounded-full bg-error-container flex items-center justify-center">
          <span className="material-symbols-outlined text-[28px] text-error">person_remove</span>
        </div>
        <div>
          <p className="font-body-md-bold text-on-surface">Delete <span className="text-error">{student.name}</span>?</p>
          <p className="text-sm text-on-surface-variant font-body-md mt-1">
            This will permanently delete the student account and all associated data. This cannot be undone.
          </p>
        </div>
      </div>
      <div className="flex gap-3 pt-4">
        <button
          onClick={handleDelete}
          disabled={deleting}
          className="flex-1 flex items-center justify-center gap-2 bg-error text-on-error font-body-md-bold py-2.5 rounded-btn hover:bg-error/90 transition-colors text-sm disabled:opacity-60"
        >
          {deleting ? <div className="w-4 h-4 border-2 border-on-error border-t-transparent rounded-full animate-spin" /> : <span className="material-symbols-outlined text-[18px]">delete_forever</span>}
          {deleting ? 'Deleting…' : 'Delete Student'}
        </button>
        <button
          onClick={onClose}
          className="border border-outline-variant text-on-surface-variant font-body-md-bold px-4 py-2.5 rounded-btn hover:bg-surface-container transition-colors text-sm"
        >
          Cancel
        </button>
      </div>
    </Modal>
  )
}

// ── Main page ───────────────────────────────────────────────────────────────
export default function ManageStudentsPage() {
  const [searchParams] = useSearchParams()
  const [students, setStudents] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState(searchParams.get('search') || '')
  const [deptFilter, setDeptFilter] = useState('')

  const [detailStudent, setDetailStudent]   = useState(null)
  const [editStudent,   setEditStudent]     = useState(null)
  const [deleteStudent_, setDeleteStudent_] = useState(null)
  const [showAddModal,  setShowAddModal]    = useState(false)

  const load = () => {
    setLoading(true)
    getAllStudents()
      .then(res => setStudents(res.data.data || res.data || []))
      .catch(() => toast.error('Failed to load students'))
      .finally(() => setLoading(false))
  }

  useEffect(load, [])

  const departments = [...new Set(students.map(s => s.department).filter(Boolean))].sort()

  const filtered = students.filter(s => {
    const q = search.toLowerCase()
    const matchesSearch =
      s.name?.toLowerCase().includes(q) ||
      s.email?.toLowerCase().includes(q) ||
      s.student_id?.toLowerCase().includes(q)
    const matchesDept = !deptFilter || s.department === deptFilter
    return matchesSearch && matchesDept
  })

  const initials = (name) => name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || '?'

  return (
    <>
      <div className="space-y-8 pb-10">
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <h1 className="font-display text-display text-on-background">Manage Students</h1>
          <div className="flex items-center gap-3">
            <span className="bg-secondary-fixed text-primary text-sm rounded-full px-3 py-1 font-body-md-bold">
              {filtered.length} student{filtered.length !== 1 ? 's' : ''}
            </span>
            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center gap-2 bg-primary text-on-primary font-body-md-bold px-4 py-2 rounded-btn hover:bg-primary/90 transition-colors text-sm"
            >
              <span className="material-symbols-outlined text-[18px]">person_add</span>
              Add Student
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant p-4 flex flex-wrap items-center gap-3">
          <div className="relative flex items-center gap-3 bg-surface-container-low border border-outline-variant rounded-2xl px-4 py-2.5 flex-1 min-w-[200px] max-w-sm">
            <span className="material-symbols-outlined text-[20px] text-on-surface-variant">search</span>
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search by name, email, or ID..."
              className="bg-transparent outline-none text-sm text-on-surface w-full placeholder:text-on-surface-variant font-body-md"
            />
            {search && (
              <button onClick={() => setSearch('')} className="text-on-surface-variant hover:text-on-surface">
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            )}
          </div>

          <select
            value={deptFilter}
            onChange={e => setDeptFilter(e.target.value)}
            className="bg-surface-container-low border border-outline-variant rounded-input px-4 py-2.5 focus:ring-2 focus:ring-primary focus:border-transparent text-on-surface font-body-md outline-none text-sm"
          >
            <option value="">All Departments</option>
            {(departments.length ? departments : DEPARTMENTS).map(dept => (
              <option key={dept} value={dept}>{dept}</option>
            ))}
          </select>

          {(search || deptFilter) && (
            <button
              onClick={() => { setSearch(''); setDeptFilter('') }}
              className="border border-outline-variant text-on-surface-variant px-3 py-2 rounded-btn font-body-md hover:bg-surface-container transition-colors text-xs flex items-center gap-1.5"
            >
              <span className="material-symbols-outlined text-[16px]">filter_list_off</span>
              Clear
            </button>
          )}
        </div>

        {/* Table */}
        {loading ? (
          <Loader />
        ) : (
          <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant overflow-hidden shadow-[0_4px_20px_rgba(0,0,0,0.03)]">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr>
                    <th className="bg-surface-container border-b border-outline-variant font-label-caps text-on-surface-variant uppercase tracking-wider h-[48px] px-4 text-left text-xs">Student</th>
                    <th className="bg-surface-container border-b border-outline-variant font-label-caps text-on-surface-variant uppercase tracking-wider h-[48px] px-4 text-left text-xs">Student ID</th>
                    <th className="bg-surface-container border-b border-outline-variant font-label-caps text-on-surface-variant uppercase tracking-wider h-[48px] px-4 text-left text-xs hidden md:table-cell">Email</th>
                    <th className="bg-surface-container border-b border-outline-variant font-label-caps text-on-surface-variant uppercase tracking-wider h-[48px] px-4 text-left text-xs hidden lg:table-cell">Department</th>
                    <th className="bg-surface-container border-b border-outline-variant font-label-caps text-on-surface-variant uppercase tracking-wider h-[48px] px-4 text-right text-xs">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="text-center py-16">
                        <span className="material-symbols-outlined text-[48px] text-on-surface-variant block mb-2">manage_accounts</span>
                        <p className="text-on-surface-variant font-body-md text-sm">No students found</p>
                      </td>
                    </tr>
                  ) : (
                    filtered.map(student => (
                      <tr key={student.id} className="hover:bg-surface transition-colors h-[56px] border-b border-outline-variant last:border-0">
                        <td className="px-4 font-body-md text-on-surface text-sm">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-full bg-primary-container text-primary text-xs font-body-md-bold flex items-center justify-center shrink-0">
                              {initials(student.name)}
                            </div>
                            <span className="font-body-md-bold text-on-surface">{student.name}</span>
                          </div>
                        </td>
                        <td className="px-4 font-body-md text-on-surface text-sm">
                          <span className="font-mono text-xs text-on-surface-variant">{student.student_id || '—'}</span>
                        </td>
                        <td className="px-4 font-body-md text-on-surface text-sm hidden md:table-cell">
                          <span className="text-on-surface-variant text-xs truncate max-w-[180px] block">{student.email}</span>
                        </td>
                        <td className="px-4 font-body-md text-on-surface text-sm hidden lg:table-cell">
                          {student.department ? (
                            <span className="bg-secondary-fixed text-primary text-xs rounded-full px-2.5 py-0.5 font-body-md-bold">{student.department}</span>
                          ) : (
                            <span className="text-on-surface-variant">—</span>
                          )}
                        </td>
                        <td className="px-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => setDetailStudent(student)}
                              className="w-8 h-8 rounded-full flex items-center justify-center border border-outline-variant text-on-surface-variant hover:bg-surface-container hover:text-primary transition-colors"
                              title="View details"
                            >
                              <span className="material-symbols-outlined text-[16px]">visibility</span>
                            </button>
                            <button
                              onClick={() => setEditStudent(student)}
                              className="w-8 h-8 rounded-full flex items-center justify-center border border-outline-variant text-on-surface-variant hover:bg-surface-container hover:text-primary transition-colors"
                              title="Edit student"
                            >
                              <span className="material-symbols-outlined text-[16px]">edit</span>
                            </button>
                            <button
                              onClick={() => setDeleteStudent_(student)}
                              className="w-8 h-8 rounded-full flex items-center justify-center border border-outline-variant text-on-surface-variant hover:bg-error-container hover:text-error transition-colors"
                              title="Delete student"
                            >
                              <span className="material-symbols-outlined text-[16px]">delete</span>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {detailStudent && (
        <StudentDetailModal
          student={detailStudent}
          onClose={() => setDetailStudent(null)}
          onEdit={(s) => setEditStudent(s)}
          onDelete={(s) => setDeleteStudent_(s)}
        />
      )}

      {editStudent && (
        <StudentFormModal
          student={editStudent}
          onClose={() => setEditStudent(null)}
          onSaved={load}
        />
      )}

      {showAddModal && (
        <StudentFormModal
          student={null}
          onClose={() => setShowAddModal(false)}
          onSaved={load}
        />
      )}

      {deleteStudent_ && (
        <StudentDeleteModal
          student={deleteStudent_}
          onClose={() => setDeleteStudent_(null)}
          onDeleted={load}
        />
      )}
    </>
  )
}
