"use client";
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';

export function Header(){
  const pathname = usePathname();
  const { data: session, status } = useSession();
  const isAdmin = !!(session as any)?.role;

  // If not logged in and not on /admin, header hidden because middleware redirects.
  // Design: Hide full nav if admin logged in (only show a minimal top bar with Logout optional) or hide entirely per requirement.

  if (!isAdmin && pathname === '/admin') {
    return null; // login page: no header
  }
  if (isAdmin) {
    return (
      <header className="fixed top-0 inset-x-0 z-50 backdrop-blur-md bg-[#0d1422]/80 border-b border-white/10">
        <div className="container flex items-center justify-between h-14">
          <span className="font-heading text-lg font-bold bg-gradient-to-r from-brand-primary to-brand-accent bg-clip-text text-transparent">InGeeks Admin</span>
          <button onClick={()=>signOut({ callbackUrl:'/admin' })} className="text-xs font-semibold px-3 py-1.5 rounded bg-slate-700 hover:bg-slate-600">Logout</button>
        </div>
      </header>
    );
  }
  return null; // fallback
}
