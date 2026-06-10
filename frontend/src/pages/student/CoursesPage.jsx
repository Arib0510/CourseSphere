import { useEffect, useState, useCallback } from 'react'
import { useSearchParams } from 'react-router-dom'
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
  const [searchParams] = useSearchParams()

  const [courses, setCourses]               = useState([])
  const [registeredIds, setRegisteredIds]   = useState([])
  const [loading, setLoading]               = useState(true)
  const [search, setSearch]                 = useState(searchParams.get('search') || '')
  const [debouncedSearch, setDebouncedSearch] = useState(searchParams.get('search') || '')
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

    const coursesPromise = getCourses(params)
      .then(res => setCourses(res.data.data || res.data || []))
      .catch(() => setCourses([]))

    const regsPromise = getMyRegistrations()
      .then(res => {
        const regs = res.data.data || res.data || []
        setRegisteredIds(regs.map(r => r.course?.id).filter(Boolean))
      })
      .catch(() => setRegisteredIds([]))

    Promise.all([coursesPromise, regsPromise]).finally(() => setLoading(false))
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
        <h1 className="font-h1 text-h1 text-primary tracking-tight">Browse Courses</h1>
        <p className="text-on-surface-variant font-body-md mt-1">
          Explore and register for upcoming semester classes.
        </p>
      </div>

      <div className="flex gap-8">
        {/* Sidebar Filters */}
        <aside className="hidden md:block w-64 shrink-0">
          <div className="bg-surface-container-lowest rounded-[24px] border border-outline-variant shadow-[0_4px_20px_rgba(0,0,0,0.03)] p-5 space-y-6 sticky top-6">
            {/* Search */}
            <div>
              <p className="font-label-caps text-on-surface-variant uppercase tracking-wider text-[10px] mb-2">Search</p>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-[18px]">search</span>
                <input
                  type="text"
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  placeholder="Course name or code..."
                  className="bg-surface border border-outline-variant rounded-input pl-9 pr-4 py-2 w-full focus:ring-2 focus:ring-primary focus:border-transparent text-on-surface font-body-md outline-none text-sm"
                />
              </div>
            </div>

            {/* Academic Year */}
            <div>
              <p className="font-label-caps text-on-surface-variant uppercase tracking-wider text-[10px] mb-3">Academic Year</p>
              <div className="space-y-2">
                {['', ...YEAR_ORDER].map(y => (
                  <label key={y || 'all'} className="flex items-center gap-2.5 cursor-pointer group">
                    <input
                      type="radio"
                      name="yearFilter"
                      value={y}
                      checked={yearFilter === y}
                      onChange={() => setYearFilter(y)}
                      className="accent-primary w-4 h-4"
                    />
                    <span className={`font-body-md text-sm transition-colors ${yearFilter === y ? 'text-primary font-body-md-bold' : 'text-on-surface-variant group-hover:text-on-surface'}`}>
                      {y || 'All Years'}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Semester */}
            <div>
              <p className="font-label-caps text-on-surface-variant uppercase tracking-wider text-[10px] mb-3">Semester</p>
              <div className="flex flex-wrap gap-2">
                {['', 'Odd', 'Even'].map(s => (
                  <button
                    key={s || 'all'}
                    onClick={() => setSemFilter(s)}
                    className={`px-3 py-1.5 rounded-full text-xs font-body-md-bold transition-colors ${
                      semFilter === s
                        ? 'bg-primary text-on-primary'
                        : 'bg-surface-container-high text-on-surface-variant border border-outline-variant hover:bg-surface-variant'
                    }`}
                  >
                    {s || 'All'}
                  </button>
                ))}
              </div>
            </div>

            {/* Category */}
            <div>
              <p className="font-label-caps text-on-surface-variant uppercase tracking-wider text-[10px] mb-3">Category</p>
              <div className="flex flex-wrap gap-2">
                {['', 'Core', 'Elective', 'Optional', 'Theory', 'Sessional'].map(cat => (
                  <button
                    key={cat || 'all'}
                    onClick={() => setCategoryFilter(cat)}
                    className={`px-3 py-1.5 rounded-full text-xs font-body-md-bold transition-colors ${
                      categoryFilter === cat
                        ? 'bg-primary text-on-primary'
                        : 'bg-surface-container-high text-on-surface-variant border border-outline-variant hover:bg-surface-variant'
                    }`}
                  >
                    {cat || 'All'}
                  </button>
                ))}
              </div>
            </div>

            {/* Clear filters */}
            {isFiltered && (
              <button
                onClick={() => {
                  setSearch('')
                  setYearFilter('')
                  setSemFilter('')
                  setCategoryFilter('')
                }}
                className="w-full text-xs text-error border border-error rounded-lg py-1.5 font-body-md-bold hover:bg-error-container transition-colors"
              >
                Clear Filters
              </button>
            )}
          </div>
        </aside>

        {/* Course Grid */}
        <div className="flex-1 min-w-0">
          {/* Mobile filters strip */}
          <div className="md:hidden mb-5">
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
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="bg-surface-container-highest rounded-2xl animate-pulse h-64" />
              ))}
            </div>
          ) : courses.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <span className="material-symbols-outlined text-6xl text-on-surface-variant mb-4 block">hourglass_empty</span>
              <h3 className="font-h2 text-h2 text-on-background mb-2">No courses found</h3>
              <p className="text-on-surface-variant font-body-md">Try adjusting your filters or search term.</p>
            </div>
          ) : isFiltered ? (
            <>
              <p className="font-label-caps text-on-surface-variant uppercase tracking-widest text-xs mb-5">
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
                  <div className="flex items-center gap-4 mb-5">
                    <div>
                      <h2 className="font-h1 text-h1 text-primary">{year}</h2>
                      <p className="text-on-surface-variant font-body-md text-sm">
                        {sem} Semester &middot; {gc.length} course{gc.length !== 1 ? 's' : ''}
                      </p>
                    </div>
                    <div className="flex-1 h-px bg-outline-variant" />
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
      </div>
    </div>
  )
}
