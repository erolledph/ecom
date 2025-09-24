import { auth, db } from './firebase';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut } from 'firebase/auth';
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
    
    // Create user profile and store in Firestore
    const userProfile: UserProfile = {
      uid: user.uid,
      email: user.email!,
      displayName: displayName || '',
      createdAt: new Date(),
      updatedAt: new Date(),
      role: 'user',
      isPremium: false,
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

export const getUserProfile = async (uid: string): Promise<UserProfile | null> => {
  try {
    if (!db) return null;


    const docRef = doc(db, 'users', uid);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      const data = docSnap.data();
      return {
        ...data,
        createdAt: data.createdAt?.toDate ? data.createdAt.toDate() : data.createdAt,
        updatedAt: data.updatedAt?.toDate ? data.updatedAt.toDate() : data.updatedAt
      } as UserProfile;
    }
    return null;
  } catch (error) {
    console.error('Error fetching user profile:', error);
    return null;
  }
};

export const updateUserRoleAndPremiumStatus = async (userId: string, updates: { role?: 'user' | 'admin', isPremium?: boolean }): Promise<void> => {
  try {
    if (!db) throw new Error('Firebase not initialized');
    
    const userRef = doc(db, 'users', userId);
    await updateDoc(userRef, {
      ...updates,
      updatedAt: new Date()
    });
  } catch (error) {
    console.error('Error updating user role/premium status:', error);
    throw error;
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
    return {
      uid: userDoc.id,
      ...userDoc.data()
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
        updatedAt: data.updatedAt?.toDate ? data.updatedAt.toDate() : data.updatedAt
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
  return userProfile?.isPremium === true || isAdmin(userProfile);
};

// Helper function to check if user can access feature
export const canAccessFeature = (userProfile: UserProfile | null, feature: 'analytics' | 'csv_import' | 'export' | 'admin'): boolean => {
  if (!userProfile) return false;
  
  switch (feature) {
    case 'admin':
      return isAdmin(userProfile);
    case 'analytics':
    case 'csv_import':
    case 'export':
      return true; // All authenticated users can access analytics
    default:
      return false;
  }
};
