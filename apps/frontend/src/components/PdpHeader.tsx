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
    <header className="flex flex-col min-h-0">
      <h1 className="text-3xl sm:text-4xl lg:text-5xl font-display font-bold leading-tight uppercase tracking-tighter text-slate-900 dark:text-white">
        {vehicle.year} {vehicle.make} {vehicle.model}
      </h1>

      {subtitle && (
        <p className="mt-2 text-sm sm:text-base text-slate-500 dark:text-slate-400 font-medium uppercase tracking-wide">
          {subtitle}
        </p>
      )}

      <div className="mt-6">
        <span className="text-xs font-semibold uppercase tracking-widest text-slate-500 dark:text-slate-400 block mb-1">
          {t('price')}
        </span>
        <div className="flex flex-wrap items-baseline gap-3">
          {showOldPrice && (
            <span className="text-xl sm:text-2xl text-slate-400 dark:text-slate-500 line-through font-display font-semibold">
              ${vehicle.oldPrice!.toLocaleString()}
            </span>
          )}
          <span className="text-4xl sm:text-5xl font-bold text-primary dark:text-white font-display tabular-nums">
            ${vehicle.price.toLocaleString()}
          </span>
        </div>
      </div>

      <div className="mt-8 flex flex-col sm:flex-row gap-4">
        <a
          href="#inquiry-form"
          className="order-1 text-center bg-primary dark:bg-white text-white dark:text-primary py-4 sm:py-5 px-6 rounded-full font-bold uppercase tracking-widest text-sm hover:-translate-y-0.5 transition-transform active:scale-[0.98] shadow-xl shadow-primary/20 dark:shadow-white/10 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 dark:focus:ring-offset-slate-900"
        >
          {t('imInterested')}
        </a>
        <Link
          href="?intent=test-drive#inquiry-form"
          scroll={false}
          className="order-2 text-center bg-transparent border-2 border-slate-200 dark:border-slate-700 text-slate-800 dark:text-white py-4 sm:py-5 px-6 rounded-full font-bold uppercase tracking-widest text-sm hover:border-primary dark:hover:border-white transition-colors active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-slate-400 dark:focus:ring-slate-500 focus:ring-offset-2 dark:focus:ring-offset-slate-900 flex items-center justify-center gap-2"
        >
          <span className="material-symbols-outlined text-lg" aria-hidden>
            drive_eta
          </span>
          {t('scheduleTestDrive')}
        </Link>
      </div>
    </header>
  );
}
