import { notFound } from 'next/navigation';
import { getPublishedVehicleById } from '@/lib/data/vehicles';
import HeroGallery from '@/components/HeroGallery';
import PdpHeader from '@/components/PdpHeader';
import YoutubeEmbed from '@/components/YoutubeEmbed';
import LeadCaptureForm from '@/components/LeadCaptureForm';
import CarVerticalRequestForm from '@/components/CarVerticalRequestForm';
import { Link } from '@/i18n/navigation';
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
    <li className="flex justify-between items-center py-2 border-b border-slate-100 dark:border-slate-800/50 last:border-0">
      <span className="text-slate-500 text-sm font-medium">{label}</span>
      <span className="text-slate-900 dark:text-slate-100 font-semibold">{value}</span>
    </li>
  );
}

const formatCategory = (str: string) => str.replace(/([A-Z])/g, ' $1').replace(/^./, (s) => s.toUpperCase());

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
  const tNav = await getTranslations('nav');

  const resolvedSearchParams = await searchParams;
  const intentRaw = resolvedSearchParams?.intent;
  const intent = typeof intentRaw === 'string' ? intentRaw : undefined;

  const vehicle = await getPublishedVehicleById(id);

  if (!vehicle) {
    notFound();
  }

  return (
    <>
      <main className="max-w-5xl mx-auto p-6 lg:p-12 w-full flex-grow">
        <div className="mb-8">
          <Link
            href="/vehicles"
            className="inline-flex items-center text-sm font-semibold text-primary dark:text-white hover:opacity-70 transition-opacity uppercase tracking-wider"
          >
            <span className="material-symbols-outlined mr-2">arrow_back</span>
            {tNav('backToInventory')}
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12 items-start">
          <div className="lg:col-span-2 space-y-16">
            <section className="grid grid-cols-1 lg:grid-cols-[1fr_minmax(0,380px)] gap-8 lg:gap-10 items-start" aria-label="Vehicle hero and header">
              <HeroGallery photos={vehicle.photos || []} />
              <PdpHeader vehicle={vehicle} />
            </section>

            <div className="space-y-16">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                <div>
                  <h3 className="text-xl font-bold font-display uppercase tracking-tight text-slate-800 dark:text-slate-100 mb-6 flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-3">
                    <span className="material-symbols-outlined text-primary">engineering</span>
                    {t('technicalSpecs')}
                  </h3>
                  <ul className="space-y-3">
                    <SpecRow label={t('power')} value={vehicle.power} />
                    <SpecRow label={t('engineSize')} value={vehicle.engineSize} />
                    <SpecRow label={t('doors')} value={vehicle.doors} />
                    <SpecRow label={t('seats')} value={vehicle.seats} />
                    <SpecRow label={t('co2Standard')} value={vehicle.co2Standard} />
                    <SpecRow label={t('interiorColor')} value={vehicle.interiorColor} />
                  </ul>
                </div>

                <div>
                  <h3 className="text-xl font-bold font-display uppercase tracking-tight text-slate-800 dark:text-slate-100 mb-6 flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-3">
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
              </div>

              {vehicle.features && vehicle.features.length > 0 && (
                <div>
                  <h3 className="text-xl font-bold font-display uppercase tracking-tight text-slate-800 dark:text-slate-100 mb-6 flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-3">
                    <span className="material-symbols-outlined text-primary">star</span>
                    {t('featuredHighlights')}
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {vehicle.features.map((feature, i) => (
                      <span
                        key={i}
                        className="px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-full text-sm font-medium border border-slate-200 dark:border-slate-700"
                      >
                        {feature}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {vehicle.description && (
                <div>
                  <h3 className="text-xl font-bold font-display uppercase tracking-tight text-slate-800 dark:text-slate-100 mb-6 flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-3">
                    <span className="material-symbols-outlined text-primary">description</span>
                    {t('description')}
                  </h3>
                  <div className="prose dark:prose-invert prose-lg text-slate-600 dark:text-slate-400 break-words whitespace-pre-wrap max-w-none">
                    {vehicle.description}
                  </div>
                </div>
              )}

              {vehicle.equipment && Object.keys(vehicle.equipment).length > 0 && (
                <div>
                  <h3 className="text-xl font-bold font-display uppercase tracking-tight text-slate-800 dark:text-slate-100 mb-6 flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-3">
                    <span className="material-symbols-outlined text-primary">build_circle</span>
                    {t('equipmentDetails')}
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {Object.entries(vehicle.equipment).map(([category, items]) => {
                      if (!items || items.length === 0) return null;
                      return (
                        <div key={category}>
                          <h4 className="font-bold text-slate-800 dark:text-slate-200 mb-4">
                            {formatCategory(category)}
                          </h4>
                          <ul className="space-y-3">
                            {items.map((item, i) => (
                              <li
                                key={i}
                                className="text-sm text-slate-600 dark:text-slate-400 flex items-start gap-3 leading-tight"
                              >
                                <span className="material-symbols-outlined text-primary text-base shrink-0">
                                  check
                                </span>
                                <span>{item}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {vehicle.videoLinks && vehicle.videoLinks.length > 0 && (
                <div>
                  <h3 className="text-xl font-bold font-display uppercase tracking-tight text-slate-800 dark:text-slate-100 mb-6 flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-3">
                    <span className="material-symbols-outlined text-primary">smart_display</span>
                    {t('vehicleVideo')}
                  </h3>
                  <YoutubeEmbed links={vehicle.videoLinks} />
                </div>
              )}

              <div
                id="carvertical-request"
                className="mt-12 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 lg:p-8 scroll-mt-32"
              >
                <div className="flex items-center gap-4 mb-6">
                  <span className="material-symbols-outlined p-3 bg-amber-500/10 text-amber-600 dark:text-amber-400 rounded-xl text-3xl">
                    history_edu
                  </span>
                  <div>
                    <h3 className="text-xl font-bold font-display uppercase tracking-tight text-slate-800 dark:text-slate-100">
                      {t('vehicleHistoryReport')}
                    </h3>
                    <p className="text-slate-500 dark:text-slate-400 text-sm">{t('vehicleHistoryReportDesc')}</p>
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
                className="mt-12 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 lg:p-10 shadow-xl scroll-mt-32"
              >
                <div className="flex items-center gap-4 mb-2">
                  <span className="material-symbols-outlined p-3 bg-primary/10 text-primary rounded-xl text-3xl">
                    mail
                  </span>
                  <div>
                    <h3 className="text-2xl font-bold font-display uppercase tracking-tight text-slate-800 dark:text-slate-100">
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

          <div className="w-full lg:w-1/3 space-y-8 sticky top-32">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-slate-50 dark:bg-slate-900 p-4 rounded-xl border border-slate-100 dark:border-slate-800">
                <span className="material-symbols-outlined text-slate-400 block mb-2">speed</span>
                <div className="text-sm font-bold uppercase tracking-wider">
                  {vehicle.mileage.toLocaleString()} km
                </div>
                <div className="text-[10px] text-slate-500 font-medium tracking-wide uppercase">
                  {t('mileage')}
                </div>
              </div>
              <div className="bg-slate-50 dark:bg-slate-900 p-4 rounded-xl border border-slate-100 dark:border-slate-800">
                <span className="material-symbols-outlined text-slate-400 block mb-2">local_gas_station</span>
                <div className="text-sm font-bold uppercase tracking-wider">{vehicle.fuelType}</div>
                <div className="text-[10px] text-slate-500 font-medium tracking-wide uppercase">
                  {t('fuelType')}
                </div>
              </div>
              <div className="bg-slate-50 dark:bg-slate-900 p-4 rounded-xl border border-slate-100 dark:border-slate-800">
                <span className="material-symbols-outlined text-slate-400 block mb-2">settings</span>
                <div className="text-sm font-bold uppercase tracking-wider">{vehicle.transmission}</div>
                <div className="text-[10px] text-slate-500 font-medium tracking-wide uppercase">
                  {t('transmission')}
                </div>
              </div>
              <div className="bg-slate-50 dark:bg-slate-900 p-4 rounded-xl border border-slate-100 dark:border-slate-800">
                <span className="material-symbols-outlined text-slate-400 block mb-2">directions_car</span>
                <div className="text-sm font-bold uppercase tracking-wider truncate">{vehicle.bodyType}</div>
                <div className="text-[10px] text-slate-500 font-medium tracking-wide uppercase">
                  {t('body')}
                </div>
              </div>
              <div className="bg-slate-50 dark:bg-slate-900 p-4 rounded-xl border border-slate-100 dark:border-slate-800">
                <span className="material-symbols-outlined text-slate-400 block mb-2">palette</span>
                <div className="text-sm font-bold uppercase tracking-wider truncate">{vehicle.color}</div>
                <div className="text-[10px] text-slate-500 font-medium tracking-wide uppercase">
                  {t('color')}
                </div>
              </div>
              {(vehicle.condition || vehicle.vin) && (
                <div className="bg-slate-50 dark:bg-slate-900 p-4 rounded-xl border border-slate-100 dark:border-slate-800">
                  <span className="material-symbols-outlined text-slate-400 block mb-2">sell</span>
                  <div className="text-sm font-bold uppercase tracking-wider truncate">
                    {vehicle.condition || t('used')}
                  </div>
                  <div className="text-[10px] text-slate-500 font-medium tracking-wide uppercase">
                    {t('condition')}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="fixed bottom-0 left-0 right-0 p-4 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-t border-slate-200 dark:border-slate-800 lg:hidden z-40 transform translate-y-0 transition-transform">
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
