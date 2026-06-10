import { Link } from 'react-router-dom'
import { useTheme } from '../context/ThemeContext'
import { Sun, Moon } from 'lucide-react'

const features = [
  {
    icon: 'dashboard_customize',
    title: 'Personalized Dashboard',
    desc: "Get a bird's-eye view of your current semester, upcoming deadlines, and academic progress all in one unified, clutter-free space.",
    span: 'md:col-span-2',
    iconBg: 'bg-primary',
    iconColor: 'text-on-primary',
  },
  {
    icon: 'library_books',
    title: 'Smart Registration',
    desc: 'Conflict-free scheduling with intelligent course prerequisite checking and automated waitlisting.',
    span: '',
    iconBg: 'bg-surface-container-high',
    iconColor: 'text-on-surface-variant',
  },
  {
    icon: 'analytics',
    title: 'Performance Tracking',
    desc: 'Visualize your CGPA trends, credit completion status, and departmental ranking visually.',
    span: '',
    iconBg: 'bg-surface-container-high',
    iconColor: 'text-on-surface-variant',
  },
  {
    icon: 'notifications_active',
    title: 'Real-time Updates',
    desc: 'Never miss a deadline. Receive instant notifications for registration windows, grade publications, and departmental notices.',
    span: 'md:col-span-2',
    iconBg: 'bg-primary-fixed',
    iconColor: 'text-primary',
  },
]

const stats = [
  { value: '12,000+', label: 'Students Enrolled' },
  { value: '400+', label: 'Courses Available' },
  { value: '12', label: 'Departments' },
  { value: '99.9%', label: 'Uptime SLA' },
]

