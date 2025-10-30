import { auth, db } from './firebase';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, sendPasswordResetEmail, confirmPasswordReset, verifyPasswordResetCode, sendEmailVerification } from 'firebase/auth';
import { doc, setDoc, getDoc, updateDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { checkSlugAvailability } from '@/lib/store';

export interface UserProfile {
  uid: string;
  email: string;
  displayName?: string;
  createdAt: Date;
  storeId?: string;
  storeSlug?: string;
  role?: 'user' | 'admin';
  isPremium?: boolean;
  isPremiumAdminSet?: boolean; // Indicates if premium was granted by admin (permanent)
  trialEndDate?: Date;         // When the trial period ends
  premiumExpiryDate?: Date;    // When time-based premium subscription expires
  subscriptionType?: 'permanent' | '1month' | '3months' | '1year' | 'trial'; // Type of premium access
  updatedAt?: Date;
}

const validatePassword = (password: string): void => {
  if (password.length < 8) {
    throw new Error('Password must be at least 8 characters long');
  }
  if (!/[A-Z]/.test(password)) {
    throw new Error('Password must contain at least one uppercase letter');
  }
  if (!/[a-z]/.test(password)) {
    throw new Error('Password must contain at least one lowercase letter');
  }
  if (!/\d/.test(password)) {
    throw new Error('Password must contain at least one number');
  }
  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    throw new Error('Password must contain at least one special character');
  }
};
export const signIn = async (email: string, password: string) => {
  try {
    if (!auth) throw new Error('Firebase not initialized');

    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    
    return userCredential.user;
  } catch (error: any) {
    throw new Error(error.message);
  }
};

export const signUp = async (email: string, password: string, displayName?: string, storeSlug?: string) => {
  try {
    if (!auth || !db) throw new Error('Firebase not initialized');

    // Validate password strength
    validatePassword(password);

    // Validate and check store slug availability
    if (storeSlug) {
      if (storeSlug.length < 3) {
        throw new Error('Store URL must be at least 3 characters long');
      }
      
      const isSlugAvailable = await checkSlugAvailability(storeSlug);
      if (!isSlugAvailable) {
        throw new Error('Store URL is already taken. Please choose a different one.');
      }
    }
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    
    // Use provided slug or generate one as fallback
    let finalStoreSlug = storeSlug;
    if (!finalStoreSlug) {
      const generateSlug = (name: string, uid: string): string => {
        const baseName = name || 'store';
        const sanitized = baseName
          .toLowerCase()
          .replace(/[^a-z0-9]/g, '')
          .substring(0, 10);
        const timestamp = Date.now().toString().slice(-6);
        return `${sanitized}${timestamp}`;
      };
      finalStoreSlug = generateSlug(displayName || 'mystore', user.uid);
    }
    
    console.log('Using store slug:', finalStoreSlug);
    
    // Calculate trial end date (7 days from now)
    const trialEndDate = new Date();
    trialEndDate.setDate(trialEndDate.getDate() + 7);

    // Create user profile and store in Firestore
    const userProfile: UserProfile = {
      uid: user.uid,
      email: user.email!,
      displayName: displayName || '',
      createdAt: new Date(),
      updatedAt: new Date(),
      role: 'user',
      isPremium: true,  // Start with premium access during trial
      trialEndDate: trialEndDate,
    };
    
    console.log('Creating user profile:', userProfile);
    
    await setDoc(doc(db, 'users', user.uid), userProfile);
    console.log('User profile created successfully');
    
    // Create a default store for the user
    const defaultStore = {
      ownerId: user.uid,
      name: `${displayName || 'My'} Store`,
      description: 'Welcome to my awesome store! Discover unique products curated just for you.',
      slug: finalStoreSlug,
      avatar: '',
      backgroundImage: '',
      socialLinks: [],
      headerLayout: 'left-right',
      // All features enabled by default
      showCategories: true,
      bannerEnabled: true,
      widgetEnabled: true,
      subscriptionEnabled: true,
      slidesEnabled: true,
      displayPriceOnProducts: true,
      // Default customization settings
      customization: {
        storeNameFontColor: '#000000',
        storeBioFontColor: '#000000',
        avatarBorderColor: '#000000',
        activeCategoryBorderColor: '#000000',
        socialIconColor: '#000000',
        headingTextColor: '#000000',
        bodyTextColor: '#000000',
        mainBackgroundGradientStartColor: '#FFFFFF',
        mainBackgroundGradientEndColor: '#FFFFFF',
        priceFontColor: '#F54927',
        loadMoreButtonBgColor: '#000000',
        loadMoreButtonTextColor: '#FFFFFF',
      },
      // Store owner's premium and trial status for public access
      ownerIsPremiumAdminSet: false,
      ownerTrialEndDate: trialEndDate,
      createdAt: new Date(),
      updatedAt: new Date(),
      isActive: true
    };
    
    console.log('Creating default store with data:', defaultStore);
    // Create store document nested under user document
    const storeRef = doc(db, 'users', user.uid, 'stores', user.uid);
    
    await setDoc(storeRef, defaultStore);
    
    console.log('Store created successfully with slug:', finalStoreSlug, 'and ID:', user.uid);
    
    // Update user profile with store reference
    const userRef = doc(db, 'users', user.uid);
    
    await setDoc(userRef, {
      ...userProfile,
      storeId: user.uid
    }, { merge: true });
    
    console.log('User profile updated with store reference. Store ID:', user.uid);

    // Send email verification
    try {
      await sendEmailVerification(user);
      console.log('Email verification sent successfully');
    } catch (emailError: any) {
      console.error('Error sending verification email:', emailError);
      // Don't throw error here - account was created successfully
    }

    return user;
  } catch (error: any) {
    throw new Error(error.message);
  }
};

