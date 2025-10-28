'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/useToast';
import { SUBSCRIPTION_PLANS, uploadPaymentProof, createSubscriptionRequest, getUserSubscriptionRequests, SubscriptionRequest } from '@/lib/subscriptions';
import { getUserProfile } from '@/lib/auth';

type PlanType = 'monthly' | 'quarterly' | 'yearly' | 'lifetime';

export default function SubscriptionPage() {
  const router = useRouter();
  const { user, loading } = useAuth();
  const { showToast } = useToast();
  const [step, setStep] = useState(1);
  const [selectedPlan, setSelectedPlan] = useState<PlanType>('monthly');
  const [paymentFiles, setPaymentFiles] = useState<File[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [userProfile, setUserProfile] = useState<any>(null);
  const [requests, setRequests] = useState<SubscriptionRequest[]>([]);
  const [loadingData, setLoadingData] = useState(true);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth');
    }
  }, [user, loading, router]);

  useEffect(() => {
    if (user) {
      loadUserData();
    }
  }, [user]);

  const loadUserData = async () => {
    if (!user) return;

    try {
      const profile = await getUserProfile(user.uid);
      setUserProfile(profile);

      const userRequests = await getUserSubscriptionRequests(user.uid);
      setRequests(userRequests);
    } catch (error) {
      console.error('Error loading user data:', error);
    } finally {
      setLoadingData(false);
    }
  };

  const calculateRemainingDays = () => {
    if (!userProfile) return null;

    let expiryDate: Date | null = null;

    if (userProfile.isPremiumAdminSet) {
      return 'Unlimited';
    }

    if (userProfile.premiumExpiryDate) {
      expiryDate = new Date(userProfile.premiumExpiryDate);
    } else if (userProfile.trialEndDate) {
      expiryDate = new Date(userProfile.trialEndDate);
    }

    if (!expiryDate) return null;

    const now = new Date();
    const diffTime = expiryDate.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) return 'Expired';
    if (diffDays === 0) return 'Expires today';

    return `${diffDays} days remaining`;
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);

    if (files.length + paymentFiles.length > 5) {
      showToast('You can upload up to 5 images only', 'error');
      return;
    }

    const validFiles = files.filter(file => {
      if (!file.type.startsWith('image/')) {
        showToast(`${file.name} is not an image file`, 'error');
        return false;
      }
      if (file.size > 5 * 1024 * 1024) {
        showToast(`${file.name} is larger than 5MB`, 'error');
        return false;
      }
      return true;
    });

    setPaymentFiles([...paymentFiles, ...validFiles]);
  };

  const removeFile = (index: number) => {
    setPaymentFiles(paymentFiles.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    if (paymentFiles.length === 0) {
      showToast('Please upload at least one payment proof', 'error');
      return;
    }

    if (!user) return;

    setSubmitting(true);
    try {
      const paymentProofUrls = await uploadPaymentProof(paymentFiles, user.uid);

      await createSubscriptionRequest({
        userId: user.uid,
        userEmail: user.email || '',
        userName: user.displayName || userProfile?.displayName,
        plan: selectedPlan,
        planPrice: SUBSCRIPTION_PLANS[selectedPlan].price,
        paymentProofUrls
      });

      showToast('Subscription request submitted successfully! Admin will review your payment.', 'success');

      setStep(1);
      setPaymentFiles([]);
      await loadUserData();
    } catch (error) {
      console.error('Error submitting subscription request:', error);
      showToast('Failed to submit subscription request', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading || loadingData) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const remainingDays = calculateRemainingDays();

  return (
    <div>
      <div className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Subscription Management</h1>

        {/* Account Status */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Account Status</h2>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Status:</span>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                userProfile?.isPremium ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
              }`}>
                {userProfile?.isPremium ? 'Premium' : 'Free'}
              </span>
            </div>
            {remainingDays && (
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Subscription:</span>
                <span className={`text-sm font-medium ${
                  remainingDays === 'Expired' ? 'text-red-600' :
                  remainingDays === 'Unlimited' ? 'text-green-600' : 'text-blue-600'
                }`}>
                  {remainingDays}
                </span>
              </div>
            )}
            {userProfile?.subscriptionType && (
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Plan Type:</span>
                <span className="text-sm font-medium text-gray-900">
                  {userProfile.subscriptionType === 'permanent' ? 'Lifetime' :
                   userProfile.subscriptionType === 'trial' ? 'Trial' :
                   userProfile.subscriptionType}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Upgrade Form */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold mb-6">Upgrade Your Account</h2>

          {/* Progress Steps */}
          <div className="mb-8">
            <div className="flex items-center justify-center space-x-4">
              <div className={`flex items-center ${step >= 1 ? 'text-blue-600' : 'text-gray-400'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  step >= 1 ? 'bg-blue-600 text-white' : 'bg-gray-300 text-gray-600'
                }`}>
                  1
                </div>
                <span className="ml-2 font-medium hidden sm:inline">Choose Plan</span>
              </div>
              <div className={`w-16 h-1 ${step >= 2 ? 'bg-blue-600' : 'bg-gray-300'}`}></div>
              <div className={`flex items-center ${step >= 2 ? 'text-blue-600' : 'text-gray-400'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  step >= 2 ? 'bg-blue-600 text-white' : 'bg-gray-300 text-gray-600'
                }`}>
                  2
                </div>
                <span className="ml-2 font-medium hidden sm:inline">Payment Proof</span>
              </div>
              <div className={`w-16 h-1 ${step >= 3 ? 'bg-blue-600' : 'bg-gray-300'}`}></div>
              <div className={`flex items-center ${step >= 3 ? 'text-blue-600' : 'text-gray-400'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  step >= 3 ? 'bg-blue-600 text-white' : 'bg-gray-300 text-gray-600'
                }`}>
                  3
                </div>
                <span className="ml-2 font-medium hidden sm:inline">Submit</span>
              </div>
            </div>
          </div>

          {/* Step 1: Choose Plan */}
          {step === 1 && (
            <div>
              <h3 className="text-lg font-semibold mb-4">Select Your Plan</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Object.entries(SUBSCRIPTION_PLANS).map(([key, plan]) => (
                  <div
                    key={key}
                    onClick={() => setSelectedPlan(key as PlanType)}
                    className={`border-2 rounded-lg p-6 cursor-pointer transition-all ${
                      selectedPlan === key
                        ? 'border-blue-600 bg-blue-50'
                        : 'border-gray-200 hover:border-blue-300'
                    }`}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="text-lg font-semibold">{plan.label}</h4>
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                        selectedPlan === key ? 'border-blue-600 bg-blue-600' : 'border-gray-300'
                      }`}>
                        {selectedPlan === key && (
                          <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        )}
                      </div>
                    </div>
                    <div className="text-3xl font-bold mb-2">${plan.price}</div>
                    <div className="text-gray-600">{plan.duration}</div>
                  </div>
                ))}
              </div>
              <div className="mt-6">
                <button
                  onClick={() => setStep(2)}
                  className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                >
                  Continue to Payment
                </button>
              </div>
            </div>
          )}

          {/* Step 2: Payment Details */}
          {step === 2 && (
            <div>
              <h3 className="text-lg font-semibold mb-4">Payment Details</h3>

              {/* Payment Instructions */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                <h4 className="font-semibold text-blue-900 mb-2">Payment Instructions</h4>
                <p className="text-sm text-blue-800 mb-3">
                  Please send your payment to one of the following methods:
                </p>
                <div className="space-y-2 text-sm text-blue-900">
                  <div className="bg-white rounded p-3">
                    <div className="font-semibold">GCash / PayMaya / PayPal</div>
                    <div className="text-gray-600 mt-1">Account details will be provided here by admin</div>
                  </div>
                </div>
                <p className="text-sm text-blue-800 mt-3">
                  Selected Plan: <span className="font-semibold">{SUBSCRIPTION_PLANS[selectedPlan].label}</span> - ${SUBSCRIPTION_PLANS[selectedPlan].price}
                </p>
              </div>

              {/* File Upload */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Upload Payment Proof (Up to 5 images)
                </label>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleFileChange}
                  disabled={paymentFiles.length >= 5}
                  className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 disabled:opacity-50"
                />
                <p className="text-xs text-gray-500 mt-1">Max file size: 5MB per image</p>
              </div>

              {/* File Preview */}
              {paymentFiles.length > 0 && (
                <div className="mb-6">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Selected Files ({paymentFiles.length}/5)</h4>
                  <div className="space-y-2">
                    {paymentFiles.map((file, index) => (
                      <div key={index} className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
                        <span className="text-sm text-gray-700 truncate flex-1">{file.name}</span>
                        <button
                          onClick={() => removeFile(index)}
                          className="ml-2 text-red-600 hover:text-red-800 text-sm font-medium"
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex space-x-4">
                <button
                  onClick={() => setStep(1)}
                  className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
                >
                  Back
                </button>
                <button
                  onClick={() => setStep(3)}
                  disabled={paymentFiles.length === 0}
                  className="flex-1 bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Review & Submit
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Review & Submit */}
          {step === 3 && (
            <div>
              <h3 className="text-lg font-semibold mb-4">Review Your Submission</h3>

              <div className="bg-gray-50 rounded-lg p-4 mb-6 space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Plan:</span>
                  <span className="font-semibold">{SUBSCRIPTION_PLANS[selectedPlan].label}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Amount:</span>
                  <span className="font-semibold">${SUBSCRIPTION_PLANS[selectedPlan].price}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Duration:</span>
                  <span className="font-semibold">{SUBSCRIPTION_PLANS[selectedPlan].duration}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Payment Proofs:</span>
                  <span className="font-semibold">{paymentFiles.length} file(s)</span>
                </div>
              </div>

              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
                <p className="text-sm text-yellow-800">
                  <strong>Note:</strong> Your subscription will be activated once the admin verifies your payment. This usually takes 24-48 hours.
                </p>
              </div>

              <div className="flex space-x-4">
                <button
                  onClick={() => setStep(2)}
                  disabled={submitting}
                  className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-300 transition-colors disabled:opacity-50"
                >
                  Back
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={submitting}
                  className="flex-1 bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors disabled:opacity-50"
                >
                  {submitting ? 'Submitting...' : 'Submit Request'}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Request History */}
        {requests.length > 0 && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Request History</h2>
            <div className="space-y-4">
              {requests.map((request) => (
                <div key={request.id} className="border rounded-lg p-4">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="font-semibold">{SUBSCRIPTION_PLANS[request.plan].label} - ${request.planPrice}</h3>
                      <p className="text-sm text-gray-600">
                        Submitted: {request.submittedAt?.toLocaleDateString()}
                      </p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusBadgeColor(request.status)}`}>
                      {request.status.toUpperCase()}
                    </span>
                  </div>
                  {request.notes && (
                    <div className="mt-2 text-sm text-gray-600">
                      <strong>Admin Notes:</strong> {request.notes}
                    </div>
                  )}
                  {request.reviewedAt && (
                    <p className="text-xs text-gray-500 mt-2">
                      Reviewed: {request.reviewedAt.toLocaleDateString()}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
