import React from 'react';
import type { Vehicle } from '@nextcar/shared';
import SidebarVehiclePreviews from './SidebarVehiclePreviews';
import SidebarPageLinks from './SidebarPageLinks';

interface SidebarProps {
  vehicles: Vehicle[];
  totalCount: number;
  lowestPrice: number | null;
}

const Sidebar: React.FC<SidebarProps> = ({ vehicles, totalCount, lowestPrice }) => {
  return (
    <aside className="w-full lg:w-[380px] lg:h-screen lg:sticky top-0 p-8 lg:p-12 flex flex-col justify-between bg-background-light dark:bg-background-dark z-40 transition-colors duration-300">
      <div className="space-y-16">
        {/* Logo and Animation */}
        <div className="flex items-center justify-between">
          <div className="font-display font-bold text-2xl tracking-tight uppercase dark:text-white">
            Nextcar<span className="text-slate-400">.</span>
          </div>
          <div className="vehicle-animation text-slate-400 flex items-center">
            <span className="material-symbols-outlined text-4xl transform -scale-x-100">commute</span>
          </div>
        </div>

        {/* Ongoing Sales */}
        <div className="space-y-6">
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">Ongoing Sales</p>
          <SidebarVehiclePreviews vehicles={vehicles} totalCount={totalCount} />
          <p className="text-sm text-slate-500 italic dark:text-slate-400 leading-relaxed">
            {lowestPrice !== null ? (
              <>
                Your next vehicle starting from <br />
                <span className="font-bold text-primary dark:text-white text-base not-italic">
                  ${lowestPrice.toLocaleString()}
                </span>
              </>
            ) : (
              <>Browse our inventory</>
            )}
          </p>
        </div>

        {/* Actions and Info Cards */}
        <div className="space-y-6">
          <a href="?contact=true" className="w-full bg-primary dark:bg-white dark:text-primary text-white py-5 rounded-full font-bold hover:opacity-90 transition-all flex items-center justify-center gap-2 group active:scale-[0.98]">
            {"Let's talk"}
            <span className="material-symbols-outlined text-sm group-hover:translate-x-1 transition-transform">arrow_forward</span>
          </a>

          <div className="grid grid-cols-2 gap-3">
            <div className="p-5 rounded-large bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/50 hover:border-slate-300 dark:hover:border-slate-600 transition-colors">
              <span className="material-symbols-outlined text-slate-400 mb-2">account_balance</span>
              <p className="text-xs font-bold uppercase tracking-wider dark:text-white">Leasing</p>
              <p className="text-[10px] text-slate-500 font-medium">From 2.9%</p>
            </div>
            <div className="p-5 rounded-large bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/50 hover:border-slate-300 dark:hover:border-slate-600 transition-colors">
              <span className="material-symbols-outlined text-slate-400 mb-2">payments</span>
              <p className="text-xs font-bold uppercase tracking-wider dark:text-white">Credit</p>
              <p className="text-[10px] text-slate-500 font-medium">Fast approval</p>
            </div>
          </div>

          <SidebarPageLinks />
        </div>
      </div>

      {/* Contact and Language */}
      <div className="space-y-8 pt-12 lg:pt-0">
        <div className="flex flex-col gap-4">
          <a className="text-xl font-semibold tracking-tight hover:underline dark:text-white" href="tel:+37120000000">+371 2000 0000</a>
          <div className="flex gap-4 uppercase text-[10px] font-extrabold tracking-[0.2em] text-slate-400">
            <span className="text-primary dark:text-white cursor-pointer border-b-2 border-primary dark:border-white pb-0.5">EN</span>
            <span className="cursor-pointer hover:text-slate-900 dark:hover:text-white transition-colors">LV</span>
            <span className="cursor-pointer hover:text-slate-900 dark:hover:text-white transition-colors">LT</span>
            <span className="cursor-pointer hover:text-slate-900 dark:hover:text-white transition-colors">EE</span>
            <span className="cursor-pointer hover:text-slate-900 dark:hover:text-white transition-colors">RU</span>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
