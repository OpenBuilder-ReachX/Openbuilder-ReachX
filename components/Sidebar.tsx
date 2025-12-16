'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React from 'react';

type SidebarProps = {
  open: boolean;
  onClose: () => void;
};

type NavItem = {
  href: string;
  label: string;
  icon: React.ReactNode;
};

const navItems: NavItem[] = [
  {
    href: '/',
    label: 'Dashboard',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5">
        <path d="M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z" className="fill-current" />
      </svg>
    ),
  },
  {
    href: '/agency',
    label: 'Agency Setup',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5">
        <path d="M4 20h16V9l-8-5-8 5v11z" className="fill-current" />
      </svg>
    ),
  },
  {
    href: '/candidates',
    label: 'Candidates',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5">
        <path d="M12 12a5 5 0 100-10 5 5 0 000 10zm-9 9a9 9 0 1118 0H3z" className="fill-current" />
      </svg>
    ),
  },
  {
    href: '/clients',
    label: 'Clients',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5">
        <path d="M3 21V7l9-4 9 4v14H3z" className="fill-current" />
      </svg>
    ),
  },
  {
    href: '/projects',
    label: 'Projects',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5">
        <path d="M4 4h16v4H4V4zm0 6h16v10H4V10z" className="fill-current" />
      </svg>
    ),
  },
];

export default function Sidebar({ open, onClose }: SidebarProps) {
  const pathname = usePathname();

  return (
    <>
      {/* Overlay for mobile */}
      {open && (
        <div
          className="fixed inset-0 z-30 bg-black/30 backdrop-blur-sm lg:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}
      <aside
        className={`fixed z-40 h-full w-72 transform border-r border-neutral-200 bg-white/90 shadow-sm backdrop-blur-sm transition-transform dark:border-neutral-800 dark:bg-neutral-950 lg:static lg:translate-x-0 ${
          open ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex h-full flex-col">
          <div className="px-4 pt-20 pb-4">
            <div className="rounded-xl border border-neutral-200 bg-white p-4 dark:border-neutral-800 dark:bg-neutral-900">
              <div className="text-sm text-neutral-500 dark:text-neutral-400">Agency</div>
              <div className="mt-1 font-semibold">ReachX</div>
              <div className="mt-2 text-xs text-neutral-500 dark:text-neutral-400">Jurisdiction: Mauritius</div>
            </div>
          </div>
          <nav className="flex-1 space-y-1 px-2">
            {navItems.map((item) => {
              const active = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`group flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors ${
                    active
                      ? 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-900'
                      : 'text-neutral-700 hover:bg-neutral-100 dark:text-neutral-300 dark:hover:bg-neutral-800'
                  }`}
                  onClick={onClose}
                >
                  <span className={`text-neutral-600 dark:text-neutral-300 ${active ? 'text-current' : ''}`}>
                    {item.icon}
                  </span>
                  <span className="font-medium">{item.label}</span>
                </Link>
              );
            })}
          </nav>
          <div className="px-4 pb-6">
            <div className="rounded-lg border border-neutral-200 bg-white p-3 text-xs text-neutral-600 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-300">
              Design principle: clarity, logs, human override.
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
