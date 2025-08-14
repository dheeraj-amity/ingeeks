"use client";
import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import { ThreeHeroBackground } from './ThreeHeroBackground';

export function Hero() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start','end start'] });
  const overlayOpacity = useTransform(scrollYProgress, [0,1],[0.0,0.6]);
  return (
    <section ref={ref} className="relative flex min-h-[90vh] flex-col items-center justify-center text-center px-4 overflow-hidden">
      <ThreeHeroBackground />
      <motion.div style={{ opacity: overlayOpacity }} className="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent via-[#0d1422]/40 to-[#0d1422]" />
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_30%_25%,rgba(86,96,255,.25),transparent_60%)]" />
      <motion.h1
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: 'easeOut' }}
        className="font-heading text-5xl md:text-6xl font-bold tracking-wide bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent"
      >
        InGeeks Technologies
      </motion.h1>
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: .2, duration: .8 }}
        className="mt-6 max-w-2xl text-base md:text-lg text-slate-300"
      >
        Innovating Ideas. Building Futures.
      </motion.p>
      <motion.div
        initial={{ opacity: 0, scale: .9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: .35, duration: .7 }}
        className="mt-10 flex gap-4"
      >
        <a href="/projects" className="rounded-xl bg-gradient-to-r from-brand-primary to-brand-accent px-6 py-3 text-sm font-semibold shadow-glow transition hover:brightness-110">View Projects</a>
        <a href="/contact" className="rounded-xl border border-white/15 px-6 py-3 text-sm font-semibold backdrop-blur-sm bg-white/5 hover:bg-white/10 transition">Contact</a>
      </motion.div>
    </section>
  );
}
