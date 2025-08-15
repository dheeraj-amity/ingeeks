"use client";
import { signOut, useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function AdminDashboard(){
  const router = useRouter();
  const { data: session, status } = useSession();
  
  if(status === 'loading') return null;
  if(!session) router.replace('/admin');

  return (
    <div className="py-16 container">
      <div className="flex items-center justify-between mb-12">
        <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
        <button onClick={()=>signOut({ callbackUrl:'/admin' })} className="text-sm px-4 py-2 rounded bg-slate-700 hover:bg-slate-600">Logout</button>
      </div>
      {/* Blank area for future widgets */}
      <div className="min-h-[40vh] flex items-center justify-center border border-dashed border-slate-700 rounded-lg bg-slate-800/40">
        <p className="text-sm text-slate-500">(Blank dashboard – add widgets later)</p>
      </div>
    </div>
  );
}
