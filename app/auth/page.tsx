'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { signIn, signUp } from '@/lib/auth';
import { checkSlugAvailability } from '@/lib/store';
import { useAuth } from '@/hooks/useAuth';

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
    
    // Debounce slug checking
    const timeoutId = setTimeout(() => checkSlug(value), 500);
    return () => clearTimeout(timeoutId);
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setPassword(value);
    
    if (!isLogin) {
      // Use the validatePassword function from lib/auth.ts
      let error = '';
      try {
        // This will throw an error if password is invalid
        if (value) {
          // We can't directly call the validatePassword from lib/auth.ts here
          // since it throws errors, so we'll do basic validation
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

    // Additional validation for signup
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
    <div className="min-h-screen bg-gray-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            {isLogin ? 'Sign in to your account' : 'Create your account'}
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            {isLogin ? "Don't have an account? " : 'Already have an account? '}
            <button
              type="button"
              onClick={() => setIsLogin(!isLogin)}
              className="font-medium text-primary-600 hover:text-primary-500"
            >
              {isLogin ? 'Sign up' : 'Sign in'}
            </button>
          </p>
        </div>
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm -space-y-px">
            {!isLogin && (
              <div>
                <label htmlFor="displayName" className="sr-only">
                  Display Name
                </label>
                <input
                  id="displayName"
                  name="displayName"
                  type="text"
                  required={!isLogin}
                  className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                  placeholder="Display Name"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                />
              </div>
            )}
            
            {!isLogin && (
              <div>
                <label htmlFor="storeSlug" className="sr-only">
                  Store URL
                </label>
                <div className="flex">
                  <span className="inline-flex items-center px-3 rounded-l-none border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm">
                    tiangge.shop/
                  </span>
                  <input
                    id="storeSlug"
                    name="storeSlug"
                    type="text"
                    required={!isLogin}
                    className={`appearance-none rounded-none relative block w-full px-3 py-2 border placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm ${
                      slugError ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder="my-store"
                    value={storeSlug}
                    onChange={handleStoreSlugChange}
                  />
                </div>
                {isCheckingSlug && (
                  <p className="mt-1 text-sm text-gray-500">Checking availability...</p>
                )}
                {slugError && (
                  <p className="mt-1 text-sm text-red-600">{slugError}</p>
                )}
                {!slugError && !isCheckingSlug && storeSlug && (
                  <p className="mt-1 text-sm text-green-600">✓ Store URL is available</p>
                )}
              </div>
            )}
            <div>
              <label htmlFor="email-address" className="sr-only">
                Email address
              </label>
              <input
                id="email-address"
                name="email"
                type="email"
                autoComplete="email"
                required
                className={`appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 ${
                  isLogin ? 'rounded-t-md' : (displayName ? '' : 'rounded-t-md')
                } focus:outline-none focus:ring-primary-500 focus:border-primary-500 focus:z-10 sm:text-sm`}
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            
            <div>
              <label htmlFor="password" className="sr-only">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-primary-500 focus:border-primary-500 focus:z-10 sm:text-sm"
                placeholder="Password"
                value={password}
                onChange={handlePasswordChange}
              />
              {!isLogin && passwordError && (
                <p className="mt-1 text-sm text-red-600">{passwordError}</p>
              )}
              {!isLogin && !passwordError && password && (
                <p className="mt-1 text-sm text-green-600">✓ Password meets requirements</p>
              )}
            </div>
          </div>

          {error && (
            <div className="text-danger-600 text-sm text-center">{error}</div>
          )}

          <div>
            <button
              type="submit"
              disabled={loading || (!isLogin && (slugError !== '' || passwordError !== '' || isCheckingSlug))}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              ) : (
                isLogin ? 'Sign in' : 'Sign up'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}