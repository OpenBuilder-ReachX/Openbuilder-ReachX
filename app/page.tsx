import { createSupabaseServer } from '@/lib/supabase/server';
import Link from 'next/link';

export default async function DashboardPage() {
  const supabase = createSupabaseServer();

  // Fetch counts
  const { count: candidateCount } = await supabase.from('candidates').select('*', { count: 'exact', head: true });
  const { count: clientCount } = await supabase.from('clients').select('*', { count: 'exact', head: true });
  const { count: greenCount } = await supabase.from('candidates').select('*', { count: 'exact', head: true }).eq('status', 'Green');

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-2xl font-semibold">Dashboard</h1>
        <p className="mt-1 text-sm text-neutral-600 dark:text-neutral-400">
          Overview of agency operations.
        </p>
      </header>

      {/* KPI Cards */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <Link href="/candidates" className="block rounded-xl border border-neutral-200 bg-white p-6 shadow-sm transition hover:shadow-md dark:border-neutral-800 dark:bg-neutral-900">
          <div className="text-sm font-medium text-neutral-600 dark:text-neutral-400">Total Candidates</div>
          <div className="mt-2 text-3xl font-bold">{candidateCount || 0}</div>
        </Link>

        <Link href="/clients" className="block rounded-xl border border-neutral-200 bg-white p-6 shadow-sm transition hover:shadow-md dark:border-neutral-800 dark:bg-neutral-900">
          <div className="text-sm font-medium text-neutral-600 dark:text-neutral-400">Active Clients</div>
          <div className="mt-2 text-3xl font-bold">{clientCount || 0}</div>
        </Link>

        <Link href="/candidates?status=Green" className="block rounded-xl border border-neutral-200 bg-green-50 p-6 shadow-sm transition hover:shadow-md dark:border-neutral-800 dark:bg-green-900/10">
          <div className="text-sm font-medium text-green-700 dark:text-green-400">Ready to Deploy</div>
          <div className="mt-2 text-3xl font-bold text-green-700 dark:text-green-400">{greenCount || 0}</div>
        </Link>

        <div className="block rounded-xl border border-neutral-200 bg-white p-6 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
          <div className="text-sm font-medium text-neutral-600 dark:text-neutral-400">Jurisdiction</div>
          <div className="mt-2 text-xl font-semibold">Mauritius</div>
          <div className="text-xs text-neutral-500">Compliance Active</div>
        </div>
      </div>

      {/* Quick Actions */}
      <section>
        <h2 className="text-lg font-semibold">Quick Actions</h2>
        <div className="mt-4 flex flex-wrap gap-4">
          <Link
            href="/candidates"
            className="rounded-md bg-neutral-900 px-4 py-2 text-sm text-white dark:bg-white dark:text-neutral-900"
          >
            Manage Candidates
          </Link>
          <Link
            href="/clients"
            className="rounded-md border border-neutral-200 bg-white px-4 py-2 text-sm dark:border-neutral-800 dark:bg-neutral-900"
          >
            Add Client
          </Link>
          <Link
            href="/agency"
            className="rounded-md border border-neutral-200 bg-white px-4 py-2 text-sm dark:border-neutral-800 dark:bg-neutral-900"
          >
            Setup Agency Profile
          </Link>
        </div>
      </section>
    </div>
  );
}
