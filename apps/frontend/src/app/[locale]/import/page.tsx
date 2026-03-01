import { Metadata } from 'next';
import StaticPageLayout from '@/components/StaticPageLayout';
import { Link } from '@/i18n/navigation';
import { setRequestLocale } from 'next-intl/server';
import { getTranslations } from 'next-intl/server';

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const t = await getTranslations({ locale: (await params).locale, namespace: 'import' });
  return {
    title: `${t('title')} | Nextcar`,
    description: t('metaDescription'),
  };
}

export default async function ImportPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('import');
  const tNav = await getTranslations('nav');

  return (
    <StaticPageLayout>
      <article>
        <h1 className="text-4xl lg:text-5xl font-display font-bold leading-tight uppercase tracking-tighter mb-6">
          {t('title')}
        </h1>
        <p className="text-lg text-slate-500 max-w-2xl mb-12 leading-relaxed">
          {t('intro')}
        </p>

        <section className="space-y-8 mb-12">
          <h2 className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">
            {t('whatWeOffer')}
          </h2>
          <p className="text-slate-700 leading-relaxed">{t('whatWeOfferText')}</p>
        </section>

        <section className="space-y-8 mb-12">
          <h2 className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">
            {t('processSteps')}
          </h2>
          <ol className="space-y-6 list-none">
            <li className="flex gap-4">
              <span className="flex-shrink-0 w-10 h-10 rounded-full bg-primary/10 text-primary font-bold flex items-center justify-center text-sm">
                1
              </span>
              <div>
                <h3 className="font-semibold text-slate-900 mb-1">{t('step1Title')}</h3>
                <p className="text-slate-600 text-sm">{t('step1Text')}</p>
              </div>
            </li>
            <li className="flex gap-4">
              <span className="flex-shrink-0 w-10 h-10 rounded-full bg-primary/10 text-primary font-bold flex items-center justify-center text-sm">
                2
              </span>
              <div>
                <h3 className="font-semibold text-slate-900 mb-1">{t('step2Title')}</h3>
                <p className="text-slate-600 text-sm">{t('step2Text')}</p>
              </div>
            </li>
            <li className="flex gap-4">
              <span className="flex-shrink-0 w-10 h-10 rounded-full bg-primary/10 text-primary font-bold flex items-center justify-center text-sm">
                3
              </span>
              <div>
                <h3 className="font-semibold text-slate-900 mb-1">{t('step3Title')}</h3>
                <p className="text-slate-600 text-sm">{t('step3Text')}</p>
              </div>
            </li>
            <li className="flex gap-4">
              <span className="flex-shrink-0 w-10 h-10 rounded-full bg-primary/10 text-primary font-bold flex items-center justify-center text-sm">
                4
              </span>
              <div>
                <h3 className="font-semibold text-slate-900 mb-1">{t('step4Title')}</h3>
                <p className="text-slate-600 text-sm">{t('step4Text')}</p>
              </div>
            </li>
          </ol>
        </section>

        <section className="space-y-8 mb-12">
          <h2 className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">
            {t('benefits')}
          </h2>
          <ul className="space-y-4 text-slate-700">
            <li className="flex items-start gap-3">
              <span className="text-primary mt-0.5">—</span>
              <span>{t('benefit1')}</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-primary mt-0.5">—</span>
              <span>{t('benefit2')}</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-primary mt-0.5">—</span>
              <span>{t('benefit3')}</span>
            </li>
          </ul>
        </section>

        <section className="pt-8 border-t border-slate-200">
          <p className="text-slate-600 mb-6">{t('readyToImport')}</p>
          <Link
            href="?contact=true"
            className="inline-flex items-center gap-2 bg-primary text-white px-8 py-4 rounded-full font-bold hover:opacity-90 transition-opacity"
          >
            {tNav('contactUs')}
            <span className="material-symbols-outlined text-sm">arrow_forward</span>
          </Link>
        </section>
      </article>
    </StaticPageLayout>
  );
}
