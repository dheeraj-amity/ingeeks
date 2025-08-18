import { promises as fs } from 'fs';
import path from 'path';

// Simple JSON file persistence for contact messages. Not for high concurrency.
export interface ContactMessageRecord {
  id: string;
  name: string;
  email: string;
  message: string;
  createdAt: string;
  ip: string;
}

const FILE_PATH = path.join(process.cwd(), 'data', 'contactMessages.json');

async function ensureFile(){
  try {
    await fs.access(FILE_PATH);
  } catch {
    await fs.mkdir(path.dirname(FILE_PATH), { recursive: true });
    await fs.writeFile(FILE_PATH, JSON.stringify({ messages: [] }, null, 2));
  }
}

export async function readMessages(): Promise<ContactMessageRecord[]> {
  await ensureFile();
  const raw = await fs.readFile(FILE_PATH, 'utf8');
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed.messages) ? parsed.messages : [];
  } catch {
    return [];
  }
}

export async function appendMessage(msg: ContactMessageRecord){
  const messages = await readMessages();
  messages.unshift(msg);
  await fs.writeFile(FILE_PATH, JSON.stringify({ messages }, null, 2));
}
