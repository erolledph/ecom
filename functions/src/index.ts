import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import { JSDOM } from 'jsdom';
import { CallableContext } from 'firebase-functions/lib/providers/https';
const DOMPurify = require('dompurify');

// Initialize Firebase Admin
admin.initializeApp();

// Create DOMPurify instance with JSDOM
const window = new JSDOM('').window;
const purify = DOMPurify(window as any);

// Configure DOMPurify to allow safe HTML elements and attributes
const ALLOWED_TAGS = [
  'p', 'br', 'strong', 'em', 'u', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
  'ul', 'ol', 'li', 'blockquote', 'a', 'img', 'div', 'span', 'hr',
  'table', 'thead', 'tbody', 'tr', 'th', 'td', 'pre', 'code'
];

const ALLOWED_ATTR = [
  'href', 'src', 'alt', 'title', 'class', 'id', 'style',
  'target', 'rel', 'width', 'height'
];

// Sanitize HTML content
function sanitizeHtml(html: string): string {
  return purify.sanitize(html, {
    ALLOWED_TAGS,
    ALLOWED_ATTR,
    ALLOW_DATA_ATTR: false,
    FORBID_SCRIPT: true,
    FORBID_TAGS: ['script', 'object', 'embed', 'form', 'input', 'button'],
    FORBID_ATTR: ['onclick', 'onload', 'onerror', 'onmouseover', 'onfocus', 'onblur'],
    KEEP_CONTENT: true,
    RETURN_DOM: false,
    RETURN_DOM_FRAGMENT: false,
    SANITIZE_DOM: true
  });
}

// Cloud Function to sanitize and update custom HTML
export const updateCustomHtml = functions.https.onCall(async (data: any, context: CallableContext) => {
  const { storeId, customHtml, authToken } = data;

  // Validate input
  if (!storeId || typeof customHtml !== 'string' || !authToken) {
    throw new functions.https.HttpsError(
      'invalid-argument',
      'Store ID, custom HTML, and auth token are required.'
    );
  }

  // Manually verify the authentication token
  let userId: string;
  try {
    const decodedToken = await admin.auth().verifyIdToken(authToken);
    userId = decodedToken.uid;
  } catch (error) {
    console.error('Token verification failed:', error);
    throw new functions.https.HttpsError(
      'unauthenticated',
      'User must be authenticated to update custom HTML.'
    );
  }

  try {
    // Verify that the user owns the store
    const storeRef = admin.firestore()
      .collection('users')
      .doc(userId)
      .collection('stores')
      .doc(storeId);

    const storeDoc = await storeRef.get();
    
    if (!storeDoc.exists) {
      throw new functions.https.HttpsError(
        'not-found',
        'Store not found.'
      );
    }

    const storeData = storeDoc.data();
    if (storeData?.ownerId !== userId) {
      throw new functions.https.HttpsError(
        'permission-denied',
        'You do not have permission to update this store.'
      );
    }

    // Sanitize the HTML content
    const sanitizedHtml = sanitizeHtml(customHtml);

    // Update the store with sanitized HTML
    await storeRef.update({
      customHtml: sanitizedHtml,
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    });

    return {
      success: true,
      sanitizedHtml,
      message: 'Custom HTML updated successfully.'
    };

  } catch (error) {
    console.error('Error updating custom HTML:', error);
    
    if (error instanceof functions.https.HttpsError) {
      throw error;
    }
    
    throw new functions.https.HttpsError(
      'internal',
      'An error occurred while updating custom HTML.'
    );
  }
});

// Cloud Function to validate HTML without saving (for preview)
export const validateCustomHtml = functions.https.onCall(async (data: any, context: CallableContext) => {
  const { customHtml, authToken } = data;

  // Validate input
  if (typeof customHtml !== 'string' || !authToken) {
    throw new functions.https.HttpsError(
      'invalid-argument',
      'Custom HTML and auth token are required.'
    );
  }

  // Manually verify the authentication token
  try {
    await admin.auth().verifyIdToken(authToken);
  } catch (error) {
    console.error('Token verification failed:', error);
    throw new functions.https.HttpsError(
      'unauthenticated',
      'User must be authenticated to validate HTML.'
    );
  }

  try {
    // Sanitize the HTML content
    const sanitizedHtml = sanitizeHtml(customHtml);
    
    // Check if content was modified during sanitization
    const wasModified = sanitizedHtml !== customHtml;

    return {
      sanitizedHtml,
      wasModified,
      message: wasModified 
        ? 'HTML was sanitized for security. Some content may have been removed.'
        : 'HTML is safe and ready to use.'
    };

  } catch (error) {
    console.error('Error validating custom HTML:', error);
    
    throw new functions.https.HttpsError(
      'internal',
      'An error occurred while validating HTML.'
    );
  }
});
