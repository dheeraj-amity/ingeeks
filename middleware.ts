import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function middleware(req: NextRequest){
  const { pathname } = req.nextUrl;

  // Allow static and auth paths
  if (pathname.startsWith('/_next') || pathname.startsWith('/api/auth') || pathname.startsWith('/favicon') || pathname.startsWith('/og')) {
    return NextResponse.next();
  }

  const token = await getToken({ req, secret: process.env.AUTH_SECRET });

  // Logged in admin -> force everything to dashboard (except existing admin routes)
  if (token) {
    if (pathname === '/admin') {
      const url = req.nextUrl.clone();
      url.pathname = '/admin/dashboard';
      return NextResponse.redirect(url);
    }
    if (!pathname.startsWith('/admin')) {
      const url = req.nextUrl.clone();
      url.pathname = '/admin/dashboard';
      return NextResponse.redirect(url);
    }
  } else {
    // Not logged in -> only allow /admin (login page)
    if (pathname !== '/admin' && !pathname.startsWith('/admin/dashboard')) { // if they somehow try dashboard, send to login
      const url = req.nextUrl.clone();
      url.pathname = '/admin';
      url.searchParams.set('callbackUrl', '/admin/dashboard');
      return NextResponse.redirect(url);
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
