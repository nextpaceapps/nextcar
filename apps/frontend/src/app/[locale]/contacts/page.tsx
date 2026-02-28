import { Metadata } from 'next';
import StaticPageLayout from '@/components/StaticPageLayout';
import LeadCaptureForm from '@/components/LeadCaptureForm';
import { setRequestLocale } from 'next-intl/server';
import { getTranslations } from 'next-intl/server';

const CONTACT_EMAIL = 'hi@nextcar.lv';
const CONTACT_PHONE = '+371 20399627';
const CONTACT_PHONE_TEL = '+37120399627';

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const t = await getTranslations({ locale: (await params).locale, namespace: 'contacts' });
  return {
    title: `${t('title')} | Nextcar`,
    description: t('metaDescription'),
  };
}

export default async function ContactsPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('contacts');

  return (
    <StaticPageLayout>
      <article>
        <h1 className="text-4xl lg:text-5xl font-display font-bold leading-tight uppercase tracking-tighter dark:text-white mb-6">
          {t('title')}
        </h1>
        <p className="text-lg text-slate-500 dark:text-slate-400 max-w-2xl mb-12 leading-relaxed">
          {t('intro')}
        </p>

        <section className="mb-12" aria-label="Contact information">
          <h2 className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 mb-6">
            {t('getInTouch')}
          </h2>
          <div className="flex flex-col sm:flex-row gap-8">
            <a
              href={`mailto:${CONTACT_EMAIL}`}
              className="flex items-center gap-4 p-6 rounded-2xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 transition-colors group"
            >
              <span className="material-symbols-outlined text-2xl text-primary dark:text-white">
                mail
              </span>
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  {t('email')}
                </p>
                <p className="text-lg font-semibold text-slate-900 dark:text-white group-hover:text-primary dark:group-hover:text-white transition-colors">
                  {CONTACT_EMAIL}
                </p>
              </div>
            </a>
            <a
              href={`tel:${CONTACT_PHONE_TEL}`}
              className="flex items-center gap-4 p-6 rounded-2xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 transition-colors group"
            >
              <span className="material-symbols-outlined text-2xl text-primary dark:text-white">
                phone
              </span>
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  {t('phone')}
                </p>
                <p className="text-lg font-semibold text-slate-900 dark:text-white group-hover:text-primary dark:group-hover:text-white transition-colors">
                  {CONTACT_PHONE}
                </p>
              </div>
            </a>
          </div>
          <p className="mt-4 text-sm text-slate-500 dark:text-slate-400">{t('respondWithinDay')}</p>
        </section>

        <section aria-label="Contact form">
          <LeadCaptureForm />
        </section>

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'ContactPage',
              name: `Contacts | Nextcar`,
              description: 'Get in touch with Nextcar — email, phone, and contact form.',
              mainEntity: {
                '@type': 'Organization',
                name: 'Nextcar',
                email: CONTACT_EMAIL,
                telephone: CONTACT_PHONE_TEL,
              },
            }),
          }}
        />
      </article>
    </StaticPageLayout>
  );
}
