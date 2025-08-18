import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

// Helper to read flag cookies set by /api/admin/settings
function readFlagCookies(req: NextRequest){
  const publicSiteEnabled = req.cookies.get('publicSiteEnabled')?.value === '1';
  const sessionTimeoutMinutes = parseInt(req.cookies.get('sessionTimeoutMinutes')?.value || '30', 10);
  const rememberMe = req.cookies.get('rememberMe')?.value === '1';
  return { publicSiteEnabled, sessionTimeoutMinutes, rememberMe };
}

export async function middleware(req: NextRequest){
  const { pathname } = req.nextUrl;
  const { publicSiteEnabled } = readFlagCookies(req);

  // Allow static and auth paths
  if (pathname.startsWith('/_next') || pathname.startsWith('/api/auth') || pathname.startsWith('/favicon') || pathname.startsWith('/og')) {
    return NextResponse.next();
  }

  const token = await getToken({ req, secret: process.env.AUTH_SECRET });
  const isAdminPath = pathname.startsWith('/admin');

  if(token){
    // Logged in: only redirect /admin root to dashboard; allow browsing public pages now.
    if(pathname === '/admin'){
      const url = req.nextUrl.clone();
      url.pathname = '/admin/dashboard';
      return NextResponse.redirect(url);
    }
    // Access to /admin/* allowed; public pages pass through.
  } else {
    // Not logged in
    if(pathname.startsWith('/admin/dashboard')){
      const url = req.nextUrl.clone();
      url.pathname = '/admin';
      url.searchParams.set('callbackUrl','/admin/dashboard');
      return NextResponse.redirect(url);
    }
    if(!publicSiteEnabled && !isAdminPath){
      const url = req.nextUrl.clone();
      url.pathname = '/admin';
      url.searchParams.set('callbackUrl','/');
      return NextResponse.redirect(url);
    }
  }

  const res = NextResponse.next();
  if((req.headers.get('accept')||'').includes('text/html')){
    res.headers.set('Cache-Control','no-store, must-revalidate');
  }
  return res;
}

export const config = { matcher: ['/:path*'] };
