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
      className="w-full text-left flex items-center gap-4 p-4 rounded-xl border-2 border-amber-200 dark:border-amber-800 bg-amber-50/80 dark:bg-slate-900/80 hover:bg-amber-100/90 dark:hover:bg-slate-800/90 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:ring-offset-2"
      aria-label={t('historyCardCta')}
    >
      <span
        className="material-symbols-outlined text-amber-600 dark:text-amber-400 shrink-0"
        aria-hidden
      >
        history_edu
      </span>
      <div className="flex-1 min-w-0">
        <span className="block text-xs font-bold uppercase tracking-wider text-amber-700 dark:text-amber-300">
          {t('historyCardLabel')}
        </span>
        <span className="block text-sm font-semibold text-slate-800 dark:text-slate-100 mt-0.5">
          carVertical {t('historyCardReport')}
        </span>
      </div>
      <span
        className="material-symbols-outlined text-amber-600 dark:text-amber-400 shrink-0"
        aria-hidden
      >
        arrow_forward
      </span>
    </button>
  );
}
