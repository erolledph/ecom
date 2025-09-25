import React from 'react';
import { useAuth } from '@/hooks/useAuth';
import { canAccessFeature } from '@/lib/auth';
import { Crown, Lock, Sparkles } from 'lucide-react';

interface PremiumFeatureGateProps {
  feature: 'analytics' | 'csv_import' | 'export' | 'admin';
  children: React.ReactNode;
  fallback?: React.ReactNode;
  showUpgrade?: boolean;
}

export default function PremiumFeatureGate({ 
  feature, 
  children, 
  fallback, 
  showUpgrade = true 
}: PremiumFeatureGateProps) {
  const { userProfile } = useAuth();
  
  const hasAccess = canAccessFeature(userProfile, feature);
  
  if (hasAccess) {
    return <>{children}</>;
  }
  
  if (fallback) {
    return <>{fallback}</>;
  }
  
  if (!showUpgrade) {
    return null;
  }
  
  const getFeatureInfo = () => {
    switch (feature) {
      case 'analytics':
        return {
          title: 'Advanced Analytics',
          description: 'Track detailed user interactions, product performance, and store insights.',
          icon: <Sparkles className="w-6 h-6" />
        };
      case 'csv_import':
        return {
          title: 'Bulk Product Import',
          description: 'Import hundreds of products at once using CSV files.',
          icon: <Crown className="w-6 h-6" />
        };
      case 'export':
        return {
          title: 'Data Export',
          description: 'Export your subscribers and analytics data to CSV files.',
          icon: <Crown className="w-6 h-6" />
        };
      case 'admin':
        return {
          title: 'Admin Access Required',
          description: 'This feature requires administrator privileges.',
          icon: <Lock className="w-6 h-6" />
        };
      default:
        return {
          title: 'Premium Feature',
          description: 'This feature is available for premium users.',
          icon: <Crown className="w-6 h-6" />
        };
    }
  };
  
  const featureInfo = getFeatureInfo();
  
  return (
    <div className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-lg border border-yellow-200 p-6 text-center">
      <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-4 text-white">
        {featureInfo.icon}
      </div>
      <h3 className="text-lg font-semibold text-gray-900 mb-2">{featureInfo.title}</h3>
      <p className="text-gray-600 mb-4">{featureInfo.description}</p>
      
      {feature !== 'admin' && (
        <div className="bg-white rounded-lg p-4 mb-4">
          <p className="text-sm font-medium text-gray-700 mb-2">Premium features include:</p>
          <ul className="text-sm text-gray-600 space-y-1">
            <li>• Advanced analytics and reporting</li>
            <li>• Bulk product imports via CSV</li>
            <li>• Data export capabilities</li>
            <li>• Priority support</li>
          </ul>
        </div>
      )}
      
      {feature !== 'admin' && (
        <button className="px-6 py-3 bg-gradient-to-r from-yellow-500 to-orange-500 text-white rounded-lg hover:from-yellow-600 hover:to-orange-600 transition-colors font-medium">
          Upgrade to Premium
        </button>
      )}
    </div>
  );
}