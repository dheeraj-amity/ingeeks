"use client";
import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';

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
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((i, idx)=> (
            <motion.div
              key={i.title}
              initial={{ opacity:0, y: 24 }}
              animate={inView ? { opacity:1, y:0 } : undefined}
              transition={{ delay: idx*0.1, duration:.55, ease:'easeOut' }}
              className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm p-6 hover:border-brand-accent/50 transition"
            >
              <h3 className="font-heading text-lg font-semibold tracking-wide mb-2">{i.title}</h3>
              <p className="text-sm text-slate-400 leading-relaxed">{i.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
