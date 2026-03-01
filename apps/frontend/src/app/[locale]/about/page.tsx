import { Metadata } from 'next';
import StaticPageLayout from '@/components/StaticPageLayout';
import { setRequestLocale } from 'next-intl/server';
import { getTranslations } from 'next-intl/server';

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const t = await getTranslations({ locale: (await params).locale, namespace: 'about' });
  return {
    title: `${t('title')} | Premium Curated Fleet`,
    description: t('metaDescription'),
  };
}

export default async function AboutPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('about');

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
            {t('ourStory')}
          </h2>
          <p className="text-slate-700 leading-relaxed">{t('ourStoryText')}</p>
        </section>

        <section className="space-y-8 mb-12">
          <h2 className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">
            {t('mission')}
          </h2>
          <p className="text-slate-700 leading-relaxed">{t('missionText')}</p>
        </section>

        <section className="space-y-8">
          <h2 className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">
            {t('whyChooseUs')}
          </h2>
          <ul className="space-y-4 text-slate-700">
            <li className="flex items-start gap-3">
              <span className="text-primary mt-0.5">—</span>
              <span>{t('why1')}</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-primary mt-0.5">—</span>
              <span>{t('why2')}</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-primary mt-0.5">—</span>
              <span>{t('why3')}</span>
            </li>
          </ul>
        </section>
      </article>
    </StaticPageLayout>
  );
}
