// Firebase configuration - only initialize on client side
let auth: any = null;
let db: any = null;
let app: any = null;
let initialized = false;

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

// Initialize Firebase only on client side
const initializeFirebase = async () => {
  if (typeof window === 'undefined') {
    // Return mock objects for server-side rendering
    return {
      auth: null,
      db: null,
      app: null
    };
  }

  if (initialized && app) {
    return { auth, db, app };
  }

  try {
    // Use dynamic imports with explicit paths to ensure browser builds
    const { initializeApp } = await import('firebase/app/dist/esm/index.js');
    const { getAuth } = await import('firebase/auth/dist/esm/index.js');
    const { getFirestore } = await import('firebase/firestore/dist/esm/index.js');

    app = initializeApp(firebaseConfig);
    auth = getAuth(app);
    db = getFirestore(app);
    initialized = true;

    return { auth, db, app };
  } catch (error) {
    console.error('Failed to initialize Firebase:', error);
    return { auth: null, db: null, app: null };
  }
};

// Export a function that returns the initialized Firebase instances
export const getFirebaseInstances = async () => {
  return await initializeFirebase();
};

// For backward compatibility, export individual instances
export { auth, db };
export default app;