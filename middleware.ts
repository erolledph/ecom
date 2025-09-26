import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getStoreByCustomDomain } from '@/lib/store';

// Define your main domain
const MAIN_DOMAIN = 'tiangge.shop';
const LOCALHOST_DOMAINS = ['localhost', '127.0.0.1'];

export async function middleware(request: NextRequest) {
  const hostname = request.nextUrl.hostname;
  const path = request.nextUrl.pathname;

  // Allow API routes, static files, and Next.js internal routes to pass through
  if (
    path.startsWith('/api') ||
    path.startsWith('/_next/static') ||
    path.startsWith('/_next/image') ||
    path.startsWith('/favicon.ico') ||
    path.startsWith('/vercel.svg') ||
    path.startsWith('/default-avatar.webp') ||
    path.startsWith('/auth') ||
    path.startsWith('/dashboard')
  ) {
    return NextResponse.next();
  }

  // If the hostname is the main domain or localhost, let Next.js handle it normally
  if (hostname === MAIN_DOMAIN || LOCALHOST_DOMAINS.includes(hostname)) {
    return NextResponse.next();
  }

  // If it's a custom domain, try to find the store
  try {
    const store = await getStoreByCustomDomain(hostname);

    if (store && store.slug) {
      // Rewrite the URL to the store's slug page
      const url = request.nextUrl.clone();
      url.pathname = `/${store.slug}${path === '/' ? '' : path}`;
      return NextResponse.rewrite(url);
    } else {
      // If no store found for the custom domain, redirect to main domain
      const url = request.nextUrl.clone();
      url.hostname = MAIN_DOMAIN;
      url.pathname = '/';
      return NextResponse.redirect(url);
    }
  } catch (error) {
    console.error('Middleware error:', error);
    // In case of an error, redirect to the main domain
    const url = request.nextUrl.clone();
    url.hostname = MAIN_DOMAIN;
    url.pathname = '/';
    return NextResponse.redirect(url);
  }
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|vercel.svg|default-avatar.webp|auth|dashboard|api).*)',
  ],
};