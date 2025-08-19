"use client";
import { ReactNode, useState, useEffect } from 'react';
import { AuthProvider } from '@/components/AuthProvider';
import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { usePathname, useRouter } from 'next/navigation';

export default function AdminLayout({ children }: { children: ReactNode }) {
  const { data: session, status } = useSession();
  const pathname = usePathname();
  const router = useRouter();
  const [open,setOpen] = useState(false);

  useEffect(()=>{ setOpen(false); }, [pathname]);

  // Protect admin pages (fallback; middleware already guards deeper routes)
  useEffect(()=>{
    if(status==='loading') return;
    if(!session && pathname !== '/admin'){
      router.replace('/admin');
    }
  },[status, session, pathname, router]);

  const links = [
    { href: '/admin/dashboard', label: 'Dashboard' },
    { href: '/admin/contacts', label: 'Contacts' },
    { href: '/admin/settings', label: 'Settings' },
  ];

  return (
    <AuthProvider>
      <div className="min-h-screen bg-gradient-to-br from-[#0d1422] via-[#0f1828] to-[#09121c] text-slate-200">
        {pathname !== '/admin' && (
          <header className="fixed top-0 inset-x-0 z-50 backdrop-blur-md bg-[#0d1422]/80 border-b border-white/10">
            <div className="container flex items-center justify-between h-14">
              <Link href="/admin/dashboard" className="font-heading text-lg font-bold bg-gradient-to-r from-brand-primary to-brand-accent bg-clip-text text-transparent">Admin Panel</Link>
              <nav className="hidden md:flex items-center gap-6 text-sm">
                {links.map(l => (
                  <Link key={l.href} href={l.href} className={`${pathname === l.href ? 'text-brand-accent' : 'hover:text-brand-accent'} transition`}>{l.label}</Link>
                ))}
                {session && <button onClick={()=>signOut({ callbackUrl:'/admin' })} className="text-xs font-semibold px-3 py-1.5 rounded bg-slate-700 hover:bg-slate-600">Logout</button>}
              </nav>
              <button aria-label="Menu" aria-expanded={open} onClick={()=>setOpen(o=>!o)} className="md:hidden inline-flex flex-col justify-center gap-1.5 p-2 rounded focus:outline-none focus:ring-2 focus:ring-brand-accent/60">
                <span className={`h-0.5 w-5 bg-slate-200 transition ${open ? 'translate-y-2 rotate-45' : ''}`}></span>
                <span className={`h-0.5 w-5 bg-slate-200 transition ${open ? 'opacity-0' : ''}`}></span>
                <span className={`h-0.5 w-5 bg-slate-200 transition ${open ? '-translate-y-2 -rotate-45' : ''}`}></span>
              </button>
            </div>
            {open && (
              <div className="md:hidden absolute top-14 inset-x-0 bg-[#0d1422] border-b border-white/10 shadow-lg animate-fade-in">
                <div className="flex flex-col px-6 py-4 gap-3">
                  {links.map(l => (
                    <Link key={l.href} href={l.href} className={`text-sm font-medium ${pathname === l.href ? 'text-brand-accent' : 'text-slate-300 hover:text-brand-accent'}`}>{l.label}</Link>
                  ))}
                  {session && <button onClick={()=>signOut({ callbackUrl:'/admin' })} className="mt-2 text-sm font-semibold px-3 py-2 rounded bg-slate-700 hover:bg-slate-600">Logout</button>}
                </div>
              </div>
            )}
          </header>
        )}
        <main className={pathname !== '/admin' ? 'pt-16' : ''}>
          {children}
        </main>
      </div>
    </AuthProvider>
  );
}
