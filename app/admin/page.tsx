"use client";
import { signIn } from 'next-auth/react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useState } from 'react';

export default function AdminLoginPage(){
  const params = useSearchParams();
  const router = useRouter();
  const callbackUrl = params.get('callbackUrl') || '/admin/dashboard';
  const [username,setUsername] = useState('');
  const [password,setPassword] = useState('');
  const [error,setError] = useState('');
  const [loading,setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent){
    e.preventDefault();
    setError('');
    setLoading(true);
    const res = await signIn('credentials', { redirect:false, username, password, callbackUrl });
    setLoading(false);
    if(res?.error){ setError('Invalid credentials'); return; }
    if(res?.ok){ router.push(callbackUrl); }
  }

  return (
    <div className="max-w-sm mx-auto py-24">
      <h1 className="text-2xl font-bold mb-6">Admin Login</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1" htmlFor="username">Username</label>
          <input id="username" value={username} onChange={e=>setUsername(e.target.value)} className="w-full rounded bg-slate-800 border border-slate-600 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-accent" autoComplete="username" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1" htmlFor="password">Password</label>
          <input id="password" type="password" value={password} onChange={e=>setPassword(e.target.value)} className="w-full rounded bg-slate-800 border border-slate-600 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-accent" autoComplete="current-password" />
        </div>
        {error && <p className="text-sm text-red-400" role="alert">{error}</p>}
        <button disabled={loading} type="submit" className="w-full bg-gradient-to-r from-brand-primary to-brand-accent text-[#0d1422] font-semibold py-2 rounded shadow hover:opacity-90 transition disabled:opacity-50">{loading? 'Signing in...':'Login'}</button>
      </form>
    </div>
  );
}
