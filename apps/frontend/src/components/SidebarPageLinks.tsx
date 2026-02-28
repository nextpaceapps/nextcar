'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const PAGES = [
  { href: '/about', label: 'About Nextcar' },
  { href: '/import', label: 'Import Service' },
  { href: '/how-it-works', label: 'How It Works' },
  { href: '/contacts', label: 'Contacts' },
] as const;

export default function SidebarPageLinks() {
  const pathname = usePathname();

  return (
    <nav className="space-y-1" aria-label="Informational pages">
      <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 mb-3">
        Info
      </p>
      {PAGES.map(({ href, label }) => {
        const isActive = pathname === href;
        return (
          <Link
            key={href}
            href={href}
            className={`block py-2 text-sm font-medium transition-colors rounded-lg px-3 -mx-3 ${
              isActive
                ? 'text-primary dark:text-white bg-slate-100 dark:bg-slate-800/70'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800/50'
            }`}
          >
            {label}
          </Link>
        );
      })}
    </nav>
  );
}
