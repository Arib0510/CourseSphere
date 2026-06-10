export default function StatCard({ icon: Icon, label, value, accentColor = '#7CB9C8', bgColor = '#F0F9FF' }) {
  return (
    <div
      className="bg-white rounded-xl p-5 shadow-sm border border-[#E7DED6] hover:shadow-md transition-shadow"
      style={{ borderTopWidth: '4px', borderTopColor: accentColor }}
    >
      <div className="flex items-start justify-between mb-3">
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center"
          style={{ backgroundColor: bgColor }}
        >
          <Icon className="w-5 h-5" style={{ color: accentColor }} />
        </div>
      </div>
      <p className="text-sm text-[#9A9189] font-medium mb-1">{label}</p>
      <p className="text-2xl font-bold text-[#2E2A27]">{value}</p>
    </div>
  )
}
