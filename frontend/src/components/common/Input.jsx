export default function Input({ label, error, className = '', ...props }) {
  return (
    <div className="flex flex-col gap-1">
      {label && <label className="text-sm font-medium text-[#2E2A27]">{label}</label>}
      <input
        className={`bg-[#F8F6F3] border border-[#E7DED6] rounded-lg px-3 py-2 text-sm text-[#2E2A27] placeholder:text-[#9A9189] focus:outline-none focus:ring-2 focus:ring-[#8B2E3C]/30 focus:border-[#8B2E3C] transition-colors ${error ? 'border-[#C65A5A] focus:ring-[#C65A5A]/30' : ''} ${className}`}
        {...props}
      />
      {error && <p className="text-xs text-[#C65A5A]">{error}</p>}
    </div>
  )
}
