'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';

const Footer: React.FC = () => {
  const t = useTranslations('footer');

  return (
    <footer className="p-6 lg:p-8">
      <div className="bg-black text-white rounded-xlarge p-10 lg:p-20 flex flex-col min-h-[500px] justify-between relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-blue-500/10 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/2" />

        <div className="relative z-10">
          <h2 className="text-3xl lg:text-5xl font-display font-semibold leading-tight max-w-3xl mb-4">
            {t('tagline')}
          </h2>
          <p className="text-slate-400 text-lg mb-10">{t('readyToGetStarted')}</p>

          <div className="flex flex-wrap gap-4 mb-20">
            <Link
              href="?contact=true"
              className="inline-block text-center bg-white text-black px-10 py-5 rounded-2xl font-bold text-lg hover:bg-slate-100 transition-all hover:-translate-y-1 active:scale-95 shadow-xl shadow-white/5"
            >
              {t('getQuote')}
            </Link>
            <Link
              href="?contact=true"
              className="inline-block text-center bg-[#2a2a2a] text-white px-10 py-5 rounded-2xl font-bold text-lg hover:bg-[#333333] transition-all hover:-translate-y-1 active:scale-95"
            >
              {t('bookConsultation')}
            </Link>
          </div>
        </div>

        <div className="mt-auto space-y-8 relative z-10">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <a
              className="text-slate-300 text-lg hover:text-white transition-colors flex items-center gap-2 group/link"
              href="mailto:hi@nextcar.lv"
            >
              hi@nextcar.lv
              <span className="material-symbols-outlined text-sm opacity-0 group-hover/link:opacity-100 transition-opacity">
                north_east
              </span>
            </a>
            <a
              className="text-slate-300 text-lg hover:text-white transition-colors flex items-center gap-2 group/link"
              href="tel:+37120399627"
            >
              +371 20399627
              <span className="material-symbols-outlined text-sm opacity-0 group-hover/link:opacity-100 transition-opacity">
                north_east
              </span>
            </a>

            <div className="flex gap-8 text-white font-medium uppercase text-xs tracking-widest">
              <a className="hover:text-slate-400 transition-colors" href="#">
                x
              </a>
              <a className="hover:text-slate-400 transition-colors" href="#">
                behance
              </a>
              <a className="hover:text-slate-400 transition-colors" href="#">
                linkedin
              </a>
              <a className="hover:text-slate-400 transition-colors" href="#">
                dribbble
              </a>
            </div>
          </div>

          <div className="flex flex-col md:flex-row md:items-center justify-between pt-8 border-t border-white/10 text-slate-500 text-[10px] font-bold uppercase tracking-widest">
            <p>{t('copyright')}</p>
            <a className="hover:text-white transition-colors" href="#">
              {t('privacyPolicy')}
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
