import { useState } from 'react';
import { Mail, ArrowLeft, Check, AlertCircle } from 'lucide-react';
import { signUp, signIn } from '../utils/supabaseAuth';
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
        userData = await signIn(email, password);
        toast.success('Welcome back!');
      } else {
        userData = await signUp(email, password, name);
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
      <div className="flex-1 flex flex-col justify-center max-w-md mx-auto w-full px-4 py-8 sm:py-12">
        <div className="text-center mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1.5">
            {isSignIn ? 'Welcome back' : 'Create your account'}
          </h1>
          <p className="text-sm sm:text-base text-gray-600">
            {isSignIn 
              ? 'Sign in to continue' 
              : 'Get 3 free optimizations'
            }
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
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

        <div className="mt-4 sm:mt-6 pt-4 sm:pt-6 border-t border-gray-200">
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

        {!isSignIn && (
          <div className="mt-4 sm:mt-6 bg-gray-50 rounded-xl p-3 sm:p-4 border border-gray-200">
            <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-600">
              <Check className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-green-600 flex-shrink-0" />
              <span><strong>3 free optimizations</strong> · No credit card needed</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

