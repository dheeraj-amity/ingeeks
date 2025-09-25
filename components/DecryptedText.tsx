"use client";
import { useEffect, useState, useRef, HTMLAttributes } from 'react';

export interface DecryptedTextProps extends HTMLAttributes<HTMLSpanElement> {
  text: string;
  speed?: number; // interval ms
  maxIterations?: number;
  sequential?: boolean;
  revealDirection?: 'start' | 'end' | 'center';
  useOriginalCharsOnly?: boolean;
  characters?: string;
  className?: string; // class for revealed chars
  parentClassName?: string; // wrapper class
  encryptedClassName?: string; // class while scrambling
  animateOn?: 'hover' | 'view';
}

export default function DecryptedText({
  text,
  speed = 50,
  maxIterations = 10,
  sequential = false,
  revealDirection = 'start',
  useOriginalCharsOnly = false,
  characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz!@#$%^&*()_+',
  className = '',
  parentClassName = '',
  encryptedClassName = 'opacity-60',
  animateOn = 'hover',
  ...props
}: DecryptedTextProps){
  const [displayText, setDisplayText] = useState(text);
  const [isHovering, setIsHovering] = useState(false);
  const [isScrambling, setIsScrambling] = useState(false);
  const [revealedIndices, setRevealedIndices] = useState<Set<number>>(new Set());
  const [hasAnimated, setHasAnimated] = useState(false);
  const containerRef = useRef<HTMLSpanElement | null>(null);

  useEffect(()=>{ setDisplayText(text); }, [text]);

  useEffect(()=>{
    let interval: ReturnType<typeof setInterval> | undefined;
    let currentIteration = 0;

    const getNextIndex = (revealedSet: Set<number>) => {
      const len = text.length;
      switch(revealDirection){
        case 'start': return revealedSet.size;
        case 'end': return len - 1 - revealedSet.size;
        case 'center': {
          const middle = Math.floor(len/2);
            const offset = Math.floor(revealedSet.size/2);
            const next = revealedSet.size % 2 === 0 ? middle + offset : middle - offset - 1;
            if(next >=0 && next < len && !revealedSet.has(next)) return next;
            for(let i=0;i<len;i++){ if(!revealedSet.has(i)) return i; }
            return 0;
        }
        default: return revealedSet.size;
      }
    };

    const availableChars = useOriginalCharsOnly
      ? Array.from(new Set(text.split(''))).filter(c => c !== ' ')
      : characters.split('');

    const shuffleText = (original: string, currentRevealed: Set<number>) => {
      if(useOriginalCharsOnly){
        const positions = original.split('').map((char,i)=>({char, i, isSpace: char===' ', revealed: currentRevealed.has(i)}));
        const pool = positions.filter(p=> !p.isSpace && !p.revealed).map(p=> p.char);
        for(let i=pool.length-1;i>0;i--){ const j = Math.random()* (i+1) | 0; [pool[i], pool[j]] = [pool[j], pool[i]]; }
        let idx=0;
        return positions.map(p=> p.isSpace ? ' ' : (p.revealed ? original[p.i] : pool[idx++])).join('');
      }
      return original.split('').map((char,i)=>{
        if(char===' ') return ' ';
        if(currentRevealed.has(i)) return original[i];
        return availableChars[Math.random()*availableChars.length | 0];
      }).join('');
    };

    const active = animateOn === 'hover' ? isHovering : isHovering; // same flag reused (set when visible if view)

    if(active){
      setIsScrambling(true);
      interval = setInterval(()=> {
        setRevealedIndices(prev => {
          if(sequential){
            if(prev.size < text.length){
              const nextIndex = getNextIndex(prev);
              const updated = new Set(prev); updated.add(nextIndex);
              setDisplayText(shuffleText(text, updated));
              return updated;
            } else {
              clearInterval(interval);
              setIsScrambling(false);
              return prev;
            }
          } else {
            setDisplayText(shuffleText(text, prev));
            currentIteration++;
            if(currentIteration >= maxIterations){
              clearInterval(interval);
              setIsScrambling(false);
              setDisplayText(text);
            }
            return prev;
          }
        });
      }, speed);
    } else {
      setDisplayText(text);
      setRevealedIndices(new Set());
      setIsScrambling(false);
    }

    return ()=> { if(interval) clearInterval(interval); };
  }, [isHovering, text, speed, maxIterations, sequential, revealDirection, characters, useOriginalCharsOnly, animateOn]);

  useEffect(()=>{
    if(animateOn !== 'view') return;
    const node = containerRef.current; if(!node) return;
    if(hasAnimated) return;
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => { if(entry.isIntersecting && !hasAnimated){ setIsHovering(true); setHasAnimated(true); observer.disconnect(); } });
    }, { threshold: 0.15 });
    observer.observe(node);
    return ()=> observer.disconnect();
  }, [animateOn, hasAnimated]);

  const hoverHandlers = animateOn === 'hover' ? {
    onMouseEnter: () => setIsHovering(true),
    onMouseLeave: () => setIsHovering(false)
  } : {};

  return (
    <span ref={containerRef} className={`inline-block whitespace-pre-wrap ${parentClassName}`} {...hoverHandlers} {...props}>
      <span className="sr-only">{displayText}</span>
      <span aria-hidden="true">
        {displayText.split('').map((char, i) => {
          const revealed = revealedIndices.has(i) || !isScrambling || !isHovering;
          return <span key={i} className={revealed ? className : encryptedClassName}>{char}</span>;
        })}
      </span>
    </span>
  );
}
