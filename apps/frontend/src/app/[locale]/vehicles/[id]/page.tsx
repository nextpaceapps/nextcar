import { notFound } from 'next/navigation';
import { getPublishedVehicleById } from '@/lib/data/vehicles';
import HeroGallery from '@/components/HeroGallery';
import PdpHeader from '@/components/PdpHeader';
import Breadcrumb from '@/components/Breadcrumb';
import VerificationBadge from '@/components/VerificationBadge';
import TechnicalSpecs from '@/components/TechnicalSpecs';
import FeaturesSection from '@/components/FeaturesSection';
import YoutubeEmbed from '@/components/YoutubeEmbed';
import LeadCaptureForm from '@/components/LeadCaptureForm';
import CarVerticalRequestForm from '@/components/CarVerticalRequestForm';
import HistoryCard from '@/components/HistoryCard';
import ReviewCard from '@/components/ReviewCard';
import { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import { getTranslations } from 'next-intl/server';

export const revalidate = 60;

type Params = { params: Promise<{ locale: string; id: string }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { id, locale } = await params;
  const vehicle = await getPublishedVehicleById(id);
  if (!vehicle) {
    const t = await getTranslations({ locale, namespace: 'metadata' });
    return { title: t('notFound') };
  }

  const title = `${vehicle.year} ${vehicle.make} ${vehicle.model} — $${vehicle.price.toLocaleString()}`;
  const description = vehicle.description ? vehicle.description.substring(0, 160) : `Check out this premium ${vehicle.year} ${vehicle.make} ${vehicle.model}.`;
  const image = vehicle.photos && vehicle.photos.length > 0 ? vehicle.photos[0].url : '';

  return {
    title: `${vehicle.year} ${vehicle.make} ${vehicle.model} | Nextcar`,
    description,
    openGraph: {
      title,
      description,
      images: image ? [{ url: image }] : [],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: image ? [image] : [],
    },
  };
}

function SpecRow({ label, value }: { label: string; value?: string | number | null }) {
  if (value === undefined || value === null || value === '') return null;
  return (
    <li className="flex justify-between items-center py-2 border-b border-slate-100 last:border-0">
      <span className="text-slate-500 text-sm font-medium">{label}</span>
      <span className="text-slate-900 font-semibold">{value}</span>
    </li>
  );
}

export default async function VehicleDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string; id: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const { locale, id } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('vehicles');
  const tBreadcrumb = await getTranslations('breadcrumb');

  const resolvedSearchParams = await searchParams;
  const intentRaw = resolvedSearchParams?.intent;
  const intent = typeof intentRaw === 'string' ? intentRaw : undefined;

  const vehicle = await getPublishedVehicleById(id);

  if (!vehicle) {
    notFound();
  }

  const breadcrumbItems = [
    { label: tBreadcrumb('home'), href: '/' },
    { label: tBreadcrumb('vehicles'), href: '/vehicles' },
    { label: `${vehicle.year} ${vehicle.make} ${vehicle.model}` },
  ];

  return (
    <>
      <main className="max-w-5xl mx-auto p-6 lg:p-12 w-full flex-grow">
        <div className="mb-4 hidden sm:block">
          <Breadcrumb items={breadcrumbItems} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12 items-start">
          <div className="lg:col-span-2 space-y-8">
            <HeroGallery
              photos={vehicle.photos || []}
              badge={vehicle.verified ? <VerificationBadge /> : undefined}
            />
            <PdpHeader vehicle={vehicle} />

            <div className="space-y-16 pt-4">
              <TechnicalSpecs vehicle={vehicle} />

              <div>
                <h3 className="text-xl font-bold font-display uppercase tracking-tight text-slate-800 mb-6 flex items-center gap-2 border-b border-slate-200 pb-3">
                  <span className="material-symbols-outlined text-primary">history</span>
                  {t('historyProvenance')}
                </h3>
                <ul className="space-y-3">
                  <SpecRow label={t('firstRegistration')} value={vehicle.firstRegistration} />
                  <SpecRow label={t('technicalInspection')} value={vehicle.technicalInspection} />
                  <SpecRow label={t('condition')} value={vehicle.condition} />
                  <SpecRow label={t('numberOfKeys')} value={vehicle.numberOfKeys} />
                  <SpecRow label={t('vin')} value={vehicle.vin} />
                </ul>
              </div>

              <FeaturesSection vehicle={vehicle} />

              {vehicle.description && (
                <div>
                  <h3 className="text-xl font-bold font-display uppercase tracking-tight text-slate-800 mb-6 flex items-center gap-2 border-b border-slate-200 pb-3">
                    <span className="material-symbols-outlined text-primary">description</span>
                    {t('description')}
                  </h3>
                  <div className="prose prose-lg text-slate-600 break-words whitespace-pre-wrap max-w-none">
                    {vehicle.description}
                  </div>
                </div>
              )}

              {vehicle.videoLinks && vehicle.videoLinks.length > 0 && (
                <div>
                  <h3 className="text-xl font-bold font-display uppercase tracking-tight text-slate-800 mb-6 flex items-center gap-2 border-b border-slate-200 pb-3">
                    <span className="material-symbols-outlined text-primary">smart_display</span>
                    {t('vehicleVideo')}
                  </h3>
                  <YoutubeEmbed links={vehicle.videoLinks} />
                </div>
              )}

              <div
                id="carvertical-request"
                className="mt-12 bg-slate-50 border border-slate-200 rounded-3xl p-6 lg:p-8 scroll-mt-32"
              >
                <div className="flex items-center gap-4 mb-6">
                  <span className="material-symbols-outlined p-3 bg-amber-500/10 text-amber-600 rounded-xl text-3xl">
                    history_edu
                  </span>
                  <div>
                    <h3 className="text-xl font-bold font-display uppercase tracking-tight text-slate-800">
                      {t('vehicleHistoryReport')}
                    </h3>
                    <p className="text-slate-500 text-sm">{t('vehicleHistoryReportDesc')}</p>
                  </div>
                </div>
                <CarVerticalRequestForm
                  vehicleId={id}
                  vehicleContext={{
                    make: vehicle.make,
                    model: vehicle.model,
                    year: vehicle.year,
                    vin: vehicle.vin ?? null,
                  }}
                />
              </div>

              <div
                id="inquiry-form"
                className="mt-12 bg-white border border-slate-200 rounded-3xl p-6 lg:p-10 shadow-xl scroll-mt-32"
              >
                <div className="flex items-center gap-4 mb-2">
                  <span className="material-symbols-outlined p-3 bg-primary/10 text-primary rounded-xl text-3xl">
                    mail
                  </span>
                  <div>
                    <h3 className="text-2xl font-bold font-display uppercase tracking-tight text-slate-800">
                      {t('interestedContactUs')}
                    </h3>
                    <p className="text-slate-500">{t('fastResponseGuaranteed')}</p>
                  </div>
                </div>
                <div className="mt-8">
                  <LeadCaptureForm vehicleId={id} intent={intent} />
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-4 sticky top-32">
            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 px-1">
              History &amp; Review
            </p>
            <HistoryCard />
            <ReviewCard videoLinks={vehicle.videoLinks ?? []} />
          </div>
        </div>

        <div className="fixed bottom-0 left-0 right-0 p-4 bg-white/80 backdrop-blur-md border-t border-slate-200 lg:hidden z-40 transform translate-y-0 transition-transform">
          <a
            href="#inquiry-form"
            className="block w-full text-center bg-primary text-white py-4 rounded-full font-bold uppercase tracking-widest text-sm shadow-xl shadow-primary/20"
          >
            {t('contactSales')}
          </a>
        </div>
      </main>
    </>
  );
}
