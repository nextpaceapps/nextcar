import { getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import type { Vehicle } from '@nextcar/shared';

export interface PdpHeaderProps {
  vehicle: Pick<
    Vehicle,
    'year' | 'make' | 'model' | 'bodyType' | 'fuelType' | 'transmission' | 'price' | 'oldPrice'
  >;
}

export default async function PdpHeader({ vehicle }: PdpHeaderProps) {
  const t = await getTranslations('vehicles');

  const subtitleParts = [vehicle.bodyType, vehicle.fuelType, vehicle.transmission].filter(Boolean);
  const subtitle = subtitleParts.join(' · ');
  const showOldPrice =
    vehicle.oldPrice != null &&
    vehicle.oldPrice > 0 &&
    vehicle.oldPrice > vehicle.price;

  return (
    <header className="flex flex-col gap-2">
      <h1 className="text-3xl sm:text-4xl lg:text-5xl font-display font-bold leading-tight uppercase tracking-tighter text-slate-900">
        {vehicle.year} {vehicle.make} {vehicle.model}
      </h1>

      {subtitle && (
        <p className="text-sm text-slate-500 font-medium uppercase tracking-wide">
          {subtitle}
        </p>
      )}

      <div className="flex flex-wrap items-center justify-between gap-6 mt-4">
        <div className="flex flex-wrap items-baseline gap-3">
          <span className="text-4xl sm:text-5xl font-bold text-primary font-display tabular-nums">
            €{vehicle.price.toLocaleString()}
          </span>
          {showOldPrice && (
            <span className="text-xl sm:text-2xl text-slate-400 line-through font-display">
              €{vehicle.oldPrice!.toLocaleString()}
            </span>
          )}
        </div>

        <div className="flex flex-wrap gap-3">
          <a
            href="#inquiry-form"
            className="text-center bg-primary text-white py-3 px-7 rounded-full font-bold uppercase tracking-widest text-sm hover:-translate-y-0.5 transition-transform active:scale-[0.98] shadow-lg shadow-primary/25 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
          >
            {t('imInterested')}
          </a>
          <Link
            href="?intent=test-drive#inquiry-form"
            scroll={false}
            className="text-center bg-slate-900 text-white py-3 px-7 rounded-full font-bold uppercase tracking-widest text-sm hover:bg-slate-700 transition-colors active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2"
          >
            {t('scheduleTestDrive')}
          </Link>
        </div>
      </div>
    </header>
  );
}
