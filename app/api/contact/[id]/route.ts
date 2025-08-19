import { NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import { readMessages } from '@/lib/contactStore';
import { put } from '@vercel/blob';

const BLOB_ACCESS: 'public' | 'private' = (process.env.CONTACT_BLOB_ACCESS === 'private' ? 'private' : 'public');

// Helper: fetch existing blob via readMessages then find by id (inefficient but acceptable for small volume)
export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  // @ts-expect-error casting
  const token = await getToken({ req: request, secret: process.env.AUTH_SECRET });
  if(!token) return NextResponse.json({ error: 'Unauthorized' }, { status:401 });

  const { status } = await request.json() as { status?: 'read' | 'archived' | 'new' };
  if(!status || !['read','archived','new'].includes(status)){
    return NextResponse.json({ error: 'Invalid status' }, { status:400 });
  }
  const messages = await readMessages();
  const existing = messages.find(m => m.id === params.id);
  if(!existing) return NextResponse.json({ error: 'Not found' }, { status:404 });
  const updated = { ...existing, status };
  try {
    await put(`contacts/${updated.id}.json`, JSON.stringify(updated), { access: BLOB_ACCESS, contentType: 'application/json' });
    return NextResponse.json({ ok: true, updated });
  } catch {
    return NextResponse.json({ error: 'Update failed' }, { status:500 });
  }
}
