import { promises as fs } from 'fs';
import path from 'path';
// Optional Vercel Blob (installed via @vercel/blob)
// Will be tree-shaken if not used.
let blobClient: typeof import('@vercel/blob') | null = null;
let MIGRATION_IN_PROGRESS = false;
let MIGRATION_COMPLETED = false;

export interface ContactMessageRecord {
  id: string;
  name: string;
  email: string;
  message: string;
  createdAt: string;
  ip: string;
  status?: 'new' | 'read' | 'archived';
  userAgent?: string;
}

const FILE_PATH = path.join(process.cwd(), 'data', 'contactMessages.json');
const USE_BLOB = Boolean(process.env.BLOB_READ_WRITE_TOKEN);

async function ensureFile(){
  try { await fs.access(FILE_PATH); } catch { await fs.mkdir(path.dirname(FILE_PATH), { recursive: true }); await fs.writeFile(FILE_PATH, JSON.stringify({ messages: [] }, null, 2)); }
}

async function ensureBlobClient(){
  if(!blobClient){
    try { blobClient = await import('@vercel/blob'); } catch { blobClient = null; }
  }
  return blobClient;
}

// FILESYSTEM IMPLEMENTATION
async function fsRead(): Promise<ContactMessageRecord[]> {
  await ensureFile();
  const raw = await fs.readFile(FILE_PATH, 'utf8');
  try { const parsed = JSON.parse(raw); return Array.isArray(parsed.messages) ? parsed.messages : []; } catch { return []; }
}
async function fsAppend(msg: ContactMessageRecord){
  const messages = await fsRead();
  messages.unshift(msg);
  await fs.writeFile(FILE_PATH, JSON.stringify({ messages }, null, 2));
}

// BLOB IMPLEMENTATION (one blob per message under prefix contacts/)
async function blobRead(): Promise<ContactMessageRecord[]> {
  const mod = await ensureBlobClient();
  if(!mod) return [];
  const { list } = mod;
  const { blobs } = await list({ prefix: 'contacts/' });

  // If no blobs yet, attempt one-time migration from file store.
  if(blobs.length === 0 && !MIGRATION_COMPLETED && !MIGRATION_IN_PROGRESS){
    await migrateToBlob();
    const after = await list({ prefix: 'contacts/' });
    return fetchBlobEntries(after.blobs);
  }

  return fetchBlobEntries(blobs);
}

async function fetchBlobEntries(blobs: { uploadedAt?: string; url: string; }[]): Promise<ContactMessageRecord[]>{
  const sorted = [...blobs].sort((a,b)=> (b.uploadedAt && a.uploadedAt) ? (new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime()) : 0);
  const limited = sorted.slice(0, 200);
  const results = await Promise.all(limited.map(async b => {
    try {
      const res = await fetch(b.url);
      if(!res.ok) return null;
      return await res.json() as ContactMessageRecord;
    } catch { return null; }
  }));
  return results.filter(Boolean) as ContactMessageRecord[];
}

async function blobAppend(msg: ContactMessageRecord){
  const mod = await ensureBlobClient();
  if(!mod) throw new Error('Blob module not available');
  const { put } = mod;
  await put(`contacts/${msg.id}.json`, JSON.stringify(msg), { access: 'private', contentType: 'application/json' });
}

// PUBLIC API (auto selects storage backend)
export async function readMessages(): Promise<ContactMessageRecord[]> {
  return USE_BLOB ? blobRead() : fsRead();
}

export async function appendMessage(msg: ContactMessageRecord){
  return USE_BLOB ? blobAppend(msg) : fsAppend(msg);
}

// One-time migration helper. Called automatically but also exported for manual triggering.
export async function migrateToBlob(): Promise<{ migrated: number }>{
  if(!USE_BLOB) return { migrated: 0 };
  if(MIGRATION_COMPLETED || MIGRATION_IN_PROGRESS) return { migrated: 0 };
  MIGRATION_IN_PROGRESS = true;
  try {
    const existingFileMessages = await fsRead();
    if(existingFileMessages.length === 0){
      MIGRATION_COMPLETED = true;
      return { migrated: 0 };
    }
    const mod = await ensureBlobClient();
    if(!mod){
      return { migrated: 0 };
    }
    const { list, put } = mod;
    const { blobs } = await list({ prefix: 'contacts/' });
    if(blobs.length > 0){
      MIGRATION_COMPLETED = true; // Already migrated previously
      return { migrated: 0 };
    }
    let count = 0;
    // Upload oldest first so ordering (newest first later) still correct (we will reverse by uploadedAt)
    for(const msg of [...existingFileMessages].reverse()){
      try { await put(`contacts/${msg.id}.json`, JSON.stringify(msg), { access: 'private', contentType: 'application/json' }); count++; } catch { /* ignore individual upload errors */ }
    }
    MIGRATION_COMPLETED = true;
    return { migrated: count };
  } finally {
    MIGRATION_IN_PROGRESS = false;
  }
}
