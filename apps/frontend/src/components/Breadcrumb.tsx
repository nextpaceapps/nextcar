'use client';

import { Link } from '@/i18n/navigation';

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

export interface BreadcrumbProps {
  items: BreadcrumbItem[];
}

export default function Breadcrumb({ items }: BreadcrumbProps) {
  if (!items.length) return null;

  return (
    <nav aria-label="breadcrumb" className="mb-4">
      <ol
        className="flex flex-wrap items-center gap-x-2 gap-y-1 text-sm font-medium text-slate-600 dark:text-slate-400"
        itemScope
        itemType="https://schema.org/BreadcrumbList"
      >
        {items.map((item, i) => {
          const isLast = i === items.length - 1;
          return (
            <li
              key={i}
              className="flex items-center gap-x-2"
              itemProp="itemListElement"
              itemScope
              itemType="https://schema.org/ListItem"
            >
              {i > 0 && (
                <span className="text-slate-400 dark:text-slate-500 select-none" aria-hidden>
                  /
                </span>
              )}
              {isLast || !item.href ? (
                <span
                  className="uppercase tracking-wider text-slate-800 dark:text-slate-200"
                  itemProp="name"
                >
                  {item.label}
                </span>
              ) : (
                <Link
                  href={item.href}
                  className="uppercase tracking-wider hover:text-primary dark:hover:text-primary transition-colors"
                  itemProp="item"
                >
                  <span itemProp="name">{item.label}</span>
                </Link>
              )}
              <meta itemProp="position" content={String(i + 1)} />
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
