export default function Loader({ size = 'md' }) {
  const sizes = { sm: 'w-4 h-4', md: 'w-8 h-8', lg: 'w-12 h-12' }
  return (
    <div className="flex items-center justify-center p-8">
      <div
        className={`${sizes[size]} border-[#E7DED6] border-t-[#8B2E3C] rounded-full animate-spin`}
        style={{ borderWidth: '3px', borderStyle: 'solid' }}
      />
    </div>
  )
}
