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

const CONTACT_PHONE = '+371 20399627';
const CONTACT_PHONE_TEL = '+37120399627';

export default function SidebarPageLinks() {
  const t = useTranslations('nav');
  const tContacts = useTranslations('contacts');
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
      <div className="pt-2 mt-2 border-t border-slate-100">
        <a
          href={`tel:${CONTACT_PHONE_TEL}`}
          className="block py-2 text-sm font-semibold text-slate-900 hover:text-primary transition-colors rounded-lg px-3 -mx-3"
        >
          {CONTACT_PHONE}
        </a>
        <p className="text-[10px] text-slate-400 px-3 -mx-3">{tContacts('phone')}</p>
      </div>
    </nav>
  );
}
