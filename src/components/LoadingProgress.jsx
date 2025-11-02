import { useState, useEffect } from 'react';
import { Sparkles, Check, Search, Zap, FileText, Star } from 'lucide-react';

const stages = [
  {
    icon: FileText,
    message: 'Reading your resume...',
    description: 'Understanding your experience',
    duration: 1500
  },
  {
    icon: Search,
    message: 'Analyzing job requirements...',
    description: 'Finding the perfect match',
    duration: 1500
  },
  {
    icon: Zap,
    message: 'Optimizing keywords...',
    description: 'Making ATS-friendly',
    duration: 1500
  },
  {
    icon: Sparkles,
    message: 'Crafting improvements...',
    description: 'Adding that special touch',
    duration: 1500
  },
  {
    icon: Star,
    message: 'Almost ready!',
    description: 'Putting the final touches',
    duration: 800
  }
];

export default function LoadingProgress({ isVisible }) {
  const [currentStage, setCurrentStage] = useState(0);
  const [completedStages, setCompletedStages] = useState([]);

  useEffect(() => {
    if (!isVisible) {
      setCurrentStage(0);
      setCompletedStages([]);
      return;
    }

    let timeout;
    const processStage = (stageIndex) => {
      if (stageIndex >= stages.length) return;

      timeout = setTimeout(() => {
        setCompletedStages(prev => [...prev, stageIndex]);
        if (stageIndex < stages.length - 1) {
          setCurrentStage(stageIndex + 1);
        }
      }, stages[stageIndex].duration);
    };

    processStage(0);

    return () => {
      if (timeout) clearTimeout(timeout);
    };
  }, [isVisible]);

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-8 animate-in zoom-in">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="relative inline-block mb-4">
            <div className="w-20 h-20 bg-gradient-to-br from-slate-600 to-teal-600 rounded-2xl flex items-center justify-center shadow-lg animate-pulse">
              <Sparkles className="w-10 h-10 text-white animate-spin-slow" />
            </div>
            <div className="absolute -top-1 -right-1 w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center animate-bounce">
              <Star className="w-3 h-3 text-yellow-900 fill-yellow-900" />
            </div>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-2">
            Crafting your perfect resume
          </h3>
          <p className="text-gray-600">
            This will take about 30 seconds
          </p>
        </div>

        {/* Progress Stages */}
        <div className="space-y-4 mb-6">
          {stages.map((stage, index) => {
            const isCompleted = completedStages.includes(index);
            const isActive = currentStage === index && !isCompleted;
            const StageIcon = stage.icon;

            return (
              <div
                key={index}
                className={`flex items-center gap-4 p-4 rounded-xl transition-all duration-300 ${
                  isCompleted
                    ? 'bg-green-50 border-2 border-green-200'
                    : isActive
                    ? 'bg-slate-50 border-2 border-slate-300 shadow-md'
                    : 'bg-gray-50 border-2 border-gray-200'
                }`}
              >
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                    isCompleted
                      ? 'bg-green-500'
                      : isActive
                      ? 'bg-slate-600 animate-pulse'
                      : 'bg-gray-300'
                  }`}
                >
                  {isCompleted ? (
                    <Check className="w-6 h-6 text-white" />
                  ) : (
                    <StageIcon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-gray-500'}`} />
                  )}
                </div>
                <div className="flex-1">
                  <p
                    className={`font-semibold mb-0.5 ${
                      isCompleted ? 'text-green-700' : isActive ? 'text-slate-900' : 'text-gray-500'
                    }`}
                  >
                    {stage.message}
                  </p>
                  <p className="text-xs text-gray-500">{stage.description}</p>
                </div>
                {isActive && (
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-slate-600 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <div className="w-2 h-2 bg-slate-600 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <div className="w-2 h-2 bg-slate-600 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Encouraging Message */}
        <div className="text-center">
          <p className="text-sm text-gray-600 italic">
            {currentStage < stages.length - 1
              ? "Great things take time... but this is fast! ⚡"
              : "Just a moment more!"}
          </p>
        </div>
      </div>
    </div>
  );
}

