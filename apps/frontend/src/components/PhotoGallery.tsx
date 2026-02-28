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

export default function PhotoGallery({ photos }: { photos: VehiclePhoto[] }) {
  const [index, setIndex] = useState(-1);
  const t = useTranslations('photoGallery');

  if (!photos || photos.length === 0) {
    return (
      <div className="w-full h-96 bg-slate-100 dark:bg-slate-800 rounded-xl flex items-center justify-center text-slate-500">
        {t('noPhotos')}
      </div>
    );
  }

  const sorted = [...photos].sort((a, b) => a.order - b.order);
  const slides = sorted.map((photo) => ({ src: photo.url }));

  return (
    <div className="space-y-4">
      <div
        className="w-full h-[30vh] md:h-[60vh] bg-slate-200 dark:bg-slate-800 rounded-2xl overflow-hidden cursor-pointer shadow-lg group relative"
        onClick={() => setIndex(0)}
      >
        <Image
          src={sorted[0].url}
          alt="Main"
          fill
          priority
          sizes="(max-width: 1024px) 100vw, 66vw"
          className="object-cover group-hover:scale-105 transition-transform duration-700"
        />
        <div className="absolute inset-0 bg-black/10 group-hover:bg-black/20 transition-colors" />
        {sorted[0].defects?.length ? (
          <div onClick={(e) => e.stopPropagation()}>
            <DefectIndicator defects={sorted[0].defects} photoLabel={t('mainPhoto')} />
          </div>
        ) : null}
        <div className="absolute bottom-4 right-4 bg-black/60 text-white px-4 py-2 rounded-full text-sm font-semibold backdrop-blur-md flex items-center gap-2">
          <span className="material-symbols-outlined text-sm">fullscreen</span>
          {t('enlarge')}
        </div>
      </div>

      {sorted.length > 1 && (
        <div className="flex flex-nowrap overflow-x-auto gap-2 md:gap-4 pb-2 snap-x hide-scrollbar">
          {sorted.slice(1).map((photo, i) => (
            <div
              key={photo.url}
              className="aspect-[4/3] w-24 md:w-32 bg-slate-200 dark:bg-slate-800 rounded-xl overflow-hidden cursor-pointer hover:opacity-90 relative snap-start shrink-0"
              onClick={() => setIndex(i + 1)}
            >
              <Image
                src={photo.url}
                alt={`Gallery ${i + 1}`}
                fill
                sizes="128px"
                className="object-cover"
              />
              {photo.defects?.length ? (
                <div onClick={(e) => e.stopPropagation()}>
                  <DefectIndicator defects={photo.defects} photoLabel={`Photo ${i + 2}`} />
                </div>
              ) : null}
            </div>
          ))}
        </div>
      )}

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
