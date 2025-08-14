export default function ServicesPage(){
  const services = [
    { title:'AI Products', desc:'LLM assistants, automation, intelligence layers.'},
    { title:'Custom Platforms', desc:'End-to-end SaaS, CRMs, workflow systems.'},
    { title:'Cloud & DevOps', desc:'Infra, pipelines, observability & scaling.'},
    { title:'Security & Compliance', desc:'Secure SDLC, reviews, best practices.'},
    { title:'Mobile & Web Apps', desc:'Cross-platform apps & PWAs.'},
    { title:'UX Strategy', desc:'Research, prototyping, design systems.'},
  ];
  return (
    <main className="py-24 container space-y-14">
      <h1 className="font-heading text-4xl font-bold tracking-wide">Services</h1>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {services.map(s => (
          <div key={s.title} className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm p-6 hover:border-brand-accent/50 transition">
            <h3 className="font-heading text-lg font-semibold mb-2 tracking-wide">{s.title}</h3>
            <p className="text-sm text-slate-400 leading-relaxed">{s.desc}</p>
          </div>
        ))}
      </div>
    </main>
  );
}
