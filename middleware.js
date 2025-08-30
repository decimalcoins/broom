import { NextResponse } from 'next/server';

const PUBLIC_PATHS = ['/', '/api/', '/auth', '/assets', '/favicon.ico', '/_next'];

export function middleware(req) {
  const url = req.nextUrl.clone();
  const path = url.pathname;

  // allow public paths
  if (PUBLIC_PATHS.some(p => path.startsWith(p))) return NextResponse.next();

  const cookie = req.cookies.get('pi_auth');
  if (!cookie) {
    // redirect to auth page
    url.pathname = '/auth';
    return NextResponse.redirect(url);
  }
  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/seller/:path*', '/checkout/:path*']
};
