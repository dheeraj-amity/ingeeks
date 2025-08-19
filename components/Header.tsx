"use client";
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';

export function Header(){
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  // Close menu on route change
  useEffect(()=>{ setOpen(false); }, [pathname]);

  // Lock body scroll when menu open (mobile)
  useEffect(()=>{
    if(open){ document.body.style.overflow = 'hidden'; } else { document.body.style.overflow = ''; }
  }, [open]);

  // Hide header on admin paths
  if(pathname.startsWith('/admin')) return null;

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
          </div>
        </div>
      )}
    </header>
  );
}

// NOTE: This header is purely public. Admin UI has its own layout. Logging in/out will not change this header.
