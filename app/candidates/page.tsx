import { createSupabaseServer } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export default async function CandidatesPage() {
  const supabase = createSupabaseServer();
  const { data: candidates, error } = await supabase
    .from('candidates')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching candidates:', error);
  }

  // Helper action to create a dummy candidate for testing
  async function createDummyCandidate() {
    'use server';
    const supabase = createSupabaseServer();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return redirect('/login');

    // Random expiry date: 50% chance of being expired or close
    const daysOffset = Math.floor(Math.random() * 60) - 10; // -10 to +50 days from now
    const expiry = new Date();
    expiry.setDate(expiry.getDate() + daysOffset);

    await supabase.from('candidates').insert({
      agency_id: user.id, // Linked to the logged-in user's agency
      first_name: 'John',
      last_name: 'Doe ' + Math.floor(Math.random() * 1000),
      nationality: 'MU',
      role: 'General Worker',
      availability: 'Immediate',
      status: 'Green',
      document_expiry_date: expiry.toISOString(),
      compliance_notes: 'Created via Quick Add',
    });
    revalidatePath('/candidates');
  }

  // Compliance Logic (Client-Side for Display)
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
            Deep profiles with compliance status and availability (Mauritius).
          </p>
        </div>
        <div className="flex gap-2">
          <form action={createDummyCandidate}>
            <button className="rounded-md bg-neutral-900 px-4 py-2 text-sm text-white dark:bg-white dark:text-neutral-900">
              + Quick Add (Test)
            </button>
          </form>
          {/* CSV Download Link would go here, maybe pointing to an API route */}
          <button className="rounded-md border border-neutral-200 px-4 py-2 text-sm dark:border-neutral-800">
            Import CVs
          </button>
        </div>
      </header>

      <div className="rounded-xl border border-neutral-200 bg-white p-4 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
        <div className="flex flex-wrap items-center gap-2">
          <input
            className="w-48 rounded-md border border-neutral-200 bg-white px-3 py-2 text-sm dark:border-neutral-800 dark:bg-neutral-950"
            placeholder="Search candidates…"
          />
          {/* Filters can be wired later */}
          <select className="rounded-md border border-neutral-200 bg-white px-3 py-2 text-sm dark:border-neutral-800 dark:bg-neutral-950">
            <option>All Status</option>
            <option>Green</option>
            <option>Yellow</option>
            <option>Red</option>
          </select>
        </div>

        <div className="mt-4 overflow-x-auto">
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
              {/* Show Empty State if no candidates */}
              {(!candidates || candidates.length === 0) && (
                <tr>
                  <td colSpan={6} className="px-3 py-8 text-center text-neutral-500">
                    No candidates found. Click "Quick Add" to test the database connection.
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
