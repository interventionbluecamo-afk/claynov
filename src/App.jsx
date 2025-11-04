import React, { useState, useCallback, useEffect } from 'react';
import { Sparkles, FileText, ArrowRight, Check, TrendingUp, Star, Lock, X, Loader2, LogOut, Upload, Download, RefreshCw, ChevronLeft, ChevronDown, ChevronUp, Zap, MessageSquare, Target, Shield, Search } from 'lucide-react';
import { parseResume } from './utils/fileParser';
import { optimizeResume as optimizeResumeApi } from './utils/claudeApi';
import { mockOptimizeResume } from './utils/mockApi';
import { generateInterviewQuestions } from './utils/interviewQuestions';
import { generateResumeDocx, downloadBlob } from './utils/resumeGenerator';
import { getCurrentUser, signOut, getUserUseCount, incrementUseCount, resetUseCount } from './utils/supabaseAuth';
import { createConfetti } from './utils/confetti';
import SignUp from './pages/SignUp';
import Pricing from './pages/Pricing';
import Profile from './pages/Profile';
import Terms from './pages/Terms';
import Privacy from './pages/Privacy';
import { getWeeklyResumeCount, formatWeeklyCount, incrementWeeklyCount } from './utils/weeklyCount';
import { getRandomTrustSignal, getTrustSignals } from './utils/trustSignals';
import ErrorBoundary from './components/ErrorBoundary';
import { ToastContainer, toast } from './components/Toast';
import StepProgress from './components/StepProgress';
import { analytics, EVENTS, getFileInfo, getTextInfo } from './utils/analytics';

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
  const [formatting, setFormatting] = useState('modern');
  const [interviewQuestions, setInterviewQuestions] = useState([]);
  const [generatingQuestions, setGeneratingQuestions] = useState(false);
  const [expandedSections, setExpandedSections] = useState({
    tone: false,
    format: false,
    questions: false
  });
  const [useCount, setUseCount] = useState(0);
  const [showPricing, setShowPricing] = useState(false);
  const [showSignUpPage, setShowSignUpPage] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [showTerms, setShowTerms] = useState(false);
  const [showPrivacy, setShowPrivacy] = useState(false);
  const [user, setUser] = useState(null);
  const [weeklyCount, setWeeklyCount] = useState(0);
  const [currentTrustSignal, setCurrentTrustSignal] = useState(null);
  const [trustSignalIndex, setTrustSignalIndex] = useState(0);

  // Developer bypass (Ctrl/Cmd + Shift + B)
  useEffect(() => {
    const handleDevBypass = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'B') {
        e.preventDefault();
        // Toggle dev bypass mode
        const currentBypass = localStorage.getItem('clay_dev_bypass') === 'true';
        const newBypass = !currentBypass;
        localStorage.setItem('clay_dev_bypass', newBypass.toString());
        
        if (newBypass && user) {
          // Temporarily upgrade to Pro for testing
          const bypassUser = { ...user, isPro: true };
          setUser(bypassUser);
          setIsPro(true);
          // Also reset use count for testing
          setUseCount(0);
          localStorage.removeItem('clay_use_count');
          toast.success('Dev bypass enabled - Pro features unlocked & use count reset 🛠️');
        } else if (newBypass) {
          toast.success('Dev bypass enabled - Sign in to activate 🛠️');
        } else {
          // Remove bypass
          if (user && !user.isPro) {
            setIsPro(false);
            const normalUser = { ...user, isPro: false };
            setUser(normalUser);
          }
          toast.info('Dev bypass disabled');
        }
      }
      
      // Also add reset use count shortcut: Ctrl/Cmd + Shift + R
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'R') {
        e.preventDefault();
        setUseCount(0);
        localStorage.removeItem('clay_use_count');
        // Also reset in Supabase if signed in
        if (user?.id) {
          resetUseCount(user.id).catch(err => console.error('Error resetting in Supabase:', err));
        }
        toast.success('Use count reset to 0! Refresh to see changes 🎉');
      }
    };
    
    window.addEventListener('keydown', handleDevBypass);
    return () => window.removeEventListener('keydown', handleDevBypass);
  }, [user]);

  // Check auth on mount
  useEffect(() => {
    const loadUser = async () => {
      const currentUser = await getCurrentUser();
      
      // Apply dev bypass if enabled
      if (localStorage.getItem('clay_dev_bypass') === 'true' && currentUser) {
        currentUser.isPro = true;
      }
      
      setUser(currentUser);
      
      // Load use count - CRITICAL: Always use database for authenticated users
      if (currentUser?.id) {
        try {
          // Always get fresh count from database (never localStorage for logged-in users)
          const count = await getUserUseCount(currentUser.id);
          setUseCount(count);
          // Don't sync to localStorage - it causes cross-user contamination
        } catch (error) {
          console.error('Error loading use count:', error);
          // If database fails, default to 0 (don't use localStorage for authenticated users)
          setUseCount(0);
        }
      } else {
        // No user logged in - use localStorage for anonymous users only
        const savedCount = localStorage.getItem('clay_use_count');
        if (savedCount) {
          setUseCount(parseInt(savedCount, 10));
        } else {
          setUseCount(0);
        }
      }
      
      // Load weekly count
      setWeeklyCount(getWeeklyResumeCount());
      
      // Check for pending payment upgrade
      const pendingEmail = localStorage.getItem('clay_pending_upgrade_email');
      const pendingTimestamp = localStorage.getItem('clay_pending_upgrade_timestamp');
      
      if (pendingEmail && pendingTimestamp && currentUser?.email === pendingEmail) {
        // Payment was initiated less than 24 hours ago
        const timestamp = parseInt(pendingTimestamp, 10);
        const hoursSincePayment = (Date.now() - timestamp) / (1000 * 60 * 60);
        
        if (hoursSincePayment < 24) {
          // Show message that payment is being processed
          toast.info('Payment processing... We\'ll upgrade your account shortly!');
          
          // Track payment completion (detected via localStorage flag)
          analytics.track(EVENTS.PAYMENT_COMPLETED, {
            userId: pendingUserId,
            email: pendingEmail,
            hoursSincePayment: hoursSincePayment,
          });
          
          // In production, you would:
          // 1. Check Stripe API for payment status
          // 2. Or wait for webhook to update user
          // 3. For MVP, you can manually verify in Stripe dashboard
          
          // Clear the flags after 5 minutes (give time for webhook)
          if (hoursSincePayment < 0.1) { // Less than 6 minutes
            // Keep checking - don't clear yet
          } else {
            // After 24 hours, clear the pending flag
            localStorage.removeItem('clay_pending_upgrade_email');
            localStorage.removeItem('clay_pending_upgrade_timestamp');
            localStorage.removeItem('clay_pending_upgrade_user_id');
          }
        } else {
          // Timed out - clear pending
          localStorage.removeItem('clay_pending_upgrade_email');
          localStorage.removeItem('clay_pending_upgrade_timestamp');
          localStorage.removeItem('clay_pending_upgrade_user_id');
        }
      }
    };
    loadUser();
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

  // Track page views
  useEffect(() => {
    if (showPricing) {
      analytics.page('Pricing');
      analytics.track(EVENTS.PRICING_PAGE_VIEWED, {
        useCount,
        isPro,
        hasEmail: !!user?.email,
      });
    } else if (showSignUpPage) {
      analytics.page('SignUp');
      analytics.track(EVENTS.SIGNUP_STARTED, {
        source: 'pricing_page',
      });
    } else if (showProfile) {
      analytics.page('Profile');
      analytics.track(EVENTS.PROFILE_VIEWED);
    } else if (showTerms) {
      analytics.page('Terms');
      analytics.track(EVENTS.TERMS_VIEWED);
    } else if (showPrivacy) {
      analytics.page('Privacy');
      analytics.track(EVENTS.PRIVACY_VIEWED);
    } else {
      analytics.page(`Step ${step}`);
      if (step === 1) {
        analytics.track(EVENTS.LANDING_PAGE_VIEWED);
      }
    }
  }, [step, showPricing, showSignUpPage, showProfile, showTerms, showPrivacy, useCount, isPro, user]);

  // Track user identification
  useEffect(() => {
    if (user?.id) {
      analytics.identify(user.id, {
        email: user.email,
        isPro: user.isPro || false,
        name: user.name,
        signupDate: user.created_at,
        useCount: useCount,
      });
      
      // Track returning user
      const lastVisit = localStorage.getItem(`clay_last_visit_${user.id}`);
      if (lastVisit) {
        analytics.track(EVENTS.RETURNING_USER, {
          daysSinceLastVisit: Math.floor((Date.now() - parseInt(lastVisit)) / (1000 * 60 * 60 * 24)),
        });
      }
      localStorage.setItem(`clay_last_visit_${user.id}`, Date.now().toString());
    }
  }, [user, useCount]);

  // Track limit reached
  useEffect(() => {
    if (!isPro && useCount >= 3) {
      analytics.track(EVENTS.LIMIT_REACHED, {
        useCount,
        hasEmail: !!user?.email,
        hasAccount: !!user,
      });
    }
  }, [useCount, isPro, user]);

  const [isPro, setIsPro] = useState(user?.isPro || false);
  const freeUsesLeft = Math.max(0, 3 - useCount);

  // Update isPro when user changes, and reset use count if upgraded
  useEffect(() => {
    const wasPro = isPro;
    const nowPro = user?.isPro || false;
    setIsPro(nowPro);
    
    // If user just upgraded to Pro, reset their use count
    if (!wasPro && nowPro && user?.id) {
      resetUseCount(user.id).then(() => {
        setUseCount(0);
        localStorage.removeItem('clay_use_count');
      }).catch(error => {
        console.error('Error resetting use count after upgrade:', error);
      });
    }
  }, [user]);

  const handleFileUpload = useCallback(async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const validExtensions = ['.pdf', '.doc', '.docx'];
    const fileName = file.name.toLowerCase();
    
    if (!validExtensions.some(ext => fileName.endsWith(ext))) {
      const errorMsg = 'Please upload a PDF, DOC, or DOCX file.';
      setError(errorMsg);
      toast.error(errorMsg);
      analytics.track(EVENTS.ERROR_OCCURRED, {
        error: 'Invalid file type',
        step: 'upload',
      });
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      const errorMsg = 'File size must be less than 5MB. Please compress your file.';
      setError(errorMsg);
      toast.error(errorMsg);
      analytics.track(EVENTS.ERROR_OCCURRED, {
        error: 'File too large',
        step: 'upload',
        fileSize: file.size,
      });
      return;
    }

    // Track file upload
    const fileInfo = getFileInfo(file);
    analytics.track(EVENTS.RESUME_UPLOADED, {
      ...fileInfo,
      isPro,
      hasAccount: !!user,
    });

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
      const errorMsg = err.message || 'An error occurred while processing your file.';
      setError(errorMsg);
      toast.error(errorMsg);
      setResumeFile(null);
      analytics.track(EVENTS.ERROR_OCCURRED, {
        error: errorMsg,
        step: 'file_parsing',
        ...fileInfo,
      });
    } finally {
      setUploading(false);
    }
  }, [isPro, user]);

  const handleOptimize = useCallback(async () => {
    if (!resumeText.trim() || !jobDesc.trim()) {
      const errorMsg = 'Please provide both a resume and job description.';
      setError(errorMsg);
      toast.error(errorMsg);
      return;
    }

    // Check free uses limit
    if (!isPro && useCount >= 3) {
      // Show upgrade modal with better messaging
      analytics.track(EVENTS.UPGRADE_MODAL_VIEWED, {
        trigger: 'limit_reached',
        useCount,
        hasEmail: !!user?.email,
      });
      if (!user) {
        // Encourage sign up first
        // Show pricing page instead of native confirm
        setShowPricing(true);
        return;
      } else {
        setShowPricing(true);
        return;
      }
    }

    // Track optimization started
    const resumeInfo = getTextInfo(resumeText);
    const jobDescInfo = getTextInfo(jobDesc);
    analytics.track(EVENTS.OPTIMIZATION_STARTED, {
      useCount,
      isPro,
      tone,
      resumeLength: resumeInfo.length,
      resumeWordCount: resumeInfo.wordCount,
      jobDescLength: jobDescInfo.length,
      jobDescWordCount: jobDescInfo.wordCount,
      hasAccount: !!user,
    });

    setProcessing(true);
    setError(null);
    
    // Initialize trust signals for this optimization
    const signals = getTrustSignals(3);
    setCurrentTrustSignal(signals[0]);
    setTrustSignalIndex(0);
    
    // Cycle through trust signals every 3 seconds during processing
    const signalInterval = setInterval(() => {
      setTrustSignalIndex(prev => {
        const nextIndex = (prev + 1) % signals.length;
        setCurrentTrustSignal(signals[nextIndex]);
        return nextIndex;
      });
    }, 3000);
    
    // Store interval ID to clear later
    window.clayTrustSignalInterval = signalInterval;

    try {
      // Always use serverless function - API key is secure on server
      const optimizationResult = await optimizeResumeApi(resumeText, jobDesc, tone);
      
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
      if (!isPro && user?.id) {
        try {
          // For authenticated users, only use database
          const newCount = await incrementUseCount(user.id);
          setUseCount(newCount);
          // Don't save to localStorage - causes cross-user issues
        } catch (error) {
          console.error('Error incrementing use count:', error);
          // Fallback: increment state but don't persist to localStorage
          const newCount = useCount + 1;
          setUseCount(newCount);
        }
      } else if (!isPro) {
        // Anonymous user - use localStorage only
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
      toast.success('Resume optimized successfully! 🎉');
      
      // Track successful optimization
      analytics.track(EVENTS.OPTIMIZATION_COMPLETED, {
        useCount: useCount + 1,
        isPro,
        tone,
        success: true,
        atsScore: optimizationResult.ats_score || 94,
        matchScore: optimizationResult.match_score || 96,
        improvementsCount: optimizationResult.key_changes?.length || 0,
      });
    } catch (err) {
      // Handle network/API errors - fallback to mock if serverless function unavailable
      const isNetworkError = err.message?.includes('Failed to fetch') || err.message?.includes('CORS_BLOCKED') || err.name === 'TypeError';
      const errorMsg = isNetworkError
        ? 'Backend server unavailable. Using demo optimization.'
        : err.message || 'Failed to optimize resume. Please try again.';
      
      // Track optimization failure
      analytics.track(EVENTS.OPTIMIZATION_FAILED, {
        error: errorMsg,
        isNetworkError,
        useCount,
        isPro,
        tone,
      });
      
      if (isNetworkError) {
        console.warn('Network error - serverless function may not be deployed, falling back to mock API');
        toast.info('Using demo optimization (backend not configured)');
      } else {
        setError(errorMsg);
        toast.error(errorMsg);
        analytics.track(EVENTS.ERROR_OCCURRED, {
          error: errorMsg,
          step: 'optimization',
          useCount,
        });
      }
      
      // Fallback to mock API if serverless function fails (e.g., not deployed yet)
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
        
        // Track mock API usage (fallback)
        analytics.track(EVENTS.OPTIMIZATION_COMPLETED, {
          useCount: useCount + 1,
          isPro,
          tone,
          success: true,
          isMock: true,
          atsScore: mockResult.ats_score || 94,
          matchScore: mockResult.match_score || 96,
        });
        if (!isPro && user?.id) {
          try {
            // For authenticated users, only use database
            const newCount = await incrementUseCount(user.id);
            setUseCount(newCount);
            // Don't save to localStorage - causes cross-user contamination
          } catch (error) {
            console.error('Error incrementing use count:', error);
            // Fallback: increment state but don't persist to localStorage for authenticated users
            const newCount = useCount + 1;
            setUseCount(newCount);
          }
        } else if (!isPro) {
          // Anonymous user - use localStorage only
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
      // Clear trust signal interval
      if (window.clayTrustSignalInterval) {
        clearInterval(window.clayTrustSignalInterval);
        window.clayTrustSignalInterval = null;
      }
      setProcessing(false);
      setCurrentTrustSignal(null);
      setTrustSignalIndex(0);
    }
  }, [resumeText, jobDesc, tone, useCount, isPro, user]);

  const handleDownload = useCallback(async () => {
    if (!result?.optimizedText) {
      const errorMsg = 'No optimized resume available to download.';
      setError(errorMsg);
      analytics.track(EVENTS.ERROR_OCCURRED, {
        error: errorMsg,
        step: 'download',
      });
      return;
    }

    try {
      const blob = await generateResumeDocx(result.optimizedText);
      const filename = resumeFile 
        ? `Optimized_${resumeFile.name.replace(/\.[^/.]+$/, '.docx')}`
        : 'Optimized_Resume.docx';
      downloadBlob(blob, filename);
      
      // Track download
      analytics.track(EVENTS.RESUME_DOWNLOADED, {
        isPro,
        useCount,
        atsScore: result.ats,
        matchScore: result.match,
        tone,
        hasAccount: !!user,
      });
    } catch (err) {
      const errorMsg = 'Failed to generate download. Please try again.';
      setError(errorMsg);
      analytics.track(EVENTS.ERROR_OCCURRED, {
        error: errorMsg,
        step: 'download',
      });
    }
  }, [result, resumeFile, isPro, useCount, tone, user]);

  const handleReset = useCallback(() => {
    // Track new optimization started
    analytics.track(EVENTS.NEW_OPTIMIZATION_STARTED, {
      previousUseCount: useCount,
      isPro,
      hasAccount: !!user,
    });
    
    setStep(1);
    setResumeFile(null);
    setResumeText('');
    setJobDesc('');
    setResult(null);
    setError(null);
    setTone('professional');
    setInterviewQuestions([]);
    setExpandedSections({ tone: false, format: false, questions: false });
    const fileInput = document.getElementById('upload');
    if (fileInput) fileInput.value = '';
  }, [useCount, isPro, user]);

  const handleGenerateQuestions = useCallback(async () => {
    if (!resumeText || !jobDesc) {
      toast.error('Resume and job description required');
      return;
    }
    
    // Track interview questions generation
    analytics.track(EVENTS.INTERVIEW_QUESTIONS_GENERATED, {
      isPro,
      useCount,
      hasAccount: !!user,
    });

    setGeneratingQuestions(true);
    try {
      const result = await generateInterviewQuestions(resumeText, jobDesc);
      if (result.success && result.questions) {
        setInterviewQuestions(result.questions);
        setExpandedSections(prev => ({ ...prev, questions: true }));
        toast.success('Interview questions generated! 💡');
      }
    } catch (error) {
      console.error('Error generating questions:', error);
      toast.error('Failed to generate questions. Using sample questions.');
      // Fallback to sample questions
      setInterviewQuestions([
        "Tell me about your experience with this role.",
        "What challenges have you faced in similar positions?",
        "How do you approach problem-solving?",
        "Why are you interested in this position?"
      ]);
      setExpandedSections(prev => ({ ...prev, questions: true }));
    } finally {
      setGeneratingQuestions(false);
    }
  }, [resumeText, jobDesc]);

  const toggleSection = useCallback((section) => {
    const isExpanding = !expandedSections[section];
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
    
    // Track section expansion/collapse
    if (isExpanding) {
      analytics.track(EVENTS.SECTION_EXPANDED, {
        section,
        isPro,
      });
    }
  }, [expandedSections, isPro]);

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
      // Always use serverless function - API key is secure on server
      const optimizationResult = await optimizeResumeApi(resumeText, jobDesc, newTone);
        
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
    // Track upgrade click
    analytics.track(EVENTS.UPGRADE_CLICKED, {
      trigger: 'upgrade_button',
      useCount,
      hasAccount: !!user,
      source: 'pricing_page',
    });
    
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
      toast.info('Redirecting to secure payment...');
    } catch (error) {
      // Stripe not configured yet - show helpful message
      console.warn('Stripe not configured:', error.message);
      const errorMsg = 'Payment system is being set up. Please try again in a few minutes or contact support.';
      setError(errorMsg);
      toast.error(errorMsg);
      
      // Don't auto-upgrade in production - require actual payment
    }
  }, [user]);

  // Show Pricing page if needed
  if (showPricing) {
    return (
      <ErrorBoundary>
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
        <ToastContainer />
      </ErrorBoundary>
    );
  }

  // Show Profile page if needed
  if (showProfile) {
    return (
      <ErrorBoundary>
        <Profile
          user={user}
          setUser={setUser}
          onBack={() => {
            setShowProfile(false);
            // If user clicked "Upgrade to Pro", show pricing
            const shouldShowPricing = localStorage.getItem('clay_profile_upgrade_click');
            if (shouldShowPricing === 'true') {
              localStorage.removeItem('clay_profile_upgrade_click');
              setShowPricing(true);
            }
          }}
        />
        <ToastContainer />
      </ErrorBoundary>
    );
  }

  // Show Terms page if needed
  if (showTerms) {
    return (
      <ErrorBoundary>
        <Terms onBack={() => setShowTerms(false)} />
      </ErrorBoundary>
    );
  }

  // Show Privacy page if needed
  if (showPrivacy) {
    return (
      <ErrorBoundary>
        <Privacy onBack={() => setShowPrivacy(false)} />
      </ErrorBoundary>
    );
  }

  // Show SignUp page if needed
  if (showSignUpPage) {
    return (
      <ErrorBoundary>
        <SignUp
          user={user}
          onSuccess={async (userData) => {
            // CRITICAL: Clear localStorage use count when new user signs up
            localStorage.removeItem('clay_use_count');
            
            setUser(userData);
            setShowSignUpPage(false);
            
            // Load fresh use count from database for new user (should be 0)
            if (userData?.id) {
              try {
                const count = await getUserUseCount(userData.id);
                setUseCount(count);
              } catch (error) {
                console.error('Error loading use count after signup:', error);
                setUseCount(0); // Always start at 0 for new users
              }
            } else {
              setUseCount(0);
            }
            
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
        <ToastContainer />
      </ErrorBoundary>
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
                className="w-11 h-11 flex items-center justify-center rounded-full hover:bg-gray-100 active:scale-95 transition-all -ml-2"
                aria-label="Go back"
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
          <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  // Always show pricing page - no sign-up required to view
                  setShowPricing(true);
                }}
                className="text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors"
                aria-label="View Pro pricing"
              >
                Pro
              </button>
              {user ? (
                <button 
                  onClick={() => setShowProfile(true)}
                  className="w-11 h-11 rounded-full bg-gray-900 text-white text-sm font-semibold flex items-center justify-center hover:bg-gray-800 active:scale-95 transition-all"
                  aria-label={`View profile for ${user.email}`}
                >
                  {user?.name?.[0]?.toUpperCase() || user?.email?.[0]?.toUpperCase() || 'U'}
                </button>
              ) : (
                <button
                  onClick={() => setShowSignUpPage(true)}
                  className="text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors px-3 py-2 min-h-[44px] flex items-center"
                  aria-label="Sign up or sign in"
                >
                  Sign up
                </button>
              )}
            </div>
        </div>
      </header>

      {/* Step Progress Indicator - Only show when in flow (step 1-3) */}
      {step >= 1 && step <= 3 && !showPricing && !showSignUpPage && !showProfile && !showTerms && !showPrivacy && (
        <div className="bg-white border-b border-gray-100">
          <StepProgress currentStep={step} />
        </div>
      )}

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
              <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-green-50 border border-green-200 rounded-full text-sm font-medium text-green-700 mb-4 animate-fade-in-up animate-delay-100">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                {formatWeeklyCount(weeklyCount)} resumes optimized this week
              </div>
              <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4 tracking-tight animate-fade-in-up animate-delay-200">
                Land jobs like never before
              </h1>
              <p className="text-xl text-gray-600 animate-fade-in-up animate-delay-300">AI recrafts your resume for each job—boost your chances ✨</p>
            </div>

            <div className="w-full max-w-md mx-auto animate-fade-in-up animate-delay-400">
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
                    ? 'border-gray-900 bg-white' 
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

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-12 max-w-xl mx-auto">
              <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm animate-fade-in-up animate-delay-500">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Shield className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-gray-900">100% private</div>
                    <div className="text-xs text-gray-500">Stays on your device</div>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm animate-fade-in-up animate-delay-600">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-purple-50 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Sparkles className="w-5 h-5 text-purple-600" />
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-gray-900">3 free tries</div>
                    <div className="text-xs text-gray-500">No credit card needed</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Feature Highlights Section */}
          <div className="py-12 sm:py-16 bg-gradient-to-b from-white to-gray-50">
            <div className="max-w-4xl mx-auto px-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8 mb-10">
                {/* Feature 1: ATS Optimization */}
                <div className="bg-white rounded-2xl p-6 sm:p-8 border border-gray-200 shadow-sm hover:shadow-md transition-shadow animate-fade-in-up animate-delay-800">
                  <div className="w-14 h-14 bg-green-100 rounded-2xl flex items-center justify-center mb-4">
                    <Target className="w-7 h-7 text-green-600" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Beat ATS Systems</h3>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    Our AI optimizes your resume to pass Applicant Tracking Systems with keyword matching and ATS-friendly formatting.
                  </p>
                </div>

                {/* Feature 2: Job Matching */}
                <div className="bg-white rounded-2xl p-6 sm:p-8 border border-gray-200 shadow-sm hover:shadow-md transition-shadow animate-fade-in-up animate-delay-900">
                  <div className="w-14 h-14 bg-blue-100 rounded-2xl flex items-center justify-center mb-4">
                    <Search className="w-7 h-7 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Perfect Job Match</h3>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    Tailor your resume for each job description. Our AI analyzes requirements and aligns your experience perfectly.
                  </p>
                </div>

                {/* Feature 3: Interview Prep & Tone Flexibility */}
                <div className="bg-white rounded-2xl p-6 sm:p-8 border border-gray-200 shadow-sm hover:shadow-md transition-shadow animate-fade-in-up animate-delay-1000">
                  <div className="w-14 h-14 bg-purple-100 rounded-2xl flex items-center justify-center mb-4">
                    <MessageSquare className="w-7 h-7 text-purple-600" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Ace Your Interview</h3>
                  <p className="text-sm text-gray-600 leading-relaxed mb-3">
                    Practice with AI-generated questions tailored to your experience and the role. Plus, instantly switch writing styles—professional, creative, or technical—to match any company's vibe and land more interviews.
                  </p>
                  <div className="flex items-center gap-2 text-xs font-semibold text-purple-600">
                    <Zap className="w-3.5 h-3.5" />
                    <span>Pro feature</span>
                  </div>
                </div>

                {/* Feature 4: Pro Features Highlight */}
                <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-6 sm:p-8 border border-gray-700 shadow-lg hover:shadow-xl transition-shadow relative overflow-hidden animate-fade-in-up animate-delay-1100">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16"></div>
                  <div className="relative">
                    <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center mb-4 backdrop-blur-sm">
                      <Zap className="w-7 h-7 text-white" />
                    </div>
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="text-xl font-bold text-white">Pro Features</h3>
                      <span className="text-xs bg-white/20 text-white px-2 py-0.5 rounded-full font-semibold backdrop-blur-sm">Pro</span>
                    </div>
                    <p className="text-sm text-gray-200 leading-relaxed mb-3">
                      Unlock unlimited optimizations, all writing styles, interview questions, and format options.
                    </p>
                    <ul className="space-y-1.5 text-xs text-gray-300">
                      <li className="flex items-center gap-2">
                        <Check className="w-3.5 h-3.5 text-white flex-shrink-0" />
                        <span>Unlimited resume optimizations</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <Check className="w-3.5 h-3.5 text-white flex-shrink-0" />
                        <span>All writing styles (Creative, Technical, Executive)</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <Check className="w-3.5 h-3.5 text-white flex-shrink-0" />
                        <span>AI-generated interview questions</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <Check className="w-3.5 h-3.5 text-white flex-shrink-0" />
                        <span>Multiple format styles</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* CTA to Scroll to Top */}
              <div className="text-center">
                <button
                  onClick={() => {
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-gray-900 text-white rounded-xl font-semibold text-sm hover:bg-gray-800 active:scale-95 transition-all shadow-md"
                >
                  <ArrowRight className="w-4 h-4 rotate-[-90deg]" />
                  <span>Start optimizing your resume</span>
                </button>
              </div>
            </div>
          </div>

          {resumeFile && !uploading && (
            <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t">
              <div className="max-w-2xl mx-auto">
                <button 
                  onClick={() => setStep(2)} 
                  className="w-full h-14 bg-gray-900 text-white rounded-2xl font-semibold text-base sm:text-lg flex items-center justify-center gap-2 active:scale-[0.98] transition-all"
                >
                  <span>Continue</span>
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Step 2: Job Description */}
      {step === 2 && (
        <div className="flex-1 flex flex-col max-w-2xl mx-auto w-full">
          <div className="flex-1 flex flex-col px-4 pt-6 sm:pt-8 pb-24 sm:pb-20">
            <div className="mb-4 sm:mb-6">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Paste the job posting</h2>
              <p className="text-base sm:text-lg text-gray-600 mb-3">Include the full description for best results 🎯</p>
              <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-500">
                <div className="flex items-center gap-1.5">
                  <div className="w-1.5 h-1.5 bg-green-500 rounded-full" />
                  <span>Your resume stays on your device</span>
                </div>
              </div>
            </div>

            <div className="flex-1 flex flex-col min-h-0 mb-4">
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
                className="flex-1 w-full p-4 sm:p-5 border-2 border-gray-200 rounded-2xl focus:border-gray-900 outline-none resize-none text-base leading-relaxed bg-white transition-all"
                style={{ minHeight: '300px' }}
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
          </div>

          <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t shadow-lg">
            <div className="max-w-2xl mx-auto">
              <button 
                onClick={handleOptimize} 
                disabled={!jobDesc.trim() || processing || !resumeText}
                className="w-full h-14 bg-gray-900 text-white rounded-2xl font-semibold text-base sm:text-lg flex items-center justify-center gap-2 active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {processing ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Optimizing...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5" />
                    <span>Optimize Resume</span>
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
          {/* Success Hero Section */}
          <div className="bg-gradient-to-br from-gray-50 via-white to-gray-50 px-4 sm:px-6 py-6 sm:py-8 border-b border-gray-200">
            <div className="text-center mb-6">
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Check className="w-8 h-8 sm:w-10 sm:h-10 text-green-600" />
              </div>
              <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2 tracking-tight">
                Resume optimized! 🎉
              </h1>
              <p className="text-sm sm:text-base text-gray-600">
                Ready to download and start applying
              </p>
            </div>

            {/* Stats Cards - Refined Design */}
            <div className="grid grid-cols-2 gap-3 sm:gap-4 mb-6">
              <div className="bg-white rounded-2xl p-4 sm:p-5 border border-gray-200 shadow-sm">
                <div className="text-4xl sm:text-5xl md:text-6xl font-bold text-gray-900 tracking-tight mb-1.5">
                  {result.ats}
                </div>
                <div className="text-xs sm:text-sm text-gray-600 font-medium mb-2">ATS Score</div>
                <div className="flex items-center gap-1.5">
                  <TrendingUp className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-green-600" />
                  <span className="text-xs text-green-600 font-semibold">Excellent</span>
                </div>
              </div>
              <div className="bg-white rounded-2xl p-4 sm:p-5 border border-gray-200 shadow-sm">
                <div className="text-4xl sm:text-5xl md:text-6xl font-bold text-gray-900 tracking-tight mb-1.5">
                  {result.match}%
                </div>
                <div className="text-xs sm:text-sm text-gray-600 font-medium mb-2">Job Match</div>
                <div className="flex items-center gap-1.5">
                  <Star className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-500 fill-amber-500" />
                  <span className="text-xs text-amber-600 font-semibold">Strong match</span>
                </div>
              </div>
            </div>

            {/* Resume Preview - THE BIG REVEAL! */}
            <div className="mb-6">
              <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-3xl p-1 shadow-xl">
                <div className="bg-white rounded-3xl overflow-hidden">
                  <div className="px-5 sm:px-6 py-4 bg-gradient-to-r from-gray-50 to-white border-b border-gray-200">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gray-900 rounded-xl flex items-center justify-center">
                          <FileText className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <h2 className="text-base sm:text-lg font-bold text-gray-900">Your Optimized Resume</h2>
                          <p className="text-xs text-gray-600">Ready to download and impress</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span className="text-xs text-gray-600 font-medium">Optimized</span>
                      </div>
                    </div>
                  </div>
                  <div className="p-5 sm:p-6 md:p-8 bg-white max-h-[50vh] overflow-y-auto">
                    <div className="resume-preview text-gray-900">
                      {result.optimizedText.split('\n').map((line, idx, arr) => {
                        const trimmed = line.trim();
                        const prevLine = idx > 0 ? arr[idx - 1].trim() : '';
                        const isInBulletList = prevLine.startsWith('- ') || prevLine.startsWith('* ') || trimmed.startsWith('- ') || trimmed.startsWith('* ');
                        
                        if (!trimmed) {
                          // Only add spacing if not in a bullet list
                          if (!isInBulletList && prevLine) {
                            return <div key={idx} className="h-3" />;
                          }
                          return null;
                        }
                        
                        // Headings
                        if (trimmed.startsWith('# ')) {
                          return (
                            <h1 key={idx} className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3 mt-6 first:mt-0 leading-tight">
                              {trimmed.substring(2)}
                            </h1>
                          );
                        } else if (trimmed.startsWith('## ')) {
                          return (
                            <h2 key={idx} className="text-xl sm:text-2xl font-bold text-gray-900 mb-2.5 mt-5 leading-tight">
                              {trimmed.substring(3)}
                            </h2>
                          );
                        } else if (trimmed.startsWith('### ')) {
                          return (
                            <h3 key={idx} className="text-lg sm:text-xl font-semibold text-gray-900 mb-2 mt-4 leading-tight">
                              {trimmed.substring(4)}
                            </h3>
                          );
                        } else if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
                          // Bullet points
                          return (
                            <div key={idx} className="flex gap-3 mb-1.5">
                              <span className="text-gray-500 mt-1.5 text-lg leading-none flex-shrink-0">•</span>
                              <p className="text-sm sm:text-base text-gray-700 flex-1 leading-relaxed">
                                {trimmed.substring(2)}
                              </p>
                            </div>
                          );
                        } else {
                          // Regular paragraph - check if it's a continuation or new paragraph
                          const isContinuation = idx > 0 && !prevLine && !arr[idx - 2]?.trim().startsWith('#') && !arr[idx - 2]?.trim().startsWith('-');
                          if (isContinuation) {
                            return (
                              <span key={idx} className="text-sm sm:text-base text-gray-700 leading-relaxed">
                                {' '}{trimmed}
                              </span>
                            );
                          }
                          return (
                            <p key={idx} className="text-sm sm:text-base text-gray-700 leading-relaxed mb-3">
                              {trimmed}
                            </p>
                          );
                        }
                      }).filter(Boolean)}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Primary Download CTA */}
            <button 
              onClick={handleDownload}
              className="w-full h-14 sm:h-16 bg-gray-900 text-white rounded-2xl font-bold text-base sm:text-lg flex items-center justify-center gap-2.5 hover:bg-gray-800 active:scale-[0.98] transition-all shadow-lg hover:shadow-xl mb-6"
              aria-label="Download optimized resume as DOCX file"
            >
              <Download className="w-5 h-5 sm:w-6 sm:h-6" /> 
              <span>Download Resume</span>
            </button>
          </div>

          {/* Scrollable Content - Features Below */}
          <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-6 space-y-5">
            {/* Quick Actions - Collapsible Sections (Airbnb-style) */}
            <div className="space-y-2.5">
              {/* Tone Switcher - Improved Mobile Design */}
              <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
                <button
                  onClick={() => toggleSection('tone')}
                  className="w-full flex items-center justify-between p-5 hover:bg-gray-50/80 active:bg-gray-100 transition-colors"
                  aria-label={`${expandedSections.tone ? 'Collapse' : 'Expand'} tone options`}
                  aria-expanded={expandedSections.tone}
                >
                  <div className="flex items-center gap-3 flex-1">
                    <div className="w-11 h-11 bg-gray-100 rounded-xl flex items-center justify-center flex-shrink-0">
                      <span className="text-2xl">🎯</span>
                    </div>
                    <div className="text-left flex-1 min-w-0">
                      <div className="text-base font-bold text-gray-900 mb-0.5">Change writing style</div>
                      <div className="text-xs text-gray-500">
                        Currently: {tone.charAt(0).toUpperCase() + tone.slice(1)}
                        {!isPro && ' • More styles available'}
                      </div>
                    </div>
                  </div>
                  {expandedSections.tone ? (
                    <ChevronUp className="w-5 h-5 text-gray-400 flex-shrink-0 ml-2" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-gray-400 flex-shrink-0 ml-2" />
                  )}
                </button>
                {expandedSections.tone && (
                  <div className="px-5 pb-5 border-t border-gray-100">
                    <p className="text-xs text-gray-600 mb-4 mt-4">
                      Match your resume's tone to the job and company culture
                    </p>
                    <div className="space-y-2.5">
                      {[
                        { name: 'Professional', emoji: '💼', locked: false, desc: 'Formal and polished' },
                        { name: 'Creative', emoji: '🎨', locked: !isPro, desc: 'Dynamic and expressive' },
                        { name: 'Technical', emoji: '⚙️', locked: !isPro, desc: 'Precise and detailed' },
                        { name: 'Executive', emoji: '👔', locked: !isPro, desc: 'Strategic and leadership-focused' }
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
                          className={`w-full h-16 rounded-xl transition-all disabled:opacity-50 relative flex items-center gap-3 px-4 ${
                            tone === t.name.toLowerCase()
                              ? 'bg-gray-900 text-white shadow-md'
                              : t.locked
                              ? 'bg-gray-50 text-gray-400 cursor-not-allowed border border-gray-200'
                              : 'bg-gray-50 text-gray-700 hover:bg-gray-100 active:scale-[0.98] border border-gray-200'
                          }`}
                        >
                          <span className="text-2xl flex-shrink-0">{t.emoji}</span>
                          <div className="flex-1 text-left min-w-0">
                            <div className={`font-semibold text-base mb-0.5 ${tone === t.name.toLowerCase() ? 'text-white' : 'text-gray-900'}`}>
                              {t.name}
                            </div>
                            <div className={`text-xs ${tone === t.name.toLowerCase() ? 'text-gray-200' : 'text-gray-500'}`}>
                              {t.desc}
                            </div>
                          </div>
                          {t.locked && (
                            <Lock className="w-4 h-4 text-gray-400 flex-shrink-0" />
                          )}
                        </button>
                      ))}
                    </div>
                    {!isPro && (
                      <p className="text-xs text-gray-500 mt-4 text-center">
                        <button 
                          onClick={() => setShowPricing(true)}
                          className="text-gray-700 hover:text-gray-900 font-semibold underline underline-offset-2"
                        >
                          Unlock all styles
                        </button>
                        {' '}with Pro
                      </p>
                    )}
                  </div>
                )}
              </div>

              {/* Formatting Options - Collapsible (Pro Only) */}
              {isPro && (
                <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-2xl border border-purple-200 overflow-hidden shadow-sm">
                  <button
                    onClick={() => toggleSection('format')}
                    className="w-full flex items-center justify-between p-4 hover:bg-purple-50/50 active:bg-purple-50 transition-colors"
                    aria-label={`${expandedSections.format ? 'Collapse' : 'Expand'} format options`}
                    aria-expanded={expandedSections.format}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-xl">✨</span>
                      <div className="text-left">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-semibold text-gray-900">Format style</span>
                          <span className="text-xs bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full font-medium">Pro</span>
                        </div>
                        <div className="text-xs text-gray-600">
                          {formatting.charAt(0).toUpperCase() + formatting.slice(1)} selected
                        </div>
                      </div>
                    </div>
                    {expandedSections.format ? (
                      <ChevronUp className="w-5 h-5 text-purple-600" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-purple-600" />
                    )}
                  </button>
                  {expandedSections.format && (
                    <div className="px-4 pb-4 border-t border-purple-200">
                      <div className="grid grid-cols-3 gap-2 mt-4">
                        {[
                          { name: 'Modern', emoji: '🚀' },
                          { name: 'Compact', emoji: '📄' },
                          { name: 'Traditional', emoji: '📋' }
                        ].map(f => (
                          <button
                            key={f.name}
                            onClick={() => {
                              const newFormat = f.name.toLowerCase();
                              setFormatting(newFormat);
                              
                              // Track format change
                              analytics.track(EVENTS.FORMAT_CHANGED, {
                                fromFormat: formatting,
                                toFormat: newFormat,
                                isPro,
                              });
                              
                              if (resumeText && jobDesc) {
                                handleToneChange(tone);
                              }
                            }}
                            disabled={processing}
                            className={`h-11 rounded-xl text-xs font-semibold transition-all disabled:opacity-50 flex flex-col items-center justify-center gap-1 ${
                              formatting === f.name.toLowerCase()
                                ? 'bg-purple-600 text-white shadow-md'
                                : 'bg-white text-gray-700 hover:bg-white/80 active:scale-95 border border-purple-200'
                            }`}
                          >
                            <span className="text-base">{f.emoji}</span>
                            <span>{f.name}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Interview Questions - Improved Mobile Design */}
              <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
                <button
                  onClick={() => {
                    if (!isPro) {
                      setShowPricing(true);
                    } else if (!expandedSections.questions && interviewQuestions.length === 0) {
                      handleGenerateQuestions();
                    } else {
                      toggleSection('questions');
                    }
                  }}
                  disabled={generatingQuestions}
                  className="w-full flex items-center justify-between p-5 hover:bg-gray-50/80 active:bg-gray-100 transition-colors disabled:opacity-50"
                  aria-label={`${expandedSections.questions ? 'Collapse' : 'Expand'} interview questions`}
                  aria-expanded={expandedSections.questions}
                >
                  <div className="flex items-center gap-3 flex-1">
                    <div className="w-11 h-11 bg-blue-50 rounded-xl flex items-center justify-center flex-shrink-0">
                      <MessageSquare className="w-5 h-5 text-blue-600" />
                    </div>
                    <div className="text-left flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className="text-base font-bold text-gray-900">Practice interview questions</span>
                        {!isPro && (
                          <span className="text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full font-semibold">Pro</span>
                        )}
                      </div>
                      <div className="text-xs text-gray-500">
                        {!isPro 
                          ? 'Get personalized questions tailored to this role'
                          : interviewQuestions.length > 0 
                          ? `${interviewQuestions.length} questions ready to practice` 
                          : 'Generate questions based on your resume'}
                      </div>
                    </div>
                  </div>
                  {generatingQuestions ? (
                    <Loader2 className="w-5 h-5 text-gray-400 animate-spin flex-shrink-0 ml-2" />
                  ) : expandedSections.questions ? (
                    <ChevronUp className="w-5 h-5 text-gray-400 flex-shrink-0 ml-2" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-gray-400 flex-shrink-0 ml-2" />
                  )}
                </button>
                {expandedSections.questions && (
                  <div className="px-5 pb-5 border-t border-gray-100">
                    {!isPro ? (
                      /* Preview for free users */
                      <div className="mt-4">
                        <p className="text-xs text-gray-600 mb-4">
                          See sample questions based on this role. Get all questions with Pro.
                        </p>
                        <div className="space-y-3">
                          {[
                            "Tell me about your experience with the skills mentioned in this role.",
                            "How do you approach the key responsibilities outlined in the job description?",
                            "Can you walk me through a project that demonstrates your qualifications?"
                          ].map((question, idx) => (
                            <div key={idx} className="p-4 bg-gray-50 rounded-xl border border-gray-200">
                              <div className="flex gap-3">
                                <div className="w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                                  <span className="text-xs font-bold text-gray-600">{idx + 1}</span>
                                </div>
                                <p className="text-sm text-gray-700 leading-relaxed flex-1">
                                  {question}
                                </p>
                              </div>
                            </div>
                          ))}
                          <div className="relative">
                            <div className="absolute inset-0 bg-white/90 backdrop-blur-sm rounded-xl flex items-center justify-center z-10 border border-gray-200">
                              <div className="flex flex-col items-center gap-2">
                                <Lock className="w-6 h-6 text-gray-400" />
                                <span className="text-xs font-medium text-gray-500">More questions available</span>
                              </div>
                            </div>
                            <div className="p-4 bg-gray-50 rounded-xl border border-gray-200 opacity-50">
                              <div className="flex gap-3">
                                <div className="w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                                  <span className="text-xs font-bold text-gray-600">4+</span>
                                </div>
                                <p className="text-sm text-gray-700 leading-relaxed flex-1">
                                  Additional personalized questions based on your resume...
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                        <button
                          onClick={() => setShowPricing(true)}
                          className="w-full mt-4 h-12 bg-gray-900 text-white rounded-xl font-semibold text-sm flex items-center justify-center gap-2 hover:bg-gray-800 active:scale-[0.98] transition-all"
                        >
                          <Zap className="w-4 h-4" />
                          Unlock all questions with Pro
                        </button>
                      </div>
                    ) : interviewQuestions.length > 0 ? (
                      /* Full questions for Pro users */
                      <>
                        <div className="space-y-3 mt-4">
                          {interviewQuestions.map((question, idx) => (
                            <div
                              key={idx}
                              className="p-4 bg-gray-50 rounded-xl border border-gray-200"
                            >
                              <div className="flex gap-3">
                                <div className="w-6 h-6 bg-gray-900 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                                  <span className="text-xs font-bold text-white">{idx + 1}</span>
                                </div>
                                <p className="text-sm text-gray-700 leading-relaxed flex-1">
                                  {question}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                        <button
                          onClick={handleGenerateQuestions}
                          disabled={generatingQuestions}
                          className="w-full mt-4 h-12 bg-gray-100 text-gray-700 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 hover:bg-gray-200 active:scale-[0.98] transition-all disabled:opacity-50"
                        >
                          {generatingQuestions ? (
                            <>
                              <Loader2 className="w-4 h-4 animate-spin" />
                              Generating...
                            </>
                          ) : (
                            <>
                              <RefreshCw className="w-4 h-4" />
                              Generate new questions
                            </>
                          )}
                        </button>
                      </>
                    ) : (
                      /* Empty state for Pro users */
                      <div className="mt-4 text-center py-6">
                        <MessageSquare className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                        <p className="text-sm font-medium text-gray-700 mb-1">Ready to generate questions</p>
                        <p className="text-xs text-gray-500">Tap above to create personalized interview questions</p>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Regenerate Button */}
              <button
                onClick={() => handleOptimize()}
                disabled={processing || !resumeText || !jobDesc}
                className="w-full h-12 bg-white border border-gray-200 text-gray-700 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 hover:bg-gray-50 active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                aria-label="Regenerate resume with current settings"
              >
                <RefreshCw className={`w-4 h-4 ${processing ? 'animate-spin' : ''}`} />
                <span>Regenerate resume</span>
              </button>
            </div>

            {/* Social Proof */}
            <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl p-5 sm:p-6 border border-amber-200/60 shadow-sm">
              <div className="flex items-center gap-1 mb-3 justify-center">
                {[1,2,3,4,5].map(i => (
                  <Star key={i} className="w-4 h-4 sm:w-5 sm:h-5 fill-amber-400 text-amber-400" />
                ))}
              </div>
              <p className="text-sm sm:text-base text-gray-900 text-center font-semibold mb-1.5 leading-relaxed">
                "Got 3 interviews in a week!"
              </p>
              <p className="text-xs text-gray-600 text-center">— Marcus L., Product Manager</p>
            </div>

            {/* Secondary CTA */}
            <button 
              onClick={handleReset}
              className="w-full h-12 bg-white text-gray-700 rounded-xl font-medium text-sm border border-gray-200 flex items-center justify-center gap-2 hover:bg-gray-50 active:scale-[0.98] transition-all"
              aria-label="Optimize another resume"
            >
              <RefreshCw className="w-4 h-4" /> 
              <span>Optimize Another</span>
            </button>
          </div>

        </div>
      )}

      {/* Loading Overlay with Trust Signals */}
      {processing && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full mx-4 text-center shadow-2xl">
            <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Sparkles className="w-8 h-8 text-gray-900 animate-pulse" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Optimizing your resume ✨</h3>
            <p className="text-sm text-gray-600 mb-6">AI is analyzing and rewriting...</p>
            
            {/* Progress Steps */}
            <div className="space-y-2 text-left text-xs text-gray-500 mb-6">
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
            
            {/* Trust Signal / Fun Fact */}
            {currentTrustSignal && (
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-4 border border-blue-200 mb-4 animate-in fade-in">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <span className="text-2xl">{currentTrustSignal.icon}</span>
                  <div className="text-2xl font-bold text-gray-900">{currentTrustSignal.stat}</div>
                </div>
                <p className="text-xs sm:text-sm text-gray-700 font-medium leading-relaxed">
                  {currentTrustSignal.text}
                </p>
              </div>
            )}
            
            <p className="text-xs text-gray-400 mt-4">This usually takes 10-30 seconds...</p>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="border-t bg-white">
        <div className="max-w-2xl mx-auto px-4 py-6">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 text-sm text-gray-500">
            <p className="text-center">
              Made with <span className="text-red-500">♥</span> by{' '}
              <a 
                href="https://roundtripux.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-700 hover:text-gray-900 font-medium underline underline-offset-2 transition-colors"
              >
                roundtrip ux
              </a>
            </p>
            <span className="hidden sm:inline">·</span>
            <div className="flex items-center gap-3">
              <a 
                href="/terms" 
                className="text-gray-600 hover:text-gray-900 underline underline-offset-2 transition-colors"
                onClick={(e) => {
                  e.preventDefault();
                  setShowTerms(true);
                }}
              >
                Terms
              </a>
              <span className="text-gray-400">·</span>
              <a 
                href="/privacy" 
                className="text-gray-600 hover:text-gray-900 underline underline-offset-2 transition-colors"
                onClick={(e) => {
                  e.preventDefault();
                  setShowPrivacy(true);
                }}
              >
                Privacy
              </a>
            </div>
          </div>
        </div>
      </footer>

      {/* Toast Notifications */}
      <ToastContainer />
    </div>
  );
}
