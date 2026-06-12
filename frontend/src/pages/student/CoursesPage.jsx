// Tarik's student Panel Frontend
import { useEffect, useState, useCallback } from 'react'
import { getCourses } from '../../services/courseService'
import { getMyRegistrations } from '../../services/registrationService'
import CourseCard from '../../components/courses/CourseCard'
import CourseFilters from '../../components/courses/CourseFilters'
import SkeletonCard from '../../components/common/SkeletonCard'

const YEAR_ORDER = ['1st Year', '2nd Year', '3rd Year', '4th Year', 'Elective']
const SEM_ORDER  = ['Odd', 'Even']

function groupCourses(courses) {
  const groups = {}
  for (const c of courses) {
    const year = c.academic_year || 'Other'
    const sem  = c.semester      || 'Other'
    const key  = `${year}||${sem}`
    if (!groups[key]) groups[key] = { year, sem, courses: [] }
    groups[key].courses.push(c)
  }
  return Object.values(groups).sort((a, b) => {
    const yi = YEAR_ORDER.indexOf(a.year)
    const yj = YEAR_ORDER.indexOf(b.year)
    if (yi !== yj) return (yi === -1 ? 99 : yi) - (yj === -1 ? 99 : yj)
    const si = SEM_ORDER.indexOf(a.sem)
    const sj = SEM_ORDER.indexOf(b.sem)
    return (si === -1 ? 99 : si) - (sj === -1 ? 99 : sj)
  })
}

export default function CoursesPage() {
  const [courses, setCourses]               = useState([])
  const [registeredIds, setRegisteredIds]   = useState([])
  const [loading, setLoading]               = useState(true)
  const [search, setSearch]                 = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')
  const [yearFilter, setYearFilter]         = useState('')
  const [semFilter, setSemFilter]           = useState('')
  const [categoryFilter, setCategoryFilter] = useState('')

  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search), 300)
    return () => clearTimeout(t)
  }, [search])

  const fetchData = useCallback(() => {
    setLoading(true)
    const params = {}
    if (debouncedSearch) params.search        = debouncedSearch
    if (yearFilter)      params.academic_year = yearFilter
    if (semFilter)       params.semester      = semFilter
    if (categoryFilter)  params.category      = categoryFilter

    Promise.all([getCourses(params), getMyRegistrations()])
      .then(([coursesRes, regsRes]) => {
        setCourses(coursesRes.data.data || coursesRes.data || [])
        const regs = regsRes.data.data || regsRes.data || []
        setRegisteredIds(regs.map(r => r.course_id || r.course?.id))
      })
      .catch(() => setCourses([]))
      .finally(() => setLoading(false))
  }, [debouncedSearch, yearFilter, semFilter, categoryFilter])

  useEffect(() => { fetchData() }, [fetchData])

  const handleRegisterSuccess = (id) =>
    setRegisteredIds(prev => [...prev, id])

  const groups = groupCourses(courses)
  const isFiltered = !!(debouncedSearch || yearFilter || semFilter || categoryFilter)

  return (
    <div className="pt-4 pb-10">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-cs-on-surface tracking-tight">Browse Courses</h1>
        <p className="text-cs-on-sv mt-1">
          Explore and register for upcoming semester classes.
        </p>
      </div>

      {/* Filters */}
      <CourseFilters
        search={search}
        setSearch={setSearch}
        yearFilter={yearFilter}
        setYearFilter={setYearFilter}
        semFilter={semFilter}
        setSemFilter={setSemFilter}
        categoryFilter={categoryFilter}
        setCategoryFilter={setCategoryFilter}
      />

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)}
        </div>
      ) : courses.length === 0 ? (
        <div className="bg-cs-surface rounded-2xl border border-cs-border p-12 text-center shadow-card">
          <span className="material-symbols-outlined text-5xl text-cs-muted mb-3 block">menu_book</span>
          <h3 className="font-semibold text-cs-on-surface mb-1">No courses found</h3>
          <p className="text-sm text-cs-on-sv">Try adjusting your filters or search term.</p>
        </div>
      ) : isFiltered ? (
        <>
          <p className="text-xs text-cs-muted uppercase tracking-widest font-semibold mb-5">
            {courses.length} result{courses.length !== 1 ? 's' : ''}
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {courses.map(course => (
              <CourseCard
                key={course.id}
                course={course}
                registeredIds={registeredIds}
                onRegisterSuccess={handleRegisterSuccess}
              />
            ))}
          </div>
        </>
      ) : (
        <div className="space-y-10">
          {groups.map(({ year, sem, courses: gc }) => (
            <div key={`${year}-${sem}`}>
              <div className="flex items-center gap-3 mb-5">
                <div>
                  <h2 className="text-lg font-bold text-cs-on-surface">{year}</h2>
                  <p className="text-xs font-semibold text-cs-muted uppercase tracking-widest">
                    {sem} Semester · {gc.length} course{gc.length !== 1 ? 's' : ''}
                  </p>
                </div>
                <div className="flex-1 h-px bg-cs-border" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {gc.map(course => (
                  <CourseCard
                    key={course.id}
                    course={course}
                    registeredIds={registeredIds}
                    onRegisterSuccess={handleRegisterSuccess}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
