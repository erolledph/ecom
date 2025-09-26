import { NextRequest, NextResponse } from 'next/server';
import { updateStore } from '@/lib/store';
import { getFirebaseAdminApp } from '@/lib/firebase-admin';

export async function PUT(req: NextRequest) {
  try {
    const updates = await req.json();

    // Verify user authentication
    const idToken = req.headers.get('Authorization')?.split('Bearer ')[1];
    if (!idToken) {
      return NextResponse.json({ success: false, message: 'Unauthorized.' }, { status: 401 });
    }

    const admin = await getFirebaseAdminApp();
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    const userId = decodedToken.uid;

    // For custom domain enabled toggle, check premium status
    if ('customDomainEnabled' in updates) {
      const db = admin.firestore();
      const userDoc = await db.collection('users').doc(userId).get();
      if (!userDoc.exists || !userDoc.data()?.isPremium) {
        return NextResponse.json({ success: false, message: 'Premium subscription required for custom domains.' }, { status: 403 });
      }
    }

    await updateStore(userId, updates);

    return NextResponse.json({
      success: true,
      message: 'Store updated successfully.'
    });
  } catch (error: any) {
    console.error('API Error updating store:', error);
    return NextResponse.json({ success: false, message: error.message || 'Failed to update store.' }, { status: 500 });
  }
}