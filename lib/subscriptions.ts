import { db } from './firebase';
import { collection, addDoc, getDocs, query, where, orderBy, doc, updateDoc, getDoc, Timestamp } from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';

export interface SubscriptionNotification {
  id?: string;
  userId: string;
  type: 'subscription_approved' | 'subscription_rejected';
  title: string;
  message: string;
  read: boolean;
  createdAt: Date;
}

export interface SubscriptionRequest {
  id?: string;
  userId: string;
  userEmail: string;
  userName?: string;
  plan: 'monthly' | 'quarterly' | 'yearly' | 'lifetime';
  planPrice: number;
  paymentProofUrls: string[];
  status: 'pending' | 'approved' | 'rejected';
  submittedAt: Date;
  reviewedAt?: Date;
  reviewedBy?: string;
  notes?: string;
}

export const SUBSCRIPTION_PLANS = {
  monthly: { label: 'Monthly', price: 3, duration: '1 month' },
  quarterly: { label: 'Quarterly', price: 10, duration: '3 months' },
  yearly: { label: 'Yearly', price: 15, duration: '1 year' },
  lifetime: { label: 'Lifetime', price: 250, duration: 'Forever' }
};

export async function uploadPaymentProof(files: File[], userId: string): Promise<string[]> {
  const storage = getStorage();
  const urls: string[] = [];

  for (const file of files) {
    const timestamp = Date.now();
    const storageRef = ref(storage, `payment-proofs/${userId}/${timestamp}-${file.name}`);
    await uploadBytes(storageRef, file);
    const url = await getDownloadURL(storageRef);
    urls.push(url);
  }

  return urls;
}

export async function createSubscriptionRequest(request: Omit<SubscriptionRequest, 'id' | 'submittedAt' | 'status'>): Promise<string> {
  try {
    const requestData = {
      ...request,
      status: 'pending',
      submittedAt: Timestamp.now()
    };

    const docRef = await addDoc(collection(db, 'subscription_requests'), requestData);
    return docRef.id;
  } catch (error) {
    console.error('Error creating subscription request:', error);
    throw error;
  }
}

export async function getSubscriptionRequests(status?: 'pending' | 'approved' | 'rejected'): Promise<SubscriptionRequest[]> {
  try {
    let q;
    if (status) {
      q = query(
        collection(db, 'subscription_requests'),
        where('status', '==', status),
        orderBy('submittedAt', 'desc')
      );
    } else {
      q = query(
        collection(db, 'subscription_requests'),
        orderBy('submittedAt', 'desc')
      );
    }

    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => {
      const data: any = doc.data();
      return {
        id: doc.id,
        userId: data.userId,
        userEmail: data.userEmail,
        userName: data.userName,
        plan: data.plan,
        planPrice: data.planPrice,
        paymentProofUrls: data.paymentProofUrls,
        status: data.status,
        submittedAt: data.submittedAt?.toDate(),
        reviewedAt: data.reviewedAt?.toDate(),
        reviewedBy: data.reviewedBy,
        notes: data.notes
      } as SubscriptionRequest;
    });
  } catch (error) {
    console.error('Error fetching subscription requests:', error);
    throw error;
  }
}

export async function getUserSubscriptionRequests(userId: string): Promise<SubscriptionRequest[]> {
  try {
    const q = query(
      collection(db, 'subscription_requests'),
      where('userId', '==', userId),
      orderBy('submittedAt', 'desc')
    );

    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => {
      const data: any = doc.data();
      return {
        id: doc.id,
        userId: data.userId,
        userEmail: data.userEmail,
        userName: data.userName,
        plan: data.plan,
        planPrice: data.planPrice,
        paymentProofUrls: data.paymentProofUrls,
        status: data.status,
        submittedAt: data.submittedAt?.toDate(),
        reviewedAt: data.reviewedAt?.toDate(),
        reviewedBy: data.reviewedBy,
        notes: data.notes
      } as SubscriptionRequest;
    });
  } catch (error) {
    console.error('Error fetching user subscription requests:', error);
    throw error;
  }
}

export async function updateSubscriptionRequestStatus(
  requestId: string,
  status: 'approved' | 'rejected',
  reviewerId: string,
  notes?: string
): Promise<void> {
  try {
    const requestRef = doc(db, 'subscription_requests', requestId);
    await updateDoc(requestRef, {
      status,
      reviewedAt: Timestamp.now(),
      reviewedBy: reviewerId,
      notes: notes || ''
    });
  } catch (error) {
    console.error('Error updating subscription request:', error);
    throw error;
  }
}

export async function getSubscriptionRequest(requestId: string): Promise<SubscriptionRequest | null> {
  try {
    const requestRef = doc(db, 'subscription_requests', requestId);
    const requestDoc = await getDoc(requestRef);

    if (!requestDoc.exists()) {
      return null;
    }

    const data: any = requestDoc.data();
    return {
      id: requestDoc.id,
      userId: data.userId,
      userEmail: data.userEmail,
      userName: data.userName,
      plan: data.plan,
      planPrice: data.planPrice,
      paymentProofUrls: data.paymentProofUrls,
      status: data.status,
      submittedAt: data.submittedAt?.toDate(),
      reviewedAt: data.reviewedAt?.toDate(),
      reviewedBy: data.reviewedBy,
      notes: data.notes
    } as SubscriptionRequest;
  } catch (error) {
    console.error('Error fetching subscription request:', error);
    throw error;
  }
}

export async function sendSubscriptionNotification(
  userId: string,
  status: 'approved' | 'rejected',
  plan: string,
  notes?: string
): Promise<void> {
  try {
    const planLabel = SUBSCRIPTION_PLANS[plan as keyof typeof SUBSCRIPTION_PLANS]?.label || plan;

    const notificationData = {
      userId,
      type: status === 'approved' ? 'subscription_approved' : 'subscription_rejected',
      title: status === 'approved'
        ? 'Subscription Approved!'
        : 'Subscription Request Update',
      message: status === 'approved'
        ? `Great news! Your ${planLabel} subscription has been approved. You now have access to all premium features!`
        : `Your ${planLabel} subscription request has been reviewed. ${notes || 'Please contact support for more information.'}`,
      read: false,
      createdAt: Timestamp.now()
    };

    await addDoc(collection(db, 'helpdesk_notifications'), notificationData);
  } catch (error) {
    console.error('Error sending subscription notification:', error);
  }
}
