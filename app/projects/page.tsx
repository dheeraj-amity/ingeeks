import { finishedProjects, inProgressProjects } from '@/data/projects';
import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Projects | InGeeks Technologies',
  description: 'Finished and in-progress product initiatives by InGeeks Technologies.'
};

function slugify(title:string){ return title.toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/(^-|-$)/g,''); }

export default function ProjectsPage(){
  return (
    <main className="py-24 container space-y-20">
      <section>
        <h1 className="font-heading text-4xl font-bold tracking-wide mb-10">Finished Projects</h1>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {finishedProjects.map(p=> {
            const href = p.link ? p.link : `/projects/${slugify(p.title)}`;
            const external = Boolean(p.link);
            const Tag: any = 'a';
            return (
              <Tag
                key={p.title}
                href={href}
                {...(external ? { target:'_blank', rel:'noopener noreferrer'}: {})}
                className="group rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm p-6 hover:border-brand-accent/50 transition focus:outline-none focus:ring-2 focus:ring-brand-accent/40"
              >
                <h3 className="font-heading text-lg font-semibold tracking-wide mb-2 group-hover:text-white">{p.title}</h3>
                <p className="text-sm text-slate-400 leading-relaxed">{p.desc}</p>
                {external ? <span className="mt-3 inline-block text-[11px] font-semibold tracking-wide text-brand-accent/80">Visit ↗</span> : <span className="mt-3 inline-block text-[11px] font-semibold tracking-wide text-brand-accent/60 group-hover:text-brand-accent">Details →</span>}
              </Tag>
            );
          })}
        </div>
      </section>
      <section>
        <h2 className="font-heading text-3xl font-bold tracking-wide mb-10">In Progress</h2>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {inProgressProjects.map(p=> (
            <Link key={p.title} href={`/projects/${slugify(p.title)}`} className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm p-6 space-y-4 hover:border-brand-accent/50 transition focus:outline-none focus:ring-2 focus:ring-brand-accent/40">
              <div className="flex items-center justify-between gap-4">
                <h3 className="font-heading text-base font-semibold tracking-wide">{p.title}</h3>
                <span className="text-xs font-semibold text-brand-accent">{p.progress}%</span>
              </div>
              <p className="text-sm text-slate-400 leading-relaxed">{p.desc}</p>
              <div className="h-2 rounded-full bg-white/10 overflow-hidden">
                <div className="h-full bg-gradient-to-r from-brand-primary via-brand-accent to-brand-cyan" style={{width: p.progress+'%'}} />
              </div>
              <span className="inline-block text-[11px] font-semibold tracking-wide text-brand-accent/60 group-hover:text-brand-accent">Details →</span>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
