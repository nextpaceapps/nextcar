'use client';

import React from 'react';

function extractYoutubeId(url: string) {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
}

export default function YoutubeEmbed({ links }: { links?: string[] }) {
    if (!links || links.length === 0) return null;

    return (
        <div className="space-y-8 mt-12 mb-12">
            <h3 className="text-2xl font-bold font-display uppercase tracking-tight text-slate-800 dark:text-slate-100">
                Video Reviews
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {links.map((link, idx) => {
                    const videoId = extractYoutubeId(link);
                    if (!videoId) return null;

                    return (
                        <div key={idx} className="aspect-video w-full rounded-2xl overflow-hidden bg-slate-900 shadow-xl border border-slate-200 dark:border-slate-800">
                            <iframe
                                src={`https://www.youtube.com/embed/${videoId}`}
                                title={`YouTube Video ${idx + 1}`}
                                className="w-full h-full"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                            />
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
