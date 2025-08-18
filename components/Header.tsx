"use client";
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';

export function Header(){
  const pathname = usePathname();
  const { data: session } = useSession();
  const isAdmin = !!(session as any)?.role;

  // Hide header only on the admin login page
  if (!isAdmin && pathname === '/admin') return null;

  if (isAdmin) {
    const adminLinks = [
      { href: '/admin/dashboard', label: 'Dashboard' },
      { href: '/admin/settings', label: 'Settings' },
      { href: '/admin/contacts', label: 'Contacts' },
    ];
    return (
      <header className="fixed top-0 inset-x-0 z-50 backdrop-blur-md bg-[#0d1422]/80 border-b border-white/10">
        <div className="container flex items-center justify-between h-14">
          <span className="font-heading text-lg font-bold bg-gradient-to-r from-brand-primary to-brand-accent bg-clip-text text-transparent">InGeeks Admin</span>
          <nav className="hidden md:flex items-center gap-5 text-xs">
            {adminLinks.map(l => (
              <Link key={l.href} href={l.href} className={`${pathname === l.href ? 'text-brand-accent' : 'text-slate-300 hover:text-brand-accent'} font-medium transition`}>{l.label}</Link>
            ))}
            <button onClick={()=>signOut({ callbackUrl:'/admin' })} className="text-xs font-semibold px-3 py-1.5 rounded bg-slate-700 hover:bg-slate-600">Logout</button>
          </nav>
          <button onClick={()=>signOut({ callbackUrl:'/admin' })} className="md:hidden text-xs font-semibold px-3 py-1.5 rounded bg-slate-700 hover:bg-slate-600">Logout</button>
        </div>
      </header>
    );
  }

  // Public navigation
  const links = [
    { href: '/', label: 'Home' },
    { href: '/about', label: 'About' },
    { href: '/services', label: 'Services' },
    { href: '/projects', label: 'Projects' },
    { href: '/contact', label: 'Contact' },
  ];

  return (
    <header className="fixed top-0 inset-x-0 z-50 backdrop-blur-md bg-[#0d1422]/80 border-b border-white/10">
      <div className="container flex items-center justify-between h-14">
        <Link href="/" className="font-heading text-lg font-bold bg-gradient-to-r from-brand-primary to-brand-accent bg-clip-text text-transparent">InGeeks</Link>
        <nav className="hidden md:flex items-center gap-6 text-sm">
          {links.map(l => (
            <Link key={l.href} href={l.href} className={`hover:text-brand-accent transition ${pathname === l.href ? 'text-brand-accent' : 'text-slate-300'}`}>{l.label}</Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
