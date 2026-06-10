const variants = {
  primary: 'bg-[#F9ECEE] text-[#8B2E3C]',
  success: 'bg-emerald-50 text-[#4C956C]',
  warning: 'bg-amber-50 text-[#D89B3D]',
  danger: 'bg-red-50 text-[#C65A5A]',
  cyan: 'bg-sky-50 text-[#7CB9C8]',
  violet: 'bg-violet-50 text-[#A78BCF]',
  rose: 'bg-rose-50 text-[#D98C9A]',
  gray: 'bg-[#F5F1EC] text-[#6B625C]',
}

export default function Badge({ variant = 'gray', children, className = '' }) {
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${variants[variant]} ${className}`}>
      {children}
    </span>
  )
}
