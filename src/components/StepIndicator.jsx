export default function StepIndicator({ currentStep, totalSteps = 3 }) {
  return (
    <div className="flex items-center justify-center gap-2 mb-8">
      {Array.from({ length: totalSteps }, (_, i) => i + 1).map((step) => (
        <div key={step} className="flex items-center">
          <div
            className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center text-sm font-semibold transition-all ${
              step === currentStep
                ? 'bg-gradient-to-br from-slate-600 to-teal-600 text-white scale-110 shadow-lg'
                : step < currentStep
                ? 'bg-green-500 text-white'
                : 'bg-gray-200 text-gray-500'
            }`}
          >
            {step < currentStep ? '✓' : step}
          </div>
          {step < totalSteps && (
            <div
              className={`w-8 sm:w-12 h-1 mx-1 transition-all ${
                step < currentStep ? 'bg-green-500' : 'bg-gray-200'
              }`}
            />
          )}
        </div>
      ))}
    </div>
  );
}

