const variants = {
  primary: 'bg-[#8B2E3C] hover:bg-[#732532] text-white',
  secondary: 'bg-[#F9ECEE] hover:bg-[#F5F1EC] text-[#8B2E3C] border border-[#8B2E3C]/20',
  success: 'bg-[#4C956C] hover:bg-[#3d7a58] text-white',
  danger: 'bg-[#C65A5A] hover:bg-[#b34d4d] text-white',
  ghost: 'bg-transparent hover:bg-[#F5F1EC] text-[#6B625C]',
}

const sizes = {
  sm: 'px-3 py-1.5 text-xs',
  md: 'px-4 py-2 text-sm',
  lg: 'px-6 py-3 text-base',
}

export default function Button({ variant = 'primary', size = 'md', className = '', children, ...props }) {
  return (
    <button
      className={`inline-flex items-center justify-center gap-2 rounded-lg font-semibold transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}
