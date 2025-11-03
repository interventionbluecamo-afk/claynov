import { useState } from 'react';
import { ArrowLeft, Zap, Check, Lock, Star } from 'lucide-react';
import { toast } from '../components/Toast';

export default function Pricing({ user, onUpgrade, onBack, useCount = 0, freeUsesLeft = 3, isPro = false }) {
  const [loading, setLoading] = useState(false);

  const handleUpgradeClick = async () => {
    setLoading(true);
    try {
      await onUpgrade();
      // Note: onUpgrade handles redirect to Stripe, so we won't see this if successful
    } catch (error) {
      toast.error('Failed to process upgrade. Please try again.');
      setLoading(false);
    }
  };

  const hasUsedAllFree = useCount >= 3 && !isPro;

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header */}
      <header className="border-b bg-white sticky top-0 z-40">
        <div className="px-4 py-3 flex items-center justify-between max-w-2xl mx-auto">
          <button 
            onClick={onBack}
            className="w-11 h-11 flex items-center justify-center rounded-full hover:bg-gray-100 active:scale-95 transition-all"
            aria-label="Go back"
          >
            <ArrowLeft className="w-5 h-5 text-gray-700" />
          </button>
          <span className="text-xl font-bold text-gray-900">Clay Pro</span>
          <div className="w-9" /> {/* Spacer */}
        </div>
      </header>

      {/* Hero Section */}
      <div className="flex-1 flex flex-col max-w-2xl mx-auto w-full px-4 py-8 sm:py-12">
        <div className="text-center mb-8 sm:mb-12">
          <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-amber-100 to-orange-100 rounded-2xl flex items-center justify-center mx-auto mb-4 sm:mb-6">
            <Zap className="w-8 h-8 sm:w-10 sm:h-10 text-amber-600" />
          </div>
          
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-3 sm:mb-4 tracking-tight">
            Unlock Pro Features 💎
          </h1>
          
          <p className="text-base sm:text-lg text-gray-600 max-w-md mx-auto leading-relaxed">
            {hasUsedAllFree
              ? "You've used all 3 free optimizations. Unlock unlimited optimizations for just $7.99 — one payment, yours forever."
              : !user
              ? "Get unlimited resume optimizations, all tone options, and priority AI processing for just $7.99 — one payment, yours forever."
              : freeUsesLeft > 0
              ? `You have ${freeUsesLeft} free optimization${freeUsesLeft !== 1 ? 's' : ''} left. Upgrade now to unlock unlimited optimizations, all tone options, and priority AI processing for just $7.99 — one payment, yours forever.`
              : "Get unlimited resume optimizations, all tone options, and priority AI processing for just $7.99 — one payment, yours forever."
            }
          </p>
        </div>

        {/* Pricing Card */}
        <div className="bg-gray-900 rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8 mb-6 text-white shadow-2xl">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 sm:mb-6 gap-3">
            <div>
              <div className="flex items-baseline gap-2 mb-1">
                <span className="text-4xl sm:text-5xl md:text-6xl font-bold">$7.99</span>
                <span className="text-lg sm:text-xl md:text-2xl text-white/70 line-through">$19.99</span>
              </div>
              <div className="text-xs sm:text-sm text-white/70">One-time payment · No subscription</div>
            </div>
            <div className="px-3 sm:px-4 py-1.5 sm:py-2 bg-green-500 text-white text-xs sm:text-sm font-bold rounded-full whitespace-nowrap">
              60% OFF
            </div>
          </div>
          
          {/* Features List - Compact */}
          <div className="space-y-2.5 sm:space-y-3 mb-4 sm:mb-6">
            <div className="flex items-start gap-2 sm:gap-3">
              <div className="w-5 h-5 sm:w-6 sm:h-6 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <Check className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
              </div>
              <div>
                <div className="font-bold text-sm sm:text-base">Unlimited optimizations</div>
                <div className="text-xs sm:text-sm text-white/70 hidden sm:block">Optimize as many resumes as you need</div>
              </div>
            </div>
            
            <div className="flex items-start gap-2 sm:gap-3">
              <div className="w-5 h-5 sm:w-6 sm:h-6 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <Check className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
              </div>
              <div>
                <div className="font-bold text-sm sm:text-base">All tone options</div>
                <div className="text-xs sm:text-sm text-white/70 hidden sm:block">Professional, Creative, Technical, Executive</div>
              </div>
            </div>
            
            <div className="flex items-start gap-2 sm:gap-3">
              <div className="w-5 h-5 sm:w-6 sm:h-6 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <Check className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
              </div>
              <div>
                <div className="font-bold text-sm sm:text-base">Priority processing</div>
                <div className="text-xs sm:text-sm text-white/70 hidden sm:block">Faster results when you need them</div>
              </div>
            </div>
            
            <div className="flex items-start gap-2 sm:gap-3">
              <div className="w-5 h-5 sm:w-6 sm:h-6 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <Check className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
              </div>
              <div>
                <div className="font-bold text-sm sm:text-base">Advanced ATS</div>
                <div className="text-xs sm:text-sm text-white/70 hidden sm:block">Deep keyword matching</div>
              </div>
            </div>
          </div>

          {/* Trust Indicators */}
          <div className="pt-4 sm:pt-6 border-t border-white/20">
            <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 text-xs text-white/60">
              <div className="flex items-center gap-1">
                <Lock className="w-3.5 h-3.5" />
                <span>Secure</span>
              </div>
              <div className="flex items-center gap-1">
                <Zap className="w-3.5 h-3.5" />
                <span>Instant</span>
              </div>
              <div className="flex items-center gap-1">
                <Check className="w-3.5 h-3.5" />
                <span>No subscription</span>
              </div>
            </div>
          </div>
        </div>

        {/* Sign Up Notice */}
        {!user && (
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-3 sm:p-4 mb-4 sm:mb-6">
            <p className="text-xs sm:text-sm text-blue-900 text-center">
              <strong>Sign up</strong> first or continue below
            </p>
          </div>
        )}

        {/* CTA Buttons */}
        <div className="space-y-3 sm:space-y-4">
          <button
            onClick={handleUpgradeClick}
            disabled={loading}
            className="w-full h-14 sm:h-16 bg-gray-900 text-white rounded-2xl font-bold text-base sm:text-lg flex items-center justify-center gap-3 active:scale-[0.98] transition-all shadow-xl hover:shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Processing...</span>
              </>
            ) : (
              <>
                <Zap className="w-6 h-6 sm:w-7 sm:h-7" />
                <span>{user ? 'Upgrade to Pro — $7.99' : 'Get Pro — $7.99'}</span>
              </>
            )}
          </button>
          
          {!user && (
            <button
              onClick={() => {
                // Store upgrade intent and trigger sign up via callback
                localStorage.setItem('clay_upgrade_after_signup', 'true');
                onBack();
                // Use requestAnimationFrame for proper React state update timing
                requestAnimationFrame(() => {
                  window.dispatchEvent(new CustomEvent('clay:showSignUp', { detail: { fromPricing: true } }));
                });
              }}
              className="w-full h-14 bg-gray-100 text-gray-900 rounded-xl font-semibold text-base hover:bg-gray-200 active:scale-[0.98] transition-all"
            >
              Sign up first (free)
            </button>
          )}
        </div>

        {/* Social Proof */}
        <div className="mt-8 sm:mt-12 bg-amber-50 rounded-2xl p-6 border border-amber-200">
          <div className="flex items-center gap-1 mb-3 justify-center">
            {[1,2,3,4,5].map(i => (
              <Star key={i} className="w-4 h-4 sm:w-5 sm:h-5 fill-amber-400 text-amber-400" />
            ))}
          </div>
          <p className="text-sm sm:text-base text-gray-900 text-center font-semibold mb-2">
            "Got 3 interviews in a week after using Clay!"
          </p>
          <p className="text-xs sm:text-sm text-gray-600 text-center">— Marcus L., Product Manager</p>
        </div>

        {/* Additional Info */}
        <div className="mt-8 pt-8 border-t border-gray-200">
          <div className="text-center">
            <p className="text-xs sm:text-sm text-gray-500 mb-3">
              Powered by Stripe · Secure payment processing
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 text-xs text-gray-500">
              <div className="flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-gray-400" />
                <span>Encrypted</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5 text-gray-400" />
                <span>No subscription</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5 text-gray-400" />
                <span>Instant access</span>
              </div>
            </div>
          </div>
        </div>

        {/* Secondary CTA */}
        <button
          onClick={onBack}
          className="mt-6 w-full py-3 text-gray-600 font-medium text-sm sm:text-base hover:text-gray-900 transition-colors"
        >
          Continue with free account
        </button>
      </div>
    </div>
  );
}