export const logout = async () => {
  try {
    if (!auth) throw new Error('Firebase not initialized');

    await signOut(auth);
  } catch (error: any) {
    throw new Error(error.message);
  }
};

export const resetPassword = async (email: string) => {
  try {
    if (!auth) throw new Error('Firebase not initialized');

    // Configure the action code settings to redirect to custom reset page
    const actionCodeSettings = {
      url: `${window.location.origin}/auth/reset-password`,
      handleCodeInApp: true,
    };

    await sendPasswordResetEmail(auth, email, actionCodeSettings);
  } catch (error: any) {
    throw new Error(error.message);
  }
};

export const verifyResetCode = async (code: string): Promise<string> => {
  try {
    if (!auth) throw new Error('Firebase not initialized');
    const email = await verifyPasswordResetCode(auth, code);
    return email;
  } catch (error: any) {
    throw new Error(error.message);
  }
};

export const confirmPasswordResetWithCode = async (code: string, newPassword: string) => {
  try {
    if (!auth) throw new Error('Firebase not initialized');
    await confirmPasswordReset(auth, code, newPassword);
  } catch (error: any) {
    throw new Error(error.message);
  }
};

export const getUserProfile = async (uid: string): Promise<UserProfile | null> => {
  try {
    if (!db) return null;
    
    // Add error handling for permission issues
    console.log('🔍 getUserProfile: Attempting to fetch profile for UID:', uid);

    const docRef = doc(db, 'users', uid);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      const data = docSnap.data();
      console.log('✅ getUserProfile: Profile data found for UID:', uid);
      return {
        ...data,
        createdAt: data.createdAt?.toDate ? data.createdAt.toDate() : data.createdAt,
        updatedAt: data.updatedAt?.toDate ? data.updatedAt.toDate() : data.updatedAt,
        trialEndDate: data.trialEndDate?.toDate ? data.trialEndDate.toDate() : data.trialEndDate,
        premiumExpiryDate: data.premiumExpiryDate?.toDate ? data.premiumExpiryDate.toDate() : data.premiumExpiryDate
      } as UserProfile;
    }
    
    console.log('⚠️ getUserProfile: No profile document found for UID:', uid);
    return null;
  } catch (error) {
    console.error('❌ getUserProfile: Error fetching user profile for UID:', uid, error);
    
    // If it's a permission error, return null instead of throwing
    if (error && typeof error === 'object' && 'code' in error && error.code === 'permission-denied') {
      console.log('🔒 getUserProfile: Permission denied - returning null for public access');
      return null;
    }
    
    return null;
  }
};

export const grantPremiumAccess = async (
  userId: string,
  subscriptionType: 'permanent' | '1month' | '3months' | '1year',
  adminId: string
): Promise<void> => {
  return updateUserRoleAndPremiumStatus(userId, {
    isPremium: true,
    subscriptionType
  });
};

