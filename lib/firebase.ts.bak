import { initializeApp, getApps } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { getStorage } from 'firebase/storage';

console.log('🔥 Firebase config loading...');

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID
};

console.log('🔥 Firebase config:', {
  apiKey: firebaseConfig.apiKey ? '✅ Set' : '❌ Missing',
  authDomain: firebaseConfig.authDomain ? '✅ Set' : '❌ Missing',
  projectId: firebaseConfig.projectId ? '✅ Set' : '❌ Missing',
  storageBucket: firebaseConfig.storageBucket ? '✅ Set' : '❌ Missing',
  messagingSenderId: firebaseConfig.messagingSenderId ? '✅ Set' : '❌ Missing',
  appId: firebaseConfig.appId ? '✅ Set' : '❌ Missing'
});

// Initialize Firebase only if it hasn't been initialized
console.log('🔥 Existing Firebase apps:', getApps().length);
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
console.log('🔥 Firebase app initialized:', app ? '✅ Success' : '❌ Failed');

// Initialize services
console.log('🔥 Initializing Firebase services...');
export const db = getFirestore(app);
console.log('🔥 Firestore initialized:', db ? '✅ Success' : '❌ Failed');

export const auth = getAuth(app);
console.log('🔥 Auth initialized:', auth ? '✅ Success' : '❌ Failed');

export const storage = getStorage(app);
console.log('🔥 Storage initialized:', storage ? '✅ Success' : '❌ Failed');

console.log('🔥 All Firebase services ready!');

export default app;