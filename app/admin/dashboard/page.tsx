"use client";
import { signOut, useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';

interface SettingsState {
  publicSiteEnabled: boolean;
  sessionTimeoutMinutes: number;
  enableRateLimit: boolean;
  maxFailedAttempts: number;
  rememberMe: boolean;
  auditLogEnabled: boolean;
  showStatusBar: boolean;
  enableLoadingFallback: boolean;
}

const DEFAULTS: SettingsState = {
  publicSiteEnabled: false,
  sessionTimeoutMinutes: 30,
  enableRateLimit: true,
  maxFailedAttempts: 5,
  rememberMe: false,
  auditLogEnabled: true,
  showStatusBar: true,
  enableLoadingFallback: true,
};

export default function AdminDashboard(){
  const router = useRouter();
  const { data: session, status } = useSession();
  const [saving, setSaving] = useState(false);
  const [savedAt,setSavedAt] = useState<string | null>(null);
  const [loading,setLoading] = useState(true);
  const [error,setError] = useState<string | null>(null);
  const [settings,setSettings] = useState<SettingsState>(DEFAULTS);

  useEffect(()=> {
    if(status === 'loading') return;
    if(!session){ router.replace('/admin'); return; }
    (async()=>{
      try {
        const res = await fetch('/api/admin/settings');
        if(!res.ok) throw new Error('Failed to load settings');
        const data = await res.json();
        setSettings(data);
      } catch(e:any){
        setError(e.message);
      } finally {
        setLoading(false);
      }
    })();
  },[session, status, router]);

  function update<K extends keyof SettingsState>(key: K, value: SettingsState[K]){
    setSettings(s=> ({ ...s, [key]: value }));
  }

  async function save(){
    setSaving(true);
    setError(null);
    try {
      const res = await fetch('/api/admin/settings', { method:'PATCH', headers:{'Content-Type':'application/json'}, body: JSON.stringify(settings)});
      if(!res.ok) throw new Error('Save failed');
      const data = await res.json();
      setSettings(data);
      setSavedAt(new Date().toLocaleTimeString());
    } catch(e:any){
      setError(e.message);
    } finally {
      setSaving(false);
    }
  }

  if(status === 'loading' || loading) return null;

  return (
    <div className="py-16 container space-y-10">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
        <button onClick={()=>signOut({ callbackUrl:'/admin' })} className="text-sm px-4 py-2 rounded bg-slate-700 hover:bg-slate-600">Logout</button>
      </div>

      {error && <div className="p-3 rounded bg-red-500/10 border border-red-500/30 text-sm text-red-300">{error}</div>}

      <section className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">
        {/* Public Site Toggle */}
        <div className="rounded-lg border border-slate-700 bg-slate-800/40 p-5 flex flex-col gap-3">
          <h2 className="font-semibold">Public Site Access</h2>
          <p className="text-xs text-slate-400">Allow regular visitors to see marketing pages while keeping admin secured.</p>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={settings.publicSiteEnabled} onChange={e=>update('publicSiteEnabled', e.target.checked)} /> Enable public site
          </label>
        </div>
        {/* Session Timeout */}
        <div className="rounded-lg border border-slate-700 bg-slate-800/40 p-5 flex flex-col gap-3">
          <h2 className="font-semibold">Session Timeout</h2>
            <p className="text-xs text-slate-400">Auto logout users after inactivity.</p>
            <input type="number" min={5} max={720} value={settings.sessionTimeoutMinutes} onChange={e=>update('sessionTimeoutMinutes', parseInt(e.target.value)||30)} className="w-full rounded bg-slate-900 border border-slate-600 px-2 py-1 text-sm" />
            <p className="text-[11px] text-slate-500">Minutes (5 - 720)</p>
        </div>
        {/* Rate Limiting */}
        <div className="rounded-lg border border-slate-700 bg-slate-800/40 p-5 flex flex-col gap-3">
          <h2 className="font-semibold">Login Rate Limiting</h2>
          <p className="text-xs text-slate-400">Protect against brute force attempts.</p>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={settings.enableRateLimit} onChange={e=>update('enableRateLimit', e.target.checked)} /> Enable rate limit
          </label>
          <label className="flex items-center gap-2 text-sm">
            <span>Max attempts:</span>
            <input type="number" min={3} max={20} value={settings.maxFailedAttempts} onChange={e=>update('maxFailedAttempts', parseInt(e.target.value)||5)} className="w-20 rounded bg-slate-900 border border-slate-600 px-2 py-1 text-sm" />
          </label>
        </div>
        {/* Remember Me */}
        <div className="rounded-lg border border-slate-700 bg-slate-800/40 p-5 flex flex-col gap-3">
          <h2 className="font-semibold">Remember Me</h2>
          <p className="text-xs text-slate-400">Persist sessions longer when enabled.</p>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={settings.rememberMe} onChange={e=>update('rememberMe', e.target.checked)} /> Enable feature
          </label>
        </div>
        {/* Audit Log */}
        <div className="rounded-lg border border-slate-700 bg-slate-800/40 p-5 flex flex-col gap-3">
          <h2 className="font-semibold">Audit Logging</h2>
          <p className="text-xs text-slate-400">Track admin actions for security reviews.</p>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={settings.auditLogEnabled} onChange={e=>update('auditLogEnabled', e.target.checked)} /> Enable audit log
          </label>
        </div>
        {/* Status Bar */}
        <div className="rounded-lg border border-slate-700 bg-slate-800/40 p-5 flex flex-col gap-3">
          <h2 className="font-semibold">Status Bar</h2>
          <p className="text-xs text-slate-400">Display build/version banner when updates available.</p>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={settings.showStatusBar} onChange={e=>update('showStatusBar', e.target.checked)} /> Show status bar
          </label>
        </div>
        {/* Loading Fallback */}
        <div className="rounded-lg border border-slate-700 bg-slate-800/40 p-5 flex flex-col gap-3">
          <h2 className="font-semibold">Loading Fallback</h2>
          <p className="text-xs text-slate-400">Show skeleton or spinner while auth/session resolves.</p>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={settings.enableLoadingFallback} onChange={e=>update('enableLoadingFallback', e.target.checked)} /> Enable fallback
          </label>
        </div>
      </section>
      <div className="flex items-center gap-4">
        <button onClick={save} disabled={saving} className="px-5 py-2 rounded bg-gradient-to-r from-brand-primary to-brand-accent text-[#0d1422] font-semibold text-sm disabled:opacity-50">{saving? 'Saving...':'Save Settings'}</button>
        {savedAt && <span className="text-xs text-slate-500">Saved at {savedAt}</span>}
      </div>
      <p className="text-[11px] text-slate-500">(Settings persist in memory only – use a database for production.)</p>
    </div>
  );
}
