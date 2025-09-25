"use client";
import { motion } from 'framer-motion';
import { useRef } from 'react';
import dynamic from 'next/dynamic';
import { fadeUp } from '@/lib/motion';
import DecryptedText from './DecryptedText';
const ThreeHeroBackground = dynamic(()=> import('./ThreeHeroBackground').then(m=>m.ThreeHeroBackground), { ssr:false });

export function Hero() {
  const ref = useRef<HTMLElement>(null);
  return (
    <section ref={ref} className="relative flex min-h-[90vh] flex-col items-center justify-center text-center px-4 overflow-hidden">
      <ThreeHeroBackground />
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_30%_25%,rgba(86,96,255,.25),transparent_60%)]" />
      <motion.h1 variants={fadeUp} initial="hidden" animate="show" className="font-heading text-5xl md:text-6xl font-bold tracking-wide bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
        <DecryptedText text="InGeeks Technologies" animateOn="view" sequential revealDirection="center" className="" encryptedClassName="opacity-20" />
      </motion.h1>
      <motion.p variants={fadeUp} initial="hidden" animate="show" transition={{ delay:0.15 }} className="mt-6 max-w-2xl text-base md:text-lg text-slate-300">
        <DecryptedText text="Innovating Ideas. Building Futures." animateOn="view" speed={40} maxIterations={18} className="" encryptedClassName="opacity-30" />
      </motion.p>
      <motion.div variants={fadeUp} initial="hidden" animate="show" transition={{ delay:0.3 }} className="mt-10 flex gap-4">
        <a href="/projects" className="rounded-xl bg-gradient-to-r from-brand-primary to-brand-accent px-6 py-3 text-sm font-semibold shadow-glow transition hover:brightness-110">View Projects</a>
        <a href="/contact" className="rounded-xl border border-white/15 px-6 py-3 text-sm font-semibold backdrop-blur-sm bg-white/5 hover:bg-white/10 transition">Contact</a>
      </motion.div>
    </section>
  );
}
