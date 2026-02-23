'use client';

import React, { useState, useEffect } from 'react';

export default function ThemeProvider({ children }: { children: React.ReactNode }) {
    const [isDark, setIsDark] = useState(false);

    useEffect(() => {
        if (localStorage.theme === 'dark') {
            setIsDark(true);
        } else {
            setIsDark(false);
            localStorage.theme = 'light';
        }
    }, []);

    const toggleDarkMode = () => {
        setIsDark(!isDark);
        if (!isDark) {
            document.documentElement.classList.add('dark');
            localStorage.theme = 'dark';
        } else {
            document.documentElement.classList.remove('dark');
            localStorage.theme = 'light';
        }
    };

    return (
        <>
            {children}
            <button
                onClick={toggleDarkMode}
                className="fixed bottom-6 right-6 z-[100] p-4 bg-white dark:bg-slate-900 rounded-full shadow-2xl border border-slate-100 dark:border-slate-800 text-slate-500 dark:text-slate-400 hover:scale-110 transition-transform flex items-center justify-center group"
                aria-label="Toggle dark mode"
            >
                {isDark ? (
                    <span className="material-symbols-outlined group-hover:rotate-12 transition-transform">light_mode</span>
                ) : (
                    <span className="material-symbols-outlined group-hover:rotate-12 transition-transform">dark_mode</span>
                )}
            </button>
        </>
    );
}