export const updateUserRoleAndPremiumStatus = async (
  userId: string,
  updates: {
    role?: 'user' | 'admin',
    isPremium?: boolean,
    subscriptionType?: 'permanent' | '1month' | '3months' | '1year'
  }
): Promise<void> => {
  try {
    if (!db) throw new Error('Firebase not initialized');

    console.log('🔄 Starting user update for userId:', userId, 'with updates:', updates);

    // Prepare the update object
    const updateData: any = {
      updatedAt: new Date()
    };

    // Handle role updates
    if (updates.role !== undefined) {
      updateData.role = updates.role;
    }

    // If admin is granting premium access
    if (updates.isPremium === true) {
      updateData.isPremium = true;
      updateData.trialEndDate = null;

      const subscriptionType = updates.subscriptionType || 'permanent';
      updateData.subscriptionType = subscriptionType;

      if (subscriptionType === 'permanent') {
        // Permanent premium access
        updateData.isPremiumAdminSet = true;
        updateData.premiumExpiryDate = null;
        console.log('✅ Setting permanent premium access');
      } else {
        // Time-based premium subscription
        updateData.isPremiumAdminSet = false;
        const expiryDate = new Date();

        switch (subscriptionType) {
          case '1month':
            expiryDate.setMonth(expiryDate.getMonth() + 1);
            break;
          case '3months':
            expiryDate.setMonth(expiryDate.getMonth() + 3);
            break;
          case '1year':
            expiryDate.setFullYear(expiryDate.getFullYear() + 1);
            break;
        }

        updateData.premiumExpiryDate = expiryDate;
        console.log(`✅ Setting ${subscriptionType} premium subscription (expires: ${expiryDate.toLocaleDateString()})`);
      }
    }

    // If admin is revoking premium access, clear all premium-related fields
    if (updates.isPremium === false) {
      updateData.isPremium = false;
      updateData.isPremiumAdminSet = false;
      updateData.trialEndDate = null;
      updateData.premiumExpiryDate = null;
      updateData.subscriptionType = null;
      console.log('✅ Revoking premium access');
    }

    // Update user document first
    console.log('🔄 Updating user document...');
    const userRef = doc(db, 'users', userId);
    await updateDoc(userRef, updateData);
    console.log('✅ User document updated successfully');

    // Update store document if premium status changed
    if (updates.isPremium !== undefined) {
      console.log('🔄 Updating store document...');
      try {
        const storeRef = doc(db, 'users', userId, 'stores', userId);
        const storeUpdateData: any = {
          updatedAt: new Date()
        };

        // Sync premium status fields to store document
        if (updates.isPremium === true) {
          storeUpdateData.ownerIsPremiumAdminSet = true;
          storeUpdateData.ownerTrialEndDate = null;
        } else if (updates.isPremium === false) {
          storeUpdateData.ownerIsPremiumAdminSet = false;
          storeUpdateData.ownerTrialEndDate = null;
        }

        await updateDoc(storeRef, storeUpdateData);
        console.log('✅ Store document updated successfully');
      } catch (storeError: any) {
        console.error('❌ Failed to update store document:', storeError);

        // Check if it's a not-found error (store doesn't exist yet)
        if (storeError.code === 'not-found') {
          console.log('⚠️ Store document not found - user may not have created a store yet');
          // Don't throw error if store doesn't exist
          return;
        }

        // For other errors, throw
        throw new Error(`Failed to sync premium status to store: ${storeError.message || 'Unknown error'}`);
      }
    }

    console.log('✅ All updates completed successfully');
  } catch (error: any) {
    console.error('❌ Error updating user role/premium status:', error);
    throw new Error(error.message || 'Failed to update user status');
  }
};

export const getUserByEmail = async (email: string): Promise<UserProfile | null> => {
  try {
    if (!db) return null;

    const usersRef = collection(db, 'users');
    const q = query(usersRef, where('email', '==', email));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      return null;
    }

    const userDoc = querySnapshot.docs[0];
    const data = userDoc.data();
    return {
      uid: userDoc.id,
      ...data,
      createdAt: data.createdAt?.toDate ? data.createdAt.toDate() : data.createdAt,
      updatedAt: data.updatedAt?.toDate ? data.updatedAt.toDate() : data.updatedAt,
      trialEndDate: data.trialEndDate?.toDate ? data.trialEndDate.toDate() : data.trialEndDate,
      premiumExpiryDate: data.premiumExpiryDate?.toDate ? data.premiumExpiryDate.toDate() : data.premiumExpiryDate
    } as UserProfile;
  } catch (error) {
    console.error('Error fetching user by email:', error);
    return null;
  }
};

