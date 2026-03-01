'use client';

import { useState, useRef, useCallback, useEffect, useMemo } from 'react';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { extractYoutubeId, getYoutubeThumbnailUrl } from '@/lib/youtube';

type ReviewCardProps = {
  videoLinks: string[];
};

export default function ReviewCard({ videoLinks }: ReviewCardProps) {
  const t = useTranslations('vehicles');
  const triggerRef = useRef<HTMLButtonElement>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  const videoIds = useMemo(
    () => videoLinks.map((link) => extractYoutubeId(link)).filter((id): id is string => id != null),
    [videoLinks]
  );

  const closeModal = useCallback(() => {
    setModalOpen(false);
    triggerRef.current?.focus();
  }, []);

  useEffect(() => {
    if (!modalOpen) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeModal();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [modalOpen, closeModal]);

  if (!videoIds.length) return null;

  const firstId = videoIds[0];
  const thumbUrl = getYoutubeThumbnailUrl(firstId);
  const hasMultiple = videoIds.length > 1;

  const openModal = () => {
    setCurrentIndex(0);
    setModalOpen(true);
  };

  const currentVideoId = modalOpen ? videoIds[currentIndex] ?? firstId : firstId;
  const canPrev = hasMultiple && currentIndex > 0;
  const canNext = hasMultiple && currentIndex < videoIds.length - 1;

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        onClick={openModal}
        className="w-full text-left rounded-xl overflow-hidden border-2 border-slate-200 dark:border-slate-700 hover:border-red-400 dark:hover:border-red-600 bg-slate-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2 transition-colors group"
        aria-label={t('reviewCardWatch')}
      >
        <div className="relative aspect-video w-full">
          <Image
            src={thumbUrl}
            alt=""
            fill
            className="object-cover"
            sizes="(max-width: 1024px) 100vw, 380px"
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
              {hasMultiple ? t('reviewCardViewAllVideos', { count: videoIds.length }) : t('reviewCardWatchOnYouTube')}
            </span>
          </div>
          <span className="material-symbols-outlined shrink-0" aria-hidden>
            arrow_forward
          </span>
        </div>
      </button>

      {modalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80"
          role="dialog"
          aria-modal="true"
          aria-label={t('reviewCardWatch')}
          onClick={() => closeModal()}
        >
          <div
            className="relative w-full max-w-4xl aspect-video rounded-xl overflow-hidden bg-slate-900 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={closeModal}
              className="absolute top-3 right-3 z-10 p-2 rounded-full bg-black/60 text-white hover:bg-black/80 transition-colors"
              aria-label={t('reviewCardCloseModal')}
            >
              <span className="material-symbols-outlined">close</span>
            </button>

            {hasMultiple && (
              <>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setCurrentIndex((i) => Math.max(0, i - 1));
                  }}
                  disabled={!canPrev}
                  className="absolute left-2 top-1/2 -translate-y-1/2 z-10 p-2 rounded-full bg-black/60 text-white hover:bg-black/80 disabled:opacity-30 disabled:pointer-events-none transition-colors"
                  aria-label={t('reviewCardPrevVideo')}
                >
                  <span className="material-symbols-outlined">chevron_left</span>
                </button>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setCurrentIndex((i) => Math.min(videoIds.length - 1, i + 1));
                  }}
                  disabled={!canNext}
                  className="absolute right-2 top-1/2 -translate-y-1/2 z-10 p-2 rounded-full bg-black/60 text-white hover:bg-black/80 disabled:opacity-30 disabled:pointer-events-none transition-colors"
                  aria-label={t('reviewCardNextVideo')}
                >
                  <span className="material-symbols-outlined">chevron_right</span>
                </button>
              </>
            )}

            <iframe
              key={currentVideoId}
              src={`https://www.youtube.com/embed/${currentVideoId}?autoplay=1`}
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
