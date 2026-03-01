'use client';

import { useTranslations } from 'next-intl';
import { Link, usePathname } from '@/i18n/navigation';

const PAGE_KEYS = ['about', 'import', 'howItWorks', 'contacts'] as const;
const PATH_MAP: Record<(typeof PAGE_KEYS)[number], string> = {
  about: '/about',
  import: '/import',
  howItWorks: '/how-it-works',
  contacts: '/contacts',
};

export default function SidebarPageLinks() {
  const t = useTranslations('nav');
  const pathname = usePathname();

  return (
    <nav className="space-y-1" aria-label="Informational pages">
      <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 mb-3">
        {t('info')}
      </p>
      {PAGE_KEYS.map((key) => {
        const href = PATH_MAP[key];
        const isActive = pathname === href;
        return (
          <Link
            key={key}
            href={href}
            className={`block py-2 text-sm font-medium transition-colors rounded-lg px-3 -mx-3 ${
              isActive
                ? 'text-primary bg-slate-100'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            {t(key)}
          </Link>
        );
      })}
    </nav>
  );
}
