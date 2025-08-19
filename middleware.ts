import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function middleware(req: NextRequest){
  const { pathname } = req.nextUrl;

  // Allow Next internal, auth, assets, og
  if (pathname.startsWith('/_next') || pathname.startsWith('/api/auth') || pathname.startsWith('/favicon') || pathname.startsWith('/og')) {
    return NextResponse.next();
  }

  const token = await getToken({ req, secret: process.env.AUTH_SECRET });

  // If visiting /admin (login page) while already authenticated -> redirect to dashboard
  if(pathname === '/admin'){
    if(token){
      const url = req.nextUrl.clone();
      url.pathname = '/admin/dashboard';
      return NextResponse.redirect(url);
    }
    // Not logged in -> allow to see login page (no redirect of public users)
    const res = NextResponse.next();
    if((req.headers.get('accept')||'').includes('text/html')) res.headers.set('Cache-Control','no-store, must-revalidate');
    return res;
  }

  // Protect deeper admin routes (/admin/* except root)
  if(pathname.startsWith('/admin/')){
    if(!token){
      const url = req.nextUrl.clone();
      url.pathname = '/admin';
      url.searchParams.set('callbackUrl', pathname);
      return NextResponse.redirect(url);
    }
  }

  // Everything else is public (remove previous publicSiteEnabled gating)
  const res = NextResponse.next();
  if((req.headers.get('accept')||'').includes('text/html')){
    res.headers.set('Cache-Control','no-store, must-revalidate');
  }
  return res;
}

export const config = { matcher: ['/:path*'] };
