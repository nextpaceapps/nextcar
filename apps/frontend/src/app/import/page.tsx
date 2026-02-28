import { Metadata } from 'next';
import StaticPageLayout from '../../components/StaticPageLayout';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Import Service | Nextcar',
  description: 'Import your vehicle with Nextcar — process steps, benefits, and how we help you bring your car to your country.',
};

export default function ImportPage() {
  return (
    <StaticPageLayout>
      <article>
        <h1 className="text-4xl lg:text-5xl font-display font-bold leading-tight uppercase tracking-tighter dark:text-white mb-6">
          Import Service
        </h1>
        <p className="text-lg text-slate-500 dark:text-slate-400 max-w-2xl mb-12 leading-relaxed">
          We help you import your next vehicle with a clear process, support at every step, and no surprises.
        </p>

        <section className="space-y-8 mb-12">
          <h2 className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">
            What we offer
          </h2>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
            Our import service covers sourcing, documentation, customs clearance, and registration support. Whether you are buying from our inventory or bringing a car from abroad, we guide you through the process so you can drive legally and with peace of mind.
          </p>
        </section>

        <section className="space-y-8 mb-12">
          <h2 className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">
            Process steps
          </h2>
          <ol className="space-y-6 list-none counter-reset">
            <li className="flex gap-4">
              <span className="flex-shrink-0 w-10 h-10 rounded-full bg-primary/10 dark:bg-white/10 text-primary dark:text-white font-bold flex items-center justify-center text-sm">1</span>
              <div>
                <h3 className="font-semibold text-slate-900 dark:text-white mb-1">Consultation</h3>
                <p className="text-slate-600 dark:text-slate-400 text-sm">Tell us what you want — make, model, budget — and we outline options and costs.</p>
              </div>
            </li>
            <li className="flex gap-4">
              <span className="flex-shrink-0 w-10 h-10 rounded-full bg-primary/10 dark:bg-white/10 text-primary dark:text-white font-bold flex items-center justify-center text-sm">2</span>
              <div>
                <h3 className="font-semibold text-slate-900 dark:text-white mb-1">Sourcing & purchase</h3>
                <p className="text-slate-600 dark:text-slate-400 text-sm">We source the vehicle and handle the purchase and necessary paperwork.</p>
              </div>
            </li>
            <li className="flex gap-4">
              <span className="flex-shrink-0 w-10 h-10 rounded-full bg-primary/10 dark:bg-white/10 text-primary dark:text-white font-bold flex items-center justify-center text-sm">3</span>
              <div>
                <h3 className="font-semibold text-slate-900 dark:text-white mb-1">Customs & registration</h3>
                <p className="text-slate-600 dark:text-slate-400 text-sm">We assist with customs clearance and registration in your country.</p>
              </div>
            </li>
            <li className="flex gap-4">
              <span className="flex-shrink-0 w-10 h-10 rounded-full bg-primary/10 dark:bg-white/10 text-primary dark:text-white font-bold flex items-center justify-center text-sm">4</span>
              <div>
                <h3 className="font-semibold text-slate-900 dark:text-white mb-1">Delivery</h3>
                <p className="text-slate-600 dark:text-slate-400 text-sm">You receive your vehicle ready to drive, with documentation in order.</p>
              </div>
            </li>
          </ol>
        </section>

        <section className="space-y-8 mb-12">
          <h2 className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">
            Benefits
          </h2>
          <ul className="space-y-4 text-slate-700 dark:text-slate-300">
            <li className="flex items-start gap-3">
              <span className="text-primary dark:text-white mt-0.5">—</span>
              <span>One point of contact for the entire import process.</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-primary dark:text-white mt-0.5">—</span>
              <span>Clear cost breakdown and no hidden fees.</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-primary dark:text-white mt-0.5">—</span>
              <span>Expertise in regulations and paperwork.</span>
            </li>
          </ul>
        </section>

        <section className="pt-8 border-t border-slate-200 dark:border-slate-800">
          <p className="text-slate-600 dark:text-slate-400 mb-6">
            Ready to import? Get in touch and we will walk you through the next steps.
          </p>
          <Link
            href="?contact=true"
            className="inline-flex items-center gap-2 bg-primary dark:bg-white dark:text-primary text-white px-8 py-4 rounded-full font-bold hover:opacity-90 transition-opacity"
          >
            Contact us
            <span className="material-symbols-outlined text-sm">arrow_forward</span>
          </Link>
        </section>
      </article>
    </StaticPageLayout>
  );
}
