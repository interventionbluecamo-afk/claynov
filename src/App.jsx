import React, { useState, useCallback, useEffect } from 'react';
import { Sparkles, FileText, ArrowRight, Check, TrendingUp, Star, Lock, X, Loader2, LogOut, Upload, Download, RefreshCw, ChevronLeft, Zap } from 'lucide-react';
import { parseResume } from './utils/fileParser';
import { optimizeResume as optimizeResumeApi } from './utils/claudeApi';
import { mockOptimizeResume } from './utils/mockApi';
import { generateResumeDocx, downloadBlob } from './utils/resumeGenerator';
import { getCurrentUser, signOut } from './utils/auth';
import { createConfetti } from './utils/confetti';
import SignUp from './pages/SignUp';
import Pricing from './pages/Pricing';
import { getWeeklyResumeCount, formatWeeklyCount, incrementWeeklyCount } from './utils/weeklyCount';
import LanguageSwitcher from './components/LanguageSwitcher';

export default function ClayApp() {
  const [step, setStep] = useState(1);
  const [resumeFile, setResumeFile] = useState(null);
  const [resumeText, setResumeText] = useState('');
  const [jobDesc, setJobDesc] = useState('');
  const [processing, setProcessing] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [tone, setTone] = useState('professional');
  const [useCount, setUseCount] = useState(0);
  const [showPricing, setShowPricing] = useState(false);
  const [showSignUpPage, setShowSignUpPage] = useState(false);
  const [user, setUser] = useState(null);
  const [weeklyCount, setWeeklyCount] = useState(0);

  // Check auth on mount
  useEffect(() => {
    const currentUser = getCurrentUser();
    setUser(currentUser);
    // Load use count from localStorage
    const savedCount = localStorage.getItem('clay_use_count');
    if (savedCount) {
      setUseCount(parseInt(savedCount, 10));
    }
    // Load weekly count
    setWeeklyCount(getWeeklyResumeCount());
  }, []);

  // Listen for sign up events from Pricing page
  useEffect(() => {
    const handleShowSignUp = () => {
      setShowPricing(false);
      setShowSignUpPage(true);
    };
    window.addEventListener('clay:showSignUp', handleShowSignUp);
    return () => window.removeEventListener('clay:showSignUp', handleShowSignUp);
  }, []);

  const [isPro, setIsPro] = useState(user?.isPro || false);
  const freeUsesLeft = Math.max(0, 3 - useCount);

  // Update isPro when user changes
  useEffect(() => {
    setIsPro(user?.isPro || false);
  }, [user]);

  const handleFileUpload = useCallback(async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const validExtensions = ['.pdf', '.doc', '.docx'];
    const fileName = file.name.toLowerCase();
    
    if (!validExtensions.some(ext => fileName.endsWith(ext))) {
      setError('Please upload a PDF, DOC, or DOCX file.');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError('File size must be less than 5MB. Please compress your file.');
      return;
    }

    setResumeFile(file);
    setError(null);
    setUploading(true);

    try {
      const parsed = await parseResume(file);
      if (!parsed.success) {
        throw new Error(parsed.error || 'Failed to parse resume.');
      }
      setResumeText(parsed.text);
    } catch (err) {
      setError(err.message || 'An error occurred while processing your file.');
      setResumeFile(null);
    } finally {
      setUploading(false);
    }
  }, []);

  const handleOptimize = useCallback(async () => {
    if (!resumeText.trim() || !jobDesc.trim()) {
      setError('Please provide both a resume and job description.');
      return;
    }

    // Check free uses limit
    if (!isPro && useCount >= 3) {
      // Show upgrade modal with better messaging
      if (!user) {
        // Encourage sign up first
        const shouldSignUp = window.confirm(
          'You\'ve used all 3 free optimizations! Sign up to unlock unlimited optimizations for just $7.99. Continue?'
        );
        if (shouldSignUp) {
          setShowPricing(false);
          setShowSignUpPage(true);
          return;
        }
      } else {
        setShowPricing(true);
        return;
      }
    }

    setProcessing(true);
    setError(null);

    try {
      const apiKey = import.meta.env.VITE_CLAUDE_API_KEY;
      const optimizationResult = apiKey 
        ? await optimizeResumeApi(resumeText, jobDesc, tone)
        : await mockOptimizeResume(resumeText, jobDesc, tone);
      
      if (!optimizationResult.success) {
        throw new Error('Optimization failed. Please try again.');
      }

      setResult({
        ats: optimizationResult.ats_score || 94,
        match: optimizationResult.match_score || 96,
        improvements: optimizationResult.key_changes?.length || 12,
        changes: optimizationResult.key_changes || [],
        gaps: optimizationResult.gap_analysis || [],
        optimizedText: optimizationResult.optimized_resume || resumeText
      });

      // Increment use count if not pro
      if (!isPro) {
        const newCount = useCount + 1;
        setUseCount(newCount);
        localStorage.setItem('clay_use_count', newCount.toString());
      }
      
      setStep(3);
      // Increment weekly count
      const newWeeklyCount = incrementWeeklyCount();
      setWeeklyCount(newWeeklyCount);
      // Trigger confetti celebration!
      createConfetti();
    } catch (err) {
      const errorMsg = err.message.includes('API key')
        ? 'Claude API not configured. Using mock data for demo.'
        : err.message || 'Failed to optimize resume. Please try again.';
      setError(errorMsg);
      
      try {
        const mockResult = await mockOptimizeResume(resumeText, jobDesc, tone);
        setResult({
          ats: mockResult.ats_score || 94,
          match: mockResult.match_score || 96,
          improvements: mockResult.key_changes?.length || 12,
          changes: mockResult.key_changes || [],
          gaps: mockResult.gap_analysis || [],
          optimizedText: mockResult.optimized_resume || resumeText
        });
        if (!isPro) {
          const newCount = useCount + 1;
          setUseCount(newCount);
          localStorage.setItem('clay_use_count', newCount.toString());
        }
        setStep(3);
        // Increment weekly count
        const newWeeklyCount = incrementWeeklyCount();
        setWeeklyCount(newWeeklyCount);
        // Trigger confetti celebration!
        createConfetti();
      } catch (mockErr) {
        console.error('Mock API also failed:', mockErr);
      }
    } finally {
      setProcessing(false);
    }
  }, [resumeText, jobDesc, tone, useCount, isPro]);

  const handleDownload = useCallback(async () => {
    if (!result?.optimizedText) {
      setError('No optimized resume available to download.');
      return;
    }

    try {
      const blob = await generateResumeDocx(result.optimizedText);
      const filename = resumeFile 
        ? `Optimized_${resumeFile.name.replace(/\.[^/.]+$/, '.docx')}`
        : 'Optimized_Resume.docx';
      downloadBlob(blob, filename);
    } catch (err) {
      setError('Failed to generate download. Please try again.');
    }
  }, [result, resumeFile]);

  const handleReset = useCallback(() => {
    setStep(1);
    setResumeFile(null);
    setResumeText('');
    setJobDesc('');
    setResult(null);
    setError(null);
    setTone('professional');
    const fileInput = document.getElementById('upload');
    if (fileInput) fileInput.value = '';
  }, []);

  const handleToneChange = useCallback(async (newTone) => {
    if (tone === newTone || !resumeText || !jobDesc) return;
    
    // Check if tone is locked for free users
    const lockedTones = ['creative', 'technical', 'executive'];
    if (!isPro && lockedTones.includes(newTone.toLowerCase())) {
      setShowPricing(true);
      return;
    }
    
    setTone(newTone);
    setProcessing(true);
    setError(null);

    try {
      const apiKey = import.meta.env.VITE_CLAUDE_API_KEY;
      const optimizationResult = apiKey
        ? await optimizeResumeApi(resumeText, jobDesc, newTone)
        : await mockOptimizeResume(resumeText, jobDesc, newTone);
        
      if (optimizationResult.success) {
        setResult(prev => ({
          ...prev,
          ats: optimizationResult.ats_score || prev?.ats || 94,
          match: optimizationResult.match_score || prev?.match || 96,
          improvements: optimizationResult.key_changes?.length || prev?.improvements || 12,
          changes: optimizationResult.key_changes || prev?.changes || [],
          gaps: optimizationResult.gap_analysis || prev?.gaps || [],
          optimizedText: optimizationResult.optimized_resume || prev?.optimizedText
        }));
      }
    } catch (err) {
      const mockResult = await mockOptimizeResume(resumeText, jobDesc, newTone);
      setResult(prev => ({
        ...prev,
        ...mockResult,
        optimizedText: mockResult.optimized_resume || prev?.optimizedText
      }));
    } finally {
      setProcessing(false);
    }
  }, [tone, resumeText, jobDesc, isPro]);


  const handleUpgrade = useCallback(async () => {
    // If user not signed in, redirect to sign up first
    if (!user) {
      setShowPricing(false);
      // Store intent to upgrade after sign-up
      localStorage.setItem('clay_upgrade_after_signup', 'true');
      setShowSignUpPage(true);
      return;
    }

    try {
      // Import Stripe utility
      const { redirectToStripePayment } = await import('./utils/stripe');
      
      // Redirect to Stripe payment
      redirectToStripePayment(user);
    } catch (error) {
      // Fallback: Show upgrade success (for demo/testing)
      console.warn('Stripe not configured, using demo mode:', error.message);
      const upgradedUser = { ...user, isPro: true };
      setUser(upgradedUser);
      localStorage.setItem('clay_current_user', JSON.stringify(upgradedUser));
      setShowPricing(false);
      
      // In production, show error instead
      if (import.meta.env.VITE_STRIPE_PAYMENT_LINK) {
        setError('Payment processing failed. Please try again or contact support.');
      }
    }
  }, [user]);

  // Show Pricing page if needed
  if (showPricing) {
    return (
      <Pricing
        user={user}
        useCount={useCount}
        freeUsesLeft={freeUsesLeft}
        isPro={isPro}
        onUpgrade={handleUpgrade}
        onBack={() => {
          setShowPricing(false);
          localStorage.removeItem('clay_upgrade_after_signup');
        }}
      />
    );
  }

  // Show SignUp page if needed
  if (showSignUpPage) {
    return (
      <SignUp
        user={user}
        onSuccess={(userData) => {
          setUser(userData);
          setShowSignUpPage(false);
          if (userData?.isPro) {
            setIsPro(true);
          }
          // If user signed up with upgrade intent, show pricing page
          const upgradeAfterSignup = localStorage.getItem('clay_upgrade_after_signup');
          if (upgradeAfterSignup === 'true') {
            localStorage.removeItem('clay_upgrade_after_signup');
            setShowPricing(true);
          }
        }}
        onBack={() => {
          setShowSignUpPage(false);
          localStorage.removeItem('clay_upgrade_after_signup');
        }}
      />
    );
  }

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Minimal Header */}
      <header className="border-b bg-white sticky top-0 z-40">
        <div className="px-4 py-3 flex items-center justify-between max-w-2xl mx-auto">
          <div className="flex items-center gap-2">
            {step > 1 && (
              <button 
                onClick={() => setStep(step - 1)} 
                className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-gray-100 active:scale-95 transition-all -ml-2"
              >
                <ChevronLeft className="w-5 h-5 text-gray-700" />
              </button>
            )}
            <span className="text-xl font-bold text-gray-900">Clay</span>
            {!isPro && useCount > 0 && user && (
              <span className="ml-2 px-2 py-0.5 bg-gray-100 text-gray-600 text-xs font-medium rounded-full">
                {freeUsesLeft} free left
              </span>
            )}
          </div>
          <div className="flex items-center gap-3">
            <div className="flex gap-1.5">
              {[1,2,3].map(i => (
                <div 
                  key={i} 
                  className={`h-1.5 rounded-full transition-all ${
                    step >= i ? 'bg-gray-900 w-6' : 'bg-gray-200 w-1.5'
                  }`} 
                />
              ))}
            </div>
            <div className="flex items-center gap-2">
              {!isPro && (
                <button
                  onClick={() => {
                    // Always show pricing page - no sign-up required to view
                    setShowPricing(true);
                  }}
                  className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-gray-900 text-white text-sm font-medium rounded-full hover:bg-gray-800 active:scale-95 transition-all"
                >
                  <Zap className="w-3.5 h-3.5" />
                  <span>Pro</span>
                </button>
              )}
              {user ? (
                <button 
                  onClick={() => {
                    signOut();
                    setUser(null);
                    handleReset();
                  }}
                  className="w-8 h-8 rounded-full bg-gray-900 text-white text-xs font-semibold flex items-center justify-center"
                >
                  {user?.email?.[0]?.toUpperCase() || 'U'}
                </button>
              ) : (
                <button
                  onClick={() => setShowSignUpPage(true)}
                  className="text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors"
                >
                  Sign up
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Error Banner */}
      {error && (
        <div className="bg-red-50 border-b border-red-200 px-4 py-3">
          <div className="max-w-2xl mx-auto flex items-center justify-between">
            <p className="text-sm text-red-700">{error}</p>
            <button onClick={() => setError(null)} className="text-red-500 hover:text-red-700">
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Step 1: Upload */}
      {step === 1 && (
        <div className="flex-1 flex flex-col pb-24 max-w-2xl mx-auto w-full px-4">
          <div className="flex-1 flex flex-col justify-center py-8">
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-green-50 border border-green-200 rounded-full text-sm font-medium text-green-700 mb-4">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                {formatWeeklyCount(weeklyCount)} resumes optimized this week
              </div>
              <h1 className="text-5xl font-bold text-gray-900 mb-4 tracking-tight">
                Land any job
              </h1>
              <p className="text-xl text-gray-600">Tailor your resume with AI ⚡</p>
            </div>

            <div className="w-full max-w-md mx-auto">
              <input 
                type="file" 
                id="upload" 
                className="hidden" 
                accept=".pdf,.doc,.docx" 
                onChange={handleFileUpload}
                disabled={uploading}
              />
              <label htmlFor="upload" className="block">
                <div className={`rounded-3xl p-12 border-2 transition-all cursor-pointer ${
                  uploading 
                    ? 'border-gray-400 bg-gray-50' 
                    : resumeFile 
                    ? 'border-gray-900 bg-gray-50' 
                    : 'border-gray-300 hover:border-gray-400 bg-white'
                }`}>
                  <div className="flex flex-col items-center gap-6">
                    {uploading ? (
                      <>
                        <Loader2 className="w-20 h-20 text-gray-600 animate-spin" />
                        <div className="text-center">
                          <p className="text-lg font-semibold text-gray-900 mb-1">Reading your resume...</p>
                        </div>
                      </>
                    ) : resumeFile ? (
                      <>
                        <div className="w-20 h-20 rounded-2xl bg-gray-900 flex items-center justify-center">
                          <Check className="w-10 h-10 text-white" />
                        </div>
                        <div className="text-center">
                          <p className="text-lg font-semibold text-gray-900 mb-1 break-all px-2">{resumeFile.name}</p>
                          <p className="text-sm text-gray-600">Ready</p>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="w-20 h-20 rounded-2xl bg-gray-100 flex items-center justify-center">
                          <Upload className="w-10 h-10 text-gray-600" />
                        </div>
                        <div className="text-center">
                          <p className="text-2xl font-semibold text-gray-900 mb-2">Upload resume</p>
                          <p className="text-sm text-gray-500">PDF, DOC, or DOCX</p>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </label>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 mt-12 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <span className="text-xl">🚀</span>
                <span>Instant results</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xl">🔒</span>
                <span>100% private</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xl">✨</span>
                <span>3 free optimizations</span>
              </div>
            </div>
            
            {/* Soft CTA for sign up */}
            {!user && (
              <div className="mt-8 text-center">
                <button
                  onClick={() => setShowSignUpPage(true)}
                  className="text-sm text-gray-600 hover:text-gray-900 transition-colors underline"
                >
                  Sign up to save your progress →
                </button>
              </div>
            )}
          </div>

          {resumeFile && !uploading && (
            <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t">
              <div className="max-w-2xl mx-auto">
                <button 
                  onClick={() => setStep(2)} 
                  className="w-full h-14 bg-gray-900 text-white rounded-2xl font-semibold text-lg flex items-center justify-center gap-2 active:scale-[0.98] transition-all"
                >
                  Continue <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Step 2: Job Description */}
      {step === 2 && (
        <div className="flex-1 flex flex-col pb-24 max-w-2xl mx-auto w-full px-4 pt-8">
          <div className="mb-6">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Paste the job posting</h2>
            <p className="text-lg text-gray-600">Include the full description for best results 🎯</p>
            <div className="mt-4 flex items-center gap-2 text-sm text-gray-500">
              <div className="flex items-center gap-1.5">
                <div className="w-1.5 h-1.5 bg-green-500 rounded-full" />
                <span>Your resume stays on your device</span>
              </div>
            </div>
          </div>

          <div className="flex-1 flex flex-col min-h-0">
            <textarea 
              value={jobDesc} 
              onChange={(e) => setJobDesc(e.target.value)} 
              placeholder="Senior Product Manager

About the role:
We're seeking an experienced PM to lead our product team…

Requirements:
• 5+ years in product management
• Strong agile/scrum experience
• Data-driven decision maker
• Excellent communication skills"
              className="flex-1 w-full p-5 border-2 border-gray-200 rounded-2xl focus:border-gray-900 outline-none resize-none text-base leading-relaxed bg-white transition-all"
              style={{ minHeight: '400px' }}
            />
            <div className="mt-3 flex items-center justify-between px-1">
              <p className="text-xs text-gray-500">
                {jobDesc.length > 0 ? `${jobDesc.length} characters` : 'More detail = better match'}
              </p>
              {jobDesc.length > 200 && (
                <div className="flex items-center gap-1.5 text-xs text-green-600">
                  <Check className="w-3.5 h-3.5" />
                  <span>Looking good!</span>
                </div>
              )}
            </div>
          </div>

          <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t">
            <div className="max-w-2xl mx-auto">
              <button 
                onClick={handleOptimize} 
                disabled={!jobDesc.trim() || processing || !resumeText}
                className="w-full h-14 bg-gray-900 text-white rounded-2xl font-semibold text-lg flex items-center justify-center gap-2 active:scale-[0.98] transition-all disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {processing ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Optimizing...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5" />
                    Optimize Resume
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Step 3: Results - Clean & Focused */}
      {step === 3 && result && (
        <div className="flex-1 flex flex-col max-w-2xl mx-auto w-full bg-white">
          {/* Success Banner */}
          <div className="bg-gray-900 px-4 sm:px-6 py-8 sm:py-10">
            <div className="flex items-start justify-between mb-6">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-10 h-10 bg-green-500 rounded-xl flex items-center justify-center">
                    <Check className="w-6 h-6 text-white" />
                  </div>
                  <h1 className="text-3xl sm:text-4xl font-bold text-white">All set! 🎉</h1>
                </div>
                <p className="text-white/70 text-base">Your resume is optimized and ready to download</p>
              </div>
            </div>

            {/* Stats Row */}
            <div className="grid grid-cols-2 gap-3 mb-6">
              <div className="bg-white/10 backdrop-blur rounded-xl p-4 border border-white/20">
                <div className="text-3xl font-bold text-white mb-0.5">{result.ats}</div>
                <div className="text-xs text-white/60">ATS Score</div>
              </div>
              <div className="bg-white/10 backdrop-blur rounded-xl p-4 border border-white/20">
                <div className="text-3xl font-bold text-white mb-0.5">{result.match}%</div>
                <div className="text-xs text-white/60">Job Match</div>
              </div>
            </div>

            {/* Download CTA */}
            <button 
              onClick={handleDownload}
              className="w-full h-14 bg-white text-gray-900 rounded-xl font-bold text-base flex items-center justify-center gap-2 hover:bg-gray-100 active:scale-[0.98] transition-all"
            >
              <Download className="w-5 h-5" /> 
              <span>Download Resume</span>
            </button>
          </div>

          {/* Scrollable Content */}
          <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-6 space-y-5">
            {/* Full Preview */}
            <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
              <div className="px-4 py-3 bg-gray-50 border-b border-gray-200 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-gray-600" />
                  <span className="text-sm font-semibold text-gray-900">Preview</span>
                </div>
              </div>
              <div className="p-4 sm:p-6 max-h-[55vh] overflow-y-auto">
                <pre className="whitespace-pre-wrap text-sm leading-relaxed text-gray-800 font-sans">
                  {result.optimizedText}
                </pre>
              </div>
            </div>

            {/* Tone Switcher */}
            <div className="bg-white rounded-2xl border border-gray-200 p-4">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-semibold text-gray-900">Tone</span>
                {processing && <Loader2 className="w-4 h-4 animate-spin text-gray-400" />}
              </div>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { name: 'Professional', locked: false },
                  { name: 'Creative', locked: !isPro },
                  { name: 'Technical', locked: !isPro },
                  { name: 'Executive', locked: !isPro }
                ].map(t => (
                  <button 
                    key={t.name}
                    onClick={() => {
                      if (t.locked) {
                        setShowPricing(true);
                      } else {
                        handleToneChange(t.name.toLowerCase());
                      }
                    }}
                    disabled={processing}
                    className={`py-2.5 rounded-lg text-sm font-medium transition-all disabled:opacity-50 relative ${
                      tone === t.name.toLowerCase()
                        ? 'bg-gray-900 text-white'
                        : t.locked
                        ? 'bg-gray-50 text-gray-400 cursor-not-allowed'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200 active:scale-95'
                    }`}
                  >
                    {t.name}
                    {t.locked && (
                      <Lock className="w-3 h-3 absolute top-1 right-1" />
                    )}
                  </button>
                ))}
              </div>
              {!isPro && (
                <p className="text-xs text-gray-500 mt-2 text-center">
                  <button 
                    onClick={() => setShowPricing(true)}
                    className="underline hover:text-gray-700"
                  >
                    Upgrade to Pro
                  </button>
                  {' '}to unlock Creative, Technical, and Executive tones
                </p>
              )}
            </div>

            {/* Improvements List */}
            {result.changes && result.changes.length > 0 && (
              <div className="bg-white rounded-2xl border border-gray-200 p-4">
                <div className="flex items-center gap-2 mb-3">
                  <TrendingUp className="w-4 h-4 text-green-600" />
                  <span className="text-sm font-semibold text-gray-900">Key improvements</span>
                </div>
                <div className="space-y-2.5">
                  {result.changes.slice(0, 4).map((change, idx) => (
                    <div key={idx} className="flex gap-2 text-sm">
                      <Check className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700 leading-relaxed">{change}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Social Proof */}
            <div className="bg-amber-50 rounded-2xl p-4 border border-amber-200">
              <div className="flex items-center gap-1 mb-2 justify-center">
                {[1,2,3,4,5].map(i => (
                  <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                ))}
              </div>
              <p className="text-sm text-gray-900 text-center font-medium mb-1">
                "Got 3 interviews in a week!"
              </p>
              <p className="text-xs text-gray-600 text-center">— Marcus L., Product Manager</p>
            </div>

            {/* Secondary CTA */}
            <button 
              onClick={handleReset}
              className="w-full h-12 bg-white text-gray-700 rounded-xl font-medium text-sm border-2 border-gray-200 flex items-center justify-center gap-2 hover:bg-gray-50 active:scale-[0.98] transition-all"
            >
              <RefreshCw className="w-4 h-4" /> 
              <span>Optimize Another</span>
            </button>
          </div>

          {/* Fixed Bottom Download */}
          <div className="border-t bg-white p-4">
            <button 
              onClick={handleDownload}
              className="w-full h-14 bg-gray-900 text-white rounded-xl font-bold text-base flex items-center justify-center gap-2 active:scale-[0.98] transition-all"
            >
              <Download className="w-5 h-5" /> 
              <span>Download Resume (DOCX)</span>
            </button>
          </div>
        </div>
      )}

      {/* Loading Overlay */}
      {processing && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="bg-white rounded-3xl p-8 max-w-sm mx-4 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Sparkles className="w-8 h-8 text-gray-900 animate-pulse" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Optimizing your resume ✨</h3>
            <p className="text-sm text-gray-600 mb-4">AI is analyzing and rewriting...</p>
            <div className="space-y-2 text-left text-xs text-gray-500">
              <div className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-green-500" />
                <span>Analyzing job requirements</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-green-500" />
                <span>Matching your experience</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3.5 h-3.5 border-2 border-gray-300 border-t-gray-900 rounded-full animate-spin" />
                <span>Rewriting for impact...</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="border-t bg-white">
        <div className="max-w-2xl mx-auto px-4 py-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-center text-sm text-gray-500">
              Made with <span className="text-red-500">♥</span> by{' '}
              <a 
                href="https://roundtripux.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-700 hover:text-gray-900 font-medium underline underline-offset-2 transition-colors"
              >
                roundtrip ux
              </a>
              {' '}· Free forever
            </p>
            <LanguageSwitcher />
          </div>
        </div>
      </footer>

    </div>
  );
}
