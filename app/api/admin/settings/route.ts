import { NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';

// In-memory settings store (reset on redeploy). Replace with DB later.
let SETTINGS = {
  publicSiteEnabled: false,
  sessionTimeoutMinutes: 30,
  enableRateLimit: true,
  maxFailedAttempts: 5,
  rememberMe: false,
  auditLogEnabled: true,
  showStatusBar: true,
  enableLoadingFallback: true,
};

async function ensureAdmin(req: Request){
  // getToken expects a NextRequest / API request; runtime provides compatible object.
  // @ts-expect-error: Casting Request for getToken without introducing any.
  const token = await getToken({ req, secret: process.env.AUTH_SECRET });
  return Boolean(token);
}

function settingsCookies(res: NextResponse){
  res.cookies.set('publicSiteEnabled', SETTINGS.publicSiteEnabled ? '1':'0', { path: '/' });
  res.cookies.set('sessionTimeoutMinutes', String(SETTINGS.sessionTimeoutMinutes), { path: '/' });
  res.cookies.set('rememberMe', SETTINGS.rememberMe ? '1':'0', { path: '/' });
  return res;
}

export async function GET(req: Request){
  if(!(await ensureAdmin(req))) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const res = NextResponse.json(SETTINGS);
  return settingsCookies(res);
}

export async function PATCH(req: Request){
  if(!(await ensureAdmin(req))) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const body = await req.json();
  SETTINGS = { ...SETTINGS, ...body };
  const res = NextResponse.json(SETTINGS);
  return settingsCookies(res);
}

// NOTE: Cookies are used so edge middleware can read dynamic flags (no shared memory between API runtime & edge runtime).
