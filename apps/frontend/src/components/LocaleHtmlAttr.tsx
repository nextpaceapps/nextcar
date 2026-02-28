'use client';

import { useLocale } from 'next-intl';
import { usePathname } from '@/i18n/navigation';
import { useEffect } from 'react';
import { routing } from '@/i18n/routing';

/** Sets documentElement lang and injects hreflang link tags for SEO. */
export default function LocaleHtmlAttr() {
  const locale = useLocale();
  const pathname = usePathname();

  useEffect(() => {
    if (typeof document === 'undefined') return;
    document.documentElement.lang = locale;
  }, [locale]);

  useEffect(() => {
    if (typeof document === 'undefined' || typeof window === 'undefined') return;
    const origin = window.location.origin;
    const existing = document.querySelectorAll('link[data-nextcar-hreflang]');
    existing.forEach((el) => el.remove());
    routing.locales.forEach((loc) => {
      const link = document.createElement('link');
      link.rel = 'alternate';
      link.hreflang = loc;
      link.href = `${origin}/${loc}${pathname || ''}`;
      link.setAttribute('data-nextcar-hreflang', '');
      document.head.appendChild(link);
    });
    return () => {
      document.querySelectorAll('link[data-nextcar-hreflang]').forEach((el) => el.remove());
    };
  }, [pathname]);

  return null;
}
