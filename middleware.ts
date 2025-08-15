import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

const PROTECTED = [/^\/admin(\/.*)?$/];

export async function middleware(req: NextRequest){
  const { pathname } = req.nextUrl;
  const needsAuth = PROTECTED.some(r=> r.test(pathname)) && pathname !== '/admin';
  const token = needsAuth ? await getToken({ req, secret: process.env.AUTH_SECRET }) : null;
  if(needsAuth && !token){
    const url = req.nextUrl.clone();
    url.pathname = '/admin';
    url.searchParams.set('callbackUrl', pathname);
    return NextResponse.redirect(url);
  }
  const res = NextResponse.next();
  // Set no-store for HTML to always fetch latest
  const accept = req.headers.get('accept') || '';
  if(accept.includes('text/html')){
    res.headers.set('Cache-Control','no-store, must-revalidate');
  }
  return res;
}

export const config = {
  matcher: ['/admin/:path*','/:path*']
};
