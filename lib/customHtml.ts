import { httpsCallable } from 'firebase/functions';
import { getFunctions } from 'firebase/functions';
import { auth } from './firebase';
import app from './firebase';

// Initialize Firebase Functions
const functions = getFunctions(app);

// Interface for the update custom HTML response
interface UpdateCustomHtmlResponse {
  success: boolean;
  sanitizedHtml: string;
  message: string;
}

// Interface for the validate custom HTML response
interface ValidateCustomHtmlResponse {
  sanitizedHtml: string;
  wasModified: boolean;
  message: string;
}

// Function to update custom HTML with server-side sanitization
export const updateCustomHtml = async (storeId: string, customHtml: string): Promise<UpdateCustomHtmlResponse> => {
  // Ensure user is authenticated and get fresh token
  if (!auth.currentUser) {
    throw new Error('User must be logged in to update custom HTML');
  }
  
  // Force refresh the ID token to ensure it's valid
  try {
    await auth.currentUser.getIdToken(true); // true forces refresh
  } catch (error) {
    console.error('Failed to refresh auth token:', error);
    throw new Error('Authentication failed. Please try logging in again.');
  }

  const updateCustomHtmlFunction = httpsCallable<
    { storeId: string; customHtml: string },
    UpdateCustomHtmlResponse
  >(functions, 'updateCustomHtml');

  try {
    const result = await updateCustomHtmlFunction({ storeId, customHtml });
    return result.data;
  } catch (error: any) {
    console.error('Error updating custom HTML:', error);
    throw new Error(error.message || 'Failed to update custom HTML');
  }
};

// Function to validate custom HTML without saving (for preview)
export const validateCustomHtml = async (customHtml: string): Promise<ValidateCustomHtmlResponse> => {
  // Ensure user is authenticated and get fresh token
  if (!auth.currentUser) {
    throw new Error('User must be logged in to validate HTML');
  }
  
  // Force refresh the ID token to ensure it's valid
  try {
    await auth.currentUser.getIdToken(true); // true forces refresh
  } catch (error) {
    console.error('Failed to refresh auth token:', error);
    throw new Error('Authentication failed. Please try logging in again.');
  }

  const validateCustomHtmlFunction = httpsCallable<
    { customHtml: string },
    ValidateCustomHtmlResponse
  >(functions, 'validateCustomHtml');

  try {
    const result = await validateCustomHtmlFunction({ customHtml });
    return result.data;
  } catch (error: any) {
    console.error('Error validating custom HTML:', error);
    throw new Error(error.message || 'Failed to validate custom HTML');
  }
};