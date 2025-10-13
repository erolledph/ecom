import {
  collection,
  addDoc,
  updateDoc,
  doc,
  query,
  where,
  orderBy,
  getDocs,
  getDoc,
  onSnapshot,
  Timestamp,
  serverTimestamp,
  QuerySnapshot,
  DocumentData
} from 'firebase/firestore';
import { db } from './firebase';

export interface HelpdeskTicket {
  id?: string;
  userId: string;
  userEmail: string;
  userName: string;
  subject: string;
  category: 'technical' | 'billing' | 'feature_request' | 'general';
  priority: 'low' | 'medium' | 'high';
  description: string;
  status: 'open' | 'in_progress' | 'resolved' | 'closed';
  createdAt: Date;
  updatedAt: Date;
  openedByAdmin?: boolean;
  lastNotifiedStatus?: string;
  hasAdminReply?: boolean;
  hasUnreadReplies?: boolean;
}

export interface TicketReply {
  id?: string;
  ticketId: string;
  userId: string;
  userEmail: string;
  userName: string;
  isAdmin: boolean;
  message: string;
  createdAt: Date;
}

export interface TicketNotification {
  id?: string;
  userId: string;
  ticketId: string;
  subject: string;
  message: string;
  read: boolean;
  isRead?: boolean;
  createdAt: Date;
}

const convertTimestamp = (timestamp: any): Date => {
  if (!timestamp) return new Date();
  if (timestamp instanceof Date) return timestamp;
  if (timestamp.toDate) return timestamp.toDate();
  if (timestamp.seconds) return new Date(timestamp.seconds * 1000);
  return new Date();
};

export const createTicket = async (
  userId: string,
  userEmail: string,
  userName: string,
  subject: string,
  category: 'technical' | 'billing' | 'feature_request' | 'general',
  priority: 'low' | 'medium' | 'high',
  description: string
): Promise<string> => {
  try {
    const ticketData = {
      userId,
      userEmail,
      userName,
      subject,
      category,
      priority,
      description,
      status: 'open' as const,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      openedByAdmin: false,
      lastNotifiedStatus: null,
      hasAdminReply: false
    };

    const docRef = await addDoc(collection(db, 'helpdesk_tickets'), ticketData);
    return docRef.id;
  } catch (error) {
    console.error('Error creating ticket:', error);
    throw error;
  }
};

export const getUserTickets = async (userId: string): Promise<HelpdeskTicket[]> => {
  try {
    const q = query(
      collection(db, 'helpdesk_tickets'),
      where('userId', '==', userId),
      orderBy('createdAt', 'desc')
    );

    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: convertTimestamp(doc.data().createdAt),
      updatedAt: convertTimestamp(doc.data().updatedAt)
    } as HelpdeskTicket));
  } catch (error) {
    console.error('Error getting user tickets:', error);
    throw error;
  }
};

export const getAllTickets = async (): Promise<HelpdeskTicket[]> => {
  try {
    const q = query(
      collection(db, 'helpdesk_tickets'),
      orderBy('createdAt', 'desc')
    );

    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: convertTimestamp(doc.data().createdAt),
      updatedAt: convertTimestamp(doc.data().updatedAt)
    } as HelpdeskTicket));
  } catch (error) {
    console.error('Error getting all tickets:', error);
    throw error;
  }
};

export const getTicket = async (ticketId: string): Promise<HelpdeskTicket | null> => {
  try {
    const docRef = doc(db, 'helpdesk_tickets', ticketId);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
      return null;
    }

    return {
      id: docSnap.id,
      ...docSnap.data(),
      createdAt: convertTimestamp(docSnap.data().createdAt),
      updatedAt: convertTimestamp(docSnap.data().updatedAt)
    } as HelpdeskTicket;
  } catch (error) {
    console.error('Error getting ticket:', error);
    throw error;
  }
};

export const subscribeToUserTickets = (
  userId: string,
  callback: (tickets: HelpdeskTicket[]) => void
): (() => void) => {
  try {
    const q = query(
      collection(db, 'helpdesk_tickets'),
      where('userId', '==', userId),
      orderBy('createdAt', 'desc')
    );

    return onSnapshot(q, (snapshot) => {
      const tickets = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: convertTimestamp(doc.data().createdAt),
        updatedAt: convertTimestamp(doc.data().updatedAt)
      } as HelpdeskTicket));
      callback(tickets);
    });
  } catch (error) {
    console.error('Error subscribing to user tickets:', error);
    throw error;
  }
};

