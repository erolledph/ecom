'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/useToast';
import { isAdmin } from '@/lib/auth';

interface AdminRouteProps {
  children: React.ReactNode;
}

export default function AdminRoute({ children }: AdminRouteProps) {
  const { userProfile, loading } = useAuth();
  const router = useRouter();
  const { showError } = useToast();
  
  console.log('AdminRoute - userProfile:', userProfile, 'loading:', loading);
  
  useEffect(() => {
    if (!loading && userProfile && !isAdmin(userProfile)) {
      console.log('Access denied - user is not admin:', userProfile);
      showError('Access denied. Administrator privileges required.');
      router.push('/dashboard');
    }
  }, [userProfile, loading, router, showError]);
  
  if (loading) {
    console.log('AdminRoute - still loading...');
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
          <p className="text-gray-600 text-sm">Verifying admin access...</p>
        </div>
      </div>
    );
  }
  
  if (!userProfile || !isAdmin(userProfile)) {
    console.log('AdminRoute - no access:', { userProfile, isAdmin: isAdmin(userProfile) });
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Access Denied</h3>
          <p className="text-gray-600">You need administrator privileges to access this page.</p>
          <div className="mt-4 p-3 bg-gray-100 rounded text-sm text-gray-700">
            <p>Current user role: {userProfile?.role || 'Not loaded'}</p>
            <p>User ID: {userProfile?.uid || 'Not loaded'}</p>
          </div>
        </div>
      </div>
    );
  }
  
  console.log('AdminRoute - access granted for admin user');
  return <>{children}</>;
}