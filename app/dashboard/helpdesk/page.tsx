'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/useToast';
import { useRouter } from 'next/navigation';
import { isPremium, isAdmin } from '@/lib/auth';
import { createTicket, getUserTickets, subscribeToUserTickets, getTicket, getTicketReplies, subscribeToTicketReplies, HelpdeskTicket, TicketReply, clearTicketNotifications } from '@/lib/helpdesk';
import PremiumFeatureGate from '@/components/PremiumFeatureGate';
import { Plus, MessageSquare, Clock, CheckCircle, XCircle, AlertCircle, ChevronLeft, Crown, Lock, RefreshCw } from 'lucide-react';

export default function HelpdeskPage() {
  const { user, userProfile, loading } = useAuth();
  const { showToast } = useToast();
  const router = useRouter();

  const [tickets, setTickets] = useState<HelpdeskTicket[]>([]);
  const [loadingTickets, setLoadingTickets] = useState(true);
  const [showNewTicketForm, setShowNewTicketForm] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState<HelpdeskTicket | null>(null);
  const [ticketReplies, setTicketReplies] = useState<TicketReply[]>([]);
  const [loadingReplies, setLoadingReplies] = useState(false);
  const [subscriptionError, setSubscriptionError] = useState(false);

  const [formData, setFormData] = useState({
    subject: '',
    category: 'general' as 'technical' | 'billing' | 'feature_request' | 'general',
    priority: 'medium' as 'low' | 'medium' | 'high',
    description: ''
  });

  const [submitting, setSubmitting] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const loadTicketsManually = async () => {
    if (!user) return;

    setLoadingTickets(true);
    setSubscriptionError(false);
    try {
      const userTickets = await getUserTickets(user.uid);
      setTickets(userTickets);
    } catch (error) {
      console.error('Error loading tickets:', error);
      showToast('Failed to load tickets. Please try again.', 'error');
      setSubscriptionError(true);
    } finally {
      setLoadingTickets(false);
    }
  };

  useEffect(() => {
    if (loading) return;

    if (!user || !userProfile) {
      router.push('/auth');
      return;
    }

    setLoadingTickets(true);
    setSubscriptionError(false);

    // Set a timeout to prevent infinite spinner
    const timeoutId = setTimeout(() => {
      console.warn('Subscription timeout - falling back to manual load');
      setSubscriptionError(true);
      loadTicketsManually();
    }, 5000);

    try {
      const unsubscribe = subscribeToUserTickets(user.uid, (userTickets) => {
        clearTimeout(timeoutId);
        setTickets(userTickets);
        setLoadingTickets(false);
        setSubscriptionError(false);
      });

      return () => {
        clearTimeout(timeoutId);
        unsubscribe();
      };
    } catch (error) {
      console.error('Error setting up subscription:', error);
      clearTimeout(timeoutId);
      loadTicketsManually();
    }
  }, [user, userProfile, loading, router]);

  useEffect(() => {
    if (!selectedTicket) return;

    setLoadingReplies(true);
    const unsubscribe = subscribeToTicketReplies(selectedTicket.id!, (replies) => {
      setTicketReplies(replies);
      setLoadingReplies(false);
    });

    return () => unsubscribe();
  }, [selectedTicket]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user || !userProfile) return;

    if (!formData.subject.trim() || !formData.description.trim()) {
      showToast('Please fill in all required fields', 'error');
      return;
    }

    setSubmitting(true);

    try {
      await createTicket(
        user.uid,
        userProfile.email,
        userProfile.displayName || userProfile.email,
        formData.subject,
        formData.category,
        formData.priority,
        formData.description
      );

      showToast('Support ticket created successfully', 'success');
      setFormData({
        subject: '',
        category: 'general',
        priority: 'medium',
        description: ''
      });
      setShowNewTicketForm(false);
      setCurrentPage(1);
    } catch (error) {
      console.error('Error creating ticket:', error);
      showToast('Failed to create ticket', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleTicketClick = async (ticket: HelpdeskTicket) => {
    setSelectedTicket(ticket);

    if (user && ticket.id) {
      try {
        await clearTicketNotifications(ticket.id, user.uid);
      } catch (error) {
        console.error('Error clearing notifications:', error);
      }
    }
  };

  const handleBackToList = () => {
    setSelectedTicket(null);
    setTicketReplies([]);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'open':
        return <AlertCircle className="w-5 h-5 text-blue-500" />;
      case 'in_progress':
        return <Clock className="w-5 h-5 text-yellow-500" />;
      case 'resolved':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'closed':
        return <XCircle className="w-5 h-5 text-gray-500" />;
      default:
        return <AlertCircle className="w-5 h-5 text-gray-500" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const styles = {
      open: 'bg-blue-100 text-blue-800',
      in_progress: 'bg-yellow-100 text-yellow-800',
      resolved: 'bg-green-100 text-green-800',
      closed: 'bg-gray-100 text-gray-800'
    };

    return (
      <span className={`px-2 py-1 text-xs font-medium rounded-full ${styles[status as keyof typeof styles]}`}>
        {status.replace('_', ' ').toUpperCase()}
      </span>
    );
  };

  const getPriorityBadge = (priority: string) => {
    const styles = {
      low: 'bg-gray-100 text-gray-800',
      medium: 'bg-blue-100 text-blue-800',
      high: 'bg-red-100 text-red-800'
    };

    return (
      <span className={`px-2 py-1 text-xs font-medium rounded-full ${styles[priority as keyof typeof styles]}`}>
        {priority.toUpperCase()}
      </span>
    );
  };

  const totalPages = Math.ceil(tickets.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedTickets = tickets.slice(startIndex, endIndex);;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!userProfile?.isPremiumAdminSet && !isAdmin(userProfile)) {
    return (
      <div className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-lg border border-yellow-200 p-8 text-center max-w-2xl mx-auto mt-12">
        <div className="w-20 h-20 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-6 text-white">
          <Crown className="w-10 h-10" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-3">Premium Feature: Help Desk</h2>
        <p className="text-gray-700 mb-6">
          Access our dedicated support helpdesk with this premium feature. Submit tickets and get help from our support team.
        </p>
        <div className="bg-white rounded-lg p-4 border border-yellow-300 mb-6">
          <p className="text-gray-800 font-medium">
            Upgrade to premium to access the helpdesk and get priority support.
          </p>
        </div>
      </div>
    );
  }

  if (selectedTicket) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <button
          onClick={handleBackToList}
          className="flex items-center text-gray-600 hover:text-gray-900 mb-6"
        >
          <ChevronLeft className="w-5 h-5 mr-1" />
          Back to tickets
        </button>

        <div className="bg-white rounded-lg shadow-md p-4 sm:p-6">
          <div className="flex flex-col gap-4 mb-6">
            <div className="flex-1">
              <div className="flex items-start gap-2 sm:gap-3 mb-2">
                {getStatusIcon(selectedTicket.status)}
                <h1 className="text-lg sm:text-2xl font-bold text-gray-900 break-words">{selectedTicket.subject}</h1>
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                {getStatusBadge(selectedTicket.status)}
                {getPriorityBadge(selectedTicket.priority)}
                <span className="px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-800">
                  {selectedTicket.category.replace('_', ' ').toUpperCase()}
                </span>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-200 pt-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <MessageSquare className="w-5 h-5 mr-2" />
              Conversation ({ticketReplies.length + 1})
            </h2>

            {loadingReplies ? (
              <div className="flex justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="p-3 sm:p-4 rounded-lg bg-gray-50 border border-gray-200">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-gray-900 text-sm sm:text-base break-words">
                        {selectedTicket.userName}
                      </span>
                      <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-gray-600 text-white">
                        YOU
                      </span>
                    </div>
                    <span className="text-xs text-gray-500">
                      {selectedTicket.createdAt.toLocaleString()}
                    </span>
                  </div>
                  <p className="text-gray-700 whitespace-pre-wrap text-sm sm:text-base break-words">{selectedTicket.description}</p>
                </div>
                {ticketReplies.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">
                    No replies yet. Our support team will respond soon.
                  </p>
                ) : (
                  ticketReplies.map((reply) => (
                    <div
                      key={reply.id}
                      className={`p-3 sm:p-4 rounded-lg ${
                        reply.isAdmin
                          ? 'bg-primary-50 border border-primary-200'
                          : 'bg-gray-50 border border-gray-200'
                      }`}
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-2">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-gray-900 text-sm sm:text-base break-words">
                            {reply.userName}
                          </span>
                          {reply.isAdmin && (
                            <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-primary-600 text-white">
                              ADMIN
                            </span>
                          )}
                        </div>
                        <span className="text-xs text-gray-500 whitespace-nowrap">
                          {reply.createdAt.toLocaleString()}
                        </span>
                      </div>
                      <p className="text-gray-700 whitespace-pre-wrap text-sm sm:text-base break-words">{reply.message}</p>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Help Desk</h1>
          <p className="text-gray-600 mt-2">Submit and track your support tickets</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={loadTicketsManually}
            disabled={loadingTickets}
            className="flex items-center px-3 sm:px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
          >
            <RefreshCw className={`w-4 h-4 sm:w-5 sm:h-5 sm:mr-2 ${loadingTickets ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline">Refresh</span>
          </button>
          <button
            onClick={() => setShowNewTicketForm(!showNewTicketForm)}
            className="flex items-center px-3 sm:px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors text-sm sm:text-base"
          >
            <Plus className="w-4 h-4 sm:w-5 sm:h-5 mr-1 sm:mr-2" />
            New Ticket
          </button>
        </div>
      </div>

      {subscriptionError && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-8">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-yellow-600" />
            <p className="text-yellow-800">
              Real-time updates are temporarily unavailable. Click the Refresh button to manually update your tickets.
            </p>
          </div>
        </div>
      )}

      {showNewTicketForm && (
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Create New Ticket</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Subject *
              </label>
              <input
                type="text"
                value={formData.subject}
                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="Brief description of your issue"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category *
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value as any })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  <option value="general">General</option>
                  <option value="technical">Technical</option>
                  <option value="billing">Billing</option>
                  <option value="feature_request">Feature Request</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Priority *
                </label>
                <select
                  value={formData.priority}
                  onChange={(e) => setFormData({ ...formData, priority: e.target.value as any })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description *
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={6}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="Provide detailed information about your issue..."
                required
              />
            </div>

            <div className="flex gap-3">
              <button
                type="submit"
                disabled={submitting}
                className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting ? 'Submitting...' : 'Submit Ticket'}
              </button>
              <button
                type="button"
                onClick={() => setShowNewTicketForm(false)}
                className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="p-4 sm:p-6 border-b border-gray-200 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-900">Your Tickets</h2>
          {tickets.length > 0 && (
            <div className="flex items-center gap-2">
              <span className="text-xs sm:text-sm text-gray-600">Per page:</span>
              <select
                value={itemsPerPage}
                onChange={(e) => {
                  setItemsPerPage(Number(e.target.value));
                  setCurrentPage(1);
                }}
                className="px-2 py-1 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-xs sm:text-sm"
              >
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={25}>25</option>
                <option value={50}>50</option>
                <option value={100}>100</option>
              </select>
            </div>
          )}
        </div>

        {loadingTickets ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
          </div>
        ) : paginatedTickets.length === 0 && tickets.length === 0 ? (
          <div className="text-center py-12">
            <MessageSquare className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">No tickets yet</p>
            <p className="text-gray-400 mt-2">Create a ticket to get support from our team</p>
          </div>
        ) : (
          <div>
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Subject
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Priority
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Created
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Admin Reply
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {paginatedTickets.map((ticket) => (
                  <tr
                    key={ticket.id}
                    onClick={() => handleTicketClick(ticket)}
                    className="hover:bg-gray-50 cursor-pointer transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        {getStatusIcon(ticket.status)}
                        <div>
                          <div className="text-sm font-medium text-gray-900">{ticket.subject}</div>
                          <div className="text-xs text-gray-500 line-clamp-1">{ticket.description}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-800">
                        {ticket.category.replace('_', ' ').toUpperCase()}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getPriorityBadge(ticket.priority)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(ticket.status)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div>{ticket.createdAt.toLocaleDateString()}</div>
                      <div className="text-xs text-gray-400">{ticket.createdAt.toLocaleTimeString()}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {ticket.hasAdminReply ? (
                        <span className="inline-flex items-center px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">
                          <CheckCircle className="w-3 h-3 mr-1" />
                          Yes
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-500">
                          <Clock className="w-3 h-3 mr-1" />
                          Waiting
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
              </table>
            </div>
            <div className="md:hidden divide-y divide-gray-200">
              {paginatedTickets.map((ticket) => (
                <div
                  key={ticket.id}
                  onClick={() => handleTicketClick(ticket)}
                  className="p-4 hover:bg-gray-50 cursor-pointer transition-colors"
                >
                  <div className="flex items-start gap-2 mb-2">
                    {getStatusIcon(ticket.status)}
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-medium text-gray-900 break-words">{ticket.subject}</h3>
                      <p className="text-xs text-gray-500 line-clamp-2 mt-1">{ticket.description}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 flex-wrap mt-2">
                    {getStatusBadge(ticket.status)}
                    {getPriorityBadge(ticket.priority)}
                    <span className="px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-800">
                      {ticket.category.replace('_', ' ').toUpperCase()}
                    </span>
                  </div>
                  <div className="flex items-center justify-between mt-3 text-xs text-gray-500">
                    <span>{ticket.createdAt.toLocaleDateString()}</span>
                    {ticket.hasAdminReply ? (
                      <span className="inline-flex items-center px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Admin replied
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-500">
                        <Clock className="w-3 h-3 mr-1" />
                        Waiting
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {totalPages > 1 && (
              <div className="p-4 border-t border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="text-xs sm:text-sm text-gray-600">
                  Showing {startIndex + 1} to {Math.min(endIndex, tickets.length)} of {tickets.length} tickets
                </div>
                <div className="flex items-center gap-1 sm:gap-2 flex-wrap justify-center">
                  <button
                    onClick={() => setCurrentPage(1)}
                    disabled={currentPage === 1}
                    className="px-2 sm:px-3 py-1 text-xs sm:text-sm border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    First
                  </button>
                  <button
                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                    disabled={currentPage === 1}
                    className="px-2 sm:px-3 py-1 text-xs sm:text-sm border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    Prev
                  </button>
                  <div className="flex items-center gap-1">
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      let pageNum;
                      if (totalPages <= 5) {
                        pageNum = i + 1;
                      } else if (currentPage <= 3) {
                        pageNum = i + 1;
                      } else if (currentPage >= totalPages - 2) {
                        pageNum = totalPages - 4 + i;
                      } else {
                        pageNum = currentPage - 2 + i;
                      }
                      return (
                        <button
                          key={pageNum}
                          onClick={() => setCurrentPage(pageNum)}
                          className={`px-2 sm:px-3 py-1 text-xs sm:text-sm border rounded-lg transition-colors ${
                            currentPage === pageNum
                              ? 'bg-primary-600 text-white border-primary-600'
                              : 'border-gray-300 hover:bg-gray-50'
                          }`}
                        >
                          {pageNum}
                        </button>
                      );
                    })}
                  </div>
                  <button
                    onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                    disabled={currentPage === totalPages}
                    className="px-2 sm:px-3 py-1 text-xs sm:text-sm border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    Next
                  </button>
                  <button
                    onClick={() => setCurrentPage(totalPages)}
                    disabled={currentPage === totalPages}
                    className="px-2 sm:px-3 py-1 text-xs sm:text-sm border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    Last
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
