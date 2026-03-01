'use client';

import { useTranslations } from 'next-intl';

export default function VerificationBadge() {
  const t = useTranslations('vehicles');

  return (
    <div
      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-600/90 dark:bg-emerald-500/90 text-white text-xs font-semibold uppercase tracking-wider shadow-lg backdrop-blur-sm"
      role="status"
      aria-label={t('verifiedBadge')}
    >
      <span className="material-symbols-outlined text-sm" aria-hidden>
        verified
      </span>
      <span>{t('verified')}</span>
    </div>
  );
}
