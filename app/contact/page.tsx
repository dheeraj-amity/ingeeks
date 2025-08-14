import { ContactForm } from '@/components/ContactForm';

export default function ContactPage(){
  return (
    <main className="py-24 container max-w-4xl space-y-14">
      <h1 className="font-heading text-4xl font-bold tracking-wide">Contact</h1>
      <div className="grid gap-12 md:grid-cols-2">
        <div className="space-y-6 text-sm leading-relaxed text-slate-300">
          <p>Have an idea, product or challenge? Let’s build something impactful.</p>
          <ul className="space-y-2">
            <li><strong className="text-white">📍</strong> Lucknow, Uttar Pradesh, India</li>
            <li><strong className="text-white">📧</strong> <a className="text-brand-accent" href="mailto:dheeraj@ingeeks.in">dheeraj@ingeeks.in</a></li>
            <li><strong className="text-white">📞</strong> +91 88744 43390</li>
          </ul>
        </div>
        <ContactForm />
      </div>
    </main>
  );
}
