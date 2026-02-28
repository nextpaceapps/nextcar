'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Lightbox from 'yet-another-react-lightbox';
import Thumbnails from 'yet-another-react-lightbox/plugins/thumbnails';
import 'yet-another-react-lightbox/styles.css';
import 'yet-another-react-lightbox/plugins/thumbnails.css';
import type { VehiclePhoto } from '@nextcar/shared';
import { useTranslations } from 'next-intl';
import { DefectIndicator } from './DefectIndicator';

const DESKTOP_VISIBLE_THUMBNAILS = 3;

export interface HeroGalleryProps {
  photos: VehiclePhoto[];
  /** Optional badge slot on main image (e.g. verification marker for PDP #66) */
  badge?: React.ReactNode;
}

export default function HeroGallery({ photos, badge }: HeroGalleryProps) {
  const [index, setIndex] = useState(-1);
  const t = useTranslations('photoGallery');

  if (!photos || photos.length === 0) {
    return (
      <div className="w-full aspect-[4/3] max-h-[60vh] bg-slate-100 dark:bg-slate-800 rounded-2xl flex items-center justify-center text-slate-500 dark:text-slate-400">
        {t('noPhotos')}
      </div>
    );
  }

  const sorted = [...photos].sort((a, b) => a.order - b.order);
  const slides = sorted.map((photo) => ({ src: photo.url }));

  const mainPhoto = sorted[0];
  const thumbnails = sorted.slice(1, 1 + DESKTOP_VISIBLE_THUMBNAILS);
  const remainingCount = Math.max(0, sorted.length - 1 - DESKTOP_VISIBLE_THUMBNAILS);
  const showRemainingOverlay = remainingCount > 0;
  const hasThumbnails = thumbnails.length > 0;

  return (
    <div className="space-y-4">
      {/* Desktop: grid with main ~70% + thumbnails ~30% (single column when only one photo) */}
      <div
        className={`hidden md:grid md:gap-3 lg:gap-4 md:aspect-[16/10] md:max-h-[60vh] md:min-h-[320px] rounded-2xl overflow-hidden ${
          hasThumbnails ? 'md:grid-cols-[1fr_minmax(0,280px)]' : 'md:grid-cols-1'
        }`}
      >
        {/* Main image */}
        <div
          className="relative w-full h-full min-h-[280px] bg-slate-200 dark:bg-slate-800 cursor-pointer group overflow-hidden"
          onClick={() => setIndex(0)}
        >
          <Image
            src={mainPhoto.url}
            alt={t('mainPhoto')}
            fill
            priority
            sizes="(max-width: 768px) 100vw, 70vw"
            className="object-cover group-hover:scale-[1.02] transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-black/5 group-hover:bg-black/10 transition-colors" />
          {badge && (
            <div className="absolute top-3 left-3 z-10" onClick={(e) => e.stopPropagation()}>
              {badge}
            </div>
          )}
          {mainPhoto.defects?.length ? (
            <div onClick={(e) => e.stopPropagation()}>
              <DefectIndicator defects={mainPhoto.defects} photoLabel={t('mainPhoto')} />
            </div>
          ) : null}
          <div className="absolute bottom-3 right-3 bg-black/60 text-white px-3 py-2 rounded-full text-sm font-semibold backdrop-blur-md flex items-center gap-2">
            <span className="material-symbols-outlined text-sm">fullscreen</span>
            {t('enlarge')}
          </div>
        </div>

        {/* Side thumbnails column: 2–3 stacked, equal height (only when we have more than one photo) */}
        {hasThumbnails && (
        <div className="flex flex-col gap-2 lg:gap-3 min-h-0 h-full">
          {thumbnails.map((photo, i) => {
            const globalIndex = i + 1;
            const isLast = i === thumbnails.length - 1;
            const showOverlay = isLast && showRemainingOverlay;
            return (
              <div
                key={photo.url}
                className="relative flex-1 min-h-0 rounded-xl overflow-hidden cursor-pointer hover:opacity-95 bg-slate-200 dark:bg-slate-800 group/thumb"
                onClick={() => setIndex(globalIndex)}
              >
                <Image
                  src={photo.url}
                  alt={t('photo', { number: globalIndex + 1 })}
                  fill
                  sizes="280px"
                  className="object-cover group-hover/thumb:scale-[1.03] transition-transform duration-300"
                />
                {photo.defects?.length ? (
                  <div onClick={(e) => e.stopPropagation()}>
                    <DefectIndicator
                      defects={photo.defects}
                      photoLabel={t('photo', { number: globalIndex + 1 })}
                    />
                  </div>
                ) : null}
                {showOverlay && (
                  <div className="absolute inset-0 bg-black/60 flex items-center justify-center text-white font-semibold text-sm backdrop-blur-[2px] pointer-events-none">
                    {t('morePhotos', { count: remainingCount })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
        )}
      </div>

      {/* Mobile: single main image + gallery entry */}
      <div className="md:hidden space-y-3">
        <div
          className="relative w-full aspect-[4/3] max-h-[50vh] bg-slate-200 dark:bg-slate-800 rounded-2xl overflow-hidden cursor-pointer group"
          onClick={() => setIndex(0)}
        >
          <Image
            src={mainPhoto.url}
            alt={t('mainPhoto')}
            fill
            priority
            sizes="100vw"
            className="object-cover group-hover:scale-[1.02] transition-transform duration-300"
          />
          <div className="absolute inset-0 bg-black/5 group-hover:bg-black/10 transition-colors" />
          {badge && (
            <div className="absolute top-3 left-3 z-10" onClick={(e) => e.stopPropagation()}>
              {badge}
            </div>
          )}
          {mainPhoto.defects?.length ? (
            <div onClick={(e) => e.stopPropagation()}>
              <DefectIndicator defects={mainPhoto.defects} photoLabel={t('mainPhoto')} />
            </div>
          ) : null}
          <div className="absolute bottom-3 right-3 bg-black/60 text-white px-3 py-2 rounded-full text-sm font-semibold backdrop-blur-md flex items-center gap-2">
            <span className="material-symbols-outlined text-sm">fullscreen</span>
            {t('enlarge')}
          </div>
        </div>
        {sorted.length > 1 && (
          <button
            type="button"
            onClick={() => setIndex(0)}
            className="w-full py-3 px-4 rounded-xl border-2 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-semibold text-sm flex items-center justify-center gap-2 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
          >
            <span className="material-symbols-outlined text-lg">photo_library</span>
            {t('viewAllPhotos', { count: sorted.length })}
          </button>
        )}
      </div>

      <Lightbox
        open={index >= 0}
        index={index}
        close={() => setIndex(-1)}
        slides={slides}
        plugins={[Thumbnails]}
      />
    </div>
  );
}
