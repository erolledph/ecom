'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { signIn, signUp } from '@/lib/auth';
import { checkSlugAvailability } from '@/lib/store';
import { useAuth } from '@/hooks/useAuth';
import { 
  Store, 
  Package, 
  TrendingUp, 
  Users, 
  Eye, 
  MousePointer, 
  ArrowRight,
  Star,
  StarHalf,
  RefreshCw,
  AtSign,
  Lock
} from 'lucide-react';

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [storeSlug, setStoreSlug] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [slugError, setSlugError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [isCheckingSlug, setIsCheckingSlug] = useState(false);
  
  const router = useRouter();
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      router.push('/dashboard');
    }
  }, [user, router]);

  const checkSlug = async (slug: string) => {
    if (!slug || slug.length < 3) {
      setSlugError('Store URL must be at least 3 characters long');
      return;
    }

    setIsCheckingSlug(true);
    try {
      const isAvailable = await checkSlugAvailability(slug);
      if (!isAvailable) {
        setSlugError('This store URL is already taken. Please choose a different one.');
      } else {
        setSlugError('');
      }
    } catch (error) {
      console.error('Error checking slug:', error);
      setSlugError('Error checking URL availability');
    } finally {
      setIsCheckingSlug(false);
    }
  };

  const handleStoreSlugChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '');
    setStoreSlug(value);
    
    const timeoutId = setTimeout(() => checkSlug(value), 500);
    return () => clearTimeout(timeoutId);
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setPassword(value);
    
    if (!isLogin) {
      let error = '';
      try {
        if (value) {
          if (value.length < 8) {
            error = 'Password must be at least 8 characters long';
          } else if (!/[A-Z]/.test(value)) {
            error = 'Password must contain at least one uppercase letter';
          } else if (!/[a-z]/.test(value)) {
            error = 'Password must contain at least one lowercase letter';
          } else if (!/\d/.test(value)) {
            error = 'Password must contain at least one number';
          } else if (!/[!@#$%^&*(),.?":{}|<>]/.test(value)) {
            error = 'Password must contain at least one special character';
          }
        }
      } catch (err: any) {
        error = err.message;
      }
      setPasswordError(error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (!isLogin) {
      if (passwordError) {
        setError('Please fix the password requirements');
        setLoading(false);
        return;
      }
      if (slugError) {
        setError('Please fix the store URL error');
        setLoading(false);
        return;
      }
      if (!storeSlug.trim()) {
        setError('Store URL is required');
        setLoading(false);
        return;
      }
    }

    try {
      if (isLogin) {
        await signIn(email, password);
      } else {
        await signUp(email, password, displayName, storeSlug);
      }
      router.push('/dashboard');
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-2 sm:p-4">
      <div className="w-full max-w-6xl min-h-[500px] sm:min-h-[600px] flex flex-col lg:flex-row shadow-2xl rounded-xl bg-white relative overflow-hidden">
        
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
                    src="https://images.pexels.com/photos/2529148/pexels-photo-2529148.jpeg" 
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
            <div className="flex items-center mb-6 lg:mb-8 text-emerald-600 font-bold text-lg lg:text-xl">
              <Store className="w-4 h-4 lg:w-5 lg:h-5 mr-2" />
              <span>Tiangge</span>
            </div>

            <h1 className="text-2xl lg:text-3xl font-semibold text-gray-800 mb-6 lg:mb-10">
              {isLogin ? 'Log in to your account' : 'Create your account'}
            </h1>

            <form onSubmit={handleSubmit} className="space-y-4 lg:space-y-6">
              {!isLogin && (
                <div className="relative">
                  <input
                    type="text"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    className="w-full pb-2 lg:pb-3 border-0 border-b border-gray-300 text-sm lg:text-base outline-none focus:border-green-400 transition-colors bg-transparent"
                    placeholder="Display Name"
                    required={!isLogin}
                  />
                  <Users className="absolute top-1/2 transform -translate-y-1/2 right-0 w-3 h-3 lg:w-4 lg:h-4 text-gray-400" />
                </div>
              )}

              {!isLogin && (
                <div className="relative">
                  <div className="flex items-center border-b border-gray-300 focus-within:border-green-400 transition-colors">
                    <span className="text-gray-500 text-sm lg:text-base py-2 lg:py-3 pr-2">
                      tiangge.shop/
                    </span>
                    <input
                      type="text"
                      value={storeSlug}
                      onChange={handleStoreSlugChange}
                      className="flex-1 border-0 text-sm lg:text-base outline-none bg-transparent text-left leading-normal py-2 lg:py-3"
                      placeholder="my-store"
                      required={!isLogin}
                    />
                  </div>
                  {isCheckingSlug && (
                    <p className="mt-2 text-xs lg:text-sm text-gray-500 flex items-center">
                      <div className="animate-spin rounded-full h-3 w-3 lg:h-4 lg:w-4 border-b-2 border-emerald-600 mr-2"></div>
                      Checking availability...
                    </p>
                  )}
                  {slugError && (
                    <p className="mt-2 text-xs lg:text-sm text-red-600">{slugError}</p>
                  )}
                  {!slugError && !isCheckingSlug && storeSlug && (
                    <p className="mt-2 text-xs lg:text-sm text-green-600">Store URL is available</p>
                  )}
                </div>
              )}

              <div className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pb-2 lg:pb-3 border-0 border-b border-gray-300 text-sm lg:text-base outline-none focus:border-green-400 transition-colors bg-transparent"
                  placeholder="Email Address"
                  required
                />
                <AtSign className="absolute top-1/2 transform -translate-y-1/2 right-0 w-3 h-3 lg:w-4 lg:h-4 text-gray-400" />
              </div>

              <div className="relative">
                <input
                  type="password"
                  value={password}
                  onChange={handlePasswordChange}
                  className="w-full pb-2 lg:pb-3 border-0 border-b border-gray-300 text-sm lg:text-base outline-none focus:border-green-400 transition-colors bg-transparent"
                  placeholder="Enter Password"
                  required
                />
                <Lock className="absolute top-1/2 transform -translate-y-1/2 right-0 w-3 h-3 lg:w-4 lg:h-4 text-gray-400" />
                {!isLogin && passwordError && (
                  <p className="mt-2 text-xs lg:text-sm text-red-600">{passwordError}</p>
                )}
                {!isLogin && !passwordError && password && (
                  <p className="mt-2 text-xs lg:text-sm text-green-600">Password meets requirements</p>
                )}
              </div>

              {isLogin && (
                <div className="mt-1 mb-4 lg:mb-8">
                  <a href="#" className="text-green-400 text-xs lg:text-sm font-medium hover:text-green-500 transition-colors">
                    Forgot Password?
                  </a>
                </div>
              )}

              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3 lg:p-4">
                  <div className="flex items-center">
                    <div className="w-4 h-4 lg:w-5 lg:h-5 bg-red-100 rounded-full flex items-center justify-center mr-2 lg:mr-3">
                      <span className="text-red-600 text-xs font-bold">!</span>
                    </div>
                    <span className="text-red-800 text-xs lg:text-sm">{error}</span>
                  </div>
                </div>
              )}

              <button
                type="submit"
                disabled={loading || (!isLogin && (slugError !== '' || passwordError !== '' || isCheckingSlug))}
                className="w-full py-3 lg:py-3 border-0 rounded-md text-sm lg:text-base cursor-pointer mb-3 lg:mb-4 transition-all font-semibold shadow-sm bg-green-400 text-white hover:bg-green-500 disabled:opacity-50 disabled:cursor-not-allowed min-h-[44px]"
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-4 w-4 lg:h-5 lg:w-5 border-b-2 border-white mr-2"></div>
                    {isLogin ? 'Signing in...' : 'Creating account...'}
                  </div>
                ) : (
                  isLogin ? 'Log in' : 'Create Account'
                )}
              </button>
            </form>

            <div className="text-center mt-6 lg:mt-10">
              <span className="text-gray-600 text-sm lg:text-base">
                {isLogin ? 'Need a Tiangge account? ' : 'Already have an account? '}
              </span>
              <button
                type="button"
                onClick={() => setIsLogin(!isLogin)}
                className="text-green-400 font-semibold hover:text-green-500 transition-colors text-sm lg:text-base"
              >
                {isLogin ? 'Create an account' : 'Log in'}
              </button>
            </div>
          </div>

          {/* Footer */}
          <div className="text-xs text-gray-400 leading-relaxed pt-4 lg:pt-8 mt-4 lg:mt-8 border-t border-gray-200">
            Tiangge ©2025 All Rights Reserved.
          </div>
        </div>
      </div>

      {/* Custom Styles for Animations */}
      <style jsx>{`
        @keyframes card-float {
          0% { transform: translateY(0) scale(1) rotate(var(--initial-rotation, 0deg)); }
          50% { transform: translateY(-3px) scale(1.01) rotate(var(--initial-rotation, 0deg)); }
          100% { transform: translateY(0) scale(1) rotate(var(--initial-rotation, 0deg)); }
        }

        @media (max-width: 1024px) {
          .animate-float-1,
          .animate-float-2,
          .animate-float-3,
          .animate-float-4,
          .animate-float-5,
          .animate-float-6 {
            animation-duration: 3s;
          }
        }

        .animate-float-1 {
          --initial-rotation: 5deg;
          transform: rotate(5deg);
          animation: card-float 4s ease-in-out infinite;
          animation-delay: 0.2s;
        }

        .animate-float-2 {
          --initial-rotation: -10deg;
          transform: rotate(-10deg);
          animation: card-float 4s ease-in-out infinite;
          animation-delay: 0.3s;
        }

        .animate-float-3 {
          --initial-rotation: -15deg;
          transform: rotate(-15deg);
          animation: card-float 4s ease-in-out infinite;
          animation-delay: 0.7s;
        }

        .animate-float-4 {
          --initial-rotation: 8deg;
          transform: rotate(8deg);
          animation: card-float 4s ease-in-out infinite;
          animation-delay: 0.5s;
        }

        .animate-float-5 {
          --initial-rotation: -5deg;
          transform: rotate(-5deg);
          animation: card-float 4s ease-in-out infinite;
          animation-delay: 0.9s;
        }

        .animate-float-6 {
          --initial-rotation: -12deg;
          transform: rotate(-12deg);
          animation: card-float 4s ease-in-out infinite;
          animation-delay: 0.1s;
        }

        .animate-float-center {
          animation: card-float 5s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}
