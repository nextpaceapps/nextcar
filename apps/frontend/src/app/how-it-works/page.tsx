import { Metadata } from 'next';
import StaticPageLayout from '../../components/StaticPageLayout';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'How It Works | Nextcar',
  description: 'How to find, choose, and finance your next car with Nextcar — step-by-step process, FAQ, and what to expect.',
};

export default function HowItWorksPage() {
  return (
    <StaticPageLayout>
      <article>
        <h1 className="text-4xl lg:text-5xl font-display font-bold leading-tight uppercase tracking-tighter dark:text-white mb-6">
          How It Works
        </h1>
        <p className="text-lg text-slate-500 dark:text-slate-400 max-w-2xl mb-12 leading-relaxed">
          From browsing to driving — here is how we help you get into your next vehicle with leasing or credit.
        </p>

        <section className="space-y-10 mb-16">
          <h2 className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">
            Step-by-step
          </h2>
          <ol className="space-y-8">
            <li className="flex gap-6">
              <span className="flex-shrink-0 w-12 h-12 rounded-full bg-primary dark:bg-white text-white dark:text-primary font-bold flex items-center justify-center">1</span>
              <div>
                <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">Browse our fleet</h3>
                <p className="text-slate-600 dark:text-slate-400">
                  Explore our curated inventory online. Use search and filters to find makes, models, and price ranges that fit you.
                </p>
              </div>
            </li>
            <li className="flex gap-6">
              <span className="flex-shrink-0 w-12 h-12 rounded-full bg-primary dark:bg-white text-white dark:text-primary font-bold flex items-center justify-center">2</span>
              <div>
                <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">Choose your vehicle</h3>
                <p className="text-slate-600 dark:text-slate-400">
                  View details, photos, and specs. When you are ready, get a quote or schedule a test drive — we will guide you through financing options (leasing from 2.9% or credit).
                </p>
              </div>
            </li>
            <li className="flex gap-6">
              <span className="flex-shrink-0 w-12 h-12 rounded-full bg-primary dark:bg-white text-white dark:text-primary font-bold flex items-center justify-center">3</span>
              <div>
                <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">Apply for financing</h3>
                <p className="text-slate-600 dark:text-slate-400">
                  Submit your application. We work with partners for fast approval so you know quickly whether you are approved and on what terms.
                </p>
              </div>
            </li>
            <li className="flex gap-6">
              <span className="flex-shrink-0 w-12 h-12 rounded-full bg-primary dark:bg-white text-white dark:text-primary font-bold flex items-center justify-center">4</span>
              <div>
                <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">Drive away</h3>
                <p className="text-slate-600 dark:text-slate-400">
                  Complete the paperwork and pick up your vehicle. We ensure everything is in order so you can hit the road with confidence.
                </p>
              </div>
            </li>
          </ol>
        </section>

        <section className="space-y-8 mb-16">
          <h2 className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">
            FAQ
          </h2>
          <dl className="space-y-8">
            <div>
              <dt className="font-semibold text-slate-900 dark:text-white mb-2">Do I need to visit in person?</dt>
              <dd className="text-slate-600 dark:text-slate-400">
                You can browse, get a quote, and start the process online. A visit or test drive can be arranged when you are ready.
              </dd>
            </div>
            <div>
              <dt className="font-semibold text-slate-900 dark:text-white mb-2">What financing options do you offer?</dt>
              <dd className="text-slate-600 dark:text-slate-400">
                We offer leasing (from 2.9%) and credit with fast approval. Terms depend on your profile and the vehicle — we will explain options clearly.
              </dd>
            </div>
            <div>
              <dt className="font-semibold text-slate-900 dark:text-white mb-2">Can I import a car through you?</dt>
              <dd className="text-slate-600 dark:text-slate-400">
                Yes. We provide an import service — from sourcing and purchase to customs and registration. See our Import Service page for details.
              </dd>
            </div>
          </dl>
        </section>

        <section className="pt-8 border-t border-slate-200 dark:border-slate-800">
          <h2 className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 mb-4">
            Trust & transparency
          </h2>
          <p className="text-slate-700 dark:text-slate-300 mb-6">
            We only list vehicles that meet our quality standards. Pricing and financing terms are presented clearly, and we are here to answer your questions before and after you decide.
          </p>
          <Link
            href="/vehicles"
            className="inline-flex items-center gap-2 bg-primary dark:bg-white dark:text-primary text-white px-8 py-4 rounded-full font-bold hover:opacity-90 transition-opacity"
          >
            View inventory
            <span className="material-symbols-outlined text-sm">arrow_forward</span>
          </Link>
        </section>
      </article>
    </StaticPageLayout>
  );
}
