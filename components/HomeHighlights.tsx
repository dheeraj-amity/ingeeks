"use client";
import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { fadeUp, staggerContainer } from '@/lib/motion';

export function HomeHighlights(){
  const items = [
    { title: 'AI Products', desc: 'LLM assistants, intelligent automation, recommendation systems.' },
    { title: 'Custom Platforms', desc: 'Domain SaaS, CRMs, workflow & analytics tools.' },
    { title: 'Cloud & DevOps', desc: 'Scalable infra, CI/CD, cost optimization.' },
  ];
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once:true, margin: '-80px' });
  return (
    <section ref={ref} className="py-20">
      <div className="container">
        <motion.div variants={staggerContainer(0.12)} initial="hidden" animate={inView? 'show':'hidden'} className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((i)=> (
            <motion.div
              key={i.title}
              variants={fadeUp}
              className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm p-6 hover:border-brand-accent/50 transition"
            >
              <h3 className="font-heading text-lg font-semibold tracking-wide mb-2">{i.title}</h3>
              <p className="text-sm text-slate-400 leading-relaxed">{i.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
