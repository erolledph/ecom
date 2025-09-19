/**
 * Analytics Utility Module
 * 
 * This module provides a centralized way to track user interactions and events
 * across the application. Events are now stored persistently in Firestore
 * for reliable analytics tracking across all browsers and sessions.
 */

import { db } from './firebase';
import { collection, addDoc, query, where, getDocs, deleteDoc, doc, updateDoc, increment } from 'firebase/firestore';
import { getStoreBySlug } from './store';

export interface AnalyticsEvent {
  id?: string;
  eventName: string;
  ownerId: string;
  properties?: Record<string, any>;
  timestamp: string;
  sessionId: string;
  userAgent?: string;
  url?: string;
}

// Generate a session ID for this browser session
const generateSessionId = (): string => {
  if (typeof window === 'undefined') return 'server-session';
  
  let sessionId = sessionStorage.getItem('analytics_session_id');
  if (!sessionId) {
    sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    sessionStorage.setItem('analytics_session_id', sessionId);
  }
  return sessionId;
};

/**
 * Track an analytics event and store it in Firestore
 * @param eventName - The name of the event (e.g., 'product_click', 'page_view')
 * @param ownerId - The ID of the store owner (user who owns the store being tracked)
 * @param properties - Optional object containing event properties
 */
export const trackEvent = async (eventName: string, ownerId: string, properties?: Record<string, any>): Promise<void> => {
  try {
    if (!db || !ownerId) return;

    const event: AnalyticsEvent = {
      eventName,
      ownerId,
      properties: properties || {},
      timestamp: new Date().toISOString(),
      sessionId: generateSessionId(),
      userAgent: typeof window !== 'undefined' ? window.navigator.userAgent : undefined,
      url: typeof window !== 'undefined' ? window.location.href : undefined,
    };

    // Store event in nested Firestore collection
    await addDoc(collection(db, 'users', ownerId, 'stores', ownerId, 'analytics_events'), event);

    // Log to console for debugging
    console.log('📊 Analytics Event:', event);

    // Handle click count updates for products and slides
    if (eventName === 'product_click' && properties?.product_id) {
      updateClickCount('product', properties.product_id, properties.store_slug);
    } else if (eventName === 'slide_click' && properties?.slide_id) {
      updateClickCount('slide', properties.slide_id, properties.store_slug);
    }

  } catch (error) {
    // Fail silently to not disrupt user experience
    console.warn('Analytics tracking failed:', error);
  }
};

/**
 * Update click count in Firestore for products and slides
 */
const updateClickCount = async (type: 'product' | 'slide', itemId: string, storeSlug?: string): Promise<void> => {
  try {
    if (!db || !itemId || !storeSlug) return;
    
    // Get store data to find the owner ID (which is used as storeId in nested structure)
    const store = await getStoreBySlug(storeSlug);
    if (!store || !store.ownerId) return;
    
    const storeId = store.ownerId;
    
    if (type === 'product') {
      const productRef = doc(db, 'users', storeId, 'stores', storeId, 'products', itemId);
      await updateDoc(productRef, {
        clickCount: increment(1)
      });
    } else if (type === 'slide') {
      const slideRef = doc(db, 'users', storeId, 'stores', storeId, 'slides', itemId);
      await updateDoc(slideRef, {
        clickCount: increment(1)
      });
    }
  } catch (error) {
    console.warn('Failed to update click count:', error);
  }
};

/**
 * Track page view events
 * @param pagePath - The path of the page being viewed
 * @param ownerId - The ID of the store owner
 * @param pageTitle - The title of the page
 * @param additionalProperties - Any additional properties to track
 */
export const trackPageView = async (
  pagePath: string, 
  ownerId: string,
  pageTitle?: string, 
  additionalProperties?: Record<string, any>
): Promise<void> => {
  await trackEvent('page_view', ownerId, {
    page_path: pagePath,
    page_title: pageTitle || document.title,
    ...additionalProperties,
  });
};

/**
 * Track subscription form events
 * @param eventName - The subscription event name
 * @param ownerId - The ID of the store owner
 * @param properties - Event properties
 */
export const trackSubscriptionEvent = async (
  eventName: 'subscription_form_view' | 'subscription_form_submit' | 'subscription_form_close',
  ownerId: string,
  properties?: Record<string, any>
): Promise<void> => {
  await trackEvent(eventName, ownerId, properties);
};

/**
 * Get analytics events for a specific store owner from Firestore
 */
export const getAnalyticsEvents = async (ownerId: string): Promise<AnalyticsEvent[]> => {
  if (!db || !ownerId) return [];
  
  try {
    const q = query(collection(db, 'users', ownerId, 'stores', ownerId, 'analytics_events'));
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as AnalyticsEvent[];
  } catch (error) {
    console.warn('Failed to retrieve analytics events:', error);
    return [];
  }
};

/**
 * Clear all analytics events for a specific store owner
 */
export const clearAnalyticsEvents = async (ownerId: string): Promise<void> => {
  if (!db || !ownerId) return;
  
  try {
    const q = query(collection(db, 'users', ownerId, 'stores', ownerId, 'analytics_events'));
    const querySnapshot = await getDocs(q);
    
    const deletePromises = querySnapshot.docs.map(docSnapshot => 
      deleteDoc(doc(db, 'users', ownerId, 'stores', ownerId, 'analytics_events', docSnapshot.id))
    );
    
    await Promise.all(deletePromises);
  } catch (error) {
    console.warn('Failed to clear analytics events:', error);
  }
};