export const getAllUserProfiles = async (): Promise<UserProfile[]> => {
  try {
    if (!db) return [];
    
    console.log('Fetching all user profiles...');
    const usersRef = collection(db, 'users');
    const querySnapshot = await getDocs(usersRef);
    
    console.log('Query snapshot size:', querySnapshot.size);
    
    const users: UserProfile[] = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      console.log('Processing user doc:', doc.id, data);
      users.push({
        uid: doc.id,
        ...data,
        createdAt: data.createdAt?.toDate ? data.createdAt.toDate() : data.createdAt,
        updatedAt: data.updatedAt?.toDate ? data.updatedAt.toDate() : data.updatedAt,
        trialEndDate: data.trialEndDate?.toDate ? data.trialEndDate.toDate() : data.trialEndDate,
        premiumExpiryDate: data.premiumExpiryDate?.toDate ? data.premiumExpiryDate.toDate() : data.premiumExpiryDate
      } as UserProfile);
    });
    
    console.log('Processed users:', users.length);
    
    // Sort users by creation date (newest first)
    const sortedUsers = users.sort((a, b) => {
      if (!a.createdAt || !b.createdAt) return 0;
      return b.createdAt.getTime() - a.createdAt.getTime();
    });
    
    console.log('Returning sorted users:', sortedUsers.length);
    return sortedUsers;
  } catch (error) {
    console.error('Error fetching all user profiles:', error);
    throw error; // Re-throw to handle in UI
  }
};

// Helper function to check if user is admin
export const isAdmin = (userProfile: UserProfile | null): boolean => {
  return userProfile?.role === 'admin';
};

// Helper function to check if user is premium
export const isPremium = (userProfile: UserProfile | null): boolean => {
  if (!userProfile) return false;
  
  console.log('🔍 isPremium check for user:', {
    email: userProfile.email,
    role: userProfile.role,
    isPremium: userProfile.isPremium,
    isPremiumAdminSet: userProfile.isPremiumAdminSet,
    trialEndDate: userProfile.trialEndDate,
    trialEndDateTimestamp: userProfile.trialEndDate instanceof Date ? userProfile.trialEndDate.getTime() : null,
    currentTimestamp: Date.now(),
    isTrialActive: userProfile.trialEndDate instanceof Date ? userProfile.trialEndDate.getTime() > Date.now() : false
  });
  
  // Admin users always have premium access
  if (isAdmin(userProfile)) {
    console.log('✅ User is admin - premium access granted');
    return true;
  }
  
  // If premium was set by admin, it's permanent
  if (userProfile.isPremiumAdminSet === true) {
    console.log('✅ User has permanent premium (isPremiumAdminSet=true)');
    return true;
  }

  // Check if time-based premium subscription is active
  if (userProfile.premiumExpiryDate && userProfile.premiumExpiryDate instanceof Date && userProfile.premiumExpiryDate.getTime() > Date.now()) {
    console.log('✅ User has active time-based premium subscription');
    return true;
  }

  // Check if trial is still active
  if (userProfile.trialEndDate && userProfile.trialEndDate instanceof Date && userProfile.trialEndDate.getTime() > Date.now()) {
    console.log('✅ User trial is still active');
    return true;
  }
  
  console.log('❌ User is NOT premium');
  // Otherwise, check the isPremium flag (for backward compatibility)
  return userProfile.isPremium === true;
};

// Helper function to check if trial has expired
export const hasTrialExpired = (userProfile: UserProfile | null): boolean => {
  if (!userProfile) return false;

  // If premium was set by admin, trial never expires
  if (userProfile.isPremiumAdminSet === true) return false;

  // Check if trial end date exists and has passed
  if (userProfile.trialEndDate && userProfile.trialEndDate instanceof Date && userProfile.trialEndDate.getTime() < Date.now()) {
    return true;
  }

  return false;
};