export const updateTicketStatus = async (
  ticketId: string,
  status: 'open' | 'in_progress' | 'resolved' | 'closed',
  notifyUser: boolean = true
): Promise<void> => {
  try {
    const ticketRef = doc(db, 'helpdesk_tickets', ticketId);
    const ticketDoc = await getDoc(ticketRef);

    if (!ticketDoc.exists()) {
      throw new Error('Ticket not found');
    }

    const ticketData = ticketDoc.data();
    const currentStatus = ticketData.lastNotifiedStatus;

    const updateData: any = {
      status,
      updatedAt: serverTimestamp()
    };

    if (notifyUser && currentStatus !== status) {
      updateData.lastNotifiedStatus = status;

      let statusMessage = '';
      switch (status) {
        case 'open':
          statusMessage = 'reopened';
          break;
        case 'in_progress':
          statusMessage = 'is now being reviewed by our team';
          break;
        case 'resolved':
          statusMessage = 'has been resolved';
          break;
        case 'closed':
          statusMessage = 'has been closed';
          break;
      }

      await sendTicketNotification(
        ticketData.userId,
        ticketId,
        ticketData.subject,
        `Your ticket ${statusMessage}`
      );
    }

    await updateDoc(ticketRef, updateData);
  } catch (error) {
    console.error('Error updating ticket status:', error);
    throw error;
  }
};

export const markTicketAsOpened = async (ticketId: string): Promise<void> => {
  try {
    const ticketRef = doc(db, 'helpdesk_tickets', ticketId);
    const ticketDoc = await getDoc(ticketRef);

    if (!ticketDoc.exists()) {
      throw new Error('Ticket not found');
    }

    const ticketData = ticketDoc.data();

    if (!ticketData.openedByAdmin) {
      await updateDoc(ticketRef, {
        openedByAdmin: true,
        updatedAt: serverTimestamp()
      });

      await sendTicketNotification(
        ticketData.userId,
        ticketId,
        ticketData.subject,
        'Your ticket is now being reviewed by our support team'
      );
    }
  } catch (error) {
    console.error('Error marking ticket as opened:', error);
    throw error;
  }
};

export const addTicketReply = async (
  ticketId: string,
  userId: string,
  userEmail: string,
  userName: string,
  isAdmin: boolean,
  message: string
): Promise<void> => {
  try {
    console.log('addTicketReply called with:', {
      ticketId,
      userId,
      userEmail,
      userName,
      isAdmin,
      messageLength: message.length
    });

    if (!ticketId) {
      throw new Error('Ticket ID is required');
    }

    if (!userId || !userEmail || !userName) {
      throw new Error('User information is required');
    }

    if (!message || !message.trim()) {
      throw new Error('Message is required');
    }

    const replyData = {
      ticketId,
      userId,
      userEmail,
      userName,
      isAdmin,
      message,
      createdAt: serverTimestamp()
    };

    console.log('Adding reply to Firestore...');
    const docRef = await addDoc(collection(db, 'helpdesk_replies'), replyData);
    console.log('Reply added to Firestore with ID:', docRef.id);

    const ticketRef = doc(db, 'helpdesk_tickets', ticketId);
    const updateData: any = {
      updatedAt: serverTimestamp()
    };

    if (isAdmin) {
      updateData.hasAdminReply = true;

      console.log('Fetching ticket data for notification...');
      const ticketDoc = await getDoc(ticketRef);
      if (ticketDoc.exists()) {
        const ticketData = ticketDoc.data();
        console.log('Sending notification to user:', ticketData.userId);
        await sendTicketNotification(
          ticketData.userId,
          ticketId,
          ticketData.subject,
          `New reply from support on: ${ticketData.subject}`
        );
        console.log('Notification sent successfully');
      } else {
        console.error('Ticket not found:', ticketId);
      }
    }

    console.log('Updating ticket...');
    await updateDoc(ticketRef, updateData);
    console.log('Ticket updated successfully');
  } catch (error: any) {
    console.error('Error adding ticket reply:', error);
    console.error('Error code:', error?.code);
    console.error('Error message:', error?.message);
    throw error;
  }
};

