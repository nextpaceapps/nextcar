'use client';

import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import LeadCaptureForm from './LeadCaptureForm';
import { useEffect, useState, Suspense } from 'react';

function ContactModalContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const pathname = usePathname();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const isOpen = searchParams?.get('contact') === 'true';

    if (!mounted || !isOpen) return null;

    const close = () => {
        router.push(pathname, { scroll: false });
    };

    // Close on escape key
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') close();
        };
        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [pathname]);

    return (
        <div
            className="fixed inset-0 z-50 flex flex-col items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in"
            onClick={close}
        >
            <div
                className="relative w-full max-w-2xl overflow-y-auto max-h-[90vh] pb-4"
                onClick={(e) => e.stopPropagation()} // Prevent close when clicking inside modal
            >
                <div className="bg-white dark:bg-[#0a0c10] rounded-3xl shadow-2xl relative pt-4 px-2">
                    <button
                        onClick={close}
                        className="absolute top-8 right-8 z-10 w-10 h-10 flex items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors"
                        aria-label="Close modal"
                    >
                        <span className="material-symbols-outlined">close</span>
                    </button>
                    {/* Reusing LeadCaptureForm which naturally has good padding and border */}
                    {/* We can pass an optional vehicleId if we had one, but this is general contact */}
                    <div className="pt-2">
                        <LeadCaptureForm />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function ContactModal() {
    return (
        <Suspense fallback={null}>
            <ContactModalContent />
        </Suspense>
    );
}
