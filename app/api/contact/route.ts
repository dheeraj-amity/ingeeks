import { NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import { appendMessage, readMessages } from '@/lib/contactStore';

// Simple in-memory rate limit placeholder (still memory-based)
const recent = new Map<string, number>();

function validateEmail(email: string){
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export async function POST(request: Request){
  try {
    const data = await request.json();
    const { name: rawName, email: rawEmail, message: rawMessage, honeypot } = data as { name?: string; email?: string; message?: string; honeypot?: string };
    if(honeypot){
      return NextResponse.json({ ok: true }); // silently ignore bots
    }
    if(!rawName || !rawEmail || !rawMessage) return NextResponse.json({ error: 'Missing fields'}, { status:400 });
    const name = rawName.trim();
    const email = rawEmail.trim().toLowerCase();
    const message = rawMessage.trim();
    if(name.length > 100) return NextResponse.json({ error: 'Name too long'},{ status:400 });
    if(message.length > 1000) return NextResponse.json({ error: 'Message too long'},{ status:400 });
    if(!validateEmail(email)) return NextResponse.json({ error: 'Invalid email'},{ status:400 });

    const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'local';
    const ua = request.headers.get('user-agent') || 'unknown';
    const now = Date.now();
    const last = recent.get(ip) || 0;
    if(now - last < 5000){
      return NextResponse.json({ error: 'Too many requests' }, { status:429 });
    }
    recent.set(ip, now);

    const entry = { id: crypto.randomUUID(), name, email, message, createdAt: new Date().toISOString(), ip, userAgent: ua, status: 'new' as const };
    await appendMessage(entry);

    return NextResponse.json({ ok:true, id: entry.id });
  } catch {
    return NextResponse.json({ error: 'Server error'}, { status:500 });
  }
}

export async function GET(request: Request){
  // @ts-expect-error: casting generic Request to satisfy getToken context
  const token = await getToken({ req: request, secret: process.env.AUTH_SECRET });
  if(!token) return NextResponse.json({ error: 'Unauthorized' }, { status:401 });
  const url = new URL(request.url);
  const statusFilter = url.searchParams.get('status');
  let messages = await readMessages();
  if(statusFilter){
    messages = messages.filter(m => m.status === statusFilter);
  }
  // Sort newest first just in case store didn't
  messages.sort((a,b)=> new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  return NextResponse.json(messages);
}
