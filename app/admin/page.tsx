"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';

// Simple in-memory auth (NOT for production)
const USERNAME = 'admin';
const PASSWORD = 'Admin@3390';

export default function AdminLoginPage(){
  const router = useRouter();
  const [username,setUsername] = useState('');
  const [password,setPassword] = useState('');
  const [error,setError] = useState('');

  function handleSubmit(e: React.FormEvent){
    e.preventDefault();
    if(username === USERNAME && password === PASSWORD){
      // very simple session flag in sessionStorage
      sessionStorage.setItem('ing_admin','1');
      router.push('/admin/dashboard');
    } else {
      setError('Invalid credentials');
    }
  }

  return (
    <div className="max-w-sm mx-auto py-24">
      <h1 className="text-2xl font-bold mb-6">Admin Login</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1" htmlFor="username">Username</label>
          <input id="username" value={username} onChange={e=>setUsername(e.target.value)} className="w-full rounded bg-slate-800 border border-slate-600 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-accent" autoComplete="off" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1" htmlFor="password">Password</label>
          <input id="password" type="password" value={password} onChange={e=>setPassword(e.target.value)} className="w-full rounded bg-slate-800 border border-slate-600 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-accent" />
        </div>
        {error && <p className="text-sm text-red-400" role="alert">{error}</p>}
        <button type="submit" className="w-full bg-gradient-to-r from-brand-primary to-brand-accent text-[#0d1422] font-semibold py-2 rounded shadow hover:opacity-90 transition">Login</button>
      </form>
    </div>
  );
}
