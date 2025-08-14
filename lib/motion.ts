import { Variants } from 'framer-motion';

export const fadeUp: Variants = {
  hidden: { opacity:0, y: 32 },
  show: { opacity:1, y:0, transition:{ duration:.7, ease:[0.25,0.1,0.25,1]} }
};

export const staggerContainer = (stagger=0.12, delayChildren=0): Variants => ({
  hidden: {},
  show: { transition:{ staggerChildren: stagger, delayChildren } }
});

export const scaleIn: Variants = {
  hidden: { opacity:0, scale:0.9 },
  show: { opacity:1, scale:1, transition:{ duration:.6, ease:'easeOut' } }
};

export const fadeIn: Variants = {
  hidden: { opacity:0 },
  show: { opacity:1, transition:{ duration:.6 } }
};

export const slideInX = (dir:1|-1): Variants => ({
  hidden: { opacity:0, x: 40*dir },
  show: { opacity:1, x:0, transition:{ duration:.6, ease:'easeOut' } }
});
