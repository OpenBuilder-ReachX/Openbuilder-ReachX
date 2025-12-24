'use client';

// Converting to Client Component to support Filters (for v1 MVP)
// ideally we keep it server, but for "Quick Actions" + "Filters" 
// in a single file without URL state complexity, this is faster to iterate.
// Wait, we can keep it Server and use URL params for search, but for step-by-step verification
// let's stick to the Server Component pattern we established, and just add a Search Form.

import { createSupabaseServer } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export default async function CandidatesPage({ searchParams }: { searchParams: { q?: string; status?: string } }) {
  const supabase = createSupabaseServer();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return redirect('/login');

  // Get User's Agency ID
  const { data: profile } = await supabase.from('profiles').select('agency_id').eq('id', user.id).single();
  const agencyId = profile?.agency_id;

  if (!agencyId) {
    return <div>Error: No Agency Profile. Please contact support.</div>;
  }

  // Fetch Candidates with Filters
  let query = supabase.from('candidates').select('*').eq('agency_id', agencyId).order('created_at', { ascending: false });

  if (searchParams?.status && searchParams.status !== 'All Status') {
    query = query.eq('status', searchParams.status);
  }

  // Note: 'ilike' filter for name would need a slightly different query construction or RPC for "name search"
  // For MVP v1, we'll just fetch all and let the user filter via SQL if strict, 
  // or we add a text search column. 
  // Let's implement a basic 'ilike' on last_name for the 'q' param.
  if (searchParams?.q) {
    query = query.ilike('last_name', `%${searchParams.q}%`);
  }

  const { data: candidates, error } = await query;
  if (error) console.error('Error fetching:', error);


  // Action: Create Candidate (Deterministic)
  async function createQuickCandidate() {
    'use server';
    const supabase = createSupabaseServer();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return redirect('/login');

    const { data: profile } = await supabase.from('profiles').select('agency_id').eq('id', user.id).single();
    if (!profile?.agency_id) return;

    // DETERMINISTIC: Always valid for 1 year.
    // "Trust Fix": No more random red flags.
    const expiry = new Date();
    expiry.setFullYear(expiry.getFullYear() + 1);

    await supabase.from('candidates').insert({
      agency_id: profile.agency_id,
      first_name: 'New',
      last_name: 'Candidate',
      nationality: 'MU',
      role: 'General Worker',
      availability: 'Immediate',
      status: 'Green',
      document_expiry_date: expiry.toISOString(),
      compliance_notes: 'Quick Add (Valid 1yr)',
    });
    revalidatePath('/candidates');
  }

  // Compliance Logic (Display)
  function getComputedStatus(c: any) {
    if (!c.document_expiry_date) return c.status;
    const expiry = new Date(c.document_expiry_date);
    const now = new Date();
    const daysUntil = (expiry.getTime() - now.getTime()) / (1000 * 3600 * 24);
    if (daysUntil < 0) return 'Red';
    if (daysUntil < 30) return 'Yellow';
    return 'Green';
  }

  return (
    <div className="space-y-8">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Candidates</h1>
          <p className="mt-1 text-sm text-neutral-600 dark:text-neutral-400">
            Deep profiles with compliance status and availability.
          </p>
        </div>
        <div className="flex gap-2">
          <form action={createQuickCandidate}>
            <button className="rounded-md bg-neutral-900 px-4 py-2 text-sm text-white dark:bg-white dark:text-neutral-900">
              + Quick Add (Standard)
            </button>
          </form>
          <button disabled className="rounded-md border border-neutral-200 px-4 py-2 text-sm text-neutral-400 cursor-not-allowed dark:border-neutral-800">
            Import (Coming Soon)
          </button>
        </div>
      </header>

      <div className="rounded-xl border border-neutral-200 bg-white p-4 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
        <form className="flex flex-wrap items-center gap-2 mb-4">
          <input
            name="q"
            defaultValue={searchParams?.q || ''}
            className="w-48 rounded-md border border-neutral-200 bg-white px-3 py-2 text-sm dark:border-neutral-800 dark:bg-neutral-950"
            placeholder="Search last name…"
          />
          <select
            name="status"
            defaultValue={searchParams?.status || 'All Status'}
            className="rounded-md border border-neutral-200 bg-white px-3 py-2 text-sm dark:border-neutral-800 dark:bg-neutral-950"
          >
            <option value="">All Status</option>
            <option value="Green">Green</option>
            <option value="Yellow">Yellow</option>
            <option value="Red">Red</option>
          </select>
          <button type="submit" className="rounded-md border border-neutral-200 px-3 py-2 text-sm hover:bg-neutral-50 dark:border-neutral-800">
            Filter
          </button>
        </form>

        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="text-left text-neutral-500 dark:text-neutral-400">
                <th className="px-3 py-2">Name</th>
                <th className="px-3 py-2">Nationality</th>
                <th className="px-3 py-2">Role</th>
                <th className="px-3 py-2">Availability</th>
                <th className="px-3 py-2">Compliance</th>
                <th className="px-3 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {(!candidates || candidates.length === 0) && (
                <tr>
                  <td colSpan={6} className="px-3 py-8 text-center text-neutral-500">
                    No candidates found.
                  </td>
                </tr>
              )}

              {candidates?.map((r) => {
                const computedStatus = getComputedStatus(r);
                return (
                  <tr key={r.id} className="border-t border-neutral-100 dark:border-neutral-800">
                    <td className="px-3 py-2 font-medium">{r.first_name} {r.last_name}</td>
                    <td className="px-3 py-2">{r.nationality || '-'}</td>
                    <td className="px-3 py-2">{r.role || '-'}</td>
                    <td className="px-3 py-2">{r.availability || '-'}</td>
                    <td className="px-3 py-2">
                      <span
                        className={`rounded-full px-2 py-1 text-xs ${computedStatus === 'Green'
                          ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300'
                          : computedStatus === 'Yellow'
                            ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300'
                            : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300'
                          }`}
                      >
                        {computedStatus}
                      </span>
                      {r.document_expiry_date && (
                        <div className="text-[10px] text-neutral-500">
                          Exp: {new Date(r.document_expiry_date).toLocaleDateString()}
                        </div>
                      )}
                    </td>
                    <td className="px-3 py-2">
                      <button className="rounded-md border border-neutral-200 px-2 py-1 dark:border-neutral-800">View</button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
