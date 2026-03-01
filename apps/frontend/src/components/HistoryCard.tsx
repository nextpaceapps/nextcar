'use client';

import { useTranslations } from 'next-intl';

const CARVERTICAL_FORM_ID = 'carvertical-request';

export default function HistoryCard() {
  const t = useTranslations('vehicles');

  function handleClick() {
    const el = document.getElementById(CARVERTICAL_FORM_ID);
    el?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      className="w-full text-left flex items-center gap-4 p-5 rounded-2xl bg-slate-900 border border-slate-800 hover:bg-slate-800 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:ring-offset-2 group"
      aria-label={t('historyCardCta')}
    >
      <div className="shrink-0 w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center">
        <span
          className="material-symbols-outlined text-amber-400 text-xl"
          aria-hidden
        >
          verified_user
        </span>
      </div>
      <div className="flex-1 min-w-0">
        <span className="block text-[10px] font-bold uppercase tracking-widest text-amber-400 mb-0.5">
          {t('historyCardLabel')}
        </span>
        <span className="block text-sm font-bold text-white">
          carVertical {t('historyCardReport')}
        </span>
      </div>
      <span
        className="material-symbols-outlined text-slate-500 group-hover:text-slate-300 transition-colors shrink-0"
        aria-hidden
      >
        arrow_forward
      </span>
    </button>
  );
}
