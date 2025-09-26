import { NextRequest, NextResponse } from 'next/server';
import { addCustomDomain } from '@/lib/store';
import { getFirebaseAdminApp } from '@/lib/firebase-admin';

export async function POST(req: NextRequest) {
  try {
    console.log('Custom domain add API called');
    
    const { domain } = await req.json();
    console.log('Domain received:', domain);

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
    console.log('ID Token present:', !!idToken);
    
    if (!idToken) {
      return NextResponse.json({ success: false, message: 'Unauthorized.' }, { status: 401 });
    }

    console.log('Initializing Firebase Admin...');
    const admin = await getFirebaseAdminApp();
    console.log('Firebase Admin initialized successfully');
    
    console.log('Verifying ID token...');
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    const userId = decodedToken.uid;
    console.log('User ID:', userId);

    // Check if user is premium
    console.log('Checking user premium status...');
    const db = admin.firestore();
    const userDoc = await db.collection('users').doc(userId).get();
    console.log('User doc exists:', userDoc.exists);
    console.log('User data:', userDoc.data());
    
    if (!userDoc.exists || !userDoc.data()?.isPremium) {
      return NextResponse.json({ success: false, message: 'Premium subscription required for custom domains.' }, { status: 403 });
    }

    console.log('Adding custom domain...');
    const { verificationCode } = await addCustomDomain(userId, domain.toLowerCase());
    console.log('Custom domain added successfully');

    return NextResponse.json({
      success: true,
      message: 'Custom domain added. Please add the TXT record to your DNS settings.',
      verificationCode,
      txtRecordName: `_bolt-verify.${domain.toLowerCase()}`
    });
  } catch (error: any) {
    console.error('API Error adding custom domain:', error);
    console.error('Error stack:', error.stack);
    console.error('Error details:', {
      name: error.name,
      message: error.message,
      code: error.code
    });
    return NextResponse.json({ success: false, message: error.message || 'Failed to add custom domain.' }, { status: 500 });
  }
}