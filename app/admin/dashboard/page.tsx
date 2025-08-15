"use client";
import { signOut, useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function AdminDashboard(){
  const router = useRouter();
  const { data: session, status } = useSession();
  
  if(status === 'loading') return null;
  if(!session) router.replace('/admin');

  return (
    <div className="py-20 container">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <button onClick={()=>signOut({ callbackUrl:'/admin' })} className="text-sm px-4 py-2 rounded bg-slate-700 hover:bg-slate-600">Logout</button>
      </div>
      <div className="grid gap-6 md:grid-cols-3">
        <div className="p-4 rounded-lg bg-slate-800 border border-slate-700">
          <h2 className="font-semibold mb-2">Site Stats</h2>
          <p className="text-sm text-slate-400">(Placeholder) Add real analytics later.</p>
        </div>
        <div className="p-4 rounded-lg bg-slate-800 border border-slate-700">
          <h2 className="font-semibold mb-2">Projects</h2>
          <p className="text-sm text-slate-400">(Placeholder) Manage projects here.</p>
        </div>
        <div className="p-4 rounded-lg bg-slate-800 border border-slate-700">
          <h2 className="font-semibold mb-2">Messages</h2>
          <p className="text-sm text-slate-400">(Placeholder) View contact form submissions.</p>
        </div>
      </div>
    </div>
  );
}
