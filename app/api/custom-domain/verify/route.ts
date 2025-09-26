import { NextRequest, NextResponse } from 'next/server';
import { verifyCustomDomain, getUserStore } from '@/lib/store';
import { getFirebaseAdminApp } from '@/lib/firebase-admin';

export async function POST(req: NextRequest) {
  try {
    const { domain } = await req.json();

    if (!domain) {
      return NextResponse.json({ success: false, message: 'Domain is required.' }, { status: 400 });
    }

    // Verify user authentication
    const idToken = req.headers.get('Authorization')?.split('Bearer ')[1];
    if (!idToken) {
      return NextResponse.json({ success: false, message: 'Unauthorized.' }, { status: 401 });
    }

    const admin = await getFirebaseAdminApp();
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    const userId = decodedToken.uid;

    // Fetch the user's store to get the expected verification code
    const userStore = await getUserStore(userId);
    if (!userStore || userStore.customDomain !== domain || !userStore.domainVerificationCode) {
      return NextResponse.json({ success: false, message: 'Custom domain not configured or verification code missing.' }, { status: 400 });
    }

    // Rate limiting: Check verification attempts
    if (userStore.domainVerificationAttempts && userStore.domainVerificationAttempts >= 10) {
      return NextResponse.json({ 
        success: false, 
        message: 'Too many verification attempts. Please contact support.' 
      }, { status: 429 });
    }

    const isVerified = await verifyCustomDomain(userId, domain, userStore.domainVerificationCode);

    if (isVerified) {
      return NextResponse.json({
        success: true,
        message: 'Domain verified successfully! Please update your A/CNAME records.',
        isVerified: true,
        dnsInstructions: [
          { type: 'A', name: '@', value: '75.2.60.5' },
          { type: 'CNAME', name: 'www', value: process.env.NEXT_PUBLIC_NETLIFY_SITE_NAME || 'your-netlify-site.netlify.app' }
        ]
      });
    } else {
      return NextResponse.json({
        success: false,
        message: 'Domain verification failed. Please ensure the TXT record is correctly set and has propagated.',
        isVerified: false
      }, { status: 400 });
    }
  } catch (error: any) {
    console.error('API Error verifying custom domain:', error);
    return NextResponse.json({ success: false, message: error.message || 'Failed to verify custom domain.' }, { status: 500 });
  }
}