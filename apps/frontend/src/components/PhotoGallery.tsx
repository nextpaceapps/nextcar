'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Lightbox from 'yet-another-react-lightbox';
import Thumbnails from 'yet-another-react-lightbox/plugins/thumbnails';
import 'yet-another-react-lightbox/styles.css';
import 'yet-another-react-lightbox/plugins/thumbnails.css';

interface Photo {
    url: string;
    order: number;
}

export default function PhotoGallery({ photos }: { photos: Photo[] }) {
    const [index, setIndex] = useState(-1);

    if (!photos || photos.length === 0) {
        return (
            <div className="w-full h-96 bg-slate-100 dark:bg-slate-800 rounded-xl flex items-center justify-center text-slate-500">
                No photos available
            </div>
        );
    }

    // Ensure they are sorted; though we already sort in the data layer
    const sorted = [...photos].sort((a, b) => a.order - b.order);

    // Map to lightbox format
    const slides = sorted.map(photo => ({ src: photo.url }));

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
                <div className="absolute bottom-4 right-4 bg-black/60 text-white px-4 py-2 rounded-full text-sm font-semibold backdrop-blur-md flex items-center gap-2">
                    <span className="material-symbols-outlined text-sm">fullscreen</span>
                    Enlarge
                </div>
            </div>

            {sorted.length > 1 && (
                <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-4 xl:grid-cols-5 gap-2 md:gap-4 overflow-x-auto pb-2 snap-x">
                    {sorted.slice(1).map((photo, i) => (
                        <div
                            key={photo.url}
                            className="aspect-[4/3] min-w-[80px] sm:min-w-0 bg-slate-200 dark:bg-slate-800 rounded-xl overflow-hidden cursor-pointer hover:opacity-90 relative snap-start shrink-0"
                            onClick={() => setIndex(i + 1)}
                        >
                            <Image
                                src={photo.url}
                                alt={`Gallery ${i}`}
                                fill
                                sizes="(max-width: 1024px) 25vw, 16vw"
                                className="object-cover"
                            />
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
