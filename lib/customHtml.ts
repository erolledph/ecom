import { httpsCallable } from 'firebase/functions';
import { getFunctions } from 'firebase/functions';
import { User } from 'firebase/auth';
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
export const updateCustomHtml = async (user: User, storeId: string, customHtml: string): Promise<UpdateCustomHtmlResponse> => {
  // Ensure user is authenticated and get fresh token
  if (!user) {
    throw new Error('User must be logged in to update custom HTML');
  }
  
  // Get the ID token to send to the Cloud Function
  let idToken: string;
  try {
    idToken = await user.getIdToken(true); // true forces refresh
  } catch (error) {
    console.error('Failed to refresh auth token:', error);
    throw new Error('Authentication failed. Please try logging in again.');
  }

  const updateCustomHtmlFunction = httpsCallable<
    { storeId: string; customHtml: string; authToken: string },
    UpdateCustomHtmlResponse
  >(functions, 'updateCustomHtml');

  try {
    const result = await updateCustomHtmlFunction({ storeId, customHtml, authToken: idToken });
    return result.data;
  } catch (error: any) {
    console.error('Error updating custom HTML:', error);
    throw new Error(error.message || 'Failed to update custom HTML');
  }
};

// Function to validate custom HTML without saving (for preview)
export const validateCustomHtml = async (user: User, customHtml: string): Promise<ValidateCustomHtmlResponse> => {
  // Ensure user is authenticated and get fresh token
  if (!user) {
    throw new Error('User must be logged in to validate HTML');
  }

  let idToken: string;
  try {
    idToken = await user.getIdToken(true); // true forces token refresh
  } catch (error) {
    console.error('Failed to refresh auth token:', error);
    throw new Error('Authentication failed. Please try logging in again.');
  }

  const validateCustomHtmlFunction = httpsCallable<
    { customHtml: string; authToken: string },
    ValidateCustomHtmlResponse
  >(functions, 'validateCustomHtml');

  try {
    const result = await validateCustomHtmlFunction({ customHtml, authToken: idToken });
    return result.data;
  } catch (error: any) {
    console.error('Error validating custom HTML:', error);
    throw new Error(error.message || 'Failed to validate custom HTML');
  }
};
