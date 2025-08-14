import dynamic from 'next/dynamic';
const SocialIcons = dynamic(() => import('@/components/SocialIcons'), { ssr:false });

export function Footer(){
  return (
    <footer className="mt-32 border-t border-white/10 bg-[#0a121c] py-12 text-center text-xs text-slate-500">
      <div className="container space-y-6">
        <SocialIcons />
        <p className="tracking-wide">© {new Date().getFullYear()} InGeeks Technologies. All rights reserved.</p>
        <p className="text-[11px]">Made with <span className="text-brand-accent">❤</span> in India.</p>
      </div>
    </footer>
  );
}