// Helper function to check if user is on trial
export const isOnTrial = (userProfile: UserProfile | null): boolean => {
  if (!userProfile) return false;

  // If premium was set by admin, user is not on trial
  if (userProfile.isPremiumAdminSet === true) return false;

  // Check if trial end date exists and is still valid
  if (userProfile.trialEndDate && userProfile.trialEndDate instanceof Date && userProfile.trialEndDate.getTime() > Date.now()) {
    return true;
  }

  return false;
};

// Helper function to get trial days remaining
export const getTrialDaysRemaining = (userProfile: UserProfile | null): number => {
  if (!userProfile || !userProfile.trialEndDate) return 0;

  // If premium was set by admin, return 0 (not on trial)
  if (userProfile.isPremiumAdminSet === true) return 0;

  // Check if trialEndDate is a valid Date object
  if (!(userProfile.trialEndDate instanceof Date)) return 0;

  const now = Date.now();
  const trialEnd = userProfile.trialEndDate.getTime();
  const msRemaining = trialEnd - now;

  if (msRemaining <= 0) return 0;

  return Math.ceil(msRemaining / (1000 * 60 * 60 * 24));
};

// Helper function to check if user can access feature
export const canAccessFeature = (userProfile: UserProfile | null, feature: 'analytics' | 'csv_import' | 'export' | 'admin'): boolean => {
  if (!userProfile) return false;

  switch (feature) {
    case 'admin':
      return isAdmin(userProfile);
    case 'analytics':
      return true; // All authenticated users can access analytics
    case 'csv_import':
    case 'export':
      return isPremium(userProfile) || isAdmin(userProfile); // Only premium users and admins
    default:
      return false;
  }
};

// Migration function to fix existing premium users missing isPremiumAdminSet field
export const migratePremiumUsers = async (): Promise<void> => {
  try {
    if (!db) throw new Error('Firebase not initialized');
    
    console.log('🔧 Starting migration of premium users...');
    console.log('🔧 Checking all users for premium status issues...');
    
    // Get all users
    const usersRef = collection(db, 'users');
    const querySnapshot = await getDocs(usersRef);
    
    const updatePromises = [];
    let migratedCount = 0;
    let totalChecked = 0;
    
    for (const userDoc of querySnapshot.docs) {
      const userData = userDoc.data();
      totalChecked++;
      
      console.log(`🔧 Checking user: ${userData.email} (${userDoc.id})`);
      console.log(`   - isPremium: ${userData.isPremium}`);
      console.log(`   - isPremiumAdminSet: ${userData.isPremiumAdminSet}`);
      console.log(`   - trialEndDate: ${userData.trialEndDate}`);
      
      // Check if user has isPremium: true but missing isPremiumAdminSet
      if (userData.isPremium === true && userData.isPremiumAdminSet === undefined) {
        console.log(`🔧 MIGRATING user: ${userData.email} (${userDoc.id})`);
        
        const userRef = doc(db, 'users', userDoc.id);
        const updateData = {
          isPremiumAdminSet: true,
          trialEndDate: null,
          updatedAt: new Date()
        };
        
        updatePromises.push(updateDoc(userRef, updateData));
        migratedCount++;
      } else if (userData.isPremium === true && userData.isPremiumAdminSet === true) {
        console.log(`✅ User already has correct premium status: ${userData.email}`);
      } else {
        console.log(`ℹ️ User is not premium or already correct: ${userData.email}`);
      }
    }
    
    // Execute all updates
    if (updatePromises.length > 0) {
      console.log(`🔧 Executing ${updatePromises.length} user updates...`);
      await Promise.all(updatePromises);
      console.log(`✅ Successfully migrated ${migratedCount} out of ${totalChecked} premium users`);
    } else {
      console.log(`ℹ️ No users needed migration (checked ${totalChecked} users)`);
    }
    
  } catch (error) {
    console.error('❌ Error migrating premium users:', error);
    console.error('❌ Error details:', {
      message: error instanceof Error ? error.message : 'Unknown error',
      code: (error as any)?.code,
      stack: error instanceof Error ? error.stack : undefined
    });
    throw error;
  }
};

