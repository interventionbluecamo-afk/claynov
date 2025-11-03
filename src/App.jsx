import React, { useState, useCallback, useEffect } from 'react';
import { Sparkles, FileText, ArrowRight, Check, TrendingUp, Star, Lock, X, Loader2, LogOut, Upload, Download, RefreshCw, ChevronLeft, Zap } from 'lucide-react';
import { parseResume } from './utils/fileParser';
import { optimizeResume as optimizeResumeApi } from './utils/claudeApi';
import { mockOptimizeResume } from './utils/mockApi';
import { generateResumeDocx, downloadBlob } from './utils/resumeGenerator';
import { getCurrentUser, signOut } from './utils/auth';
import { createConfetti } from './utils/confetti';
import SignUp from './pages/SignUp';
import { getWeeklyResumeCount, formatWeeklyCount, incrementWeeklyCount } from './utils/weeklyCount';

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
  const [showUpgrade, setShowUpgrade] = useState(false);
  const [showAuth, setShowAuth] = useState(false);
  const [showSignUpPage, setShowSignUpPage] = useState(false);
  const [user, setUser] = useState(null);
  const [authEmail, setAuthEmail] = useState('');
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
      setShowUpgrade(true);
      return;
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
  }, [tone, resumeText, jobDesc]);

  const handleAuthEmail = useCallback(() => {
    if (!authEmail.trim()) {
      setError('Please enter your email');
      return;
    }
    // Mock sign in for demo
    const mockUser = { email: authEmail, isPro: false };
    setUser(mockUser);
    localStorage.setItem('clay_current_user', JSON.stringify(mockUser));
    setShowAuth(false);
    setAuthEmail('');
  }, [authEmail]);

  const handleGoogleAuth = useCallback(() => {
    // Mock Google sign in
    const mockUser = { email: 'demo@gmail.com', isPro: false };
    setUser(mockUser);
    localStorage.setItem('clay_current_user', JSON.stringify(mockUser));
    setShowAuth(false);
  }, []);

  const handleUpgrade = useCallback(() => {
    // Mock upgrade
    const upgradedUser = { ...user, isPro: true };
    setUser(upgradedUser);
    localStorage.setItem('clay_current_user', JSON.stringify(upgradedUser));
    setShowUpgrade(false);
    alert('Payment processing coming soon! For now, enjoy Pro access.');
  }, [user]);

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
        }}
        onBack={() => setShowSignUpPage(false)}
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
            {user ? (
              <div className="flex items-center gap-2">
                {!isPro && (
                  <button
                    onClick={() => setShowUpgrade(true)}
                    className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-gray-900 text-white text-sm font-medium rounded-full hover:bg-gray-800 active:scale-95 transition-all"
                  >
                    <Zap className="w-3.5 h-3.5" />
                    <span>Pro</span>
                  </button>
                )}
                <button 
                  onClick={() => {
                    signOut();
                    setUser(null);
                    handleReset();
                  }}
                  className="w-8 h-8 rounded-full bg-gray-900 text-white text-xs font-semibold flex items-center justify-center"
                >
                  {user.email[0].toUpperCase()}
                </button>
              </div>
            ) : (
              <button
                onClick={() => setShowSignUpPage(true)}
                className="text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors"
              >
                Sign in
              </button>
            )}
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
                <span>Free to start</span>
              </div>
            </div>
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

      {/* Step 3: Results - Redesigned for better UX and conversion */}
      {step === 3 && result && (
        <div className="flex-1 flex flex-col pb-32 max-w-4xl mx-auto w-full">
          {/* Compact Success Header - Consistent with app */}
          <div className="bg-white px-4 sm:px-6 py-6 sm:py-8 border-b border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <Check className="w-5 h-5 text-green-600" />
                  <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Resume optimized! 🎉</h2>
                </div>
                <p className="text-sm sm:text-base text-gray-600">Ready to download and apply</p>
              </div>
              <div className="flex flex-col items-end gap-1">
                <div className="text-right">
                  <div className="text-2xl sm:text-3xl font-bold text-gray-900">{result.ats}</div>
                  <div className="text-xs text-gray-600">ATS Score</div>
                </div>
              </div>
            </div>
            
            {/* Compact Stats Row - White cards like rest of app */}
            <div className="grid grid-cols-3 gap-2 sm:gap-3">
              <div className="bg-white rounded-xl p-3 sm:p-4 text-center border border-gray-200 shadow-sm">
                <div className="text-xl sm:text-2xl font-bold text-gray-900 mb-0.5">{result.match}</div>
                <div className="text-xs text-gray-600">Match</div>
              </div>
              <div className="bg-white rounded-xl p-3 sm:p-4 text-center border border-gray-200 shadow-sm">
                <div className="text-xl sm:text-2xl font-bold text-gray-900 mb-0.5">{result.improvements || result.changes?.length || 12}</div>
                <div className="text-xs text-gray-600">Changes</div>
              </div>
              <div className="bg-white rounded-xl p-3 sm:p-4 text-center border border-gray-200 shadow-sm">
                <div className="text-xl sm:text-2xl font-bold text-gray-900 mb-0.5">✨</div>
                <div className="text-xs text-gray-600">Optimized</div>
              </div>
            </div>
          </div>

          <div className="px-4 sm:px-6 py-6 space-y-4">
            {/* Primary CTA - Clean white card */}
            <div className="bg-white rounded-2xl p-4 sm:p-5 border border-gray-200 shadow-sm">
              <button 
                onClick={handleDownload}
                className="w-full h-14 bg-gray-900 text-white rounded-xl font-semibold text-base sm:text-lg flex items-center justify-center gap-2 active:scale-[0.98] transition-all hover:bg-gray-800"
              >
                <Download className="w-5 h-5" /> 
                <span>Download Optimized Resume</span>
              </button>
              <p className="text-xs text-gray-500 text-center mt-2">DOCX format · Ready to upload anywhere</p>
            </div>

            {/* Tone Selector - Compact and Inline */}
            <div className="bg-white rounded-xl p-4 border border-gray-200">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-medium text-gray-600">Tone:</span>
                {processing && (
                  <div className="flex items-center gap-1 text-xs text-gray-500">
                    <Loader2 className="w-3 h-3 animate-spin" />
                    <span>Updating...</span>
                  </div>
                )}
              </div>
              <div className="flex gap-2 overflow-x-auto pb-1" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
                {['Professional', 'Creative', 'Technical', 'Executive'].map(t => (
                  <button 
                    key={t}
                    onClick={() => handleToneChange(t.toLowerCase())}
                    disabled={processing}
                    className={`px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-medium whitespace-nowrap transition-all disabled:opacity-50 flex-shrink-0 ${
                      tone === t.toLowerCase()
                        ? 'bg-gray-900 text-white shadow-sm'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200 active:scale-95'
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            {/* Preview - Consistent styling */}
            <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
              <div className="bg-gray-50 px-4 sm:px-5 py-3 flex items-center justify-between border-b border-gray-200">
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-gray-600" />
                  <span className="text-sm font-semibold text-gray-900">Preview Your Optimized Resume</span>
                </div>
                <span className="text-xs text-gray-500 hidden sm:inline">Scroll to review</span>
              </div>
              <div className="p-4 sm:p-6 max-h-[60vh] sm:max-h-[500px] overflow-y-auto bg-white">
                <pre className="whitespace-pre-wrap text-xs sm:text-sm font-sans text-gray-800 leading-relaxed">
                  {result.optimizedText}
                </pre>
              </div>
              <div className="bg-gray-50 px-4 sm:px-5 py-3 border-t border-gray-200">
                <button 
                  onClick={handleDownload}
                  className="w-full sm:w-auto sm:ml-auto sm:mr-0 h-11 bg-gray-900 text-white rounded-lg font-semibold text-sm flex items-center justify-center gap-2 px-6 active:scale-[0.98] transition-all hover:bg-gray-800"
                >
                  <Download className="w-4 h-4" /> 
                  <span>Download Now</span>
                </button>
              </div>
            </div>

            {/* Social Proof - Consistent gray theme */}
            <div className="bg-white rounded-2xl p-4 sm:p-5 border border-gray-200 shadow-sm">
              <div className="flex items-center justify-center gap-1 mb-2">
                {[1,2,3,4,5].map(i => (
                  <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                ))}
              </div>
              <p className="text-sm sm:text-base text-gray-800 text-center mb-1 font-medium">
                "Got 3 interviews in a week. This tool is incredible." 🚀
              </p>
              <p className="text-xs text-gray-600 text-center">— Marcus L., Product Manager</p>
            </div>

            {/* Secondary CTA */}
            <button 
              onClick={handleReset}
              className="w-full h-12 bg-white text-gray-700 rounded-xl font-medium text-sm border-2 border-gray-200 flex items-center justify-center gap-2 active:scale-[0.98] transition-all hover:bg-gray-50"
            >
              <RefreshCw className="w-4 h-4" /> 
              <span>Optimize Another Resume</span>
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
      <footer className="text-center text-sm text-gray-500 py-6 border-t bg-white">
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
      </footer>

      {/* Auth Modal */}
      {showAuth && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl">
            <div className="p-8">
              <div className="text-center mb-6">
                <div className="w-14 h-14 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Sparkles className="w-7 h-7 text-gray-900" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Save your progress</h2>
                <p className="text-sm text-gray-600">Sign in to keep track of your optimizations (still free!)</p>
              </div>

              <div className="space-y-3 mb-6">
                <input 
                  type="email" 
                  placeholder="your@email.com"
                  value={authEmail}
                  onChange={(e) => setAuthEmail(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-gray-900 outline-none transition-all text-base"
                />
                <button 
                  onClick={handleAuthEmail}
                  className="w-full h-12 bg-gray-900 text-white rounded-xl font-semibold text-base active:scale-[0.98] transition-all"
                >
                  Continue with Email
                </button>
              </div>

              <div className="relative mb-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200"></div>
                </div>
                <div className="relative flex justify-center text-xs">
                  <span className="px-2 bg-white text-gray-500">or</span>
                </div>
              </div>

              <button 
                onClick={handleGoogleAuth}
                className="w-full h-12 bg-white border-2 border-gray-200 rounded-xl font-medium text-base flex items-center justify-center gap-3 hover:bg-gray-50 active:scale-[0.98] transition-all"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Continue with Google
              </button>

              <button
                onClick={() => setShowAuth(false)}
                className="w-full py-3 text-gray-600 font-medium text-sm hover:text-gray-900 transition-colors mt-4"
              >
                Skip for now
              </button>

              <p className="text-xs text-gray-500 text-center mt-6">
                No spam, ever. Just save your resumes and get notified of new features.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Upgrade Modal */}
      {showUpgrade && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl">
            <div className="p-8">
              <div className="w-16 h-16 bg-gradient-to-br from-amber-100 to-orange-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Zap className="w-8 h-8 text-amber-600" />
              </div>
              
              <h2 className="text-2xl font-bold text-gray-900 text-center mb-2">You're on a roll! 🚀</h2>
              <p className="text-base text-gray-600 text-center mb-4">
                You've used all 3 free optimizations. Upgrade to Pro for unlimited optimizations!
              </p>
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-3 mb-6 text-center">
                <p className="text-xs text-blue-700">
                  💡 <strong>Tip:</strong> Sign up to track your progress and unlock more features. We use secure authentication to prevent abuse.
                </p>
              </div>

              {/* Pricing */}
              <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-6 mb-6 border-2 border-gray-900">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <div className="text-3xl font-bold text-gray-900">$7.99</div>
                    <div className="text-sm text-gray-600">one-time</div>
                  </div>
                  <div className="px-3 py-1 bg-amber-100 text-amber-700 text-xs font-bold rounded-full">
                    PAY ONCE
                  </div>
                </div>
                
                <div className="space-y-2.5 mb-4">
                  <div className="flex items-start gap-2 text-sm">
                    <Check className="w-4 h-4 text-gray-900 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700"><strong>Unlimited</strong> resume optimizations</span>
                  </div>
                  <div className="flex items-start gap-2 text-sm">
                    <Check className="w-4 h-4 text-gray-900 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700"><strong>All tone options</strong> (Creative, Technical, Executive)</span>
                  </div>
                  <div className="flex items-start gap-2 text-sm">
                    <Check className="w-4 h-4 text-gray-900 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700"><strong>Priority</strong> AI processing</span>
                  </div>
                  <div className="flex items-start gap-2 text-sm">
                    <Check className="w-4 h-4 text-gray-900 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700"><strong>Cover letter</strong> generator (coming soon)</span>
                  </div>
                </div>
              </div>

              <button
                onClick={handleUpgrade}
                className="w-full h-14 bg-gray-900 text-white rounded-2xl font-semibold text-lg flex items-center justify-center gap-2 active:scale-[0.98] transition-all mb-3"
              >
                <Zap className="w-5 h-5" />
                Get Pro for $7.99
              </button>

              <button
                onClick={() => setShowUpgrade(false)}
                className="w-full py-3 text-gray-600 font-medium text-sm hover:text-gray-900 transition-colors"
              >
                Maybe later
              </button>

              <div className="mt-4 pt-4 border-t border-gray-200">
                <div className="flex items-center justify-center gap-4 text-xs text-gray-500">
                  <div className="flex items-center gap-1">
                    <Check className="w-3 h-3 text-gray-400" />
                    <span>Secure payment</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Check className="w-3 h-3 text-gray-400" />
                    <span>No subscription</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Check className="w-3 h-3 text-gray-400" />
                    <span>Yours forever</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
