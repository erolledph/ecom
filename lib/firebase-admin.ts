let adminApp: any = null;

export async function getFirebaseAdminApp() {
  // Only run on server side
  if (typeof window !== 'undefined') {
    throw new Error('Firebase Admin SDK can only be used on the server side');
  }

  if (adminApp) {
    return adminApp;
  }

  try {
    const admin = require('firebase-admin');
    
    // Check if a Firebase app has already been initialized
    if (!admin.apps.length) {
      adminApp = admin.initializeApp({
        credential: admin.credential.cert({
          projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
          clientEmail: process.env.FIREBASE_ADMIN_CLIENT_EMAIL,
          privateKey: process.env.FIREBASE_ADMIN_PRIVATE_KEY?.replace(/\\n/g, '\n'),
        }),
      });
    } else {
      adminApp = admin.apps[0];
    }

    return admin;
  } catch (error) {
    console.error('Firebase admin initialization error:', error);
    throw error;
  }
}