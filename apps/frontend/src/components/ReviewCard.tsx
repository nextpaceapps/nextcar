'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { extractYoutubeId, getYoutubeThumbnailUrl } from '@/lib/youtube';

type ReviewCardProps = {
  videoLinks: string[];
};

export default function ReviewCard({ videoLinks }: ReviewCardProps) {
  const t = useTranslations('vehicles');
  const [modalVideoId, setModalVideoId] = useState<string | null>(null);

  if (!videoLinks?.length) return null;

  const firstLink = videoLinks[0];
  const firstId = extractYoutubeId(firstLink);
  if (!firstId) return null;

  const thumbUrl = getYoutubeThumbnailUrl(firstId);
  const hasMultiple = videoLinks.length > 1;

  return (
    <>
      <button
        type="button"
        onClick={() => setModalVideoId(firstId)}
        className="w-full text-left rounded-xl overflow-hidden border-2 border-slate-200 dark:border-slate-700 hover:border-red-400 dark:hover:border-red-600 bg-slate-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2 transition-colors group"
        aria-label={t('reviewCardWatch')}
      >
        <div className="relative aspect-video">
          <img
            src={thumbUrl}
            alt=""
            className="w-full h-full object-cover"
          />
          <div
            className="absolute inset-0 flex items-center justify-center bg-black/40 group-hover:bg-black/50 transition-colors"
            aria-hidden
          >
            <span className="material-symbols-outlined text-white text-6xl drop-shadow-lg">
              play_circle
            </span>
          </div>
        </div>
        <div className="flex items-center justify-between gap-3 p-4 bg-red-600 dark:bg-red-700 text-white">
          <div className="min-w-0">
            <span className="block text-xs font-bold uppercase tracking-wider text-red-100">
              {t('reviewCardLabel')}
            </span>
            <span className="block text-sm font-semibold mt-0.5 truncate">
              {hasMultiple ? t('reviewCardViewAllVideos', { count: videoLinks.length }) : t('reviewCardWatchOnYouTube')}
            </span>
          </div>
          <span className="material-symbols-outlined shrink-0" aria-hidden>
            arrow_forward
          </span>
        </div>
      </button>

      {modalVideoId && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80"
          role="dialog"
          aria-modal="true"
          aria-label={t('reviewCardWatch')}
          onClick={() => setModalVideoId(null)}
        >
          <div
            className="relative w-full max-w-4xl aspect-video rounded-xl overflow-hidden bg-slate-900 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setModalVideoId(null)}
              className="absolute top-3 right-3 z-10 p-2 rounded-full bg-black/60 text-white hover:bg-black/80 transition-colors"
              aria-label={t('reviewCardCloseModal')}
            >
              <span className="material-symbols-outlined">close</span>
            </button>
            <iframe
              src={`https://www.youtube.com/embed/${modalVideoId}?autoplay=1`}
              title={t('reviewCardWatch')}
              className="w-full h-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        </div>
      )}
    </>
  );
}
