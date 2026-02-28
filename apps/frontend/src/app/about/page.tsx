import { Metadata } from 'next';
import StaticPageLayout from '../../components/StaticPageLayout';

export const metadata: Metadata = {
  title: 'About Nextcar | Premium Curated Fleet',
  description: 'Learn about Nextcar — our story, mission, and commitment to helping you find the right vehicle with leasing and credit options.',
};

export default function AboutPage() {
  return (
    <StaticPageLayout>
      <article>
        <h1 className="text-4xl lg:text-5xl font-display font-bold leading-tight uppercase tracking-tighter dark:text-white mb-6">
          About Nextcar
        </h1>
        <p className="text-lg text-slate-500 dark:text-slate-400 max-w-2xl mb-12 leading-relaxed">
          We curate a premium fleet of used vehicles and make it easy to drive away with leasing or credit from 2.9%.
        </p>

        <section className="space-y-8 mb-12">
          <h2 className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">
            Our story
          </h2>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
            Nextcar was founded to simplify how people find and finance their next car. We combine a hand-picked inventory with transparent leasing and credit options so you can focus on the drive, not the paperwork.
          </p>
        </section>

        <section className="space-y-8 mb-12">
          <h2 className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">
            Mission
          </h2>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
            Our mission is to save your time and money by offering a curated selection of quality vehicles and straightforward financing. Every car we list is selected with care, and every deal is designed to be clear and fair.
          </p>
        </section>

        <section className="space-y-8">
          <h2 className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">
            Why choose us
          </h2>
          <ul className="space-y-4 text-slate-700 dark:text-slate-300">
            <li className="flex items-start gap-3">
              <span className="text-primary dark:text-white mt-0.5">—</span>
              <span>Curated inventory: only vehicles that meet our standards.</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-primary dark:text-white mt-0.5">—</span>
              <span>Leasing and credit from 2.9% with fast approval.</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-primary dark:text-white mt-0.5">—</span>
              <span>Transparent process and personal support when you need it.</span>
            </li>
          </ul>
        </section>
      </article>
    </StaticPageLayout>
  );
}
