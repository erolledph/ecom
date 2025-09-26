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
      // Validate required environment variables
      const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
      const clientEmail = process.env.FIREBASE_ADMIN_CLIENT_EMAIL;
      const privateKey = process.env.FIREBASE_ADMIN_PRIVATE_KEY;

      if (!projectId || !clientEmail || !privateKey) {
        throw new Error('Missing required Firebase Admin SDK environment variables. Please check NEXT_PUBLIC_FIREBASE_PROJECT_ID, FIREBASE_ADMIN_CLIENT_EMAIL, and FIREBASE_ADMIN_PRIVATE_KEY in your environment.');
      }

      // Initialize with proper credential object
      adminApp = admin.initializeApp({
        credential: admin.credential.cert({
          projectId: projectId,
          clientEmail: clientEmail,
          privateKey: privateKey.replace(/\\n/g, '\n'), // Handle escaped newlines
        }),
        // Add other config if needed
        storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
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
