'use client';

import React, { useEffect, useState } from 'react';
import Sidebar from '@/components/Sidebar';
import Topbar from '@/components/Topbar';
import '@/instrumentation-client';

type AppShellProps = {
  children: React.ReactNode;
};

export default function AppShell({ children }: AppShellProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Persist and initialize theme from localStorage
  useEffect(() => {
    const stored = typeof window !== 'undefined' ? localStorage.getItem('theme') : null;
    const prefersDark =
      typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches;
    const shouldDark = stored ? stored === 'dark' : prefersDark;
    const el = document.documentElement;
    if (shouldDark) {
      el.classList.add('dark');
    } else {
      el.classList.remove('dark');
    }
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 text-neutral-900 transition-colors dark:bg-neutral-900 dark:text-neutral-100">
      <Topbar onMenuClick={() => setSidebarOpen((v) => !v)} />
      <div className="relative flex">
        <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <main className="flex-1 px-4 pb-10 pt-24 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">{children}</div>
        </main>
      </div>
      <footer className="border-t border-neutral-200 px-4 py-4 text-sm dark:border-neutral-800 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl flex items-center justify-between">
          <span>ReachX – Recruitment Agency Operating System</span>
          <span className="text-neutral-500">v0.1 • Functional {'>'} Pretty</span>
        </div>
      </footer>
    </div>
  );
}
