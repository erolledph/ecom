import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Only import storage on client side to avoid Node.js compatibility issues
let storage: any = null;
if (typeof window !== 'undefined') {
  import('firebase/storage').then((storageModule) => {
    storage = storageModule.getStorage(app);
  });
}

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);

// Export a function to get storage instead of direct export
export const getStorageInstance = async () => {
  if (typeof window === 'undefined') {
    // Return null on server side
    return null;
  }
  
  if (!storage) {
    const { getStorage } = await import('firebase/storage');
    storage = getStorage(app);
  }
  
  return storage;
};

export default app;