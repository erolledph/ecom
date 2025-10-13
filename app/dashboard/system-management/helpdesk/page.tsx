'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/useToast';
import { useRouter } from 'next/navigation';
import { isAdmin } from '@/lib/auth';
import { getAllTickets, getTicket, updateTicketStatus, addTicketReply, getTicketReplies, subscribeToTicketReplies, sendTicketNotification, markTicketAsOpened, HelpdeskTicket, TicketReply } from '@/lib/helpdesk';
import { MessageSquare, Clock, CheckCircle, XCircle, AlertCircle, ChevronLeft, Send, Filter } from 'lucide-react';
import AdminRoute from '@/components/AdminRoute';

function HelpdeskManagementContent() {
  const { user, userProfile } = useAuth();
  const { showToast } = useToast();

  const [tickets, setTickets] = useState<HelpdeskTicket[]>([]);
  const [loadingTickets, setLoadingTickets] = useState(true);
  const [selectedTicket, setSelectedTicket] = useState<HelpdeskTicket | null>(null);
  const [ticketReplies, setTicketReplies] = useState<TicketReply[]>([]);
  const [loadingReplies, setLoadingReplies] = useState(false);
  const [replyMessage, setReplyMessage] = useState('');
  const [sendingReply, setSendingReply] = useState(false);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [notificationMessage, setNotificationMessage] = useState('');
  const [showNotificationModal, setShowNotificationModal] = useState(false);
  const [sendingNotification, setSendingNotification] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  useEffect(() => {
    loadTickets();
  }, []);

  useEffect(() => {
    if (!selectedTicket) return;

    setLoadingReplies(true);
    const unsubscribe = subscribeToTicketReplies(selectedTicket.id!, (replies) => {
      setTicketReplies(replies);
      setLoadingReplies(false);
    });

    return () => unsubscribe();
  }, [selectedTicket]);

  const loadTickets = async () => {
    setLoadingTickets(true);
    try {
      const allTickets = await getAllTickets();
      setTickets(allTickets);
    } catch (error) {
      console.error('Error loading tickets:', error);
      showToast('Failed to load tickets', 'error');
    } finally {
      setLoadingTickets(false);
    }
  };

  const handleTicketClick = async (ticket: HelpdeskTicket) => {
    setSelectedTicket(ticket);

    if (ticket.id && !ticket.openedByAdmin) {
      try {
        await markTicketAsOpened(ticket.id);
      } catch (error) {
        console.error('Error marking ticket as opened:', error);
      }
    }
  };

  const handleBackToList = () => {
    setSelectedTicket(null);
    setTicketReplies([]);
    setReplyMessage('');
  };

  const handleStatusChange = async (ticketId: string, newStatus: 'open' | 'in_progress' | 'resolved' | 'closed') => {
    try {
      const ticket = tickets.find(t => t.id === ticketId) || selectedTicket;
      if (!ticket) return;

      const shouldNotify = ticket.lastNotifiedStatus !== newStatus;

      await updateTicketStatus(ticketId, newStatus, shouldNotify);

      showToast('Ticket status updated', 'success');

      if (selectedTicket && selectedTicket.id === ticketId) {
        setSelectedTicket({ ...selectedTicket, status: newStatus, lastNotifiedStatus: shouldNotify ? newStatus : selectedTicket.lastNotifiedStatus });
      }

      loadTickets();
    } catch (error) {
      console.error('Error updating ticket status:', error);
      showToast('Failed to update ticket status', 'error');
    }
  };

  const handleSendReply = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user || !userProfile || !selectedTicket || !replyMessage.trim()) {
      console.error('Missing required data:', { user: !!user, userProfile: !!userProfile, selectedTicket: !!selectedTicket, replyMessage: replyMessage.trim() });
      showToast('Missing required information to send reply', 'error');
      return;
    }

    if (!selectedTicket.id) {
      console.error('Ticket ID is missing');
      showToast('Ticket ID is missing', 'error');
      return;
    }

    setSendingReply(true);

    try {
      console.log('Sending admin reply:', {
        ticketId: selectedTicket.id,
        userId: user.uid,
        userEmail: userProfile.email,
        userName: userProfile.displayName || userProfile.email,
        isAdmin: true,
        messageLength: replyMessage.length
      });

      await addTicketReply(
        selectedTicket.id,
        user.uid,
        userProfile.email,
        userProfile.displayName || userProfile.email,
        true,
        replyMessage
      );

      console.log('Reply sent successfully');
      showToast('Reply sent successfully', 'success');
      setReplyMessage('');

      if (selectedTicket.status === 'open') {
        await handleStatusChange(selectedTicket.id, 'in_progress');
      }
    } catch (error: any) {
      console.error('Error sending reply:', error);
      console.error('Error details:', {
        message: error?.message,
        code: error?.code,
        stack: error?.stack
      });
      showToast(`Failed to send reply: ${error?.message || 'Unknown error'}`, 'error');
    } finally {
      setSendingReply(false);
    }
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

  const handleSendNotification = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTicket || !notificationMessage.trim()) return;

    setSendingNotification(true);
    try {
      await sendTicketNotification(
        selectedTicket.userId,
        selectedTicket.id!,
        selectedTicket.subject,
        notificationMessage
      );
      showToast('Notification sent to user', 'success');
      setNotificationMessage('');
      setShowNotificationModal(false);
    } catch (error) {
      console.error('Error sending notification:', error);
      showToast('Failed to send notification', 'error');
    } finally {
      setSendingNotification(false);
    }
  };

  const filteredTickets = tickets.filter(ticket => {
    if (statusFilter !== 'all' && ticket.status !== statusFilter) return false;
    if (priorityFilter !== 'all' && ticket.priority !== priorityFilter) return false;
    if (categoryFilter !== 'all' && ticket.category !== categoryFilter) return false;
    if (searchTerm) {
      const search = searchTerm.toLowerCase();
      return (
        ticket.subject.toLowerCase().includes(search) ||
        ticket.description.toLowerCase().includes(search) ||
        ticket.userName.toLowerCase().includes(search) ||
        ticket.userEmail.toLowerCase().includes(search) ||
        ticket.id?.toLowerCase().includes(search)
      );
    }
    return true;
  });

  const totalPages = Math.ceil(filteredTickets.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedTickets = filteredTickets.slice(startIndex, endIndex);

  useEffect(() => {
    setCurrentPage(1);
  }, [statusFilter, priorityFilter, categoryFilter, searchTerm, itemsPerPage]);

  const ticketStats = {
    total: tickets.length,
    open: tickets.filter(t => t.status === 'open').length,
    inProgress: tickets.filter(t => t.status === 'in_progress').length,
    resolved: tickets.filter(t => t.status === 'resolved').length,
    closed: tickets.filter(t => t.status === 'closed').length
  };

  if (selectedTicket) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-5xl">
        <button
          onClick={handleBackToList}
          className="flex items-center text-gray-600 hover:text-gray-900 mb-6"
        >
          <ChevronLeft className="w-5 h-5 mr-1" />
          Back to all tickets
        </button>

        <div className="bg-white rounded-lg shadow-md p-4 sm:p-6">
          <div className="flex flex-col gap-4 mb-6">
            <div className="flex-1">
              <div className="flex items-start gap-2 sm:gap-3 mb-2">
                {getStatusIcon(selectedTicket.status)}
                <h1 className="text-lg sm:text-2xl font-bold text-gray-900 break-words">{selectedTicket.subject}</h1>
              </div>
              <div className="flex items-center gap-2 flex-wrap mb-4">
                {getStatusBadge(selectedTicket.status)}
                {getPriorityBadge(selectedTicket.priority)}
                <span className="px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-800">
                  {selectedTicket.category.replace('_', ' ').toUpperCase()}
                </span>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="flex-1">
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
                  Change Status
                </label>
                <select
                  value={selectedTicket.status}
                  onChange={(e) => handleStatusChange(selectedTicket.id!, e.target.value as any)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
                >
                  <option value="open">Open</option>
                  <option value="in_progress">In Progress</option>
                  <option value="resolved">Resolved</option>
                  <option value="closed">Closed</option>
                </select>
              </div>
              <div className="flex-1">
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
                  Actions
                </label>
                <button
                  onClick={() => setShowNotificationModal(true)}
                  className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                >
                  Notify User
                </button>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-200 pt-4 mb-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mb-4 text-xs sm:text-sm">
              <div>
                <span className="text-gray-500">From:</span>
                <span className="ml-2 font-medium break-words">{selectedTicket.userName}</span>
              </div>
              <div>
                <span className="text-gray-500">Email:</span>
                <span className="ml-2 font-medium break-words">{selectedTicket.userEmail}</span>
              </div>
              <div>
                <span className="text-gray-500">Created:</span>
                <span className="ml-2">{selectedTicket.createdAt.toLocaleString()}</span>
              </div>
              <div>
                <span className="text-gray-500">Updated:</span>
                <span className="ml-2">{selectedTicket.updatedAt.toLocaleString()}</span>
              </div>
            </div>
            <div className="mt-4">
              <h3 className="text-xs sm:text-sm font-medium text-gray-700 mb-2">Description:</h3>
              <p className="text-gray-700 whitespace-pre-wrap bg-gray-50 p-3 sm:p-4 rounded-lg text-xs sm:text-base break-words">{selectedTicket.description}</p>
            </div>
          </div>

          <div className="border-t border-gray-200 pt-6 mb-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <MessageSquare className="w-5 h-5 mr-2" />
              Conversation ({ticketReplies.length + 1})
            </h2>

            {loadingReplies ? (
              <div className="flex justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
              </div>
            ) : (
              <div className="space-y-4 mb-6">
                <div className="p-3 sm:p-4 rounded-lg bg-gray-50 border border-gray-200">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-gray-900 text-sm sm:text-base break-words">
                        {selectedTicket.userName}
                      </span>
                      <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-gray-600 text-white">
                        TICKET CREATOR
                      </span>
                    </div>
                    <span className="text-xs text-gray-500">
                      {selectedTicket.createdAt.toLocaleString()}
                    </span>
                  </div>
                  <p className="text-gray-700 whitespace-pre-wrap text-xs sm:text-base break-words">{selectedTicket.description}</p>
                </div>
                {ticketReplies.map((reply) => (
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
                    <p className="text-gray-700 whitespace-pre-wrap text-xs sm:text-base break-words">{reply.message}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          <form onSubmit={handleSendReply} className="border-t border-gray-200 pt-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Send Reply
            </label>
            <textarea
              value={replyMessage}
              onChange={(e) => setReplyMessage(e.target.value)}
              rows={4}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent mb-3"
              placeholder="Type your reply here..."
              required
            />
            <button
              type="submit"
              disabled={sendingReply || !replyMessage.trim()}
              className="flex items-center px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send className="w-4 h-4 mr-2" />
              {sendingReply ? 'Sending...' : 'Send Reply'}
            </button>
          </form>
        </div>

        {showNotificationModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-md w-full p-4 sm:p-6 mx-4">
              <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-4">Send Notification to User</h3>
              <form onSubmit={handleSendNotification}>
                <div className="mb-4">
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
                    Notification Message
                  </label>
                  <textarea
                    value={notificationMessage}
                    onChange={(e) => setNotificationMessage(e.target.value)}
                    rows={4}
                    className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
                    placeholder="Your ticket has been updated..."
                    required
                  />
                  <p className="text-xs text-gray-500 mt-2 break-words">
                    User: {selectedTicket.userName} ({selectedTicket.userEmail})
                  </p>
                  <p className="text-xs text-gray-500 break-words">
                    Ticket: {selectedTicket.subject}
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      setShowNotificationModal(false);
                      setNotificationMessage('');
                    }}
                    className="w-full sm:w-auto px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={sendingNotification || !notificationMessage.trim()}
                    className="w-full sm:w-auto px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                  >
                    {sendingNotification ? 'Sending...' : 'Send Notification'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Helpdesk Management</h1>
        <p className="text-sm sm:text-base text-gray-600 mt-2">Manage and respond to user support tickets</p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 sm:gap-4 mb-6 sm:mb-8">
        <div className="bg-white rounded-lg shadow p-3 sm:p-4">
          <p className="text-xs sm:text-sm text-gray-600">Total Tickets</p>
          <p className="text-xl sm:text-2xl font-bold text-gray-900 mt-1">{ticketStats.total}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-3 sm:p-4">
          <p className="text-xs sm:text-sm text-gray-600">Open</p>
          <p className="text-xl sm:text-2xl font-bold text-blue-600 mt-1">{ticketStats.open}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-3 sm:p-4">
          <p className="text-xs sm:text-sm text-gray-600">In Progress</p>
          <p className="text-xl sm:text-2xl font-bold text-yellow-600 mt-1">{ticketStats.inProgress}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-3 sm:p-4">
          <p className="text-xs sm:text-sm text-gray-600">Resolved</p>
          <p className="text-xl sm:text-2xl font-bold text-green-600 mt-1">{ticketStats.resolved}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-3 sm:p-4 col-span-2 sm:col-span-1">
          <p className="text-xs sm:text-sm text-gray-600">Closed</p>
          <p className="text-xl sm:text-2xl font-bold text-gray-600 mt-1">{ticketStats.closed}</p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md mb-6">
        <div className="p-3 sm:p-4 border-b border-gray-200">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-3 sm:mb-4">All Tickets</h2>

          <div className="flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center gap-3">
            <div className="flex-1 min-w-full sm:min-w-[200px]">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search tickets..."
                className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-xs sm:text-sm"
              />
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              <Filter className="w-4 h-4 text-gray-500 hidden sm:inline" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="flex-1 sm:flex-none px-2 sm:px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-xs sm:text-sm"
              >
                <option value="all">All Status</option>
                <option value="open">Open</option>
                <option value="in_progress">In Progress</option>
                <option value="resolved">Resolved</option>
                <option value="closed">Closed</option>
              </select>

              <select
                value={priorityFilter}
                onChange={(e) => setPriorityFilter(e.target.value)}
                className="flex-1 sm:flex-none px-2 sm:px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-xs sm:text-sm"
              >
                <option value="all">All Priorities</option>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>

              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="flex-1 sm:flex-none px-2 sm:px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-xs sm:text-sm"
              >
                <option value="all">All Categories</option>
                <option value="technical">Technical</option>
                <option value="billing">Billing</option>
                <option value="feature_request">Feature Request</option>
                <option value="general">General</option>
              </select>
            </div>
          </div>

          <div className="mt-3 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3 flex-wrap">
              {(searchTerm || statusFilter !== 'all' || priorityFilter !== 'all' || categoryFilter !== 'all') && (
                <>
                  <span className="text-xs sm:text-sm text-gray-600">
                    Showing {filteredTickets.length} of {tickets.length} tickets
                  </span>
                  <button
                    onClick={() => {
                      setSearchTerm('');
                      setStatusFilter('all');
                      setPriorityFilter('all');
                      setCategoryFilter('all');
                    }}
                    className="text-xs sm:text-sm text-primary-600 hover:text-primary-700 underline"
                  >
                    Clear filters
                  </button>
                </>
              )}
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs sm:text-sm text-gray-600">Per page:</span>
              <select
                value={itemsPerPage}
                onChange={(e) => setItemsPerPage(Number(e.target.value))}
                className="px-2 py-1 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-xs sm:text-sm"
              >
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={25}>25</option>
                <option value={50}>50</option>
                <option value={100}>100</option>
              </select>
            </div>
          </div>
        </div>

        {loadingTickets ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
          </div>
        ) : paginatedTickets.length === 0 ? (
          <div className="text-center py-12">
            <MessageSquare className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">No tickets found</p>
          </div>
        ) : (
          <div>
            <div className="divide-y divide-gray-200">
              {paginatedTickets.map((ticket) => (
              <button
                key={ticket.id}
                onClick={() => handleTicketClick(ticket)}
                className="w-full p-4 sm:p-6 text-left hover:bg-gray-50 transition-colors relative"
              >
                {!ticket.openedByAdmin && (
                  <div className="absolute top-3 sm:top-4 right-3 sm:right-4">
                    <span className="inline-flex items-center px-2 py-1 text-xs font-bold rounded-full bg-red-500 text-white animate-pulse">
                      NEW
                    </span>
                  </div>
                )}
                <div className="flex flex-col sm:flex-row items-start justify-between gap-3">
                  <div className="flex-1 min-w-0 pr-12 sm:pr-0">
                    <div className="flex items-start gap-2 sm:gap-3 mb-2">
                      {getStatusIcon(ticket.status)}
                      <h3 className="text-base sm:text-lg font-semibold text-gray-900 break-words">{ticket.subject}</h3>
                    </div>
                    <p className="text-xs sm:text-sm text-gray-600 mb-2 break-words">
                      From: <span className="font-medium">{ticket.userName}</span> ({ticket.userEmail})
                    </p>
                    <p className="text-gray-600 text-xs sm:text-sm line-clamp-2 mb-3">
                      {ticket.description}
                    </p>
                    <div className="flex items-center gap-2 flex-wrap">
                      {getStatusBadge(ticket.status)}
                      {getPriorityBadge(ticket.priority)}
                      <span className="px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-800">
                        {ticket.category.replace('_', ' ').toUpperCase()}
                      </span>
                    </div>
                  </div>
                  <div className="text-left sm:text-right sm:ml-4 w-full sm:w-auto">
                    <p className="text-xs text-gray-500 mb-1">
                      {ticket.createdAt.toLocaleDateString()}
                    </p>
                    <p className="text-xs text-gray-400 mb-2">
                      {ticket.createdAt.toLocaleTimeString()}
                    </p>
                    <p className="text-xs text-gray-500 font-mono bg-gray-100 px-2 py-1 rounded inline-block">
                      #{ticket.id?.slice(-6).toUpperCase()}
                    </p>
                  </div>
                </div>
              </button>
              ))}
            </div>

            {totalPages > 1 && (
              <div className="p-4 border-t border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="text-xs sm:text-sm text-gray-600">
                  Showing {startIndex + 1} to {Math.min(endIndex, filteredTickets.length)} of {filteredTickets.length} tickets
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

export default function HelpdeskManagementPage() {
  return (
    <AdminRoute>
      <HelpdeskManagementContent />
    </AdminRoute>
  );
}
