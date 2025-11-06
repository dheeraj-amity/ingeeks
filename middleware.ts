import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(req: NextRequest){
  const { pathname } = req.nextUrl;

  // Allow Next internal, assets, og
  if (pathname.startsWith('/_next') || pathname.startsWith('/favicon') || pathname.startsWith('/og')) {
    return NextResponse.next();
  }

  // Set cache control for HTML requests
  const res = NextResponse.next();
  if((req.headers.get('accept')||'').includes('text/html')){
    res.headers.set('Cache-Control','no-store, must-revalidate');
  }
  return res;
}

export const config = { matcher: ['/:path*'] };
