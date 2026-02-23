'use client';

import React, { useState } from 'react';
import Image from 'next/image';

interface Photo {
    url: string;
    order: number;
}

export default function PhotoGallery({ photos }: { photos: Photo[] }) {
    const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);

    if (!photos || photos.length === 0) {
        return (
            <div className="w-full h-96 bg-slate-100 dark:bg-slate-800 rounded-xl flex items-center justify-center text-slate-500">
                No photos available
            </div>
        );
    }

    // Ensure they are sorted; though we already sort in the data layer
    const sorted = [...photos].sort((a, b) => a.order - b.order);

    return (
        <div className="space-y-4">
            <div
                className="w-full h-[60vh] bg-slate-200 dark:bg-slate-800 rounded-2xl overflow-hidden cursor-pointer shadow-lg group relative"
                onClick={() => setSelectedPhoto(sorted[0].url)}
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
                <span className="absolute bottom-4 right-4 bg-black/60 text-white px-4 py-2 rounded-full text-sm font-semibold backdrop-blur-md">
                    Enlarge
                </span>
            </div>

            {sorted.length > 1 && (
                <div className="grid grid-cols-4 gap-4">
                    {sorted.slice(1).map((photo, i) => (
                        <div
                            key={photo.url}
                            className="aspect-[4/3] bg-slate-200 dark:bg-slate-800 rounded-xl overflow-hidden cursor-pointer hover:opacity-90 relative"
                            onClick={() => setSelectedPhoto(photo.url)}
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

            {selectedPhoto && (
                <div
                    className="fixed inset-0 z-50 bg-black/90 p-8 flex items-center justify-center backdrop-blur-sm"
                    onClick={() => setSelectedPhoto(null)}
                >
                    <Image
                        src={selectedPhoto}
                        alt="Enlarged"
                        fill
                        sizes="100vw"
                        className="object-contain shadow-2xl rounded-sm p-4 md:p-8"
                    />
                    <button className="fixed top-8 right-8 text-white/50 hover:text-white p-2 z-10">
                        <span className="material-symbols-outlined text-4xl leading-none">close</span>
                    </button>
                </div>
            )}
        </div>
    );
}
