"use client";
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

interface ContactMessage {
  id: string;
  name: string;
  email: string;
  message: string;
  createdAt: string;
  ip: string;
}

export default function AdminContactsPage(){
  const { data: session, status } = useSession();
  const router = useRouter();
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(()=> {
    if(status === 'loading') return;
    if(!session){ router.replace('/admin'); return; }
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status, session]);

  async function load(){
    try {
      setLoading(true);
      const res = await fetch('/api/contact');
      if(!res.ok) throw new Error('Failed to load');
      const data = await res.json();
      setMessages(data.messages || []);
    } catch(e:any){
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  async function refresh(){
    setRefreshing(true);
    await load();
    setRefreshing(false);
  }

  if(status === 'loading' || loading) return <div className="py-20 container text-sm text-slate-400">Loading...</div>;

  return (
    <div className="py-16 container space-y-8">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <h1 className="text-3xl font-bold tracking-tight">Contact Messages</h1>
        <button onClick={refresh} disabled={refreshing} className="text-xs px-3 py-2 rounded bg-slate-700 hover:bg-slate-600 disabled:opacity-50">{refreshing ? 'Refreshing...' : 'Refresh'}</button>
      </div>
      {error && <div className="p-3 rounded bg-red-500/10 border border-red-500/30 text-sm text-red-300">{error}</div>}
      {messages.length === 0 && <p className="text-sm text-slate-400">No messages yet.</p>}
      <ul className="space-y-4">
        {messages.map(m => (
          <li key={m.id} className="rounded-lg border border-slate-700 bg-slate-800/40 p-4">
            <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
              <div className="text-sm font-semibold">{m.name} <span className="text-slate-500 font-normal">&lt;{m.email}&gt;</span></div>
              <div className="text-[11px] text-slate-500">{new Date(m.createdAt).toLocaleString()}</div>
            </div>
            <p className="text-sm whitespace-pre-line leading-relaxed text-slate-200">{m.message}</p>
            <div className="mt-2 text-[10px] uppercase tracking-wide text-slate-500">IP: {m.ip}</div>
          </li>
        ))}
      </ul>
    </div>
  );
}
