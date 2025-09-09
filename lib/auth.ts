import { getFirebaseInstances } from './firebase';

export interface UserProfile {
  uid: string;
  email: string;
  displayName?: string;
  createdAt: Date;
  storeId?: string;
}

export const signIn = async (email: string, password: string) => {
  try {
    const { auth } = await getFirebaseInstances();
    if (!auth) throw new Error('Firebase not initialized');

    const { signInWithEmailAndPassword } = await import('firebase/auth');
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  } catch (error: any) {
    throw new Error(error.message);
  }
};

export const signUp = async (email: string, password: string, displayName?: string) => {
  try {
    const { auth, db } = await getFirebaseInstances();
    if (!auth || !db) throw new Error('Firebase not initialized');

    const { createUserWithEmailAndPassword } = await import('firebase/auth');
    const { doc, setDoc } = await import('firebase/firestore');

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
    
    // Create user profile and store in Firestore
    const userProfile: UserProfile = {
      uid: user.uid,
      email: user.email!,
      displayName: displayName || '',
      createdAt: new Date(),
    };
    
    await setDoc(doc(db, 'users', user.uid), userProfile);
    
    // Create a default store for the user
    const defaultStore = {
      ownerId: user.uid,
      name: `${displayName || 'My'} Store`,
      description: 'Welcome to my awesome store! Discover unique products curated just for you.',
      slug: storeSlug,
      avatar: '',
      backgroundImage: 'https://images.unsplash.com/photo-1542435503-956c469947f6?q=80&w=2670&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      socialLinks: {
        instagram: '',
        twitter: '',
        facebook: ''
      },
      createdAt: new Date(),
      updatedAt: new Date(),
      isActive: true
    };
    
    // Create store document with user's UID as the store ID for easy access
    await setDoc(doc(db, 'stores', user.uid), defaultStore);
    
    // Update user profile with store reference
    await setDoc(doc(db, 'users', user.uid), {
      ...userProfile,
      storeId: user.uid
    });
    
    return user;
  } catch (error: any) {
    throw new Error(error.message);
  }
};

export const logout = async () => {
  try {
    const { auth } = await getFirebaseInstances();
    if (!auth) throw new Error('Firebase not initialized');

    const { signOut } = await import('firebase/auth');
    await signOut(auth);
  } catch (error: any) {
    throw new Error(error.message);
  }
};

export const getUserProfile = async (uid: string): Promise<UserProfile | null> => {
  try {
    const { db } = await getFirebaseInstances();
    if (!db) return null;

    const { doc, getDoc } = await import('firebase/firestore');
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