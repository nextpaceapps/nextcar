'use client';

import React, { useState, useRef, useEffect } from 'react';

export interface PhotoDefect {
    description: string;
}

interface DefectIndicatorProps {
    defects: PhotoDefect[];
    /** Optional label for screen readers (e.g. "Photo 1") */
    photoLabel?: string;
    className?: string;
}

export function DefectIndicator({ defects, photoLabel, className = '' }: DefectIndicatorProps) {
    const [open, setOpen] = useState(false);
    const popoverRef = useRef<HTMLDivElement>(null);
    const buttonRef = useRef<HTMLButtonElement>(null);

    useEffect(() => {
        if (!open) return;
        const handleClickOutside = (e: MouseEvent) => {
            if (
                popoverRef.current &&
                !popoverRef.current.contains(e.target as Node) &&
                buttonRef.current &&
                !buttonRef.current.contains(e.target as Node)
            ) {
                setOpen(false);
            }
        };
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape') setOpen(false);
        };
        document.addEventListener('mousedown', handleClickOutside);
        document.addEventListener('keydown', handleEscape);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            document.removeEventListener('keydown', handleEscape);
        };
    }, [open]);

    if (!defects?.length) return null;

    const label = photoLabel
        ? `Photo has defects: ${defects.length} item(s). ${photoLabel}. Click to view.`
        : `Photo has defects: ${defects.length} item(s). Click to view.`;

    return (
        <div className={`absolute top-2 left-2 z-10 ${className}`}>
            <button
                ref={buttonRef}
                type="button"
                onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setOpen((o) => !o);
                }}
                aria-expanded={open}
                aria-haspopup="dialog"
                aria-label={label}
                className="w-3 h-3 rounded-full bg-red-500 hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-offset-2 shadow-md"
            />
            {open && (
                <div
                    ref={popoverRef}
                    role="dialog"
                    aria-label="Defect details"
                    className="absolute left-0 top-full mt-2 min-w-[200px] max-w-[320px] rounded-lg border border-amber-200 bg-amber-50 dark:bg-amber-950/90 dark:border-amber-800 shadow-lg p-3 z-20"
                >
                    <div className="flex items-center justify-between gap-2 mb-2">
                        <span className="text-xs font-semibold text-amber-800 dark:text-amber-200 uppercase tracking-wide">
                            Defects
                        </span>
                        <button
                            type="button"
                            onClick={() => setOpen(false)}
                            aria-label="Close defect list"
                            className="text-amber-700 dark:text-amber-300 hover:text-amber-900 dark:hover:text-amber-100 text-sm font-bold leading-none"
                        >
                            ×
                        </button>
                    </div>
                    <ul className="list-disc list-inside space-y-1 text-sm text-amber-900 dark:text-amber-100">
                        {defects.map((d, i) => (
                            <li key={i}>{d.description}</li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
}
