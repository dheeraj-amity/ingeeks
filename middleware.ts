import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

// Helper to read flag cookies set by /api/admin/settings
function readFlagCookies(req: NextRequest){
  const publicSiteEnabled = req.cookies.get('publicSiteEnabled')?.value === '1';
  const rememberMe = req.cookies.get('rememberMe')?.value === '1';
  const sessionTimeoutMinutes = parseInt(req.cookies.get('sessionTimeoutMinutes')?.value || '30', 10);
  return { publicSiteEnabled, rememberMe, sessionTimeoutMinutes };
}

export async function middleware(req: NextRequest){
  const { pathname } = req.nextUrl;
  const { publicSiteEnabled, rememberMe, sessionTimeoutMinutes } = readFlagCookies(req);

  // Allow static and auth paths
  if (pathname.startsWith('/_next') || pathname.startsWith('/api/auth') || pathname.startsWith('/favicon') || pathname.startsWith('/og')) {
    return NextResponse.next();
  }

  const token = await getToken({ req, secret: process.env.AUTH_SECRET });

  // If public site enabled, allow non-admin marketing pages for unauthenticated users
  const isAdminPath = pathname.startsWith('/admin');
  if(!token && publicSiteEnabled && !isAdminPath){
    const res = NextResponse.next();
    const accept = req.headers.get('accept') || '';
    if(accept.includes('text/html')) res.headers.set('Cache-Control','no-store, must-revalidate');
    return res;
  }

  // Logged in admin -> force everything non-admin to dashboard (retain prior behavior)
  if (token) {
    if (pathname === '/admin') {
      const url = req.nextUrl.clone();
      url.pathname = '/admin/dashboard';
      return NextResponse.redirect(url);
    }
    if (!isAdminPath) {
      const url = req.nextUrl.clone();
      url.pathname = '/admin/dashboard';
      return NextResponse.redirect(url);
    }
  } else {
    // Not logged in -> only allow /admin (login) + any public marketing pages if disabled
    if (!publicSiteEnabled) {
      if (pathname !== '/admin') {
        const url = req.nextUrl.clone();
        url.pathname = '/admin';
        url.searchParams.set('callbackUrl', '/admin/dashboard');
        return NextResponse.redirect(url);
      }
    } else {
      // public enabled: still block direct dashboard
      if (pathname.startsWith('/admin/dashboard')) {
        const url = req.nextUrl.clone();
        url.pathname = '/admin';
        url.searchParams.set('callbackUrl', '/admin/dashboard');
        return NextResponse.redirect(url);
      }
    }
  }

  const res = NextResponse.next();
  const accept = req.headers.get('accept') || '';
  if(accept.includes('text/html')){
    res.headers.set('Cache-Control','no-store, must-revalidate');
  }
  return res;
}

export const config = { matcher: ['/:path*'] };
