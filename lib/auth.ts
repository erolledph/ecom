import { auth, db } from './firebase';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut } from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';

export interface UserProfile {
  uid: string;
  email: string;
  displayName?: string;
  createdAt: Date;
  storeId?: string;
}

export const signIn = async (email: string, password: string) => {
  try {
    if (!auth) throw new Error('Firebase not initialized');

    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  } catch (error: any) {
    throw new Error(error.message);
  }
};

export const signUp = async (email: string, password: string, displayName?: string) => {
  try {
    if (!auth || !db) throw new Error('Firebase not initialized');

    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    
    // Generate unique slug for the store
    const generateSlug = (name: string, uid: string): string => {
      const baseName = name || 'store';
      const sanitized = baseName
        .toLowerCase()
        .replace(/[^a-z0-9]/g, '')
        .substring(0, 10);
      const timestamp = Date.now().toString().slice(-6);
      return `${sanitized}${timestamp}`;
    };
    
    const storeSlug = generateSlug(displayName || 'mystore', user.uid);
    console.log('Generated store slug:', storeSlug);
    
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
      slug: storeSlug,
      avatar: '',
      backgroundImage: '',
      socialLinks: {
        instagram: '',
        twitter: '',
        facebook: ''
      },
      createdAt: new Date(),
      updatedAt: new Date(),
      isActive: true
    };
    
    console.log('Creating default store with data:', defaultStore);
    // Create store document with user's UID as the store ID for easy access
    const storeRef = doc(db, 'stores', user.uid);
    await setDoc(storeRef, defaultStore);
    
    console.log('Store created successfully with slug:', storeSlug, 'and ID:', user.uid);
    
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