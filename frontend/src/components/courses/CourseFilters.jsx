const selectClass = `
  w-full appearance-none bg-[#FAF4F2] border border-cs-border rounded-xl
  px-4 py-2.5 pr-9 text-sm text-cs-on-surface
  focus:outline-none focus:border-cs-primary focus:ring-2 focus:ring-[color:var(--primary)]/20
  cursor-pointer transition-colors
`

export default function CourseFilters({
  search, setSearch,
  yearFilter, setYearFilter,
  semFilter, setSemFilter,
  categoryFilter, setCategoryFilter,
}) {
  const hasFilters = !!(search || yearFilter || semFilter || categoryFilter)

  return (
    <div className="bg-cs-surface rounded-2xl p-5 border border-cs-border shadow-card mb-6">
      <div className="flex flex-wrap gap-3 items-center">
        {/* Search */}
        <div className="flex items-center gap-2 bg-[#FAF4F2] border border-cs-border rounded-xl px-4 py-2.5 flex-1 min-w-[200px] focus-within:ring-2 focus-within:ring-[color:var(--primary)]/20 focus-within:border-cs-primary transition-all overflow-hidden">
          <span className="material-symbols-outlined text-cs-muted text-[18px] shrink-0">search</span>
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search courses, instructors..."
            className="bg-transparent border-none outline-none text-sm text-cs-on-surface w-full placeholder:text-cs-muted"
          />
        </div>

        {/* Year filter */}
        <div className="relative min-w-[150px]">
          <select
            value={yearFilter}
            onChange={e => setYearFilter(e.target.value)}
            className={selectClass}
          >
            <option value="">All Years</option>
            <option value="1st Year">1st Year</option>
            <option value="2nd Year">2nd Year</option>
            <option value="3rd Year">3rd Year</option>
            <option value="4th Year">4th Year</option>
            <option value="Elective">Elective</option>
          </select>
          <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-cs-muted pointer-events-none text-base">
            expand_more
          </span>
        </div>

        {/* Semester filter */}
        <div className="relative min-w-[150px]">
          <select
            value={semFilter}
            onChange={e => setSemFilter(e.target.value)}
            className={selectClass}
          >
            <option value="">All Semesters</option>
            <option value="Odd">Odd</option>
            <option value="Even">Even</option>
          </select>
          <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-cs-muted pointer-events-none text-base">
            expand_more
          </span>
        </div>

        {/* Category filter */}
        <div className="relative min-w-[150px]">
          <select
            value={categoryFilter}
            onChange={e => setCategoryFilter(e.target.value)}
            className={selectClass}
          >
            <option value="">All Types</option>
            <option value="Theory">Theory</option>
            <option value="Sessional">Sessional</option>
            <option value="Core">Core</option>
            <option value="Elective">Elective</option>
            <option value="Optional">Optional</option>
          </select>
          <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-cs-muted pointer-events-none text-base">
            expand_more
          </span>
        </div>

        {/* More Filters button */}
        <button className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-cs-border bg-cs-surface text-sm font-semibold text-cs-on-surface hover:bg-cs-surface-hi transition-colors">
          <span className="material-symbols-outlined text-base">filter_list</span>
          More Filters
        </button>

        {/* Clear filters */}
        {hasFilters && (
          <button
            onClick={() => { setSearch(''); setYearFilter(''); setSemFilter(''); setCategoryFilter('') }}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-cs-border bg-cs-surface text-sm text-cs-on-sv hover:text-cs-on-surface hover:bg-cs-surface-hi transition-colors"
          >
            <span className="material-symbols-outlined text-base">close</span>
            Clear
          </button>
        )}
      </div>
    </div>
  )
}
