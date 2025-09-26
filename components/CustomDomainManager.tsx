'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/useToast';
import { Store } from '@/lib/store';
import { isPremium } from '@/lib/auth';
import PremiumFeatureGate from '@/components/PremiumFeatureGate';
import { Globe, CircleCheck as CheckCircle, Circle as XCircle, TriangleAlert as AlertTriangle, RefreshCw, Copy, Trash2, Plus, Settings, Crown } from 'lucide-react';

interface CustomDomainManagerProps {
  store: Store | null;
  onStoreUpdate: () => void;
}

interface CustomDomainStatus {
  customDomain: string;
  domainVerificationCode: string;
  domainVerified: boolean;
  sslStatus: 'pending' | 'active' | 'failed' | 'not_applicable';
  customDomainEnabled: boolean;
  dnsInstructions: { type: string; name: string; value: string }[];
}

export default function CustomDomainManager({ store, onStoreUpdate }: CustomDomainManagerProps) {
  const { user, userProfile } = useAuth();
  const { showSuccess, showError, showInfo } = useToast();

  const [domainInput, setDomainInput] = useState('');
  const [currentDomainStatus, setCurrentDomainStatus] = useState<CustomDomainStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isRemoving, setIsRemoving] = useState(false);
  const [isRefreshingStatus, setIsRefreshingStatus] = useState(false);
  const [isUpdatingEnabled, setIsUpdatingEnabled] = useState(false);

  const isPremiumUser = isPremium(userProfile);
  const netlifySiteName = process.env.NEXT_PUBLIC_NETLIFY_SITE_NAME || 'your-netlify-site.netlify.app';

  useEffect(() => {
    if (store) {
      setDomainInput(store.customDomain || '');
      fetchCustomDomainStatus();
    } else {
      setLoading(false);
    }
  }, [store]);

  const fetchCustomDomainStatus = async () => {
    if (!user || !isPremiumUser) {
      setLoading(false);
      return;
    }

    setIsRefreshingStatus(true);
    try {
      const idToken = await user.getIdToken();
      const response = await fetch('/api/custom-domain/status', {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${idToken}`,
        },
      });
      const data = await response.json();

      if (data.success && data.status) {
        setCurrentDomainStatus(data.status);
      } else {
        setCurrentDomainStatus(null);
      }
    } catch (error) {
      console.error('Error fetching custom domain status:', error);
      setCurrentDomainStatus(null);
    } finally {
      setLoading(false);
      setIsRefreshingStatus(false);
    }
  };

  const handleAddDomain = async () => {
    if (!user || !isPremiumUser) return;
    if (!domainInput.trim()) {
      showError('Please enter a domain name.');
      return;
    }
    
    const cleanDomain = domainInput.toLowerCase().replace(/^https?:\/\//, '').replace(/^www\./, '');
    if (!/^[a-zA-Z0-9][a-zA-Z0-9-]{0,61}[a-zA-Z0-9]?\.[a-zA-Z]{2,}$/.test(cleanDomain)) {
      showError('Please enter a valid domain format (e.g., example.com).');
      return;
    }

    setIsAdding(true);
    try {
      const idToken = await user.getIdToken();
      const response = await fetch('/api/custom-domain/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${idToken}`,
        },
        body: JSON.stringify({ domain: cleanDomain }),
      });
      const data = await response.json();

      if (data.success) {
        showSuccess(data.message);
        onStoreUpdate();
        await fetchCustomDomainStatus();
      } else {
        showError(data.message);
      }
    } catch (error) {
      console.error('Error adding custom domain:', error);
      showError('Failed to add custom domain.');
    } finally {
      setIsAdding(false);
    }
  };

  const handleVerifyDomain = async () => {
    if (!user || !isPremiumUser || !currentDomainStatus?.customDomain) return;

    setIsVerifying(true);
    try {
      const idToken = await user.getIdToken();
      const response = await fetch('/api/custom-domain/verify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${idToken}`,
        },
        body: JSON.stringify({ domain: currentDomainStatus.customDomain }),
      });
      const data = await response.json();

      if (data.success) {
        showSuccess(data.message);
        onStoreUpdate();
        await fetchCustomDomainStatus();
      } else {
        showError(data.message);
      }
    } catch (error) {
      console.error('Error verifying custom domain:', error);
      showError('Failed to verify custom domain.');
    } finally {
      setIsVerifying(false);
    }
  };

  const handleRemoveDomain = async () => {
    if (!user || !isPremiumUser || !currentDomainStatus?.customDomain) return;

    if (!window.confirm(`Are you sure you want to remove the custom domain "${currentDomainStatus.customDomain}"? This action cannot be undone.`)) {
      return;
    }

    setIsRemoving(true);
    try {
      const idToken = await user.getIdToken();
      const response = await fetch('/api/custom-domain/remove', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${idToken}`,
        },
      });
      const data = await response.json();

      if (data.success) {
        showSuccess(data.message);
        setDomainInput('');
        setCurrentDomainStatus(null);
        onStoreUpdate();
      } else {
        showError(data.message);
      }
    } catch (error) {
      console.error('Error removing custom domain:', error);
      showError('Failed to remove custom domain.');
    } finally {
      setIsRemoving(false);
    }
  };

  const handleToggleCustomDomainEnabled = async (enabled: boolean) => {
    if (!user || !isPremiumUser || !store) return;

    setIsUpdatingEnabled(true);
    try {
      const idToken = await user.getIdToken();
      const response = await fetch('/api/store/update', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${idToken}`,
        },
        body: JSON.stringify({ customDomainEnabled: enabled }),
      });
      const data = await response.json();

      if (data.success) {
        showSuccess(`Custom domain ${enabled ? 'enabled' : 'disabled'} successfully.`);
        onStoreUpdate();
        await fetchCustomDomainStatus();
      } else {
        showError(data.message);
      }
    } catch (error) {
      console.error('Error toggling custom domain enabled status:', error);
      showError('Failed to update custom domain status.');
    } finally {
      setIsUpdatingEnabled(false);
    }
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    showInfo(`${label} copied to clipboard!`);
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="h-10 bg-gray-200 rounded mb-4"></div>
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
        </div>
      </div>
    );
  }

  return (
    <PremiumFeatureGate 
      feature="csv_import" 
      fallback={
        <div className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-lg border border-yellow-200 p-6 text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-4 text-white">
            <Globe className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Custom Domains</h3>
          <div className="flex items-center justify-center mb-3">
            <Crown className="w-5 h-5 text-yellow-600 mr-2" />
            <span className="text-sm font-medium text-yellow-800">Premium Feature</span>
          </div>
          <p className="text-gray-700 mb-4">
            Connect your own domain (e.g., yourstore.com) to your affiliate store for a professional appearance and better branding.
          </p>
          <div className="bg-white rounded-lg p-4 mb-4 text-left">
            <h4 className="font-medium text-gray-900 mb-2">Benefits of Custom Domains:</h4>
            <ul className="text-sm text-gray-700 space-y-1">
              <li>• Professional branding with your own domain</li>
              <li>• Better SEO and search engine visibility</li>
              <li>• Increased customer trust and credibility</li>
              <li>• Full SSL certificate support</li>
              <li>• Easy DNS management and setup</li>
            </ul>
          </div>
          <button className="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-medium">
            Upgrade to Premium
          </button>
        </div>
      }
    >
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center space-x-3 mb-6">
          <Globe className="w-6 h-6 text-primary-600" />
          <h2 className="text-xl font-semibold text-gray-900">Custom Domain</h2>
          <button
            onClick={fetchCustomDomainStatus}
            disabled={isRefreshingStatus}
            className="ml-auto p-2 rounded-full text-gray-500 hover:bg-gray-100 transition-colors"
            title="Refresh status"
          >
            <RefreshCw className={`w-5 h-5 ${isRefreshingStatus ? 'animate-spin' : ''}`} />
          </button>
        </div>

        {!currentDomainStatus ? (
          // No custom domain configured
          <div className="space-y-4">
            <p className="text-gray-600">Connect your own domain (e.g., yourstore.com) to your affiliate store for professional branding.</p>
            <div>
              <label htmlFor="customDomainInput" className="block text-sm font-medium text-gray-900 mb-2">
                Your Custom Domain
              </label>
              <div className="flex space-x-3">
                <input
                  type="text"
                  id="customDomainInput"
                  value={domainInput}
                  onChange={(e) => setDomainInput(e.target.value)}
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="e.g., mystore.com"
                />
                <button
                  onClick={handleAddDomain}
                  disabled={isAdding || !domainInput.trim()}
                  className="flex items-center px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
                >
                  {isAdding ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      Adding...
                    </>
                  ) : (
                    <>
                      <Plus className="w-5 h-5 mr-2" />
                      Add Domain
                    </>
                  )}
                </button>
              </div>
              <p className="mt-2 text-sm text-gray-500">
                Enter your domain without "www" or "https://" (e.g., mystore.com)
              </p>
            </div>
          </div>
        ) : (
          // Custom domain configured
          <div className="space-y-6">
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
              <div className="flex items-center space-x-3">
                <Globe className="w-6 h-6 text-gray-600" />
                <div>
                  <p className="text-sm text-gray-600">Current Custom Domain</p>
                  <p className="font-semibold text-lg text-gray-900">{currentDomainStatus.customDomain}</p>
                </div>
              </div>
              <button
                onClick={handleRemoveDomain}
                disabled={isRemoving}
                className="flex items-center px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm font-medium"
              >
                {isRemoving ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Removing...
                  </>
                ) : (
                  <>
                    <Trash2 className="w-4 h-4 mr-2" />
                    Remove Domain
                  </>
                )}
              </button>
            </div>

            {/* Verification Status */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900 flex items-center space-x-2">
                <CheckCircle className="w-5 h-5 text-primary-600" />
                Domain Verification
              </h3>
              {!currentDomainStatus.domainVerified ? (
                <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200 space-y-3">
                  <div className="flex items-center space-x-3">
                    <AlertTriangle className="w-5 h-5 text-yellow-600" />
                    <p className="font-medium text-yellow-800">Verification Pending</p>
                  </div>
                  <p className="text-sm text-yellow-700">
                    To prove ownership of your domain, please add the following TXT record to your domain's DNS settings.
                  </p>
                  <div className="bg-yellow-100 p-3 rounded-md space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-sm text-yellow-900">
                        <strong>Type:</strong> TXT
                      </span>
                      <button 
                        onClick={() => copyToClipboard('TXT', 'Record type')} 
                        className="text-yellow-600 hover:text-yellow-800 p-1"
                        title="Copy record type"
                      >
                        <Copy className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-sm text-yellow-900 break-all">
                        <strong>Name:</strong> _bolt-verify.{currentDomainStatus.customDomain}
                      </span>
                      <button 
                        onClick={() => copyToClipboard(`_bolt-verify.${currentDomainStatus.customDomain}`, 'TXT record name')} 
                        className="text-yellow-600 hover:text-yellow-800 p-1 ml-2"
                        title="Copy record name"
                      >
                        <Copy className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-sm text-yellow-900 break-all">
                        <strong>Value:</strong> {currentDomainStatus.domainVerificationCode}
                      </span>
                      <button 
                        onClick={() => copyToClipboard(currentDomainStatus.domainVerificationCode, 'TXT record value')} 
                        className="text-yellow-600 hover:text-yellow-800 p-1 ml-2"
                        title="Copy record value"
                      >
                        <Copy className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  <button
                    onClick={handleVerifyDomain}
                    disabled={isVerifying}
                    className="flex items-center px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
                  >
                    {isVerifying ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                        Verifying...
                      </>
                    ) : (
                      <>
                        <CheckCircle className="w-5 h-5 mr-2" />
                        Verify Domain
                      </>
                    )}
                  </button>
                  <p className="text-xs text-yellow-700 mt-2">
                    DNS changes can take a few minutes to propagate. If verification fails, please wait and try again.
                  </p>
                </div>
              ) : (
                <div className="p-4 bg-green-50 rounded-lg border border-green-200 space-y-3">
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <p className="font-medium text-green-800">Domain Verified!</p>
                  </div>
                  <p className="text-sm text-green-700">
                    Your domain ownership has been successfully verified. Now, point your domain to our servers.
                  </p>
                  <div className="bg-green-100 p-3 rounded-md space-y-3">
                    <div>
                      <p className="font-medium text-green-900 mb-2">For Root Domain ({currentDomainStatus.customDomain}):</p>
                      <div className="space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="font-mono text-sm text-green-900">
                            <strong>Type:</strong> A
                          </span>
                          <button onClick={() => copyToClipboard('A', 'A record type')} className="text-green-600 hover:text-green-800 p-1">
                            <Copy className="w-4 h-4" />
                          </button>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="font-mono text-sm text-green-900">
                            <strong>Name:</strong> @ (or leave blank)
                          </span>
                          <button onClick={() => copyToClipboard('@', 'A record name')} className="text-green-600 hover:text-green-800 p-1">
                            <Copy className="w-4 h-4" />
                          </button>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="font-mono text-sm text-green-900">
                            <strong>Value:</strong> 75.2.60.5
                          </span>
                          <button onClick={() => copyToClipboard('75.2.60.5', 'A record value')} className="text-green-600 hover:text-green-800 p-1">
                            <Copy className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                    <div>
                      <p className="font-medium text-green-900 mb-2">For www Subdomain (www.{currentDomainStatus.customDomain}):</p>
                      <div className="space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="font-mono text-sm text-green-900">
                            <strong>Type:</strong> CNAME
                          </span>
                          <button onClick={() => copyToClipboard('CNAME', 'CNAME record type')} className="text-green-600 hover:text-green-800 p-1">
                            <Copy className="w-4 h-4" />
                          </button>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="font-mono text-sm text-green-900">
                            <strong>Name:</strong> www
                          </span>
                          <button onClick={() => copyToClipboard('www', 'CNAME record name')} className="text-green-600 hover:text-green-800 p-1">
                            <Copy className="w-4 h-4" />
                          </button>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="font-mono text-sm text-green-900 break-all">
                            <strong>Value:</strong> {netlifySiteName}
                          </span>
                          <button onClick={() => copyToClipboard(netlifySiteName, 'CNAME record value')} className="text-green-600 hover:text-green-800 p-1">
                            <Copy className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                  <p className="text-xs text-green-700 mt-2">
                    After updating these records, your custom domain should be live within minutes to a few hours.
                  </p>
                </div>
              )}
            </div>

            {/* SSL Status */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900 flex items-center space-x-2">
                <Settings className="w-5 h-5 text-primary-600" />
                SSL Certificate Status
              </h3>
              <div className={`p-4 rounded-lg border space-y-2 ${
                currentDomainStatus.sslStatus === 'active' ? 'bg-green-50 border-green-200' :
                currentDomainStatus.sslStatus === 'pending' ? 'bg-blue-50 border-blue-200' :
                currentDomainStatus.sslStatus === 'failed' ? 'bg-red-50 border-red-200' :
                'bg-gray-50 border-gray-200'
              }`}>
                <div className="flex items-center space-x-3">
                  {currentDomainStatus.sslStatus === 'active' && <CheckCircle className="w-5 h-5 text-green-600" />}
                  {currentDomainStatus.sslStatus === 'pending' && <AlertTriangle className="w-5 h-5 text-blue-600" />}
                  {currentDomainStatus.sslStatus === 'failed' && <XCircle className="w-5 h-5 text-red-600" />}
                  {currentDomainStatus.sslStatus === 'not_applicable' && <Settings className="w-5 h-5 text-gray-600" />}
                  <p className="font-medium text-gray-800">
                    SSL Status: <span className="capitalize">{currentDomainStatus.sslStatus.replace('_', ' ')}</span>
                  </p>
                </div>
                <p className="text-sm text-gray-700">
                  {currentDomainStatus.sslStatus === 'active' && 'Your SSL certificate is active. Your custom domain is secured with HTTPS.'}
                  {currentDomainStatus.sslStatus === 'pending' && 'SSL certificate provisioning is in progress. This is handled automatically by our hosting provider and may take a few minutes.'}
                  {currentDomainStatus.sslStatus === 'failed' && 'SSL certificate provisioning failed. Please ensure your DNS records are correctly configured and contact support if the issue persists.'}
                  {currentDomainStatus.sslStatus === 'not_applicable' && 'SSL status will be available once your domain is verified and pointed to our servers.'}
                </p>
              </div>
            </div>

            {/* Custom Domain Enabled Toggle */}
            {currentDomainStatus.domainVerified && (
              <div className="flex items-center justify-between py-4 border-t border-gray-200">
                <div className="flex-1 min-w-0 mr-4">
                  <label htmlFor="customDomainEnabledToggle" className="block text-sm font-medium text-gray-900 cursor-pointer">
                    Enable Custom Domain
                  </label>
                  <p className="mt-1 text-sm text-gray-500">
                    Toggle to enable or disable your custom domain. When disabled, your store will revert to its default tiangge.shop URL.
                  </p>
                </div>
                <div className="flex-shrink-0">
                  <button
                    type="button"
                    role="switch"
                    aria-checked={currentDomainStatus.customDomainEnabled}
                    onClick={() => handleToggleCustomDomainEnabled(!currentDomainStatus.customDomainEnabled)}
                    disabled={isUpdatingEnabled}
                    className={`
                      relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent 
                      transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary-600 focus:ring-offset-2
                      ${currentDomainStatus.customDomainEnabled ? 'bg-primary-600' : 'bg-gray-200'}
                      ${isUpdatingEnabled ? 'opacity-50 cursor-not-allowed' : ''}
                    `}
                  >
                    <span
                      className={`
                        pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 
                        transition duration-200 ease-in-out
                        ${currentDomainStatus.customDomainEnabled ? 'translate-x-5' : 'translate-x-0'}
                      `}
                    />
                  </button>
                </div>
              </div>
            )}

            {/* Domain Status Summary */}
            <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
              <h4 className="font-medium text-blue-900 mb-2">Domain Status Summary</h4>
              <div className="space-y-2 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-blue-800">Domain Added:</span>
                  <CheckCircle className="w-4 h-4 text-green-600" />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-blue-800">Domain Verified:</span>
                  {currentDomainStatus.domainVerified ? (
                    <CheckCircle className="w-4 h-4 text-green-600" />
                  ) : (
                    <XCircle className="w-4 h-4 text-red-600" />
                  )}
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-blue-800">SSL Certificate:</span>
                  {currentDomainStatus.sslStatus === 'active' ? (
                    <CheckCircle className="w-4 h-4 text-green-600" />
                  ) : currentDomainStatus.sslStatus === 'pending' ? (
                    <AlertTriangle className="w-4 h-4 text-yellow-600" />
                  ) : (
                    <XCircle className="w-4 h-4 text-red-600" />
                  )}
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-blue-800">Domain Enabled:</span>
                  {currentDomainStatus.customDomainEnabled ? (
                    <CheckCircle className="w-4 h-4 text-green-600" />
                  ) : (
                    <XCircle className="w-4 h-4 text-red-600" />
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </PremiumFeatureGate>
  );
}