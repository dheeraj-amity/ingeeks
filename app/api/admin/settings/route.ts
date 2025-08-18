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
  const token = await getToken({ req: req as unknown as any, secret: process.env.AUTH_SECRET });
  if(!token) return false;
  return true; // extend role checks if multiple roles
}

function settingsCookies(res: NextResponse){
  // Minimal subset exposed to middleware
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
