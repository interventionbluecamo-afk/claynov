import { Check } from 'lucide-react';

const steps = [
  { number: 1, label: 'Upload Resume' },
  { number: 2, label: 'Job Description' },
  { number: 3, label: 'Results' },
];

export default function StepProgress({ currentStep }) {
  return (
    <div className="w-full max-w-2xl mx-auto px-4 py-4 sm:py-5">
      <div className="flex items-center justify-between relative">
        {/* Progress line */}
        <div className="absolute top-5 left-0 right-0 h-0.5 bg-gray-200 z-0">
          <div 
            className="h-full bg-gray-900 transition-all duration-500 ease-out"
            style={{ width: `${((currentStep - 1) / (steps.length - 1)) * 100}%` }}
          />
        </div>

        {/* Steps */}
        {steps.map((step, index) => {
          const isActive = currentStep === step.number;
          const isCompleted = currentStep > step.number;
          const stepPosition = index / (steps.length - 1) * 100;

          return (
            <div 
              key={step.number} 
              className="relative z-10 flex flex-col items-center"
              style={{ position: 'absolute', left: `${stepPosition}%`, transform: 'translateX(-50%)' }}
            >
              {/* Step Circle */}
              <div
                className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center font-semibold text-sm sm:text-base transition-all duration-300 ${
                  isCompleted
                    ? 'bg-gray-900 text-white'
                    : isActive
                    ? 'bg-gray-900 text-white ring-4 ring-gray-100'
                    : 'bg-white border-2 border-gray-200 text-gray-400'
                }`}
              >
                {isCompleted ? (
                  <Check className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                ) : (
                  <span>{step.number}</span>
                )}
              </div>

              {/* Step Label */}
              <div className="mt-2 text-center">
                <div
                  className={`text-xs sm:text-sm font-medium transition-colors ${
                    isActive || isCompleted
                      ? 'text-gray-900'
                      : 'text-gray-400'
                  }`}
                >
                  {step.label}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