export const getTicketReplies = async (ticketId: string): Promise<TicketReply[]> => {
  try {
    const q = query(
      collection(db, 'helpdesk_replies'),
      where('ticketId', '==', ticketId),
      orderBy('createdAt', 'asc')
    );

    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: convertTimestamp(doc.data().createdAt)
    } as TicketReply));
  } catch (error) {
    console.error('Error getting ticket replies:', error);
    throw error;
  }
};

export const subscribeToTicketReplies = (
  ticketId: string,
  callback: (replies: TicketReply[]) => void
): (() => void) => {
  try {
    const q = query(
      collection(db, 'helpdesk_replies'),
      where('ticketId', '==', ticketId),
      orderBy('createdAt', 'asc')
    );

    return onSnapshot(q, (snapshot) => {
      const replies = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: convertTimestamp(doc.data().createdAt)
      } as TicketReply));
      callback(replies);
    });
  } catch (error) {
    console.error('Error subscribing to ticket replies:', error);
    throw error;
  }
};

export const sendTicketNotification = async (
  userId: string,
  ticketId: string,
  subject: string,
  message: string
): Promise<void> => {
  try {
    const notificationData = {
      userId,
      ticketId,
      subject,
      message,
      read: false,
      createdAt: serverTimestamp()
    };

    await addDoc(collection(db, 'helpdesk_notifications'), notificationData);
  } catch (error) {
    console.error('Error sending ticket notification:', error);
    throw error;
  }
};

export const getUserNotifications = async (userId: string): Promise<TicketNotification[]> => {
  try {
    const q = query(
      collection(db, 'helpdesk_notifications'),
      where('userId', '==', userId),
      where('read', '==', false),
      orderBy('createdAt', 'desc')
    );

    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: convertTimestamp(doc.data().createdAt)
    } as TicketNotification));
  } catch (error) {
    console.error('Error getting user notifications:', error);
    throw error;
  }
};

export const getUserTicketNotifications = async (userId: string): Promise<TicketNotification[]> => {
  return getUserNotifications(userId);
};

export const markNotificationAsRead = async (notificationId: string): Promise<void> => {
  try {
    const notificationRef = doc(db, 'helpdesk_notifications', notificationId);
    await updateDoc(notificationRef, {
      read: true
    });
  } catch (error) {
    console.error('Error marking notification as read:', error);
    throw error;
  }
};

export const markTicketNotificationAsRead = async (notificationId: string): Promise<void> => {
  return markNotificationAsRead(notificationId);
};

export const clearTicketNotifications = async (ticketId: string, userId: string): Promise<void> => {
  try {
    const q = query(
      collection(db, 'helpdesk_notifications'),
      where('userId', '==', userId),
      where('ticketId', '==', ticketId),
      where('read', '==', false)
    );

    const snapshot = await getDocs(q);
    const updatePromises = snapshot.docs.map(doc =>
      updateDoc(doc.ref, { read: true })
    );

    await Promise.all(updatePromises);
  } catch (error) {
    console.error('Error clearing ticket notifications:', error);
    throw error;
  }
};

export const getUnreadTicketsCount = async (): Promise<number> => {
  try {
    const q = query(
      collection(db, 'helpdesk_tickets'),
      where('openedByAdmin', '==', false)
    );

    const snapshot = await getDocs(q);
    return snapshot.size;
  } catch (error) {
    console.error('Error getting unread tickets count:', error);
    return 0;
  }
};

export const subscribeToUnreadTicketsCount = (
  callback: (count: number) => void
): (() => void) => {
  try {
    const q = query(
      collection(db, 'helpdesk_tickets'),
      where('openedByAdmin', '==', false)
    );

    return onSnapshot(q, (snapshot) => {
      callback(snapshot.size);
    });
  } catch (error) {
    console.error('Error subscribing to unread tickets count:', error);
    throw error;
  }
};

export const subscribeToTicketNotifications = (
  userId: string,
  callback: (notifications: TicketNotification[]) => void
): (() => void) => {
  try {
    const q = query(
      collection(db, 'helpdesk_notifications'),
      where('userId', '==', userId),
      orderBy('createdAt', 'desc')
    );

    return onSnapshot(q, (snapshot) => {
      const notifications = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: convertTimestamp(doc.data().createdAt),
        isRead: doc.data().read || false
      } as TicketNotification & { isRead: boolean }));
      callback(notifications);
    });
  } catch (error) {
    console.error('Error subscribing to ticket notifications:', error);
    throw error;
  }
};
