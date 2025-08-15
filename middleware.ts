import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

const PROTECTED = [/^\/admin(\/.*)?$/];

export async function middleware(req: NextRequest){
  const { pathname } = req.nextUrl;
  const needsAuth = PROTECTED.some(r=> r.test(pathname)) && pathname !== '/admin';
  if(!needsAuth) return NextResponse.next();
  const token = await getToken({ req, secret: process.env.AUTH_SECRET });
  if(!token){
    const url = req.nextUrl.clone();
    url.pathname = '/admin';
    url.searchParams.set('callbackUrl', pathname);
    return NextResponse.redirect(url);
  }
  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*']
};
