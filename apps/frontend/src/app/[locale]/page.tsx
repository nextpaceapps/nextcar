import { getFeaturedVehicles, getPublishedVehicles } from '@/lib/data/vehicles';
import VehicleCard from '@/components/VehicleCard';
import { Link } from '@/i18n/navigation';
import type { Vehicle } from '@nextcar/shared';
import { setRequestLocale } from 'next-intl/server';
import { getTranslations } from 'next-intl/server';

export const revalidate = 60;

type Props = { params: Promise<{ locale: string }> };

export default async function HomePage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('home');
  const tNav = await getTranslations('nav');
  const tVehicles = await getTranslations('vehicles');

  let featured: Vehicle[] = [];
  let latest: Vehicle[] = [];
  let errorMsg: string | null = null;

  try {
    const res = await Promise.all([
      getFeaturedVehicles(6),
      getPublishedVehicles(7),
    ]);
    featured = res[0] as Vehicle[];
    latest = res[1] as Vehicle[];
  } catch (err: unknown) {
    if (err instanceof Error) {
      errorMsg = err.message;
    } else {
      errorMsg = String(err);
    }
  }

  const latestNonFeatured = latest
    .filter((v: Vehicle) => !v.featured)
    .slice(0, 4);

  const hasFeatured = featured.length > 0;
  const hasLatest = latestNonFeatured.length > 0;

  return (
    <main className="max-w-4xl mx-auto p-6 lg:p-12 flex-grow w-full">
      {errorMsg && (
        <div className="bg-red-100 text-red-700 p-4 rounded mb-8">
          {t('errorFetching')} {errorMsg}
        </div>
      )}
      <section className="mb-16">
        <h1 className="text-4xl lg:text-5xl font-display font-bold leading-tight uppercase tracking-tighter">
          {t('title')}
        </h1>
        <p className="mt-4 text-lg text-slate-500 max-w-xl leading-relaxed">
          {t('subtitle')}
        </p>
        <div className="mt-8 flex gap-4">
          <Link
            href="/vehicles"
            className="inline-flex items-center gap-2 bg-primary text-white px-8 py-4 rounded-full font-bold hover:-translate-y-1 transition-transform active:scale-95 shadow-xl shadow-primary/20"
          >
            {tNav('viewAllInventory')}
            <span className="material-symbols-outlined text-sm">arrow_forward</span>
          </Link>
        </div>
      </section>

      {hasFeatured && (
        <section className="mb-20">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">
              {t('featuredVehicles')}
            </h2>
          </div>
          <div className="flex flex-col gap-32">
            {featured.map((vehicle, i) => (
              <VehicleCard key={vehicle.id} vehicle={vehicle} priority={i < 2} />
            ))}
          </div>
        </section>
      )}

      {hasLatest && (
        <section className="mb-16">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">
              {t('latestArrivals')}
            </h2>
            <Link
              href="/vehicles"
              className="text-xs font-bold uppercase tracking-[0.15em] text-primary hover:opacity-70 transition-opacity flex items-center gap-1"
            >
              {tNav('seeAll')}
              <span className="material-symbols-outlined text-sm">arrow_forward</span>
            </Link>
          </div>
          <div className="flex flex-col gap-32">
            {latestNonFeatured.map((vehicle, i) => (
              <VehicleCard key={vehicle.id} vehicle={vehicle} priority={i < 2} />
            ))}
          </div>
        </section>
      )}

      {!hasFeatured && !hasLatest && (
        <div className="flex items-center justify-center py-20">
          <div className="text-slate-400 text-lg">
            {tVehicles('noInventory')}
          </div>
        </div>
      )}
    </main>
  );
}
