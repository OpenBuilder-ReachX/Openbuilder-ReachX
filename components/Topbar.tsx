'use client';

import React, { useEffect, useRef, useState } from 'react';

type TopbarProps = {
  onMenuClick: () => void;
};

export default function Topbar({ onMenuClick }: TopbarProps) {
  const [isDark, setIsDark] = useState<boolean>(false);
  const searchRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    const el = document.documentElement;
    const currentlyDark = el.classList.contains('dark');
    setIsDark(currentlyDark);
  }, []);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === '/' && !e.metaKey && !e.ctrlKey && !e.altKey) {
        e.preventDefault();
        searchRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  const toggleTheme = () => {
    const el = document.documentElement;
    const next = !isDark;
    setIsDark(next);
    if (next) {
      el.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      el.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  };

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-neutral-200 bg-white/80 backdrop-blur-sm dark:border-neutral-800 dark:bg-neutral-950/80">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-2">
          <button
            aria-label="Open menu"
            onClick={onMenuClick}
            className="rounded-md p-2 hover:bg-neutral-100 dark:hover:bg-neutral-800 lg:hidden"
          >
            <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5">
              <path d="M3 6h18M3 12h18M3 18h18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </button>
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-md bg-gradient-to-br from-indigo-500 via-violet-500 to-fuchsia-500 text-white shadow-md">
              RX
            </div>
            <span className="text-sm font-semibold">ReachX</span>
            <span className="ml-2 rounded-full bg-neutral-900 px-2 py-1 text-xs text-white dark:bg-white dark:text-neutral-900">
              Agency OS
            </span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="hidden md:block">
            <div className="relative">
              <input
                ref={searchRef}
                type="text"
                placeholder="Quick search…"
                className="w-64 rounded-md border border-neutral-200 bg-white px-3 py-2 text-sm outline-none transition focus:border-neutral-400 dark:border-neutral-800 dark:bg-neutral-900"
              />
              <span className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-neutral-400">
                /
              </span>
            </div>
          </div>
          <button
            onClick={toggleTheme}
            className="rounded-md border border-neutral-200 bg-white px-2.5 py-2 text-sm hover:bg-neutral-100 dark:border-neutral-800 dark:bg-neutral-900 dark:hover:bg-neutral-800"
            aria-label="Toggle theme"
            title="Toggle theme"
          >
            {isDark ? (
              <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5">
                <path d="M12 3a9 9 0 000 18 9 9 0 010-18z" className="fill-current" />
              </svg>
            ) : (
              <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5">
                <path
                  d="M12 4v2m0 12v2m8-8h-2M6 12H4m12.95-5.657-1.414 1.414M8.464 16.95l-1.414 1.414m10.606 0-1.414-1.414M8.464 7.05 7.05 5.636"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
                <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="2" />
              </svg>
            )}
          </button>
          <div className="flex items-center gap-2 rounded-md border border-neutral-200 bg-white px-2 py-1 dark:border-neutral-800 dark:bg-neutral-900">
            <div className="h-7 w-7 rounded-md bg-neutral-200 dark:bg-neutral-800" />
            <div className="hidden text-sm md:block">
              <div className="font-medium">You</div>
              <div className="text-xs text-neutral-500 dark:text-neutral-400">Logged in</div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
