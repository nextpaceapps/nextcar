import { Metadata } from 'next';
import StaticPageLayout from '@/components/StaticPageLayout';
import { Link } from '@/i18n/navigation';
import { setRequestLocale } from 'next-intl/server';
import { getTranslations } from 'next-intl/server';

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const t = await getTranslations({ locale: (await params).locale, namespace: 'howItWorks' });
  return {
    title: `${t('title')} | Nextcar`,
    description: t('metaDescription'),
  };
}

export default async function HowItWorksPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('howItWorks');

  return (
    <StaticPageLayout>
      <article>
        <h1 className="text-4xl lg:text-5xl font-display font-bold leading-tight uppercase tracking-tighter mb-6">
          {t('title')}
        </h1>
        <p className="text-lg text-slate-500 max-w-2xl mb-12 leading-relaxed">
          {t('intro')}
        </p>

        <section className="space-y-10 mb-16">
          <h2 className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">
            {t('stepByStep')}
          </h2>
          <ol className="space-y-8">
            <li className="flex gap-6">
              <span className="flex-shrink-0 w-12 h-12 rounded-full bg-primary text-white font-bold flex items-center justify-center">
                1
              </span>
              <div>
                <h3 className="text-xl font-semibold text-slate-900 mb-2">
                  {t('step1Title')}
                </h3>
                <p className="text-slate-600">{t('step1Text')}</p>
              </div>
            </li>
            <li className="flex gap-6">
              <span className="flex-shrink-0 w-12 h-12 rounded-full bg-primary text-white font-bold flex items-center justify-center">
                2
              </span>
              <div>
                <h3 className="text-xl font-semibold text-slate-900 mb-2">
                  {t('step2Title')}
                </h3>
                <p className="text-slate-600">{t('step2Text')}</p>
              </div>
            </li>
            <li className="flex gap-6">
              <span className="flex-shrink-0 w-12 h-12 rounded-full bg-primary text-white font-bold flex items-center justify-center">
                3
              </span>
              <div>
                <h3 className="text-xl font-semibold text-slate-900 mb-2">
                  {t('step3Title')}
                </h3>
                <p className="text-slate-600">{t('step3Text')}</p>
              </div>
            </li>
            <li className="flex gap-6">
              <span className="flex-shrink-0 w-12 h-12 rounded-full bg-primary text-white font-bold flex items-center justify-center">
                4
              </span>
              <div>
                <h3 className="text-xl font-semibold text-slate-900 mb-2">
                  {t('step4Title')}
                </h3>
                <p className="text-slate-600">{t('step4Text')}</p>
              </div>
            </li>
          </ol>
        </section>

        <section className="space-y-8 mb-16">
          <h2 className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">
            {t('faq')}
          </h2>
          <dl className="space-y-8">
            <div>
              <dt className="font-semibold text-slate-900 mb-2">{t('faq1Q')}</dt>
              <dd className="text-slate-600">{t('faq1A')}</dd>
            </div>
            <div>
              <dt className="font-semibold text-slate-900 mb-2">{t('faq2Q')}</dt>
              <dd className="text-slate-600">{t('faq2A')}</dd>
            </div>
            <div>
              <dt className="font-semibold text-slate-900 mb-2">{t('faq3Q')}</dt>
              <dd className="text-slate-600">{t('faq3A')}</dd>
            </div>
          </dl>
        </section>

        <section className="pt-8 border-t border-slate-200">
          <h2 className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 mb-4">
            {t('trustTransparency')}
          </h2>
          <p className="text-slate-700 mb-6">{t('trustText')}</p>
          <Link
            href="/vehicles"
            className="inline-flex items-center gap-2 bg-primary text-white px-8 py-4 rounded-full font-bold hover:opacity-90 transition-opacity"
          >
            {t('viewInventory')}
            <span className="material-symbols-outlined text-sm">arrow_forward</span>
          </Link>
        </section>
      </article>
    </StaticPageLayout>
  );
}
