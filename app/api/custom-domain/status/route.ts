import { NextRequest, NextResponse } from 'next/server';
import { getUserStore } from '@/lib/store';
import { getFirebaseAdminApp } from '@/lib/firebase-admin';

export async function GET(req: NextRequest) {
  try {
    // Verify user authentication
    const idToken = req.headers.get('Authorization')?.split('Bearer ')[1];
    if (!idToken) {
      return NextResponse.json({ success: false, message: 'Unauthorized.' }, { status: 401 });
    }

    const admin = await getFirebaseAdminApp();
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    const userId = decodedToken.uid;

    const userStore = await getUserStore(userId);

    if (!userStore || !userStore.customDomain) {
      return NextResponse.json({ success: true, message: 'No custom domain configured.', status: null });
    }

    return NextResponse.json({
      success: true,
      message: 'Custom domain status retrieved.',
      status: {
        customDomain: userStore.customDomain,
        domainVerificationCode: userStore.domainVerificationCode,
        domainVerified: userStore.domainVerified,
        sslStatus: userStore.sslStatus,
        customDomainEnabled: userStore.customDomainEnabled,
        dnsInstructions: userStore.domainVerified ? [
          { type: 'A', name: '@', value: '75.2.60.5' },
          { type: 'CNAME', name: 'www', value: process.env.NEXT_PUBLIC_NETLIFY_SITE_NAME || 'your-netlify-site.netlify.app' }
        ] : []
      }
    });
  } catch (error: any) {
    console.error('API Error getting custom domain status:', error);
    return NextResponse.json({ success: false, message: error.message || 'Failed to get custom domain status.' }, { status: 500 });
  }
}