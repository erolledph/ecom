'use client';

import { Suspense, useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { signIn, signUp, resetPassword } from '@/lib/auth';
import { checkSlugAvailability } from '@/lib/store';
import { useAuth } from '@/hooks/useAuth';
import { Store, Package, TrendingUp, Users, Eye, EyeOff, MousePointer, ArrowRight, Star, StarHalf, RefreshCw, AtSign, CircleAlert as AlertCircle, CircleCheck as CheckCircle } from 'lucide-react';

function AuthPageContent() {
  const [isLogin, setIsLogin] = useState(true);
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [storeSlug, setStoreSlug] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [emailError, setEmailError] = useState('');
  const [slugError, setSlugError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [isCheckingSlug, setIsCheckingSlug] = useState(false);
  const [touched, setTouched] = useState({
    email: false,
    password: false,
    displayName: false,
    storeSlug: false
  });
  const [showPassword, setShowPassword] = useState(false);

  const router = useRouter();
  const searchParams = useSearchParams();
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      router.push('/dashboard');
    }

    const resetSuccess = searchParams.get('reset');
    if (resetSuccess === 'success') {
      setIsLogin(true);
      setIsForgotPassword(false);
      setSuccess('Password reset successful! You can now log in with your new password.');
    }
  }, [user, router, searchParams]);

  const validateEmail = (email: string): string => {
    if (!email) return 'Email is required';

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return 'Please enter a valid email address';
    }

    return '';
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setEmail(value);

    if (touched.email) {
      setEmailError(validateEmail(value));
    }
  };

  const handleEmailBlur = () => {
    setTouched(prev => ({ ...prev, email: true }));
    setEmailError(validateEmail(email));
  };

  const checkSlug = async (slug: string) => {
    if (!slug || slug.length < 3) {
      setSlugError('Store URL must be at least 3 characters long');
      return;
    }

    setIsCheckingSlug(true);
    try {
      const isAvailable = await checkSlugAvailability(slug);
      if (!isAvailable) {
        setSlugError('This store URL is already taken');
      } else {
        setSlugError('');
      }
    } catch (error) {
      console.error('Error checking slug:', error);
      setSlugError('Unable to verify availability');
    } finally {
      setIsCheckingSlug(false);
    }
  };

  const handleStoreSlugChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '');
    setStoreSlug(value);
    setTouched(prev => ({ ...prev, storeSlug: true }));

    if (value.length >= 3) {
      const timeoutId = setTimeout(() => checkSlug(value), 500);
      return () => clearTimeout(timeoutId);
    } else if (value.length > 0) {
      setSlugError('Store URL must be at least 3 characters long');
    } else {
      setSlugError('');
    }
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setPassword(value);

    if (!isLogin && touched.password && value) {
      let error = '';
      if (value.length < 8) {
        error = 'Password must be at least 8 characters';
      } else if (!/[A-Z]/.test(value)) {
        error = 'Must contain at least one uppercase letter';
      } else if (!/[a-z]/.test(value)) {
        error = 'Must contain at least one lowercase letter';
      } else if (!/\d/.test(value)) {
        error = 'Must contain at least one number';
      } else if (!/[!@#$%^&*(),.?":{}|<>]/.test(value)) {
        error = 'Must contain at least one special character';
      }
      setPasswordError(error);
    }
  };

  const handlePasswordBlur = () => {
    setTouched(prev => ({ ...prev, password: true }));
    if (!isLogin && password) {
      handlePasswordChange({ target: { value: password } } as React.ChangeEvent<HTMLInputElement>);
    }
  };

  const parseFirebaseError = (errorMessage: string): string => {
    if (errorMessage.includes('auth/invalid-credential')) {
      return 'Account does not exist or incorrect password';
    }
    if (errorMessage.includes('auth/user-not-found')) {
      return 'Account does not exist';
    }
    if (errorMessage.includes('auth/wrong-password')) {
      return 'Incorrect password';
    }
    if (errorMessage.includes('auth/email-already-in-use')) {
      return 'An account with this email already exists';
    }
    if (errorMessage.includes('auth/weak-password')) {
      return 'Password is too weak. Please use a stronger password';
    }
    if (errorMessage.includes('auth/invalid-email')) {
      return 'Invalid email address format';
    }
    if (errorMessage.includes('auth/too-many-requests')) {
      return 'Too many failed attempts. Please try again later';
    }
    if (errorMessage.includes('auth/network-request-failed')) {
      return 'Network error. Please check your connection';
    }

    return errorMessage
      .replace('Firebase: Error', '')
      .replace(/\(auth\/[^)]+\)\.?/g, '')
      .trim() || 'An error occurred. Please try again';
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    const emailValidationError = validateEmail(email);
    if (emailValidationError) {
      setEmailError(emailValidationError);
      setTouched(prev => ({ ...prev, email: true }));
      return;
    }

    setLoading(true);

    try {
      await resetPassword(email);
      setSuccess('Password reset email sent! Please check your inbox.');
      setEmail('');
      setTouched(prev => ({ ...prev, email: false }));
    } catch (error: any) {
      const friendlyError = parseFirebaseError(error.message);
      setError(friendlyError);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const emailValidationError = validateEmail(email);
    if (emailValidationError) {
      setEmailError(emailValidationError);
      setTouched(prev => ({ ...prev, email: true }));
      return;
    }

    if (isLogin && !password) {
      setError('Password is required');
      return;
    }

    if (!isLogin) {
      if (!displayName.trim()) {
        setError('Display name is required');
        return;
      }

      if (passwordError) {
        setError('Please fix the password requirements');
        return;
      }

      if (!password) {
        setError('Password is required');
        return;
      }

      if (slugError) {
        setError('Please fix the store URL error');
        return;
      }

      if (!storeSlug.trim()) {
        setError('Store URL is required');
        return;
      }
    }

    setLoading(true);

    try {
      if (isLogin) {
        await signIn(email, password);
      } else {
        await signUp(email, password, displayName, storeSlug);
      }
      router.push('/dashboard');
    } catch (error: any) {
      const friendlyError = parseFirebaseError(error.message);
      setError(friendlyError);
    } finally {
      setLoading(false);
    }
  };

  const handleModeSwitch = () => {
    setIsLogin(!isLogin);
    setIsForgotPassword(false);
    setError('');
    setSuccess('');
    setEmailError('');
    setSlugError('');
    setPasswordError('');
    setTouched({
      email: false,
      password: false,
      displayName: false,
      storeSlug: false
    });
  };

  const handleForgotPasswordToggle = () => {
    setIsForgotPassword(!isForgotPassword);
    setError('');
    setSuccess('');
    setEmailError('');
    setTouched(prev => ({ ...prev, email: false }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-2 sm:p-4">
      <div className="w-full max-w-6xl min-h-[500px] sm:min-h-[600px] flex flex-col lg:flex-row shadow-2xl rounded-2xl bg-white relative overflow-hidden">
        
        {/* Left Side - Visual Showcase */}
        <div className="hidden lg:flex flex-1 bg-gradient-to-br from-emerald-600 to-green-500 relative overflow-hidden flex-col items-center justify-center text-white p-4 lg:p-8">
          
          {/* Background Elements */}
          <div className="absolute top-[10%] left-[5%] w-[100px] h-[100px] lg:w-[150px] lg:h-[150px] bg-white bg-opacity-[0.08] rounded-full"></div>
          <div className="absolute bottom-[-50px] right-[-50px] w-[200px] h-[200px] lg:w-[300px] lg:h-[300px] bg-white bg-opacity-[0.08] rounded-[120px] transform rotate-45"></div>
          <div className="absolute top-[50%] right-[20%] w-[30px] h-[30px] lg:w-[50px] lg:h-[50px] bg-white bg-opacity-[0.08] rounded-full"></div>

          <div className="relative z-10 text-center w-full max-w-sm lg:max-w-md">
            <h2 className="text-white text-2xl lg:text-3xl font-bold mb-6 lg:mb-10 leading-snug">Tiangge</h2>
            <h2 className="text-white text-2xl lg:text-3xl font-bold mb-6 lg:mb-10 leading-snug">
              Create your Store,<br />
              Earn Now.
            </h2>
            
            {/* Floating Metric Cards */}
            <div className="relative">
              {/* Store Visits - Top Right */}
              <div className="absolute top-[-30px] lg:top-[-50px] right-[-30px] lg:right-[-50px] w-[80px] lg:w-[110px] bg-white border border-emerald-600 rounded-md p-1.5 lg:p-2 text-left shadow-lg z-10 animate-float-1">
                <div className="flex items-center text-sm lg:text-lg font-bold mb-1 text-green-500">
                  <Store className="w-3 h-3 lg:w-4 lg:h-4 mr-1 lg:mr-2" />
                  9,800
                </div>
                <div className="text-[8px] lg:text-[10px] text-black">Store Visits</div>
              </div>

              {/* Total Clicks - Middle Left */}
              <div className="absolute top-[50px] lg:top-[80px] left-[-30px] lg:left-[-50px] w-[80px] lg:w-[110px] bg-white border border-emerald-600 rounded-md p-1.5 lg:p-2 text-left shadow-lg z-10 animate-float-2">
                <div className="flex items-center text-sm lg:text-lg font-bold mb-1 text-green-500">
                  <MousePointer className="w-3 h-3 lg:w-4 lg:h-4 mr-1 lg:mr-2" />
                  3,450
                </div>
                <div className="text-[8px] lg:text-[10px] text-black">Total Clicks</div>
              </div>

              {/* Rating - Bottom Left */}
              <div className="absolute bottom-[20px] lg:bottom-[30px] left-[-30px] lg:left-[-50px] w-[80px] lg:w-[110px] bg-white border border-emerald-600 rounded-md p-1.5 lg:p-2 text-left shadow-lg z-10 animate-float-3">
                <div className="flex items-center text-xs font-bold mb-1">
                  <div className="flex text-yellow-400 mr-2">
                    <Star className="w-1.5 h-1.5 lg:w-2 lg:h-2 fill-current" />
                    <Star className="w-1.5 h-1.5 lg:w-2 lg:h-2 fill-current" />
                    <Star className="w-1.5 h-1.5 lg:w-2 lg:h-2 fill-current" />
                    <Star className="w-1.5 h-1.5 lg:w-2 lg:h-2 fill-current" />
                    <StarHalf className="w-1.5 h-1.5 lg:w-2 lg:h-2 fill-current" />
                  </div>
                  <span className="text-emerald-600 text-sm lg:text-lg font-extrabold">4.5</span>
                </div>
                <div className="text-[8px] lg:text-[10px] text-black">Average Rating</div>
              </div>

              {/* Conversion Rate - Middle Right */}
              <div className="absolute top-[50px] lg:top-[80px] right-[-30px] lg:right-[-50px] w-[80px] lg:w-[110px] bg-white border border-emerald-600 rounded-md p-1.5 lg:p-2 text-left shadow-lg z-10 animate-float-4">
                <div className="flex items-center text-sm lg:text-lg font-bold mb-1 text-green-500">
                  <RefreshCw className="w-3 h-3 lg:w-4 lg:h-4 mr-1 lg:mr-2" />
                  12%
                </div>
                <div className="text-[8px] lg:text-[10px] text-black">Conversion Rate</div>
              </div>

              {/* Product Views - Bottom Right */}
              <div className="absolute bottom-[20px] lg:bottom-[30px] right-[-30px] lg:right-[-50px] w-[80px] lg:w-[110px] bg-white border border-emerald-600 rounded-md p-1.5 lg:p-2 text-left shadow-lg z-10 animate-float-5">
                <div className="flex items-center text-sm lg:text-lg font-bold mb-1 text-green-500">
                  <Eye className="w-3 h-3 lg:w-4 lg:h-4 mr-1 lg:mr-2" />
                  5,600
                </div>
                <div className="text-[8px] lg:text-[10px] text-black">Product Views</div>
              </div>

              {/* Affiliate Earnings - Top Left */}
              <div className="absolute top-[-30px] lg:top-[-50px] left-[-30px] lg:left-[-50px] w-[80px] lg:w-[110px] bg-white border border-emerald-600 rounded-md p-1.5 lg:p-2 text-left shadow-lg z-10 animate-float-6">
                <div className="text-sm lg:text-lg font-bold mb-1 text-green-500">
                  $ 2,250
                </div>
                <div className="text-[8px] lg:text-[10px] text-black">Affiliate Earnings</div>
              </div>

              {/* Central Product Card */}
              <div className="bg-white text-gray-800 rounded-xl p-0 text-left shadow-xl border border-gray-300 relative max-w-[140px] lg:max-w-[200px] w-full mx-auto overflow-hidden z-20 animate-float-center">
                <div className="w-full aspect-square overflow-hidden">
                  <img 
                    src="https://i.ibb.co/XkrqrDVm/shoes.png" 
                    alt="Organic Cotton T-Shirt"
                    className="w-full h-full object-cover bg-gray-300"
                  />
                </div>
                <div className="p-3 lg:p-5 text-left">
                  <div className="text-sm lg:text-xl font-bold leading-tight mb-1 text-black">
                    Organic Cotton T-Shirt
                  </div>
                  <div className="text-lg lg:text-2xl font-bold text-green-400 mt-0">
                    $29.99
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Auth Form */}
        <div className="flex-none w-full lg:w-[450px] bg-white p-4 sm:p-6 lg:p-12 flex flex-col min-h-[500px] lg:min-h-auto">
          <div>
            {/* Logo Section */}
            <a
              href="/"
              className="flex items-center mb-6 lg:mb-8 text-emerald-600 font-bold text-lg lg:text-xl hover:text-emerald-700 transition-colors cursor-pointer"
            >
              <Store className="w-4 h-4 lg:w-5 lg:h-5 mr-2" />
              <span>Tiangge</span>
            </a>

            <h1 className="text-2xl lg:text-3xl font-bold text-gray-800 mb-2">
              {isForgotPassword ? 'Reset Password' : isLogin ? 'Welcome back' : 'Get started'}
            </h1>
            <p className="text-sm text-gray-600 mb-6 lg:mb-8">
              {isForgotPassword
                ? 'Enter your email address and we will send you a link to reset your password'
                : isLogin ? 'Log in to your account to continue' : 'Create your account and start selling'}
            </p>

            <form onSubmit={isForgotPassword ? handleForgotPassword : handleSubmit} className="space-y-5 lg:space-y-6">
              {!isLogin && !isForgotPassword && (
                <div className="relative">
                  <label className="block text-xs font-medium text-gray-700 mb-1.5">
                    Display Name
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={displayName}
                      onChange={(e) => setDisplayName(e.target.value)}
                      className="w-full px-4 py-2.5 lg:py-3 border border-gray-300 rounded-lg text-sm lg:text-base outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 transition-all bg-white"
                      placeholder="John Doe"
                      required={!isLogin}
                    />
                    <Users className="absolute top-1/2 transform -translate-y-1/2 right-3 w-4 h-4 text-gray-400" />
                  </div>
                </div>
              )}

              {!isLogin && !isForgotPassword && (
                <div className="relative">
                  <label className="block text-xs font-medium text-gray-700 mb-1.5">
                    Store URL
                  </label>
                  <div className="flex items-stretch border border-gray-300 rounded-lg focus-within:border-emerald-500 focus-within:ring-2 focus-within:ring-emerald-100 transition-all overflow-hidden">
                    <span className="bg-gray-50 text-gray-600 text-xs lg:text-sm px-3 flex items-center border-r border-gray-300">
                      tiangge.shop/
                    </span>
                    <input
                      type="text"
                      value={storeSlug}
                      onChange={handleStoreSlugChange}
                      className="flex-1 px-3 py-2.5 lg:py-3 text-sm lg:text-base outline-none bg-white"
                      placeholder="my-store"
                      required={!isLogin}
                    />
                  </div>
                  {isCheckingSlug && (
                    <p className="mt-1.5 text-xs text-gray-500 flex items-center">
                      <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-emerald-600 mr-1.5"></div>
                      Checking availability...
                    </p>
                  )}
                  {slugError && (
                    <p className="mt-1.5 text-xs text-red-600 flex items-center">
                      <AlertCircle className="w-3 h-3 mr-1" />
                      {slugError}
                    </p>
                  )}
                  {!slugError && !isCheckingSlug && storeSlug && storeSlug.length >= 3 && (
                    <p className="mt-1.5 text-xs text-emerald-600 flex items-center">
                      <CheckCircle className="w-3 h-3 mr-1" />
                      Store URL is available
                    </p>
                  )}
                </div>
              )}

              <div className="relative">
                <label className="block text-xs font-medium text-gray-700 mb-1.5">
                  Email Address
                </label>
                <div className="relative">
                  <input
                    type="email"
                    value={email}
                    onChange={handleEmailChange}
                    onBlur={handleEmailBlur}
                    className={`w-full px-4 py-2.5 lg:py-3 border rounded-lg text-sm lg:text-base outline-none focus:ring-2 transition-all bg-white ${
                      emailError && touched.email
                        ? 'border-red-300 focus:border-red-500 focus:ring-red-100'
                        : 'border-gray-300 focus:border-emerald-500 focus:ring-emerald-100'
                    }`}
                    placeholder="you@example.com"
                    required
                  />
                  <AtSign className={`absolute top-1/2 transform -translate-y-1/2 right-3 w-4 h-4 ${
                    emailError && touched.email ? 'text-red-400' : 'text-gray-400'
                  }`} />
                </div>
                {emailError && touched.email && (
                  <p className="mt-1.5 text-xs text-red-600 flex items-center">
                    <AlertCircle className="w-3 h-3 mr-1" />
                    {emailError}
                  </p>
                )}
              </div>

              {!isForgotPassword && (
                <div className="relative">
                  <label className="block text-xs font-medium text-gray-700 mb-1.5">
                    Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={handlePasswordChange}
                      onBlur={handlePasswordBlur}
                      className={`w-full px-4 py-2.5 lg:py-3 border rounded-lg text-sm lg:text-base outline-none focus:ring-2 transition-all bg-white pr-10 ${
                        passwordError && touched.password && !isLogin
                          ? 'border-red-300 focus:border-red-500 focus:ring-red-100'
                          : 'border-gray-300 focus:border-emerald-500 focus:ring-emerald-100'
                      }`}
                      placeholder={isLogin ? 'Enter your password' : 'Create a strong password'}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute top-1/2 transform -translate-y-1/2 right-3 hover:opacity-70 transition-opacity"
                    >
                      {showPassword ? (
                        <EyeOff className={`w-4 h-4 ${
                          passwordError && touched.password && !isLogin ? 'text-red-400' : 'text-gray-400'
                        }`} />
                      ) : (
                        <Eye className={`w-4 h-4 ${
                          passwordError && touched.password && !isLogin ? 'text-red-400' : 'text-gray-400'
                        }`} />
                      )}
                    </button>
                  </div>
                  {!isLogin && passwordError && touched.password && (
                    <p className="mt-1.5 text-xs text-red-600 flex items-center">
                      <AlertCircle className="w-3 h-3 mr-1" />
                      {passwordError}
                    </p>
                  )}
                  {!isLogin && !passwordError && password && touched.password && (
                    <p className="mt-1.5 text-xs text-emerald-600 flex items-center">
                      <CheckCircle className="w-3 h-3 mr-1" />
                      Password meets requirements
                    </p>
                  )}
                </div>
              )}

              {isLogin && !isForgotPassword && (
                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={handleForgotPasswordToggle}
                    className="text-emerald-600 text-xs font-medium hover:text-emerald-700 transition-colors"
                  >
                    Forgot Password?
                  </button>
                </div>
              )}

              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                  <div className="flex items-start">
                    <AlertCircle className="w-4 h-4 text-red-600 mt-0.5 mr-2 flex-shrink-0" />
                    <span className="text-red-800 text-xs lg:text-sm">{error}</span>
                  </div>
                </div>
              )}

              {success && (
                <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-3">
                  <div className="flex items-start">
                    <CheckCircle className="w-4 h-4 text-emerald-600 mt-0.5 mr-2 flex-shrink-0" />
                    <span className="text-emerald-800 text-xs lg:text-sm">{success}</span>
                  </div>
                </div>
              )}

              <button
                type="submit"
                disabled={loading || (!isLogin && !isForgotPassword && (slugError !== '' || passwordError !== '' || isCheckingSlug))}
                className="w-full py-3 rounded-lg text-sm lg:text-base font-semibold transition-all shadow-sm bg-emerald-600 text-white hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed min-h-[44px] flex items-center justify-center"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    {isForgotPassword ? 'Sending...' : isLogin ? 'Signing in...' : 'Creating account...'}
                  </>
                ) : (
                  isForgotPassword ? 'Send Reset Link' : isLogin ? 'Log in' : 'Create Account'
                )}
              </button>
            </form>

            <div className="text-center mt-6 lg:mt-8">
              {isForgotPassword ? (
                <button
                  type="button"
                  onClick={handleForgotPasswordToggle}
                  className="text-emerald-600 font-semibold hover:text-emerald-700 transition-colors text-sm"
                >
                  Back to Login
                </button>
              ) : (
                <>
                  <span className="text-gray-600 text-sm">
                    {isLogin ? "Don't have an account? " : 'Already have an account? '}
                  </span>
                  <button
                    type="button"
                    onClick={handleModeSwitch}
                    className="text-emerald-600 font-semibold hover:text-emerald-700 transition-colors text-sm"
                  >
                    {isLogin ? 'Sign up' : 'Log in'}
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="text-xs text-gray-500 leading-relaxed pt-6 mt-6 border-t border-gray-200">
            Tiangge ©2025 All Rights Reserved.
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AuthPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
        <div className="w-full max-w-6xl min-h-[500px] flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading...</p>
          </div>
        </div>
      </div>
    }>
      <AuthPageContent />
    </Suspense>
  );
}