// Helper function to fix a specific user's premium status
export const fixUserPremiumStatus = async (userId: string): Promise<void> => {
  try {
    if (!db) throw new Error('Firebase not initialized');
    
    const userRef = doc(db, 'users', userId);
    const userDoc = await getDoc(userRef);
    
    if (!userDoc.exists()) {
      throw new Error('User not found');
    }
    
    const userData = userDoc.data();
    
    // If user has isPremium: true but missing isPremiumAdminSet, fix it
    if (userData.isPremium === true && userData.isPremiumAdminSet === undefined) {
      await updateDoc(userRef, {
        isPremiumAdminSet: true,
        trialEndDate: null,
        updatedAt: new Date()
      });
      
      console.log(`Fixed premium status for user: ${userData.email}`);
    }
  } catch (error) {
    console.error('Error fixing user premium status:', error);
    throw error;
  }
};

// Helper function to check if user's original trial window is still valid
export const isOriginalTrialWindowValid = (userProfile: UserProfile | null): boolean => {
  if (!userProfile || !userProfile.createdAt) return false;
  
  const createdAt = userProfile.createdAt instanceof Date ? userProfile.createdAt : new Date(userProfile.createdAt);
  const originalTrialEnd = new Date(createdAt);
  originalTrialEnd.setDate(originalTrialEnd.getDate() + 7);
  
  return originalTrialEnd.getTime() > Date.now();
};

// Function to manage user trial status (end or reset trial)
export const updateUserTrialStatus = async (userId: string, action: 'end' | 'reset'): Promise<void> => {
  try {
    if (!db) throw new Error('Firebase not initialized');

    console.log(`🔄 Starting trial ${action} for userId:`, userId);

    // Use getUserProfile to properly convert Firestore timestamps to Date objects
    const userData = await getUserProfile(userId);

    if (!userData) {
      throw new Error('User not found');
    }

    if (action === 'end') {
      // End the user's trial immediately
      if (!isOnTrial(userData)) {
        throw new Error('User is not currently on trial');
      }

      console.log('🔄 Ending trial...');
      const userRef = doc(db, 'users', userId);
      await updateDoc(userRef, {
        trialEndDate: new Date(0),
        isPremium: false,
        isPremiumAdminSet: false,
        updatedAt: new Date()
      });
      console.log('✅ User document updated - trial ended');

      // Also update the store document
      try {
        const storeRef = doc(db, 'users', userId, 'stores', userId);
        await updateDoc(storeRef, {
          ownerIsPremiumAdminSet: false,
          ownerTrialEndDate: new Date(0),
          updatedAt: new Date()
        });
        console.log('✅ Store document updated with trial end');
      } catch (storeError: any) {
        console.error('❌ Failed to update store document with trial end:', storeError);

        // Check if it's a not-found error
        if (storeError.code === 'not-found') {
          console.log('⚠️ Store document not found - skipping store update');
          return;
        }

        throw new Error(`Failed to sync trial end to store: ${storeError.message || 'Unknown error'}`);
      }

    } else if (action === 'reset') {
      // Reset the user's trial for another 7 days

      // Check if user has permanent premium (cannot reset trial)
      if (userData.isPremiumAdminSet === true) {
        throw new Error('Cannot reset trial for users with permanent premium access');
      }

      // Check if original 7-day window has passed
      if (!isOriginalTrialWindowValid(userData)) {
        throw new Error('Cannot reset trial: Original 7-day trial window has expired');
      }

      // Calculate new trial end date (7 days from now)
      const newTrialEndDate = new Date();
      newTrialEndDate.setDate(newTrialEndDate.getDate() + 7);

      console.log('🔄 Resetting trial...');
      const userRef = doc(db, 'users', userId);
      await updateDoc(userRef, {
        trialEndDate: newTrialEndDate,
        isPremium: true,
        isPremiumAdminSet: false,
        updatedAt: new Date()
      });
      console.log('✅ User document updated - trial reset');

      // Also update the store document
      try {
        const storeRef = doc(db, 'users', userId, 'stores', userId);
        await updateDoc(storeRef, {
          ownerIsPremiumAdminSet: false,
          ownerTrialEndDate: newTrialEndDate,
          updatedAt: new Date()
        });
        console.log('✅ Store document updated with trial reset');
      } catch (storeError: any) {
        console.error('❌ Failed to update store document with trial reset:', storeError);

        // Check if it's a not-found error
        if (storeError.code === 'not-found') {
          console.log('⚠️ Store document not found - skipping store update');
          return;
        }

        throw new Error(`Failed to sync trial reset to store: ${storeError.message || 'Unknown error'}`);
      }
    }

    console.log(`✅ Trial ${action} completed successfully`);

  } catch (error: any) {
    console.error(`❌ Error updating user trial status (${action}):`, error);
    throw new Error(error.message || `Failed to ${action} trial`);
  }
};

