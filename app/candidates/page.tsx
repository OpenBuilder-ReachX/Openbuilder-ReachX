import { createSupabaseServer } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import CandidateDropZone from './CandidateDropZone';

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

  if (searchParams?.q) {
    query = query.ilike('last_name', `%${searchParams.q}%`);
  }

  const { data: candidates, error } = await query;
  if (error) console.error('Error fetching:', error);


  // Action: Create Candidate (Deterministic)
  async function createQuickCandidate(formData: FormData) {
    'use server';
    const supabase = createSupabaseServer();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return redirect('/login');

    const { data: profile } = await supabase.from('profiles').select('agency_id').eq('id', user.id).single();
    if (!profile?.agency_id) return;

    // DETERMINISTIC: Always valid for 1 year.
    const expiry = new Date();
    expiry.setFullYear(expiry.getFullYear() + 1);

    // Upload Evidence (if provided)
    const file = formData.get('cv_file') as File;
    let cvPath = null;

    if (file && file.size > 0) {
      const { data: uploadData, error: uploadError } = await supabase
        .storage
        .from('evidence')
        .upload(`${profile.agency_id}/${Date.now()}_${file.name}`, file);

      if (uploadError) console.error('Upload error:', uploadError);
      if (uploadData) cvPath = uploadData.path;
    }

    const nameFirst = (formData.get('first_name') as string) || 'New';
    const nameLast = (formData.get('last_name') as string) || 'Candidate';
    const roleDetected = (formData.get('role') as string) || 'General Worker';

    await supabase.from('candidates').insert({
      agency_id: profile.agency_id,
      first_name: nameFirst,
      last_name: nameLast,
      nationality: 'MU',
      role: roleDetected,
      availability: 'Immediate',
      status: 'Green',
      document_expiry_date: expiry.toISOString(),
      compliance_notes: 'AI Imported (Valid 1yr)',
      cv_file_path: cvPath,
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

        {/* Actions */}
        <div className="flex gap-4 items-start">
          <a
            href="/candidates/import"
            className="rounded-md border border-neutral-200 px-4 py-2 text-sm text-neutral-600 hover:bg-neutral-50 dark:border-neutral-800 flex items-center"
          >
            Import CSV
          </a>
        </div>
      </header>

      {/* AI DROP ZONE HERO */}
      <section className="mb-8">
        <CandidateDropZone onUpload={createQuickCandidate} />
      </section>

      {/* Legacy Search/Filter Section */}
      <div className="rounded-xl border border-neutral-200 bg-white p-4 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
        <form className="flex flex-wrap items-center gap-2 mb-4">
          <input
            name="q"
            defaultValue={searchParams?.q || ''}
            className="w-48 rounded-md border border-neutral-200 bg-white px-3 py-2 text-sm dark:border-neutral-800 dark:bg-neutral-950"
            placeholder="Search last name…"
            aria-label="Search candidates"
          />
          <select
            name="status"
            defaultValue={searchParams?.status || 'All Status'}
            className="rounded-md border border-neutral-200 bg-white px-3 py-2 text-sm dark:border-neutral-800 dark:bg-neutral-950"
            aria-label="Filter status"
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
                      {r.cv_file_path ? (
                        <div className="flex gap-2 text-xs">
                          <a
                            href={`${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/evidence/${r.cv_file_path}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:underline"
                          >
                            View CV
                          </a>
                          <span className="text-neutral-300">|</span>
                          <a
                            href={`/candidates/${r.id}/print`}
                            className="text-neutral-600 hover:text-neutral-900 font-medium"
                          >
                            Blind PDF
                          </a>
                        </div>
                      ) : (
                        <button disabled className="text-neutral-300 cursor-not-allowed">No CV</button>
                      )}
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
