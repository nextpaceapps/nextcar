import { getPublishedVehicles } from '@/lib/data/vehicles';
import VehicleCard from '@/components/VehicleCard';
import { Metadata } from 'next';
import { Link } from '@/i18n/navigation';
import { setRequestLocale } from 'next-intl/server';
import { getTranslations } from 'next-intl/server';

export const revalidate = 60;

type Props = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const t = await getTranslations({ locale: (await params).locale, namespace: 'vehicles' });
  return {
    title: `${t('inventory')} | Nextcar`,
    description: t('inventoryDescription'),
    openGraph: {
      title: `${t('inventory')} | Nextcar`,
      description: t('inventoryDescription'),
      type: 'website',
    },
    twitter: {
      card: 'summary',
      title: `${t('inventory')} | Nextcar`,
      description: t('inventoryDescription'),
    },
  };
}

export default async function VehiclesPage({ searchParams, params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('vehicles');

  const query = await searchParams;
  const q = typeof query.q === 'string' ? query.q.toLowerCase() : '';
  const parsedLimit = typeof query.limit === 'string' ? parseInt(query.limit, 10) : 20;
  const currentLimit = isNaN(parsedLimit) || parsedLimit < 1 ? 20 : parsedLimit;

  const fetchLimit = currentLimit + 1;
  const allVehiclesFetched = await getPublishedVehicles(fetchLimit);

  const hasMore = allVehiclesFetched.length > currentLimit;
  const vehicles = hasMore ? allVehiclesFetched.slice(0, currentLimit) : allVehiclesFetched;

  const filteredVehicles = vehicles.filter((vehicle) => {
    if (!q) return true;
    const title = `${vehicle.make} ${vehicle.model}`.toLowerCase();
    const desc = (vehicle.description || '').toLowerCase();
    return title.includes(q) || desc.includes(q);
  });

  return (
    <>
      <main className="max-w-4xl mx-auto p-6 lg:p-12 flex-grow w-full">
        <div className="flex flex-col gap-32">
          {filteredVehicles.length === 0 ? (
            <div className="flex items-center justify-center py-20">
              <div className="text-slate-400 text-lg">
                {q ? t('noMatch') : t('noInventoryShort')}
              </div>
            </div>
          ) : (
            filteredVehicles.map((vehicle, i) => (
              <VehicleCard key={vehicle.id} vehicle={vehicle} priority={i < 4} />
            ))
          )}
        </div>

        {hasMore && (
          <div className="mt-16 text-center">
            <Link
              href={`/vehicles?limit=${currentLimit + 20}${q ? `&q=${q}` : ''}`}
              className="inline-block bg-primary text-white dark:bg-white dark:text-primary px-8 py-4 rounded-full font-bold hover:-translate-y-1 transition-transform active:scale-95 shadow-xl shadow-primary/20"
              scroll={false}
            >
              {t('loadMore')}
            </Link>
          </div>
        )}
      </main>
    </>
  );
}
