"use client";
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

const nav = [
  { href: '/', label: 'Home' },
  { href: '/about', label: 'About' },
  { href: '/services', label: 'Services' },
  { href: '/projects', label: 'Projects' },
  { href: '/contact', label: 'Contact' },
];

export function Header(){
  const pathname = usePathname();
  const [open,setOpen] = useState(false);
  return (
    <header className="fixed top-0 inset-x-0 z-50 backdrop-blur-md bg-[#0d1422]/70 border-b border-white/10" role="banner">
      <div className="container flex items-center justify-between h-16">
        <Link href="/" className="font-heading text-lg font-bold tracking-wider" aria-label="InGeeks Home">
          <span className="bg-gradient-to-r from-brand-primary to-brand-accent bg-clip-text text-transparent">InGeeks</span>
        </Link>
        <nav className="hidden md:flex items-center gap-8 text-sm font-semibold" aria-label="Primary">
          {nav.map(i=> (
            <Link key={i.href} href={i.href} className={`relative tracking-wide transition hover:text-white ${pathname===i.href?'text-white':'text-slate-400'}`} aria-current={pathname===i.href? 'page': undefined}>
              {i.label}
              {pathname===i.href && <span className="absolute -bottom-2 left-0 h-[3px] w-full rounded bg-gradient-to-r from-brand-primary to-brand-accent" />}
            </Link>
          ))}
        </nav>
        <button onClick={()=>setOpen(o=>!o)} className="md:hidden relative w-9 h-9 flex flex-col justify-center items-center gap-[6px] group" aria-label="Toggle navigation" aria-expanded={open} aria-controls="mobile-nav">
          <span className="w-6 h-[2px] bg-white transition group-hover:bg-brand-accent" />
          <span className="w-6 h-[2px] bg-white transition group-hover:bg-brand-accent" />
          <span className="w-6 h-[2px] bg-white transition group-hover:bg-brand-accent" />
        </button>
      </div>
      {open && (
        <div id="mobile-nav" className="md:hidden border-t border-white/10 bg-[#0d1422]/85 backdrop-blur-xl" role="navigation" aria-label="Mobile">
          <div className="container flex flex-col py-4">
            {nav.map(i=> (
              <Link key={i.href} href={i.href} onClick={()=>setOpen(false)} className={`py-2 text-sm font-medium tracking-wide ${pathname===i.href?'text-white':'text-slate-400'}`} aria-current={pathname===i.href? 'page': undefined}>{i.label}</Link>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}
