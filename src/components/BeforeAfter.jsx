import { ArrowRight, TrendingDown, TrendingUp, CheckCircle, XCircle } from 'lucide-react';

export default function BeforeAfter() {
  const beforeStats = [
    { label: 'Callbacks', value: '2%', icon: TrendingDown, color: 'text-red-600' },
    { label: 'Interviews', value: '1-2', icon: XCircle, color: 'text-red-600' },
    { label: 'ATS Score', value: '62%', icon: XCircle, color: 'text-red-600' }
  ];

  const afterStats = [
    { label: 'Callbacks', value: '3.2x', icon: TrendingUp, color: 'text-green-600' },
    { label: 'Interviews', value: '14+', icon: CheckCircle, color: 'text-green-600' },
    { label: 'ATS Score', value: '92%', icon: CheckCircle, color: 'text-green-600' }
  ];

  return (
    <div className="max-w-5xl mx-auto mb-8 sm:mb-16 px-3 sm:px-0">
      <div className="text-center mb-4 sm:mb-8">
        <h2 className="text-2xl sm:text-4xl font-bold text-gray-900 mb-2 sm:mb-3">
          Before Clay <span className="text-red-500">→</span> After Clay
        </h2>
        <p className="text-sm sm:text-base text-gray-600">See the transformation</p>
      </div>

      <div className="grid md:grid-cols-2 gap-4 sm:gap-6">
        {/* Before */}
        <div className="glass rounded-2xl p-4 sm:p-8 border-2 border-red-200/50 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/10 rounded-full blur-3xl -mr-16 -mt-16" />
          <div className="relative">
            <div className="flex items-center gap-2 mb-4 sm:mb-6">
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-red-100 flex items-center justify-center">
                <span className="text-xl sm:text-2xl">😞</span>
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-gray-900">Before Clay</h3>
            </div>
            
            <div className="space-y-3 sm:space-y-4 mb-4 sm:mb-6">
              <div className="p-3 sm:p-4 bg-gray-50 rounded-lg border border-gray-200">
                <p className="text-xs sm:text-sm text-gray-600 line-through mb-1 sm:mb-2">Generic resume</p>
                <p className="text-[10px] sm:text-xs text-gray-500">One size fits all approach</p>
              </div>
              <div className="p-3 sm:p-4 bg-gray-50 rounded-lg border border-gray-200">
                <p className="text-xs sm:text-sm text-gray-600 line-through mb-1 sm:mb-2">Weak keywords</p>
                <p className="text-[10px] sm:text-xs text-gray-500">Not optimized for ATS</p>
              </div>
            </div>

            <div className="space-y-2 sm:space-y-3 pt-3 sm:pt-4 border-t border-gray-200">
              {beforeStats.map((stat, i) => (
                <div key={i} className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 sm:gap-2">
                    <stat.icon className={`w-4 h-4 sm:w-5 sm:h-5 ${stat.color}`} />
                    <span className="text-xs sm:text-sm font-medium text-gray-700">{stat.label}</span>
                  </div>
                  <span className={`text-base sm:text-lg font-bold ${stat.color}`}>{stat.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* After */}
        <div className="glass rounded-2xl p-4 sm:p-8 border-2 border-teal-200/50 relative overflow-hidden shadow-xl">
          <div className="absolute top-0 right-0 w-32 h-32 bg-teal-500/20 rounded-full blur-3xl -mr-16 -mt-16" />
          <div className="relative">
            <div className="flex items-center gap-2 mb-4 sm:mb-6">
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gradient-to-br from-teal-100 to-slate-100 flex items-center justify-center shadow-md">
                <span className="text-xl sm:text-2xl">🚀</span>
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-gray-900">After Clay</h3>
            </div>
            
            <div className="space-y-3 sm:space-y-4 mb-4 sm:mb-6">
              <div className="p-3 sm:p-4 bg-gradient-to-br from-teal-50 to-slate-50 rounded-lg border-2 border-teal-200">
                <div className="flex items-center gap-1.5 sm:gap-2 mb-1 sm:mb-2">
                  <CheckCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-teal-600" />
                  <p className="text-xs sm:text-sm font-semibold text-gray-900">AI-optimized resume</p>
                </div>
                <p className="text-[10px] sm:text-xs text-gray-600">Tailored to each job</p>
              </div>
              <div className="p-3 sm:p-4 bg-gradient-to-br from-teal-50 to-slate-50 rounded-lg border-2 border-teal-200">
                <div className="flex items-center gap-1.5 sm:gap-2 mb-1 sm:mb-2">
                  <CheckCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-teal-600" />
                  <p className="text-xs sm:text-sm font-semibold text-gray-900">Perfect keywords</p>
                </div>
                <p className="text-[10px] sm:text-xs text-gray-600">ATS-ready formatting</p>
              </div>
            </div>

            <div className="space-y-2 sm:space-y-3 pt-3 sm:pt-4 border-t border-teal-200">
              {afterStats.map((stat, i) => (
                <div key={i} className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 sm:gap-2">
                    <stat.icon className={`w-4 h-4 sm:w-5 sm:h-5 ${stat.color}`} />
                    <span className="text-xs sm:text-sm font-medium text-gray-700">{stat.label}</span>
                  </div>
                  <span className={`text-base sm:text-lg font-bold ${stat.color}`}>{stat.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Visual Arrow & CTA */}
      <div className="flex items-center justify-center mt-4 sm:mt-8">
        <a
          href="#upload-section"
          onClick={(e) => {
            e.preventDefault();
            const uploadSection = document.getElementById('upload-section');
            if (uploadSection) {
              const headerOffset = 80;
              const elementPosition = uploadSection.getBoundingClientRect().top;
              const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

              window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
              });
            }
          }}
          className="inline-flex flex-col sm:flex-row items-center gap-2 sm:gap-3 glass rounded-full px-4 sm:px-8 py-3 sm:py-4 shadow-lg hover:shadow-xl transition-all group active:scale-95"
        >
          <span className="text-xs sm:text-sm font-semibold text-gray-700 text-center">Ready to transform?</span>
          <div className="flex items-center gap-1.5 sm:gap-2">
            <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 text-teal-600 group-hover:translate-x-1 transition-transform" />
            <span className="text-sm sm:text-base font-bold bg-gradient-to-r from-slate-700 to-teal-600 bg-clip-text text-transparent">Get Started</span>
          </div>
        </a>
      </div>
    </div>
  );
}

