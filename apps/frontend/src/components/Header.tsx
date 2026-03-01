'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { useRouter as useLocaleRouter } from '@/i18n/navigation';

const HeaderContent: React.FC = () => {
  const router = useLocaleRouter(); // locale-aware router from next-intl
  const searchParams = useSearchParams();
  const [value, setValue] = useState(searchParams?.get('q') || '');
  const t = useTranslations('header');
  const tCommon = useTranslations('common');

  useEffect(() => {
    const q = searchParams?.get('q') || '';
    const id = requestAnimationFrame(() => setValue(q));
    return () => cancelAnimationFrame(id);
  }, [searchParams]);

  const handleSearch = () => {
    if (value.trim()) {
      router.push(`/vehicles?q=${encodeURIComponent(value)}`);
    } else {
      router.push('/vehicles');
    }
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') handleSearch();
  };

  return (
    <div className="sticky top-0 z-30 bg-white/90 backdrop-blur-xl p-6 lg:p-8">
      <div className="max-w-4xl mx-auto flex gap-4">
        <div className="flex-1 relative">
          <span className="absolute left-5 top-1/2 -translate-y-1/2 material-symbols-outlined text-slate-400">
            search
          </span>
          <input
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={onKeyDown}
            className="w-full pl-14 pr-6 py-4 rounded-full border-none bg-slate-100/50 focus:ring-2 ring-primary/20 text-sm lg:text-base"
            placeholder={t('searchPlaceholder')}
            type="text"
          />
        </div>
        <button
          onClick={handleSearch}
          className="px-10 bg-slate-950 text-white rounded-full font-bold text-sm transition-all active:scale-95 hover:bg-slate-800 shadow-sm"
        >
          {tCommon('search')}
        </button>
      </div>
    </div>
  );
};

const Header: React.FC = () => {
  return (
    <Suspense fallback={<div className="h-[92px] w-full bg-slate-50" />}>
      <HeaderContent />
    </Suspense>
  );
};

export default Header;
