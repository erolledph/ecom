import { NextRequest, NextResponse } from 'next/server';
import { addCustomDomain } from '@/lib/store';
import admin from '@/lib/firebase-admin';

export async function POST(req: NextRequest) {
  try {
    const { domain } = await req.json();

    if (!domain) {
      return NextResponse.json({ success: false, message: 'Domain is required.' }, { status: 400 });
    }

    // Validate domain format
    const domainRegex = /^[a-zA-Z0-9][a-zA-Z0-9-]{0,61}[a-zA-Z0-9]?\.[a-zA-Z]{2,}$/;
    if (!domainRegex.test(domain)) {
      return NextResponse.json({ success: false, message: 'Invalid domain format. Please enter a valid domain (e.g., example.com).' }, { status: 400 });
    }

    // Verify user authentication
    const idToken = req.headers.get('Authorization')?.split('Bearer ')[1];
    if (!idToken) {
      return NextResponse.json({ success: false, message: 'Unauthorized.' }, { status: 401 });
    }

    const decodedToken = await admin.auth().verifyIdToken(idToken);
    const userId = decodedToken.uid;

    // Check if user is premium
    const db = admin.firestore();
    const userDoc = await db.collection('users').doc(userId).get();
    if (!userDoc.exists || !userDoc.data()?.isPremium) {
      return NextResponse.json({ success: false, message: 'Premium subscription required for custom domains.' }, { status: 403 });
    }

    const { verificationCode } = await addCustomDomain(userId, domain.toLowerCase());

    return NextResponse.json({
      success: true,
      message: 'Custom domain added. Please add the TXT record to your DNS settings.',
      verificationCode,
      txtRecordName: `_bolt-verify.${domain.toLowerCase()}`
    });
  } catch (error: any) {
    console.error('API Error adding custom domain:', error);
    return NextResponse.json({ success: false, message: error.message || 'Failed to add custom domain.' }, { status: 500 });
  }
}