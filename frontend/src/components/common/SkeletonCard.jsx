export default function SkeletonCard() {
  return (
    <div className="bg-white rounded-xl border border-[#E7DED6] p-5 shadow-sm animate-pulse">
      <div className="flex gap-2 mb-3">
        <div className="h-5 w-16 bg-[#F5F1EC] rounded-full" />
        <div className="h-5 w-20 bg-[#F5F1EC] rounded-full" />
      </div>
      <div className="h-5 w-3/4 bg-[#F5F1EC] rounded mb-2" />
      <div className="h-4 w-1/2 bg-[#F5F1EC] rounded mb-4" />
      <div className="flex gap-4 mb-3">
        <div className="h-4 w-16 bg-[#F5F1EC] rounded" />
        <div className="h-4 w-16 bg-[#F5F1EC] rounded" />
      </div>
      <div className="h-1.5 bg-[#F5F1EC] rounded-full mb-3" />
      <div className="h-9 bg-[#F5F1EC] rounded-lg" />
    </div>
  )
}
