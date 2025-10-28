'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import AdminRoute from '@/components/AdminRoute';
import { useToast } from '@/hooks/useToast';
import { getSubscriptionRequests, updateSubscriptionRequestStatus, SubscriptionRequest, SUBSCRIPTION_PLANS, sendSubscriptionNotification } from '@/lib/subscriptions';
import { grantPremiumAccess } from '@/lib/auth';
import ConfirmModal from '@/components/ConfirmModal';

export default function SubscriptionRequestsPage() {
  const router = useRouter();
  const { user } = useAuth();
  const { showToast } = useToast();
  const [requests, setRequests] = useState<SubscriptionRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('pending');
  const [selectedRequest, setSelectedRequest] = useState<SubscriptionRequest | null>(null);
  const [showImageModal, setShowImageModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState('');
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [confirmAction, setConfirmAction] = useState<{ type: 'approve' | 'reject'; request: SubscriptionRequest } | null>(null);
  const [actionNotes, setActionNotes] = useState('');
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    loadRequests();
  }, [filter]);

  const loadRequests = async () => {
    setLoading(true);
    try {
      const fetchedRequests = filter === 'all'
        ? await getSubscriptionRequests()
        : await getSubscriptionRequests(filter as 'pending' | 'approved' | 'rejected');
      setRequests(fetchedRequests);
    } catch (error) {
      console.error('Error loading subscription requests:', error);
      showToast('Failed to load subscription requests', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = (request: SubscriptionRequest) => {
    setConfirmAction({ type: 'approve', request });
    setActionNotes('');
    setShowConfirmModal(true);
  };

  const handleReject = (request: SubscriptionRequest) => {
    setConfirmAction({ type: 'reject', request });
    setActionNotes('');
    setShowConfirmModal(true);
  };

  const confirmActionHandler = async () => {
    if (!confirmAction || !user) return;

    setProcessing(true);
    try {
      const { type, request } = confirmAction;

      await updateSubscriptionRequestStatus(
        request.id!,
        type === 'approve' ? 'approved' : 'rejected',
        user.uid,
        actionNotes
      );

      if (type === 'approve') {
        let subscriptionType: 'permanent' | '1month' | '3months' | '1year' = '1month';

        switch (request.plan) {
          case 'monthly':
            subscriptionType = '1month';
            break;
          case 'quarterly':
            subscriptionType = '3months';
            break;
          case 'yearly':
            subscriptionType = '1year';
            break;
          case 'lifetime':
            subscriptionType = 'permanent';
            break;
        }

        await grantPremiumAccess(request.userId, subscriptionType, user.uid);
      }

      await sendSubscriptionNotification(
        request.userId,
        type === 'approve' ? 'approved' : 'rejected',
        request.plan,
        actionNotes
      );

      showToast(
        type === 'approve'
          ? 'Subscription request approved successfully'
          : 'Subscription request rejected',
        'success'
      );

      setShowConfirmModal(false);
      setConfirmAction(null);
      setActionNotes('');
      await loadRequests();
    } catch (error) {
      console.error('Error processing request:', error);
      showToast('Failed to process request', 'error');
    } finally {
      setProcessing(false);
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

  return (
    <AdminRoute>
      <div>
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="mb-6">
            <h1 className="text-3xl font-bold mb-2">Subscription Requests</h1>
            <p className="text-gray-600">Review and verify user subscription payment proofs</p>
          </div>

          {/* Filter Tabs */}
          <div className="bg-white rounded-lg shadow-md mb-6">
            <div className="border-b border-gray-200">
              <nav className="flex -mb-px">
                <button
                  onClick={() => setFilter('pending')}
                  className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
                    filter === 'pending'
                      ? 'border-blue-600 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  Pending
                </button>
                <button
                  onClick={() => setFilter('approved')}
                  className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
                    filter === 'approved'
                      ? 'border-blue-600 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  Approved
                </button>
                <button
                  onClick={() => setFilter('rejected')}
                  className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
                    filter === 'rejected'
                      ? 'border-blue-600 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  Rejected
                </button>
                <button
                  onClick={() => setFilter('all')}
                  className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
                    filter === 'all'
                      ? 'border-blue-600 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  All
                </button>
              </nav>
            </div>
          </div>

          {/* Requests List */}
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
          ) : requests.length === 0 ? (
            <div className="bg-white rounded-lg shadow-md p-12 text-center">
              <p className="text-gray-500">No subscription requests found</p>
            </div>
          ) : (
            <div className="space-y-4">
              {requests.map((request) => (
                <div key={request.id} className="bg-white rounded-lg shadow-md p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-lg font-semibold">{request.userName || 'Unknown User'}</h3>
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusBadgeColor(request.status)}`}>
                          {request.status.toUpperCase()}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600">{request.userEmail}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <p className="text-sm text-gray-600">Plan</p>
                      <p className="font-semibold">{SUBSCRIPTION_PLANS[request.plan].label}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Amount</p>
                      <p className="font-semibold">${request.planPrice}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Duration</p>
                      <p className="font-semibold">{SUBSCRIPTION_PLANS[request.plan].duration}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Submitted</p>
                      <p className="font-semibold">{request.submittedAt?.toLocaleDateString()}</p>
                    </div>
                  </div>

                  {/* Payment Proof Images */}
                  <div className="mb-4">
                    <p className="text-sm text-gray-600 mb-2">Payment Proof ({request.paymentProofUrls.length})</p>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2">
                      {request.paymentProofUrls.map((url, index) => (
                        <div
                          key={index}
                          onClick={() => {
                            setSelectedImage(url);
                            setShowImageModal(true);
                          }}
                          className="relative aspect-square cursor-pointer rounded-lg overflow-hidden border border-gray-200 hover:border-blue-400 transition-colors"
                        >
                          <img
                            src={url}
                            alt={`Payment proof ${index + 1}`}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ))}
                    </div>
                  </div>

                  {request.notes && (
                    <div className="bg-gray-50 rounded-lg p-3 mb-4">
                      <p className="text-sm text-gray-600 mb-1">Admin Notes:</p>
                      <p className="text-sm">{request.notes}</p>
                    </div>
                  )}

                  {request.reviewedAt && (
                    <p className="text-xs text-gray-500 mb-4">
                      Reviewed: {request.reviewedAt.toLocaleDateString()}
                    </p>
                  )}

                  {request.status === 'pending' && (
                    <div className="flex space-x-3">
                      <button
                        onClick={() => handleApprove(request)}
                        className="flex-1 bg-green-600 text-white py-2 rounded-lg font-semibold hover:bg-green-700 transition-colors"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => handleReject(request)}
                        className="flex-1 bg-red-600 text-white py-2 rounded-lg font-semibold hover:bg-red-700 transition-colors"
                      >
                        Reject
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Image Modal */}
      {showImageModal && (
        <div
          className="fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center p-4"
          onClick={() => setShowImageModal(false)}
        >
          <div className="max-w-4xl max-h-full">
            <img
              src={selectedImage}
              alt="Payment proof"
              className="max-w-full max-h-[90vh] object-contain"
            />
          </div>
        </div>
      )}

      {/* Confirm Modal */}
      {showConfirmModal && confirmAction && (
        <ConfirmModal
          isOpen={showConfirmModal}
          onClose={() => {
            setShowConfirmModal(false);
            setConfirmAction(null);
            setActionNotes('');
          }}
          onConfirm={confirmActionHandler}
          title={confirmAction.type === 'approve' ? 'Approve Subscription Request' : 'Reject Subscription Request'}
          message={
            confirmAction.type === 'approve'
              ? `Are you sure you want to approve this ${SUBSCRIPTION_PLANS[confirmAction.request.plan].label} subscription for ${confirmAction.request.userEmail}?`
              : `Are you sure you want to reject this subscription request from ${confirmAction.request.userEmail}?`
          }
          confirmText={confirmAction.type === 'approve' ? 'Approve' : 'Reject'}
          confirmButtonClass={confirmAction.type === 'approve' ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'}
          isProcessing={processing}
        >
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Notes (Optional)
            </label>
            <textarea
              value={actionNotes}
              onChange={(e) => setActionNotes(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={3}
              placeholder="Add notes for the user..."
            />
          </div>
        </ConfirmModal>
      )}
    </AdminRoute>
  );
}
