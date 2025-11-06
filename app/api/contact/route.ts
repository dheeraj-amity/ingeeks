import { NextResponse } from 'next/server';

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
    try {
      await appendMessage(entry);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      if(msg.includes('BLOB_CLIENT_UNAVAILABLE')){
        return NextResponse.json({ error: 'Blob client unavailable. Ensure @vercel/blob installed.' }, { status:500 });
      }
      if(msg.startsWith('BLOB_PUT_FAILED:')){
        return NextResponse.json({ error: msg.replace('BLOB_PUT_FAILED:','Blob write failed: ') }, { status:500 });
      }
      if(msg.includes('EROFS') || msg.toLowerCase().includes('read-only')){
        return NextResponse.json({ error: 'Storage not writable. Set BLOB_READ_WRITE_TOKEN or use writable env.' }, { status:500 });
      }
      return NextResponse.json({ error: 'Persist failed' }, { status:500 });
    }

    return NextResponse.json({ ok:true, id: entry.id });
  } catch {
    return NextResponse.json({ error: 'Server error'}, { status:500 });
  }
}

// GET method removed - was admin-only functionality
