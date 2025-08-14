import { Hero } from '../components/Hero';
import { HomeHighlights } from '../components/HomeHighlights';
import { Stats } from '../components/Stats';

export default function HomePage() {
  return (
    <main>
      <Hero />
      <Stats />
      <HomeHighlights />
    </main>
  );
}
