"use client";
import { useEffect, useState } from 'react';
let Player: any = null;

export function SocialIcons(){
  const [ready,setReady] = useState(false);
  useEffect(()=>{
    (async ()=>{
      const mod = await import('@lottiefiles/react-lottie-player');
      Player = mod.Player;
      setReady(true);
    })();
  },[]);
  const items = [
    { href:'https://github.com', label:'GitHub', lottie:'https://assets2.lottiefiles.com/packages/lf20_j1adxtyb.json' },
    { href:'https://www.linkedin.com', label:'LinkedIn', lottie:'https://assets2.lottiefiles.com/packages/lf20_0Cm1Y2.json' },
    { href:'mailto:dheeraj@ingeeks.in', label:'Email', lottie:'https://assets2.lottiefiles.com/packages/lf20_tpa51dr0.json' },
  ];
  return (
    <div className="flex justify-center gap-6">
      {items.map(i=> (
        <a key={i.label} href={i.href} target={i.href.startsWith('http')? '_blank': undefined} rel={i.href.startsWith('http')? 'noopener noreferrer': undefined} className="group relative inline-flex flex-col items-center">
          <div className="h-10 w-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center overflow-hidden hover:border-brand-accent/50 transition">
            {ready && Player ? <Player autoplay loop src={i.lottie} style={{ height: 36, width: 36 }} /> : <span className="w-4 h-4 rounded-full bg-gradient-to-r from-brand-primary to-brand-accent animate-pulse" />}
          </div>
          <span className="sr-only">{i.label}</span>
        </a>
      ))}
    </div>
  );
}
