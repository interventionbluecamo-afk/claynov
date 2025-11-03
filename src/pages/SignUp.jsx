import { useState } from 'react';
import { Sparkles, Mail, ArrowLeft, Zap, Check, AlertCircle } from 'lucide-react';
import { signUp, signIn } from '../utils/auth';
import { toast } from '../components/Toast';

export default function SignUp({ onSuccess, onBack, user }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [isSignIn, setIsSignIn] = useState(false);
  
  // Real-time validation states
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [nameError, setNameError] = useState('');

  // Validation functions
  const validateEmail = (value) => {
    if (!value) {
      return 'Email is required';
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value)) {
      return 'Please enter a valid email address';
    }
    return '';
  };

  const validatePassword = (value) => {
    if (!value) {
      return 'Password is required';
    }
    if (value.length < 6) {
      return 'Password must be at least 6 characters';
    }
    return '';
  };

  const validateName = (value) => {
    if (!value && !isSignIn) {
      return 'Name is required';
    }
    if (value && value.length < 2) {
      return 'Name must be at least 2 characters';
    }
    return '';
  };

  const handleEmailChange = (e) => {
    const value = e.target.value;
    setEmail(value);
    if (value && !isSignIn) {
      setEmailError(validateEmail(value));
    } else if (!isSignIn) {
      setEmailError('');
    }
  };

  const handlePasswordChange = (e) => {
    const value = e.target.value;
    setPassword(value);
    if (value) {
      setPasswordError(validatePassword(value));
    } else {
      setPasswordError('');
    }
  };

  const handleNameChange = (e) => {
    const value = e.target.value;
    setName(value);
    if (value || isSignIn) {
      setNameError(validateName(value));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    // Validate all fields
    const emailErr = validateEmail(email);
    const passwordErr = validatePassword(password);
    const nameErr = !isSignIn ? validateName(name) : '';
    
    setEmailError(emailErr);
    setPasswordError(passwordErr);
    setNameError(nameErr);
    
    if (emailErr || passwordErr || nameErr) {
      return;
    }

    setLoading(true);

    try {
      let userData;
      if (isSignIn) {
        userData = signIn(email, password);
        toast.success('Welcome back!');
      } else {
        userData = signUp(email, password, name);
        toast.success('Account created successfully!');
      }
      
      onSuccess(userData);
    } catch (err) {
      const errorMsg = err.message || 'Something went wrong. Please try again.';
      setError(errorMsg);
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleAuth = () => {
    // Mock Google sign in
    const mockUser = { email: 'demo@gmail.com', isPro: false };
    onSuccess(mockUser);
  };

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
          <span className="text-xl font-bold text-gray-900">Clay</span>
          <div className="w-9" /> {/* Spacer */}
        </div>
      </header>

      {/* Content */}
      <div className="flex-1 flex flex-col justify-center max-w-md mx-auto w-full px-4 py-12">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Sparkles className="w-8 h-8 text-gray-900" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {isSignIn ? 'Welcome back' : 'Join thousands optimizing their resumes'}
          </h1>
          <p className="text-gray-600">
            {isSignIn 
              ? 'Continue optimizing your resume' 
              : 'Track your progress, save your optimized resumes, and unlock unlimited optimizations'
            }
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">
              {error}
            </div>
          )}

          {!isSignIn && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Full name
              </label>
              <input
                type="text"
                value={name}
                onChange={handleNameChange}
                onBlur={() => setNameError(validateName(name))}
                placeholder="John Doe"
                className={`w-full px-4 py-3 border-2 rounded-xl focus:border-gray-900 outline-none transition-all text-base ${
                  nameError ? 'border-red-300 bg-red-50' : 'border-gray-200'
                }`}
                required={!isSignIn}
              />
              {nameError && (
                <div className="mt-1.5 flex items-center gap-1.5 text-xs text-red-600">
                  <AlertCircle className="w-3.5 h-3.5" />
                  <span>{nameError}</span>
                </div>
              )}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Email
            </label>
            <div className="relative">
              <Mail className={`absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 ${
                emailError ? 'text-red-400' : 'text-gray-400'
              }`} />
              <input
                type="email"
                value={email}
                onChange={handleEmailChange}
                onBlur={() => setEmailError(validateEmail(email))}
                placeholder="you@example.com"
                className={`w-full pl-10 pr-4 py-3 border-2 rounded-xl focus:border-gray-900 outline-none transition-all text-base ${
                  emailError ? 'border-red-300 bg-red-50' : 'border-gray-200'
                }`}
                required
              />
            </div>
            {emailError && (
              <div className="mt-1.5 flex items-center gap-1.5 text-xs text-red-600">
                <AlertCircle className="w-3.5 h-3.5" />
                <span>{emailError}</span>
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={handlePasswordChange}
              onBlur={() => setPasswordError(validatePassword(password))}
              placeholder="••••••••"
              className={`w-full px-4 py-3 border-2 rounded-xl focus:border-gray-900 outline-none transition-all text-base ${
                passwordError ? 'border-red-300 bg-red-50' : 'border-gray-200'
              }`}
              required
              minLength={6}
            />
            {!isSignIn && !passwordError && (
              <p className="mt-1 text-xs text-gray-500">Must be at least 6 characters</p>
            )}
            {passwordError && (
              <div className="mt-1.5 flex items-center gap-1.5 text-xs text-red-600">
                <AlertCircle className="w-3.5 h-3.5" />
                <span>{passwordError}</span>
              </div>
            )}
          </div>

          <button
            type="submit"
            disabled={loading || !!emailError || !!passwordError || !!nameError}
            className="w-full h-14 bg-gray-900 text-white rounded-xl font-semibold text-base hover:bg-gray-800 active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Please wait...' : isSignIn ? 'Sign in' : 'Create account'}
          </button>
        </form>

        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-200"></div>
          </div>
          <div className="relative flex justify-center text-xs">
            <span className="px-2 bg-white text-gray-500">or</span>
          </div>
        </div>

        <button 
          onClick={handleGoogleAuth}
          className="w-full h-14 bg-white border-2 border-gray-200 rounded-xl font-medium text-base flex items-center justify-center gap-3 hover:bg-gray-50 active:scale-[0.98] transition-all"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          Continue with Google
        </button>

        <div className="mt-6 pt-6 border-t border-gray-200">
          <p className="text-center text-sm text-gray-600">
            {isSignIn ? "Don't have an account? " : 'Already have an account? '}
            <button
              onClick={() => {
                setIsSignIn(!isSignIn);
                setError('');
                setPassword('');
                setEmailError('');
                setPasswordError('');
                setNameError('');
              }}
              className="font-semibold text-gray-900 hover:text-gray-700 transition-colors"
            >
              {isSignIn ? 'Sign up' : 'Sign in'}
            </button>
          </p>
        </div>

        <div className="mt-8 bg-gray-50 rounded-2xl p-4 border border-gray-200">
          <div className="space-y-2.5 text-sm">
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4 text-green-600 flex-shrink-0" />
              <span className="text-gray-700"><strong>3 free optimizations</strong> — no credit card needed</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4 text-green-600 flex-shrink-0" />
              <span className="text-gray-700">Save all your optimized resumes</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4 text-green-600 flex-shrink-0" />
              <span className="text-gray-700">Unlock unlimited for just $7.99</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4 text-green-600 flex-shrink-0" />
              <span className="text-gray-700">100% private · No spam, ever</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

