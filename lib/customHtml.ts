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
  // Ensure user is authenticated
  if (!user) {
    throw new Error('User must be logged in to update custom HTML');
  }
  
  // Force refresh of ID token with retry mechanism
  try {
    // First try to get a fresh token
    await user.getIdToken(true);
    
    // Verify the token is valid by checking if user is still authenticated
    if (!user.uid) {
      throw new Error('User authentication is invalid');
    }
  } catch (error) {
    console.error('Failed to refresh authentication token:', error);
    
    // Try one more time with force refresh
    try {
      await user.reload();
      await user.getIdToken(true);
    } catch (retryError) {
      console.error('Retry failed:', retryError);
      throw new Error('AUTHENTICATION_EXPIRED');
    }
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
export const validateCustomHtml = async (user: User, customHtml: string): Promise<ValidateCustomHtmlResponse> => {
  // Ensure user is authenticated
  if (!user) {
    throw new Error('User must be logged in to validate HTML');
  }

  // Force refresh of ID token with retry mechanism
  try {
    // First try to get a fresh token
    await user.getIdToken(true);
    
    // Verify the token is valid by checking if user is still authenticated
    if (!user.uid) {
      throw new Error('User authentication is invalid');
    }
  } catch (error) {
    console.error('Failed to refresh authentication token:', error);
    
    // Try one more time with force refresh
    try {
      await user.reload();
      await user.getIdToken(true);
    } catch (retryError) {
      console.error('Retry failed:', retryError);
      throw new Error('AUTHENTICATION_EXPIRED');
    }
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