export default function LandingPage() {
  const { isDark, toggleTheme } = useTheme()

  return (
    <div className="relative min-h-screen flex flex-col overflow-x-hidden bg-background text-on-background">
      {/* Background blobs */}
      <div className="fixed w-[500px] h-[500px] rounded-full opacity-40 blur-[100px] -z-10 top-[-15%] left-[-10%] bg-secondary-container pointer-events-none" />
      <div className="fixed w-[600px] h-[600px] rounded-full opacity-30 blur-[120px] -z-10 top-[30%] right-[-15%] bg-primary-fixed pointer-events-none" />
      <div className="fixed w-[400px] h-[400px] rounded-full opacity-20 blur-[80px] -z-10 bottom-[10%] left-[20%] bg-tertiary-container pointer-events-none" />

      {/* ── Navbar ─────────────────────────────────────── */}
      <nav className="fixed top-0 left-0 right-0 z-40 bg-background/80 backdrop-blur-md border-b border-outline-variant">
        <div className="max-w-[1440px] mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-3xl" style={{ fontVariationSettings: "'FILL' 1" }}>school</span>
            <span className="text-xl font-black text-primary tracking-tight">CourseSphere</span>
          </div>

          <div className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-xs font-semibold tracking-widest uppercase text-on-surface-variant hover:text-primary transition-colors">Features</a>
            <a href="#stats" className="text-xs font-semibold tracking-widest uppercase text-on-surface-variant hover:text-primary transition-colors">Statistics</a>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full text-on-surface-variant hover:text-primary hover:bg-surface-container transition-colors"
              aria-label="Toggle theme"
            >
              {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
            <Link
              to="/login"
              className="hidden md:inline-flex items-center gap-2 bg-primary text-on-primary text-xs font-bold tracking-widest uppercase px-5 py-2.5 rounded-full hover:bg-primary-container transition-all shadow-sm"
            >
              Student Login
            </Link>
          </div>
        </div>
      </nav>

      {/* ── Hero ────────────────────────────────────────── */}
      <main className="flex-grow pt-24 pb-16 px-6 max-w-[1440px] mx-auto w-full">
        <section className="relative flex flex-col lg:flex-row items-center justify-between gap-12 min-h-[600px] py-12">
          {/* Left */}
          <div className="flex-1 flex flex-col gap-6 z-10 max-w-2xl">
            <div className="inline-flex items-center gap-2 bg-primary-fixed text-primary text-xs font-bold tracking-widest uppercase px-4 py-2 rounded-full w-fit border border-primary-fixed-dim">
              <span className="material-symbols-outlined text-base">auto_awesome</span>
              RUET Official Academic Portal
            </div>

            <h1 className="text-5xl lg:text-6xl font-black text-on-background leading-tight tracking-tight">
              Simplifying Course Registration for{' '}
              <span className="text-primary">RUET</span>
            </h1>

            <p className="text-lg text-on-surface-variant leading-relaxed">
              Modern, intuitive course registration and academic management designed specifically for
              the Rajshahi University of Engineering &amp; Technology. Streamline your academic journey today.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 mt-2">
              <Link
                to="/signup"
                className="inline-flex items-center justify-center gap-2 bg-primary text-on-primary font-semibold text-base px-8 py-3.5 rounded-2xl hover:bg-primary-container hover:-translate-y-0.5 transition-all shadow-[0_4px_16px_rgba(108,22,39,0.3)]"
              >
                Get Started
                <span className="material-symbols-outlined text-base">arrow_forward</span>
              </Link>
              <Link
                to="/courses"
                className="inline-flex items-center justify-center gap-2 bg-surface-container-lowest text-primary border-2 border-primary-fixed font-semibold text-base px-8 py-3.5 rounded-2xl hover:bg-primary-fixed hover:-translate-y-0.5 transition-all"
              >
                <span className="material-symbols-outlined text-base">search</span>
                Browse Courses
              </Link>
            </div>
          </div>

          {/* Right – bento card graphic */}
          <div className="flex-1 relative flex items-center justify-center min-h-[400px] max-w-md w-full">
            {/* Decorative ring */}
            <div className="absolute w-72 h-72 rounded-full border-[24px] border-primary-fixed opacity-50" />

            {/* Main card */}
            <div className="relative z-10 bg-surface-container-lowest rounded-[24px] shadow-[0_8px_40px_rgba(108,22,39,0.12)] border border-outline-variant p-6 w-64">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
                  <span className="material-symbols-outlined text-on-primary text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>school</span>
                </div>
                <div>
                  <p className="font-body-md-bold text-on-background text-sm">Academic Portal</p>
                  <p className="text-xs text-on-surface-variant">Spring 2025</p>
                </div>
              </div>
              <div className="space-y-2">
                {['CSE 3101 – Registered', 'CSE 3102 – Registered', 'ETE 3163 – Pending'].map((item, i) => (
                  <div key={i} className="flex items-center gap-2 p-2 rounded-lg bg-surface-container-low border border-outline-variant">
                    <span className={`w-2 h-2 rounded-full shrink-0 ${i < 2 ? 'bg-tertiary' : 'bg-primary'}`} />
                    <span className="text-xs text-on-surface-variant">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Floating badge — registered */}
            <div className="absolute top-4 right-0 bg-surface-container-lowest border border-outline-variant rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.08)] p-3 flex items-center gap-3 z-20 animate-bounce" style={{ animationDuration: '5s' }}>
              <div className="w-9 h-9 rounded-full bg-tertiary-fixed flex items-center justify-center text-tertiary">
                <span className="material-symbols-outlined text-base" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
              </div>
              <div>
                <p className="text-xs text-on-surface-variant">Status</p>
                <p className="text-sm font-bold text-on-background">Registered</p>
              </div>
            </div>

            {/* Floating badge — next class */}
            <div className="absolute bottom-4 left-0 bg-surface-container-lowest border border-outline-variant rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.08)] p-3 flex items-center gap-3 z-20 animate-bounce" style={{ animationDuration: '6s', animationDelay: '1s' }}>
              <div className="w-9 h-9 rounded-full bg-surface-container-high flex items-center justify-center text-on-surface-variant">
                <span className="material-symbols-outlined text-base">schedule</span>
              </div>
              <div>
                <p className="text-xs text-on-surface-variant">Next Class</p>
                <p className="text-sm font-bold text-on-background">CSE-3101</p>
              </div>
            </div>
          </div>
        </section>

        {/* ── Stats ──────────────────────────────────────── */}
        <section id="stats" className="py-16">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {stats.map((s) => (
              <div key={s.label} className="bg-surface-container-lowest rounded-[24px] p-6 border border-outline-variant text-center shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:shadow-[0_8px_30px_rgba(108,22,39,0.08)] transition-shadow">
                <p className="text-3xl font-black text-primary mb-1">{s.value}</p>
                <p className="text-sm text-on-surface-variant font-medium">{s.label}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── Features ───────────────────────────────────── */}
        <section id="features" className="py-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-4xl font-black text-on-background mb-3">Everything you need</h2>
            <p className="text-lg text-on-surface-variant">A complete toolset designed to make your academic life at RUET seamless and productive.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {features.map((f) => (
              <div
                key={f.title}
                className={`bg-surface-container-lowest rounded-[24px] p-8 border border-outline-variant shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:shadow-[0_8px_30px_rgba(108,22,39,0.08)] transition-shadow relative overflow-hidden group ${f.span}`}
              >
                <div className="absolute top-0 right-0 w-48 h-48 bg-primary-fixed rounded-bl-full opacity-20 group-hover:opacity-40 transition-opacity" />
                <div className="relative z-10">
                  <div className={`w-14 h-14 rounded-2xl ${f.iconBg} ${f.iconColor} flex items-center justify-center mb-4`}>
                    <span className="material-symbols-outlined text-3xl">{f.icon}</span>
                  </div>
                  <h3 className="text-xl font-bold text-on-background mb-2">{f.title}</h3>
                  <p className="text-sm text-on-surface-variant leading-relaxed">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── CTA Banner ─────────────────────────────────── */}
        <section className="py-8">
          <div className="bg-primary rounded-[24px] p-12 text-center relative overflow-hidden">
            <div className="absolute inset-0 opacity-10 pointer-events-none">
              <div className="absolute top-0 left-0 w-64 h-64 bg-white rounded-full -translate-x-1/2 -translate-y-1/2" />
              <div className="absolute bottom-0 right-0 w-64 h-64 bg-white rounded-full translate-x-1/2 translate-y-1/2" />
            </div>
            <div className="relative z-10">
              <h2 className="text-3xl font-black text-on-primary mb-3">Ready to simplify your academic journey?</h2>
              <p className="text-on-primary/80 mb-8 max-w-xl mx-auto">Join thousands of RUET students managing their courses effortlessly with CourseSphere.</p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  to="/signup"
                  className="inline-flex items-center justify-center gap-2 bg-on-primary text-primary font-bold text-sm px-8 py-3.5 rounded-2xl hover:-translate-y-0.5 transition-all shadow-lg"
                >
                  Create Account
                  <span className="material-symbols-outlined text-base">arrow_forward</span>
                </Link>
                <Link
                  to="/login"
                  className="inline-flex items-center justify-center gap-2 bg-transparent text-on-primary border-2 border-on-primary/50 font-bold text-sm px-8 py-3.5 rounded-2xl hover:bg-on-primary/10 hover:-translate-y-0.5 transition-all"
                >
                  Sign In
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* ── Footer ─────────────────────────────────────── */}
      <footer className="border-t border-outline-variant bg-surface-container-lowest py-8">
        <div className="max-w-[1440px] mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-2xl">account_balance</span>
            <span className="font-bold text-lg text-primary">CourseSphere</span>
          </div>
          <p className="text-sm text-on-surface-variant text-center">© 2025 Rajshahi University of Engineering &amp; Technology</p>
          <div className="flex gap-6 text-sm text-on-surface-variant">
            <a href="#" className="hover:text-primary transition-colors">Academic Calendar</a>
            <a href="#" className="hover:text-primary transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-primary transition-colors">Contact Support</a>
          </div>
        </div>
      </footer>
    </div>
  )
}
