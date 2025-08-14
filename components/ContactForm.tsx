"use client";
import { useState } from 'react';

export function ContactForm(){
  const [status, setStatus] = useState<'idle'|'submitting'|'success'|'error'>('idle');
  const [message, setMessage] = useState('');

  async function onSubmit(e: React.FormEvent<HTMLFormElement>){
    e.preventDefault();
    if(status==='submitting') return;
    const form = e.currentTarget;
    const formData = new FormData(form);
    const payload = Object.fromEntries(formData.entries());
    if(!payload.name || !payload.email || !payload.message){
      setMessage('Please fill in all fields.');
      setStatus('error');
      return;
    }
    setStatus('submitting');
    setMessage('');
    try{
      const res = await fetch('/api/contact', { method:'POST', headers:{ 'Content-Type':'application/json'}, body: JSON.stringify(payload)});
      if(!res.ok) throw new Error('Failed');
      setStatus('success');
      form.reset();
    }catch{
      setStatus('error');
      setMessage('Something went wrong. Try again.');
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-5">
      <div className="space-y-2">
        <label className="block text-xs font-semibold tracking-wide uppercase">Name</label>
        <input name="name" className="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-3 text-sm outline-none focus:border-brand-accent focus:ring-2 focus:ring-brand-accent/30" required placeholder="Your Name" />
      </div>
      <div className="space-y-2">
        <label className="block text-xs font-semibold tracking-wide uppercase">Email</label>
        <input name="email" type="email" className="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-3 text-sm outline-none focus:border-brand-accent focus:ring-2 focus:ring-brand-accent/30" required placeholder="you@example.com" />
      </div>
      <div className="space-y-2">
        <label className="block text-xs font-semibold tracking-wide uppercase">Message</label>
        <textarea name="message" rows={5} className="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-3 text-sm outline-none resize-y focus:border-brand-accent focus:ring-2 focus:ring-brand-accent/30" required placeholder="Tell us about your project..."></textarea>
      </div>
      {status==='error' && <p className="text-[11px] font-medium text-red-400">{message}</p>}
      {status==='success' && <p className="text-[11px] font-medium text-emerald-400">Message sent! We will reply soon.</p>}
      <button disabled={status==='submitting'} type="submit" className="rounded-xl bg-gradient-to-r from-brand-primary to-brand-accent px-6 py-3 text-sm font-semibold shadow-glow transition hover:brightness-110 disabled:opacity-50 disabled:cursor-not-allowed">{status==='submitting' ? 'Sending...' : 'Send Message'}</button>
    </form>
  );
}