// Interface for user statistics
export interface UserStatistics {
  totalProducts: number;
  totalSlides: number;
  totalBanners: number;
  totalSubscribers: number;
  totalStoreVisits: number;
  lastLogin?: Date;
}

// Helper function to get premium subscription details
export const getPremiumSubscriptionInfo = (userProfile: UserProfile | null): {
  hasPremium: boolean;
  type: 'none' | 'trial' | 'permanent' | '1month' | '3months' | '1year';
  expiryDate?: Date;
  daysRemaining?: number;
} => {
  if (!userProfile) {
    return { hasPremium: false, type: 'none' };
  }

  // Admin always has premium
  if (isAdmin(userProfile)) {
    return { hasPremium: true, type: 'permanent' };
  }

  // Check for permanent premium
  if (userProfile.isPremiumAdminSet === true) {
    return { hasPremium: true, type: 'permanent' };
  }

  // Check for time-based subscription
  if (userProfile.premiumExpiryDate && userProfile.premiumExpiryDate instanceof Date) {
    const now = Date.now();
    const expiryTime = userProfile.premiumExpiryDate.getTime();

    if (expiryTime > now) {
      const daysRemaining = Math.ceil((expiryTime - now) / (1000 * 60 * 60 * 24));
      return {
        hasPremium: true,
        type: userProfile.subscriptionType || '1month',
        expiryDate: userProfile.premiumExpiryDate,
        daysRemaining
      };
    }
  }

  // Check for trial
  if (userProfile.trialEndDate && userProfile.trialEndDate instanceof Date) {
    const now = Date.now();
    const trialEndTime = userProfile.trialEndDate.getTime();

    if (trialEndTime > now) {
      const daysRemaining = Math.ceil((trialEndTime - now) / (1000 * 60 * 60 * 24));
      return {
        hasPremium: true,
        type: 'trial',
        expiryDate: userProfile.trialEndDate,
        daysRemaining
      };
    }
  }

  return { hasPremium: false, type: 'none' };
};

// Get user statistics
export const getUserStatistics = async (userId: string): Promise<UserStatistics> => {
  try {
    if (!db) throw new Error('Firebase not initialized');

    const statistics: UserStatistics = {
      totalProducts: 0,
      totalSlides: 0,
      totalBanners: 0,
      totalSubscribers: 0,
      totalStoreVisits: 0,
      lastLogin: undefined
    };

    // Get products count
    const productsRef = collection(db, 'users', userId, 'stores', userId, 'products');
    const productsSnapshot = await getDocs(productsRef);
    statistics.totalProducts = productsSnapshot.size;

    // Get slides count
    const slidesRef = collection(db, 'users', userId, 'stores', userId, 'slides');
    const slidesSnapshot = await getDocs(slidesRef);
    statistics.totalSlides = slidesSnapshot.size;

    // Get banners count (global banners owned by user)
    const bannersRef = collection(db, 'global_banners');
    const bannersQuery = query(bannersRef, where('ownerId', '==', userId));
    const bannersSnapshot = await getDocs(bannersQuery);
    statistics.totalBanners = bannersSnapshot.size;

    // Get subscribers count
    const subscribersRef = collection(db, 'users', userId, 'stores', userId, 'subscribers');
    const subscribersSnapshot = await getDocs(subscribersRef);
    statistics.totalSubscribers = subscribersSnapshot.size;

    // Get store visits count (page_view events)
    const analyticsRef = collection(db, 'users', userId, 'stores', userId, 'analytics_events');
    const pageViewQuery = query(analyticsRef, where('eventName', '==', 'page_view'));
    const pageViewSnapshot = await getDocs(pageViewQuery);
    statistics.totalStoreVisits = pageViewSnapshot.size;

    // Note: lastLogin would need to be tracked separately in user profile
    // For now, we'll leave it undefined

    return statistics;
  } catch (error) {
    console.error('Error getting user statistics:', error);
    return {
      totalProducts: 0,
      totalSlides: 0,
      totalBanners: 0,
      totalSubscribers: 0,
      totalStoreVisits: 0
    };
  }
};