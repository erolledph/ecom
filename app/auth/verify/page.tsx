'use client';

import { Suspense, useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { verifyResetCode, confirmPasswordResetWithCode } from '@/lib/auth';
import { applyActionCode } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { Store, Eye, EyeOff, CircleAlert as AlertCircle, CircleCheck as CheckCircle, Loader2 } from 'lucide-react';

function ResetPasswordContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [verifying, setVerifying] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [email, setEmail] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordError, setPasswordError] = useState('');
  const [touched, setTouched] = useState({
    password: false,
    confirmPassword: false
  });
  const [isEmailVerification, setIsEmailVerification] = useState(false);

  const oobCode = searchParams.get('oobCode');
  const mode = searchParams.get('mode');

  useEffect(() => {
    const handleAction = async () => {
      if (!oobCode) {
        setError('Invalid or missing action code');
        setVerifying(false);
        return;
      }

      // Handle email verification
      if (mode === 'verifyEmail') {
        setIsEmailVerification(true);
        try {
          await applyActionCode(auth, oobCode);
          setSuccess(true);
          setVerifying(false);
          setTimeout(() => {
            router.push('/auth?verified=true');
          }, 3000);
        } catch (error: any) {
          setError('Invalid or expired verification link.');
          setVerifying(false);
        }
        return;
      }

      // Handle password reset
      try {
        const userEmail = await verifyResetCode(oobCode);
        setEmail(userEmail);
        setVerifying(false);
      } catch (error: any) {
        setError('Invalid or expired reset link. Please request a new one.');
        setVerifying(false);
      }
    };

    handleAction();
  }, [oobCode, mode, router]);

  const validatePassword = (password: string): string => {
    if (!password) return 'Password is required';
    if (password.length < 8) return 'Password must be at least 8 characters';
    if (!/[A-Z]/.test(password)) return 'Must contain at least one uppercase letter';
    if (!/[a-z]/.test(password)) return 'Must contain at least one lowercase letter';
    if (!/\d/.test(password)) return 'Must contain at least one number';
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) return 'Must contain at least one special character';
    return '';
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setPassword(value);

    if (touched.password) {
      setPasswordError(validatePassword(value));
    }
  };

  const handlePasswordBlur = () => {
    setTouched(prev => ({ ...prev, password: true }));
    setPasswordError(validatePassword(password));
  };

  const parseFirebaseError = (errorMessage: string): string => {
    if (errorMessage.includes('auth/weak-password')) {
      return 'Password is too weak. Please use a stronger password';
    }
    if (errorMessage.includes('auth/expired-action-code')) {
      return 'Reset link has expired. Please request a new one';
    }
    if (errorMessage.includes('auth/invalid-action-code')) {
      return 'Invalid reset link. Please request a new one';
    }
    if (errorMessage.includes('auth/user-disabled')) {
      return 'This account has been disabled';
    }
    if (errorMessage.includes('auth/user-not-found')) {
      return 'User account not found';
    }

    return errorMessage
      .replace('Firebase: Error', '')
      .replace(/\(auth\/[^)]+\)\.?/g, '')
      .trim() || 'An error occurred. Please try again';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const passwordValidationError = validatePassword(password);
    if (passwordValidationError) {
      setPasswordError(passwordValidationError);
      setTouched(prev => ({ ...prev, password: true }));
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (!oobCode) {
      setError('Invalid reset code');
      return;
    }

    setLoading(true);

    try {
      await confirmPasswordResetWithCode(oobCode, password);
      setSuccess(true);

      setTimeout(() => {
        router.push('/auth?reset=success');
      }, 2000);
    } catch (error: any) {
      const friendlyError = parseFirebaseError(error.message);
      setError(friendlyError);
    } finally {
      setLoading(false);
    }
  };

  if (verifying) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full text-center">
          <Loader2 className="w-12 h-12 text-emerald-600 animate-spin mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-800">
            {mode === 'verifyEmail' ? 'Verifying your email...' : 'Verifying reset link...'}
          </h2>
          <p className="text-gray-600 mt-2">Please wait a moment</p>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full text-center">
          <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-10 h-10 text-emerald-600" />
          </div>
          {isEmailVerification ? (
            <>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Email Verified!</h2>
              <p className="text-gray-600 mb-6">Your email has been successfully verified. You can now access all features of your account.</p>
            </>
          ) : (
            <>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Password Reset Successful!</h2>
              <p className="text-gray-600 mb-6">Your password has been successfully reset. You can now log in with your new password.</p>
            </>
          )}
          <p className="text-sm text-gray-500">Redirecting to login page...</p>
        </div>
      </div>
    );
  }

  if (error && !email) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="w-10 h-10 text-red-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Invalid Reset Link</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => router.push('/auth')}
            className="w-full py-3 rounded-lg text-base font-semibold transition-all shadow-sm bg-emerald-600 text-white hover:bg-emerald-700"
          >
            Back to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full">
        <a
          href="/"
          className="flex items-center mb-6 text-emerald-600 font-bold text-lg hover:text-emerald-700 transition-colors cursor-pointer"
        >
          <Store className="w-5 h-5 mr-2" />
          <span>Tiangge</span>
        </a>

        <h1 className="text-3xl font-bold text-gray-800 mb-2">Reset Your Password</h1>
        <p className="text-sm text-gray-600 mb-6">
          Enter a new password for <span className="font-semibold">{email}</span>
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="relative">
            <label className="block text-xs font-medium text-gray-700 mb-1.5">
              New Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={handlePasswordChange}
                onBlur={handlePasswordBlur}
                className={`w-full px-4 py-3 border rounded-lg text-base outline-none focus:ring-2 transition-all bg-white pr-10 ${
                  passwordError && touched.password
                    ? 'border-red-300 focus:border-red-500 focus:ring-red-100'
                    : 'border-gray-300 focus:border-emerald-500 focus:ring-emerald-100'
                }`}
                placeholder="Create a strong password"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute top-1/2 transform -translate-y-1/2 right-3 hover:opacity-70 transition-opacity"
              >
                {showPassword ? (
                  <EyeOff className={`w-4 h-4 ${
                    passwordError && touched.password ? 'text-red-400' : 'text-gray-400'
                  }`} />
                ) : (
                  <Eye className={`w-4 h-4 ${
                    passwordError && touched.password ? 'text-red-400' : 'text-gray-400'
                  }`} />
                )}
              </button>
            </div>
            {passwordError && touched.password && (
              <p className="mt-1.5 text-xs text-red-600 flex items-center">
                <AlertCircle className="w-3 h-3 mr-1" />
                {passwordError}
              </p>
            )}
            {!passwordError && password && touched.password && (
              <p className="mt-1.5 text-xs text-emerald-600 flex items-center">
                <CheckCircle className="w-3 h-3 mr-1" />
                Password meets requirements
              </p>
            )}
          </div>

          <div className="relative">
            <label className="block text-xs font-medium text-gray-700 mb-1.5">
              Confirm New Password
            </label>
            <div className="relative">
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                onBlur={() => setTouched(prev => ({ ...prev, confirmPassword: true }))}
                className={`w-full px-4 py-3 border rounded-lg text-base outline-none focus:ring-2 transition-all bg-white pr-10 ${
                  confirmPassword && password !== confirmPassword && touched.confirmPassword
                    ? 'border-red-300 focus:border-red-500 focus:ring-red-100'
                    : 'border-gray-300 focus:border-emerald-500 focus:ring-emerald-100'
                }`}
                placeholder="Confirm your password"
                required
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute top-1/2 transform -translate-y-1/2 right-3 hover:opacity-70 transition-opacity"
              >
                {showConfirmPassword ? (
                  <EyeOff className="w-4 h-4 text-gray-400" />
                ) : (
                  <Eye className="w-4 h-4 text-gray-400" />
                )}
              </button>
            </div>
            {confirmPassword && password !== confirmPassword && touched.confirmPassword && (
              <p className="mt-1.5 text-xs text-red-600 flex items-center">
                <AlertCircle className="w-3 h-3 mr-1" />
                Passwords do not match
              </p>
            )}
            {confirmPassword && password === confirmPassword && touched.confirmPassword && (
              <p className="mt-1.5 text-xs text-emerald-600 flex items-center">
                <CheckCircle className="w-3 h-3 mr-1" />
                Passwords match
              </p>
            )}
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
              <div className="flex items-start">
                <AlertCircle className="w-4 h-4 text-red-600 mt-0.5 mr-2 flex-shrink-0" />
                <span className="text-red-800 text-sm">{error}</span>
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={loading || (touched.password && !!passwordError) || (password !== confirmPassword)}
            className="w-full py-3 rounded-lg text-base font-semibold transition-all shadow-sm bg-emerald-600 text-white hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed min-h-[44px] flex items-center justify-center"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Resetting password...
              </>
            ) : (
              'Reset Password'
            )}
          </button>
        </form>

        <div className="text-center mt-6">
          <button
            type="button"
            onClick={() => router.push('/auth')}
            className="text-emerald-600 font-semibold hover:text-emerald-700 transition-colors text-sm"
          >
            Back to Login
          </button>
        </div>

        <div className="text-xs text-gray-500 leading-relaxed pt-6 mt-6 border-t border-gray-200">
          Tiangge ©2025 All Rights Reserved.
        </div>
      </div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full text-center">
          <Loader2 className="w-12 h-12 text-emerald-600 animate-spin mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-800">Loading...</h2>
        </div>
      </div>
    }>
      <ResetPasswordContent />
    </Suspense>
  );
}
