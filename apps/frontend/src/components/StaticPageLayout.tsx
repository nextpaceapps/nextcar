import React from 'react';

interface StaticPageLayoutProps {
  children: React.ReactNode;
  className?: string;
}

/** Wraps static/informational page content with consistent max-width and padding. */
export default function StaticPageLayout({ children, className = '' }: StaticPageLayoutProps) {
  return (
    <main className={`max-w-4xl mx-auto p-6 lg:p-12 flex-grow w-full ${className}`}>
      {children}
    </main>
  );
}
