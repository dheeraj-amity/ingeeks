"use client";
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState, useMemo } from 'react';

interface ContactMessage {
  id: string;
  name: string;
  email: string;
  message: string;
  createdAt: string;
  ip: string;
  status?: 'new' | 'read' | 'archived';
}

const STATUS_COLORS: Record<string,string> = {
  new: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30',
  read: 'bg-blue-500/15 text-blue-300 border-blue-500/30',
  archived: 'bg-slate-500/15 text-slate-300 border-slate-500/30'
};

export default function AdminContactsPage(){
  const { data: session, status } = useSession();
  const router = useRouter();
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [filter, setFilter] = useState<'all'|'new'|'read'|'archived'>('all');

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
      const data: ContactMessage[] = await res.json();
      setMessages(data || []);
    } catch(err: unknown){
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  }

  async function refresh(){
    setRefreshing(true);
    await load();
    setRefreshing(false);
  }

  async function updateStatus(id: string, status: 'new'|'read'|'archived'){
    try {
      await fetch(`/api/contact/${id}`, { method:'PATCH', headers:{ 'Content-Type':'application/json' }, body: JSON.stringify({ status }) });
      setMessages(msgs => msgs.map(m => m.id === id ? { ...m, status } : m));
    } catch {/* ignore */}
  }

  const filtered = useMemo(()=> filter === 'all' ? messages : messages.filter(m => (m.status||'new') === filter), [messages, filter]);
  const counts = useMemo<Record<'all'|'new'|'read'|'archived', number>>(()=> ({
    all: messages.length,
    new: messages.filter(m => (m.status||'new')==='new').length,
    read: messages.filter(m => m.status==='read').length,
    archived: messages.filter(m => m.status==='archived').length
  }), [messages]);

  if(status === 'loading' || loading) return <div className="py-20 container text-sm text-slate-400">Loading...</div>;

  return (
    <div className="py-16 container space-y-8">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <h1 className="text-3xl font-bold tracking-tight">Contact Messages</h1>
        <div className="flex items-center gap-2">
          {(['all','new','read','archived'] as const).map(s => (
            <button key={s} onClick={()=>setFilter(s)} className={`text-xs px-3 py-1.5 rounded border transition ${filter===s ? 'bg-brand-accent text-[#0d1422] border-brand-accent' : 'border-slate-600 hover:border-brand-accent/60 text-slate-300'}`}>{s} ({counts[s]})</button>
          ))}
          <button onClick={refresh} disabled={refreshing} className="text-xs px-3 py-2 rounded bg-slate-700 hover:bg-slate-600 disabled:opacity-50">{refreshing ? 'Refreshing...' : 'Refresh'}</button>
        </div>
      </div>
      {error && <div className="p-3 rounded bg-red-500/10 border border-red-500/30 text-sm text-red-300">{error}</div>}
      {filtered.length === 0 && <p className="text-sm text-slate-400">No messages.</p>}
      <div className="overflow-x-auto rounded-lg border border-slate-700/60">
        <table className="min-w-full text-sm">
          <thead className="bg-slate-800/60 text-slate-300">
            <tr>
              <th className="text-left px-4 py-2 font-medium">Name</th>
              <th className="text-left px-4 py-2 font-medium">Email</th>
              <th className="text-left px-4 py-2 font-medium w-[40%]">Message</th>
              <th className="text-left px-4 py-2 font-medium">Status</th>
              <th className="text-left px-4 py-2 font-medium">Received</th>
              <th className="text-left px-4 py-2 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(m => (
              <tr key={m.id} className="border-t border-slate-700/50 align-top">
                <td className="px-4 py-2 whitespace-nowrap font-medium text-slate-200">{m.name}</td>
                <td className="px-4 py-2 text-slate-300"><a href={`mailto:${m.email}`} className="underline decoration-dotted hover:text-brand-accent">{m.email}</a></td>
                <td className="px-4 py-2 text-slate-300"><div className="max-h-40 overflow-y-auto pr-1 whitespace-pre-line">{m.message}</div></td>
                <td className="px-4 py-2"><span className={`inline-block text-[11px] px-2 py-1 rounded border ${STATUS_COLORS[m.status||'new']}`}>{m.status||'new'}</span></td>
                <td className="px-4 py-2 text-[11px] text-slate-400 whitespace-nowrap">{new Date(m.createdAt).toLocaleString()}</td>
                <td className="px-4 py-2 space-x-1">
                  {m.status !== 'read' && <button onClick={()=>updateStatus(m.id,'read')} className="text-[11px] px-2 py-1 rounded bg-blue-600 hover:bg-blue-500">Mark Read</button>}
                  {m.status !== 'archived' && <button onClick={()=>updateStatus(m.id,'archived')} className="text-[11px] px-2 py-1 rounded bg-slate-600 hover:bg-slate-500">Archive</button>}
                  {m.status === 'archived' && <button onClick={()=>updateStatus(m.id,'new')} className="text-[11px] px-2 py-1 rounded bg-emerald-600 hover:bg-emerald-500">Restore</button>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
