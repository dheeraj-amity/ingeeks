import { NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import { appendMessage, readMessages } from '@/lib/contactStore';

// Simple in-memory rate limit placeholder (still memory-based)
const recent = new Map<string, number>();

export async function POST(request: Request){
  try {
    const data = await request.json();
    const { name, email, message } = data as { name?: string; email?: string; message?: string };
    if(!name || !email || !message) return NextResponse.json({ error: 'Missing fields'}, { status:400 });

    const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'local';
    const now = Date.now();
    const last = recent.get(ip) || 0;
    if(now - last < 5000){
      return NextResponse.json({ error: 'Too many requests' }, { status:429 });
    }
    recent.set(ip, now);

    const entry = { id: crypto.randomUUID(), name, email, message, createdAt: new Date().toISOString(), ip };
    await appendMessage(entry);

    return NextResponse.json({ ok:true });
  } catch {
    return NextResponse.json({ error: 'Server error'}, { status:500 });
  }
}

export async function GET(request: Request){
  // @ts-expect-error: casting generic Request to satisfy getToken context
  const token = await getToken({ req: request, secret: process.env.AUTH_SECRET });
  if(!token) return NextResponse.json({ error: 'Unauthorized' }, { status:401 });
  const messages = await readMessages();
  return NextResponse.json({ messages });
}
