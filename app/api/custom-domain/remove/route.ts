import { NextRequest, NextResponse } from 'next/server';
import { removeCustomDomain } from '@/lib/store';
import { getFirebaseAdminApp } from '@/lib/firebase-admin';

export async function DELETE(req: NextRequest) {
  try {
    // Verify user authentication
    const idToken = req.headers.get('Authorization')?.split('Bearer ')[1];
    if (!idToken) {
      return NextResponse.json({ success: false, message: 'Unauthorized.' }, { status: 401 });
    }

    const admin = await getFirebaseAdminApp();
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    const userId = decodedToken.uid;

    // Check if user is premium
    const db = admin.firestore();
    const userDoc = await db.collection('users').doc(userId).get();
    if (!userDoc.exists || !userDoc.data()?.isPremium) {
      return NextResponse.json({ success: false, message: 'Premium subscription required for custom domains.' }, { status: 403 });
    }

    await removeCustomDomain(userId);

    return NextResponse.json({
      success: true,
      message: 'Custom domain removed successfully.'
    });
  } catch (error: any) {
    console.error('API Error removing custom domain:', error);
    return NextResponse.json({ success: false, message: error.message || 'Failed to remove custom domain.' }, { status: 500 });
  }
}