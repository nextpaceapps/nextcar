'use client';

import React from 'react';
import type { Vehicle } from '@nextcar/shared';
import { useTranslations, useLocale } from 'next-intl';
import { Link, usePathname } from '@/i18n/navigation';
import { routing } from '@/i18n/routing';
import SidebarVehiclePreviews from './SidebarVehiclePreviews';
import SidebarPageLinks from './SidebarPageLinks';

interface SidebarProps {
  vehicles: Vehicle[];
  totalCount: number;
  lowestPrice: number | null;
}

const Sidebar: React.FC<SidebarProps> = ({ vehicles, totalCount, lowestPrice }) => {
  const t = useTranslations('sidebar');
  const locale = useLocale();
  const pathname = usePathname();

  return (
    <aside className="w-full lg:w-[380px] lg:h-screen lg:sticky top-0 p-8 lg:p-12 flex flex-col justify-between bg-background-light z-40">
      <div className="space-y-16">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group">
            <img
              src="/car-logo.png"
              alt="Nextcar logo"
              width={60}
              height={40}
              className="object-contain"
            />
            <span className="font-display font-bold text-2xl tracking-tight uppercase group-hover:opacity-80 transition-opacity">
              Nextcar<span className="text-slate-400">.</span>
            </span>
          </Link>
        </div>

        <div className="space-y-6">
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">
            {t('ongoingSales')}
          </p>
          <SidebarVehiclePreviews vehicles={vehicles} totalCount={totalCount} />
          <p className="text-sm text-slate-500 italic leading-relaxed">
            {lowestPrice !== null ? (
              <>
                {t('yourNextVehicleFrom')} <br />
                <span className="font-bold text-primary text-base not-italic">
                  €{lowestPrice.toLocaleString()}
                </span>
              </>
            ) : (
              <>{t('browseInventory')}</>
            )}
          </p>
        </div>

        <div className="space-y-6">
          <Link
            href="?contact=true"
            className="w-full bg-primary text-white py-5 rounded-full font-bold hover:opacity-90 transition-all flex items-center justify-center gap-2 group active:scale-[0.98]"
          >
            {t('letsTalk')}
            <span className="material-symbols-outlined text-sm group-hover:translate-x-1 transition-transform">
              arrow_forward
            </span>
          </Link>

          <div className="grid grid-cols-2 gap-3">
            <div className="p-5 rounded-large bg-white border border-slate-100 hover:border-slate-300 transition-colors">
              <span className="material-symbols-outlined text-slate-400 mb-2">account_balance</span>
              <p className="text-xs font-bold uppercase tracking-wider">{t('leasing')}</p>
              <p className="text-[10px] text-slate-500 font-medium">{t('leasingFrom')}</p>
            </div>
            <div className="p-5 rounded-large bg-white border border-slate-100 hover:border-slate-300 transition-colors">
              <span className="material-symbols-outlined text-slate-400 mb-2">payments</span>
              <p className="text-xs font-bold uppercase tracking-wider">{t('credit')}</p>
              <p className="text-[10px] text-slate-500 font-medium">{t('creditFastApproval')}</p>
            </div>
          </div>

          <SidebarPageLinks />
        </div>
      </div>

      <div className="space-y-8 pt-12 lg:pt-0">
        <div className="flex flex-col gap-4">
          <a
            className="text-xl font-semibold tracking-tight hover:underline"
            href="tel:+37120399627"
          > +371 20399627</a>
          <div className="flex gap-4 uppercase text-[10px] font-extrabold tracking-[0.2em] text-slate-400">
            {routing.locales.map((loc) => {
              const isActive = locale === loc;
              return (
                <Link
                  key={loc}
                  href={pathname}
                  locale={loc}
                  className={
                    isActive
                      ? 'text-primary border-b-2 border-primary pb-0.5'
                      : 'hover:text-slate-900 transition-colors'
                  }
                >
                  {loc.toUpperCase()}
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
