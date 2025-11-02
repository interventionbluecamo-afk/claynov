export default function StatsCard({ value, label, index }) {
  return (
    <div className="glass rounded-xl p-4 sm:p-6 shadow-xl text-center border border-white/50">
      <div className="text-3xl sm:text-4xl md:text-5xl font-bold bg-gradient-to-r from-slate-700 to-teal-600 bg-clip-text text-transparent mb-2">
        {typeof value === 'number' ? `${value}${index < 2 ? '%' : ''}` : value}
      </div>
      <div className="text-xs sm:text-sm text-gray-600 font-medium">{label}</div>
    </div>
  );
}

