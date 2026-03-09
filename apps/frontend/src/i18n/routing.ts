import { defineRouting } from 'next-intl/routing';

export const routing = defineRouting({
  // Keep Latvian as the primary locale and show it first in UI lists
  locales: ['lv', 'en', 'lt', 'ee', 'ru'],
  defaultLocale: 'lv',
  localePrefix: 'always',
});
