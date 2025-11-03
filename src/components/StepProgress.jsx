const steps = [
  { number: 1, label: 'Upload' },
  { number: 2, label: 'Job Desc' },
  { number: 3, label: 'Results' },
];

export default function StepProgress({ currentStep }) {
  return (
    <div className="w-full max-w-2xl mx-auto px-4 py-3">
      <div className="flex items-center justify-center gap-2">
        {steps.map((step, index) => {
          const isActive = currentStep === step.number;
          const isCompleted = currentStep > step.number;
          const isLast = index === steps.length - 1;

          return (
            <div key={step.number} className="flex items-center gap-2">
              {/* Step Indicator */}
              <div className="flex flex-col items-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold transition-all ${
                    isCompleted
                      ? 'bg-gray-900 text-white'
                      : isActive
                      ? 'bg-gray-900 text-white'
                      : 'bg-gray-100 text-gray-400'
                  }`}
                >
                  {isCompleted ? (
                    <span className="text-white">✓</span>
                  ) : (
                    <span>{step.number}</span>
                  )}
                </div>
                <div
                  className={`mt-1 text-xs font-medium transition-colors ${
                    isActive || isCompleted
                      ? 'text-gray-900'
                      : 'text-gray-400'
                  }`}
                >
                  {step.label}
                </div>
              </div>

              {/* Connector Line */}
              {!isLast && (
                <div className="flex-1 h-0.5 mx-2 mt-[-16px] max-w-[60px]">
                  <div
                    className={`h-full transition-all duration-500 ${
                      isCompleted ? 'bg-gray-900' : 'bg-gray-200'
                    }`}
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

