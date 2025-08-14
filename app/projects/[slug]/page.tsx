import { finishedProjects, inProgressProjects } from '@/data/projects';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

function slugify(title:string){
  return title.toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/(^-|-$)/g,'');
}

export function generateStaticParams(){
  return [...finishedProjects, ...inProgressProjects].map(p=> ({ slug: slugify(p.title) }));
}

export function generateMetadata({ params }: { params:{ slug:string } }): Metadata {
  const project = [...finishedProjects, ...inProgressProjects].find(p=> slugify(p.title) === params.slug);
  if(!project) return { title: 'Project Not Found | InGeeks' };
  return {
    title: `${project.title} | InGeeks` ,
    description: project.desc
  };
}

type AnyProject = (typeof finishedProjects)[number] | (typeof inProgressProjects)[number];
function isProgressProject(p: AnyProject): p is { title:string; desc:string; progress:number } { return 'progress' in p; }
function hasLink(p: AnyProject): p is { title:string; desc:string; link:string } { return 'link' in p; }

export default function ProjectDetail({ params }: { params:{ slug:string }}){
  const project = [...finishedProjects, ...inProgressProjects].find(p=> slugify(p.title) === params.slug) as AnyProject | undefined;
  if(!project) notFound();
  return (
    <main className="py-24 container max-w-3xl space-y-10">
      <h1 className="font-heading text-4xl font-bold tracking-wide bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">{project.title}</h1>
      <p className="text-slate-300 leading-relaxed text-sm md:text-base">{project.desc}</p>
      {isProgressProject(project) && (
        <div className="space-y-3">
          <div className="h-2 rounded-full bg-white/10 overflow-hidden">
            <div className="h-full bg-gradient-to-r from-brand-primary via-brand-accent to-brand-cyan" style={{ width: project.progress + '%' }} />
          </div>
          <p className="text-xs text-brand-accent font-semibold tracking-wide">Progress: {project.progress}%</p>
        </div>
      )}
      {hasLink(project) && project.link && (
        <p><a className="text-brand-accent text-sm font-semibold underline decoration-dotted hover:brightness-110" href={project.link} target="_blank" rel="noopener noreferrer">Visit live ↗</a></p>
      )}
    </main>
  );
}
