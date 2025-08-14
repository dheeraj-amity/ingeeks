import { NextResponse } from 'next/server';

// Simple in-memory rate limit placeholder
const recent = new Map<string, number>();

export async function POST(request: Request){
  try {
    const data = await request.json();
    const { name, email, message } = data || {};
    if(!name || !email || !message) return NextResponse.json({ error: 'Missing fields'}, { status:400 });

    const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'local';
    const now = Date.now();
    const last = recent.get(ip) || 0;
    if(now - last < 5000){
      return NextResponse.json({ error: 'Too many requests' }, { status:429 });
    }
    recent.set(ip, now);

    // Here you would send email / store in DB
    console.log('CONTACT_FORM', { name, email, message });

    return NextResponse.json({ ok:true });
  } catch {
    return NextResponse.json({ error: 'Server error'}, { status:500 });
  }
}
