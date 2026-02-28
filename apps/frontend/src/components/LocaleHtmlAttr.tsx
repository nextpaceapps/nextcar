'use client';

import { useLocale } from 'next-intl';
import { useEffect } from 'react';

/** Sets documentElement lang for the current locale (hreflang is server-rendered via layout generateMetadata). */
export default function LocaleHtmlAttr() {
  const locale = useLocale();

  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.documentElement.lang = locale;
    }
  }, [locale]);

  return null;
}
