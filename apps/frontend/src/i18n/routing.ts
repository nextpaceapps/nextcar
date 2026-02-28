import { defineRouting } from 'next-intl/routing';

export const routing = defineRouting({
  locales: ['en', 'lv', 'lt', 'ee', 'ru'],
  defaultLocale: 'lv',
  localePrefix: 'always',
});
