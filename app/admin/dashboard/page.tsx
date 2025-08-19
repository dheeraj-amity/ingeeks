"use client";
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

interface SettingsState { publicSiteEnabled: boolean; enableRateLimit: boolean; rememberMe: boolean; auditLogEnabled: boolean; }

export default function AdminDashboard(){
  const { data: session, status } = useSession();
  const router = useRouter();
  const [contactsCount,setContactsCount] = useState<number | null>(null);
  const [settings,setSettings] = useState<SettingsState | null>(null);
  const [loading,setLoading] = useState(true);

  useEffect(()=> {
    if(status === 'loading') return;
    if(!session){ router.replace('/admin'); return; }
    (async()=>{
      try {
        const [contactsRes, settingsRes] = await Promise.all([
          fetch('/api/contact'),
          fetch('/api/admin/settings')
        ]);
        if(contactsRes.ok){
          const arr = await contactsRes.json();
          setContactsCount(Array.isArray(arr) ? arr.length : 0);
        }
        if(settingsRes.ok){
          const sdata: SettingsState = await settingsRes.json();
          setSettings(sdata);
        }
      } finally {
        setLoading(false);
      }
    })();
  },[status, session, router]);

  if(status === 'loading' || loading) return null;

  return (
    <div className="py-16 container space-y-10">
      <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-lg border border-slate-700 bg-slate-800/40 p-5 flex flex-col gap-2">
          <span className="text-xs uppercase tracking-wider text-slate-400">Contact Messages</span>
          <span className="text-3xl font-semibold">{contactsCount ?? '—'}</span>
          <a href="/admin/contacts" className="text-xs text-brand-accent hover:underline">View all</a>
        </div>
        <div className="rounded-lg border border-slate-700 bg-slate-800/40 p-5 flex flex-col gap-2">
          <span className="text-xs uppercase tracking-wider text-slate-400">Public Site</span>
          <span className="text-xl font-medium">{settings?.publicSiteEnabled ? 'Enabled':'Disabled'}</span>
          <a href="/admin/settings" className="text-xs text-brand-accent hover:underline">Change</a>
        </div>
        <div className="rounded-lg border border-slate-700 bg-slate-800/40 p-5 flex flex-col gap-2">
          <span className="text-xs uppercase tracking-wider text-slate-400">Rate Limiting</span>
            <span className="text-xl font-medium">{settings?.enableRateLimit ? 'On':'Off'}</span>
          <a href="/admin/settings" className="text-xs text-brand-accent hover:underline">Configure</a>
        </div>
        <div className="rounded-lg border border-slate-700 bg-slate-800/40 p-5 flex flex-col gap-2">
          <span className="text-xs uppercase tracking-wider text-slate-400">Remember Me</span>
            <span className="text-xl font-medium">{settings?.rememberMe ? 'Enabled':'Disabled'}</span>
          <a href="/admin/settings" className="text-xs text-brand-accent hover:underline">Configure</a>
        </div>
      </div>
    </div>
  );
}
