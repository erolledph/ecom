import { auth, db } from './firebase';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut } from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { checkSlugAvailability } from './store';

export interface UserProfile {
  uid: string;
  email: string;
  displayName?: string;
  createdAt: Date;
  storeId?: string;
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
      return docSnap.data() as UserProfile;
    }
    return null;
  } catch (error) {
    console.error('Error fetching user profile:', error);
    return null;
  }
};