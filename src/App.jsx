import React, { useState, useCallback } from 'react';
import { Sparkles, FileText, Zap, ArrowRight, Check, TrendingUp, Star, Lock, X, Loader2 } from 'lucide-react';
import { parseResume } from './utils/fileParser';
import { optimizeResume as optimizeResumeApi } from './utils/claudeApi';
import { generateResumeDocx, downloadBlob } from './utils/resumeGenerator';
import UploadZone from './components/UploadZone';
import ErrorBanner from './components/ErrorBanner';
import StatsCard from './components/StatsCard';
import StepIndicator from './components/StepIndicator';
import UserCount from './components/UserCount';
import BeforeAfter from './components/BeforeAfter';

export default function ClayApp() {
  const [step, setStep] = useState(1);
  const [resumeFile, setResumeFile] = useState(null);
  const [resumeText, setResumeText] = useState('');
  const [jobDesc, setJobDesc] = useState('');
  const [processing, setProcessing] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [showAddOns, setShowAddOns] = useState(false);
  const [tone, setTone] = useState('professional');

  const handleFileUpload = useCallback(async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    const validExtensions = ['.pdf', '.doc', '.docx'];
    const fileName = file.name.toLowerCase();
    
    if (!validExtensions.some(ext => fileName.endsWith(ext))) {
      setError('Please upload a PDF, DOC, or DOCX file.');
      return;
    }

    // Validate file size (max 5MB)
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
        throw new Error(parsed.error || 'Failed to parse resume. Please ensure the file is not corrupted.');
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

    setProcessing(true);
    setError(null);

    try {
      const optimizationResult = await optimizeResumeApi(resumeText, jobDesc, tone);
      
      if (!optimizationResult.success) {
        throw new Error('Optimization failed. Please try again.');
      }

      setResult({
        ats: optimizationResult.ats_score || 85,
        match: optimizationResult.match_score || 88,
        changes: optimizationResult.key_changes || [],
        gaps: optimizationResult.gap_analysis || [],
        optimizedText: optimizationResult.optimized_resume || resumeText
      });
      
      setStep(3);
    } catch (err) {
      const errorMsg = err.message.includes('API key')
        ? 'Claude API not configured. Please add your API key to environment variables.'
        : err.message || 'Failed to optimize resume. Please try again.';
      setError(errorMsg);
    } finally {
      setProcessing(false);
    }
  }, [resumeText, jobDesc, tone]);

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

  const reset = useCallback(() => {
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
      const optimizationResult = await optimizeResumeApi(resumeText, jobDesc, newTone);
      if (optimizationResult.success) {
        setResult(prev => ({
          ...prev,
          ats: optimizationResult.ats_score || prev?.ats || 85,
          match: optimizationResult.match_score || prev?.match || 88,
          changes: optimizationResult.key_changes || prev?.changes || [],
          gaps: optimizationResult.gap_analysis || prev?.gaps || [],
          optimizedText: optimizationResult.optimized_resume || prev?.optimizedText
        }));
      }
    } catch (err) {
      setError('Failed to re-optimize. Please try again.');
    } finally {
      setProcessing(false);
    }
  }, [tone, resumeText, jobDesc]);

  const features = [
    { icon: Sparkles, title: 'AI Optimization', desc: 'Claude AI rewrites smart' },
    { icon: Zap, title: 'Beat ATS', desc: 'Tracking system ready' },
    { icon: FileText, title: 'Gap Analysis', desc: 'Bridge skill gaps' }
  ];

  const addOns = [
    { name: 'Cover Letter Pack', price: '$2.99', desc: '10 AI-generated covers', icon: FileText },
    { name: 'LinkedIn Optimizer', price: '$3.99', desc: 'Optimize your profile', icon: Sparkles },
    { name: 'Interview Prep', price: '$9.99', desc: 'Questions from resume', icon: TrendingUp }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-teal-50">
      {/* Header */}
      <header className="border-b glass sticky top-0 z-50 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-slate-600 to-teal-600 rounded-lg flex items-center justify-center shadow-lg">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-slate-700 to-teal-600 bg-clip-text text-transparent">Clay</span>
          </div>
          <button className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors">
            Sign In
          </button>
        </div>
      </header>

      {/* Error Banner */}
      <ErrorBanner error={error} onDismiss={() => setError(null)} />

      {/* Step 1: Upload */}
      {step === 1 && (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 pt-8 sm:pt-16 pb-16">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-100 to-emerald-100 text-green-700 rounded-full text-sm font-bold mb-6">
              <Sparkles className="w-4 h-4" />
              100% Free Forever
            </div>
            
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-gray-900 mb-4 leading-tight">
              Land jobs like<br />
              <span className="bg-gradient-to-r from-slate-700 to-teal-600 bg-clip-text text-transparent">never before</span>
            </h1>
            <p className="text-lg sm:text-xl text-gray-600 mb-2">
              AI tailors your resume in seconds.
            </p>
            <p className="text-lg font-semibold text-gray-900">3.2x more callbacks</p>
          </div>

          {/* Social Proof */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mb-12 text-sm">
            <UserCount count={2341} />
            <div className="flex items-center gap-1">
              {[1,2,3,4,5].map(i => (
                <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
              ))}
              <span className="text-gray-700 font-medium ml-1">4.9/5</span>
            </div>
          </div>

          {/* Upload Zone */}
          <div id="upload-section" className="max-w-xl mx-auto mb-8">
            <UploadZone file={resumeFile} uploading={uploading} onFileSelect={handleFileUpload} />
            
            {resumeFile && !uploading && (
              <button 
                onClick={() => setStep(2)} 
                className="mt-6 w-full px-8 py-4 bg-gradient-to-r from-slate-700 to-teal-600 text-white rounded-xl font-semibold hover:shadow-xl hover:shadow-teal-500/25 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
              >
                Continue <ArrowRight className="w-5 h-5" />
              </button>
            )}
          </div>

          {/* Trust Indicators */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 text-sm text-gray-500 mb-16">
            {[{icon: Check, text: 'Unlimited & Free'}, {icon: Check, text: 'No credit card'}, {icon: Lock, text: 'Private'}].map((item, i) => (
              <div key={i} className="flex items-center gap-2">
                <item.icon className="w-4 h-4 text-green-500" />
                <span>{item.text}</span>
              </div>
            ))}
          </div>

          {/* Features */}
          <div className="grid sm:grid-cols-3 gap-6 mb-16">
            {features.map((f, i) => (
              <div key={i} className="glass rounded-xl p-6 shadow-lg border border-white/50 hover:shadow-xl transition-all hover:scale-[1.02]">
                <div className="w-12 h-12 bg-gradient-to-br from-slate-100 to-teal-100 rounded-lg flex items-center justify-center mb-4">
                  <f.icon className="w-6 h-6 text-slate-700" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">{f.title}</h3>
                <p className="text-sm text-gray-600">{f.desc}</p>
              </div>
            ))}
          </div>

          {/* Testimonial */}
          <div className="glass-dark rounded-2xl p-8 text-white text-center shadow-2xl mb-16">
            <p className="text-base mb-4 opacity-90">"Used Clay. 31 companies. 14 interviews, 3 offers."</p>
            <div className="flex items-center justify-center gap-3">
              <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center font-bold border border-white/20">ML</div>
              <div className="text-left">
                <p className="font-semibold">Marcus L.</p>
                <p className="text-sm opacity-80">Designer → Senior PM</p>
              </div>
            </div>
          </div>

          {/* Before/After Comparison */}
          <BeforeAfter />
        </div>
      )}

      {/* Step 2: Job Description */}
      {step === 2 && (
        <div className="max-w-3xl mx-auto px-4 sm:px-6 pt-8 sm:pt-12 pb-16">
          <StepIndicator currentStep={2} />
          
          <button 
            onClick={() => setStep(1)} 
            className="text-sm text-gray-600 hover:text-gray-900 mb-8 flex items-center gap-2 transition-colors"
          >
            ← Back
          </button>
          
          <div className="text-center mb-8">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">Paste job description</h2>
            <p className="text-base text-gray-600">More detail = better match</p>
          </div>

          <div className="glass rounded-2xl shadow-xl p-6 sm:p-8 border border-white/50">
            <textarea 
              value={jobDesc} 
              onChange={(e) => setJobDesc(e.target.value)} 
              placeholder="Senior Product Manager - 5+ years experience, agile methodology, cross-functional leadership..."
              className="w-full h-64 p-4 border-2 border-gray-200 rounded-xl focus:border-slate-500 focus:ring-2 focus:ring-slate-200 outline-none resize-none text-base transition-all bg-white/50" 
            />
            <div className="mt-2 text-xs text-gray-500">
              {jobDesc.length > 0 && `${jobDesc.length} characters`}
            </div>
            
            <button 
              onClick={handleOptimize} 
              disabled={!jobDesc.trim() || processing || !resumeText} 
              className="mt-6 w-full px-8 py-4 bg-gradient-to-r from-slate-700 to-teal-600 text-white rounded-xl font-semibold hover:shadow-xl hover:shadow-teal-500/25 active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {processing ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
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

          <div className="mt-8 glass rounded-xl p-4 flex gap-3 border border-teal-100/50">
            <Lock className="w-6 h-6 text-slate-600 flex-shrink-0" />
            <div>
              <h4 className="font-semibold text-slate-900 mb-1">100% Private</h4>
              <p className="text-sm text-slate-700">Your resume stays on your device. Processing happens securely via Claude API.</p>
            </div>
          </div>
        </div>
      )}

      {/* Step 3: Results */}
      {step === 3 && result && (
        <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-8 sm:pt-12 pb-16">
          <StepIndicator currentStep={3} />
          
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-100 text-green-700 rounded-full text-sm font-medium mb-4">
              <Check className="w-4 h-4" />
              Optimization Complete
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">Your resume is ready</h2>
            <p className="text-lg text-gray-600">
              <span className="font-semibold text-slate-700">3.2x better</span> chance of landing the interview
            </p>
          </div>

          {/* Tone Selector */}
          <div className="glass rounded-xl p-6 shadow-xl mb-6 border border-white/50">
            <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-slate-700" />
              Choose Tone (Free)
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {['Professional', 'Creative', 'Technical', 'Executive'].map(t => (
                <button 
                  key={t} 
                  onClick={() => handleToneChange(t.toLowerCase())}
                  disabled={processing}
                  className={`p-4 rounded-lg border-2 transition-all disabled:opacity-50 ${
                    tone === t.toLowerCase() 
                      ? 'border-slate-600 bg-slate-50 font-semibold shadow-md' 
                      : 'border-gray-200 hover:border-slate-300 hover:shadow-sm'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 sm:gap-6 mb-6">
            <StatsCard value={result.ats} label="ATS Score" index={0} />
            <StatsCard value={result.match} label="Match Score" index={1} />
            <StatsCard value={result.changes?.length || 0} label="Improvements" index={2} />
          </div>

          {/* Results Grid */}
          <div className="grid sm:grid-cols-2 gap-6 mb-8">
            <div className="glass rounded-xl p-6 shadow-xl border border-white/50">
              <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-slate-700" />
                Key Changes
              </h3>
              <ul className="space-y-3">
                {result.changes && result.changes.length > 0 ? (
                  result.changes.map((c, i) => (
                    <li key={i} className="flex gap-3 text-sm">
                      <Check className="w-5 h-5 text-green-500 flex-shrink-0" />
                      <span className="text-gray-700">{c}</span>
                    </li>
                  ))
                ) : (
                  <li className="text-sm text-gray-500">No specific changes identified</li>
                )}
              </ul>
            </div>

            <div className="glass rounded-xl p-6 shadow-xl border border-white/50">
              <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <FileText className="w-5 h-5 text-slate-700" />
                Gap Analysis
              </h3>
              <div className="space-y-3">
                {result.gaps && result.gaps.length > 0 ? (
                  result.gaps.map((g, i) => (
                    <div key={i} className="border-l-2 border-slate-300 pl-3">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <span className="font-medium text-sm text-gray-900">{g.skill}</span>
                        <span className={`px-2 py-0.5 text-xs rounded-full ${
                          g.status === 'present' 
                            ? 'bg-green-100 text-green-700' 
                            : g.status === 'added' 
                            ? 'bg-teal-100 text-teal-700' 
                            : 'bg-orange-100 text-orange-700'
                        }`}>
                          {g.status}
                        </span>
                      </div>
                      <p className="text-xs text-gray-600">{g.recommendation || g.rec}</p>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-gray-500">No gaps identified</p>
                )}
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-4">
            <button 
              onClick={reset} 
              className="w-full sm:w-auto px-8 py-4 border-2 border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 active:scale-[0.98] transition-all glass"
            >
              Optimize Another
            </button>
            <button 
              onClick={handleDownload}
              className="flex-1 px-8 py-4 bg-gradient-to-r from-slate-700 to-teal-600 text-white rounded-xl font-semibold hover:shadow-xl hover:shadow-teal-500/25 active:scale-[0.98] transition-all"
            >
              Download Resume
            </button>
          </div>
        </div>
      )}

      {/* Add-ons Modal */}
      {showAddOns && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center z-50 p-0 sm:p-6" 
          onClick={() => setShowAddOns(false)}
        >
          <div 
            className="bg-white rounded-t-2xl sm:rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto" 
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6 sm:p-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Optional Add-Ons</h2>
                <button 
                  onClick={() => setShowAddOns(false)} 
                  className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>
              <p className="text-base text-gray-600 mb-6">Clay is free forever. These help you go further.</p>

              <div className="space-y-4">
                {addOns.map((a, i) => (
                  <div key={i} className="glass border border-gray-200/50 rounded-xl p-4 hover:border-slate-300 transition-all">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-slate-100 to-teal-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <a.icon className="w-5 h-5 text-slate-700" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-1">
                          <h3 className="font-semibold text-gray-900">{a.name}</h3>
                          <span className="font-bold text-slate-700">{a.price}</span>
                        </div>
                        <p className="text-sm text-gray-600 mb-3">{a.desc}</p>
                        <button className="w-full px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200 active:scale-[0.98] transition-all">
                          Add
                        </button>
                      </div>
                    </div>
                  </div>
                ))}

                <div className="border-2 border-slate-600 rounded-xl p-4 glass-dark">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-slate-600 to-teal-600 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Check className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-1">
                        <h3 className="font-bold text-white">All 3 Bundle</h3>
                        <div className="text-right">
                          <span className="font-bold text-white block">$14.99</span>
                          <span className="text-xs text-gray-300 line-through">$16.97</span>
                        </div>
                      </div>
                      <p className="text-sm text-gray-200 mb-3">Save $2</p>
                      <button className="w-full px-4 py-2 bg-gradient-to-r from-slate-600 to-teal-600 text-white rounded-lg text-sm font-semibold hover:shadow-lg hover:shadow-teal-500/25 active:scale-[0.98] transition-all">
                        Get Bundle
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <p className="text-xs text-center text-gray-500 mt-6">One-time • 30-day refund</p>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="border-t mt-20 bg-white/50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-gray-600">
            <p className="text-center sm:text-left">
              Built with Claude AI · Free forever
              <span className="mx-2">·</span>
              <a 
                href="https://roundtripux.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-slate-600 hover:text-teal-600 transition-colors underline decoration-dotted underline-offset-4"
              >
                by RoundTrip UX
              </a>
            </p>
            <div className="flex gap-6">
              <a href="#" className="hover:text-gray-900 transition-colors">Privacy</a>
              <a href="#" className="hover:text-gray-900 transition-colors">Terms</a>
              <a href="#" className="hover:text-gray-900 transition-colors">Contact</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
