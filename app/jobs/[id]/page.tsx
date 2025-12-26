import { createSupabaseServer } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export default async function JobDetailsPage({ params }: { params: { id: string } }) {
    const supabase = createSupabaseServer();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return redirect('/login');

    const { data: job } = await supabase
        .from('jobs')
        .select('*')
        .eq('id', params.id)
        .single();

    if (!job) return <div>Job not found</div>;

    // Get Applications (Shortlisted candidates)
    const { data: applications } = await supabase
        .from('job_applications')
        .select('*, candidates(*)')
        .eq('job_id', job.id);

    // Get ALL Candidates for adding to shortlist
    const { data: availableCandidates } = await supabase
        .from('candidates')
        .select('*')
        .eq('agency_id', job.agency_id)
        .order('created_at', { ascending: false });

    // Filter out already applied
    const existingIds = new Set(applications?.map(a => a.candidate_id));
    const candidatesToAdd = availableCandidates?.filter(c => !existingIds.has(c.id)) || [];

    async function addToShortlist(formData: FormData) {
        'use server';
        const supabase = createSupabaseServer();
        const candidateId = formData.get('candidate_id') as string;
        await supabase.from('job_applications').insert({
            job_id: params.id,
            candidate_id: candidateId,
            stage: 'Shortlisted'
        });
        revalidatePath(`/jobs/${params.id}`);
    }

    async function removeApplication(formData: FormData) {
        'use server';
        const supabase = createSupabaseServer();
        const applicationId = formData.get('application_id') as string;
        await supabase.from('job_applications').delete().eq('id', applicationId);
        revalidatePath(`/jobs/${params.id}`);
    }

    const shareUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL?.replace('https://', 'https://reachx-').replace('.supabase.co', '.vercel.app')}/share/${job.share_token}`;
    // NOTE: In production, use actual domain. For Vercel preview, we simulate.
    // Actually, use relative URL for now or just a placeholder if domain unknown.
    // Ideally: use headers() to get host.
    // Let's just output the relative path for now.
    const relativeShareLink = `/share/${job.share_token}`;

    return (
        <div className="space-y-8">
            <header className="border-b border-neutral-200 pb-6 dark:border-neutral-800">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold">{job.title}</h1>
                        <p className="mt-1 text-sm text-neutral-500">Status: {job.status}</p>
                    </div>
                    <div className="flex gap-2">
                        <div className="flex items-center gap-2 rounded-md bg-blue-50 px-3 py-2 text-sm text-blue-700 border border-blue-100">
                            <span className="font-semibold">Magic Link:</span>
                            <code className="bg-white px-1 rounded">{relativeShareLink}</code>
                        </div>
                        <a href={relativeShareLink} target="_blank" className="rounded-md bg-neutral-900 px-4 py-2 text-sm text-white dark:bg-white dark:text-neutral-900">
                            Open Public View
                        </a>
                    </div>
                </div>
            </header>

            <div className="grid gap-8 lg:grid-cols-3">
                {/* Main: Shortlist */}
                <div className="lg:col-span-2 space-y-6">
                    <h2 className="text-xl font-semibold">Shortlisted Candidates</h2>
                    <div className="space-y-4">
                        {applications?.length === 0 && <p className="text-neutral-500">No candidates shortlisted yet.</p>}
                        {applications?.map((app) => (
                            <div key={app.id} className="flex items-center justify-between rounded-lg border border-neutral-200 p-4 shadow-sm bg-white dark:border-neutral-800 dark:bg-neutral-900">
                                <div>
                                    <h3 className="font-medium text-lg">{app.candidates?.first_name} {app.candidates?.last_name}</h3>
                                    <p className="text-sm text-neutral-500">{app.candidates?.role} • {app.candidates?.nationality}</p>
                                    <p className="text-xs mt-1 font-mono text-blue-600">Stage: {app.stage}</p>
                                </div>
                                <form action={removeApplication}>
                                    <input type="hidden" name="application_id" value={app.id} />
                                    <button className="text-sm text-red-600 hover:underline">Remove</button>
                                </form>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Sidebar: Add Candidates */}
                <div className="bg-neutral-50 p-6 rounded-xl border border-neutral-100 sticky top-4 h-fit dark:bg-neutral-900 dark:border-neutral-800">
                    <h3 className="font-semibold mb-4">Add to Job</h3>
                    <div className="space-y-2 max-h-[500px] overflow-y-auto">
                        {candidatesToAdd.map((c) => (
                            <form key={c.id} action={addToShortlist} className="flex items-center justify-between p-2 bg-white rounded border border-neutral-200 dark:bg-neutral-950 dark:border-neutral-800">
                                <div className="text-sm">
                                    <div className="font-medium">{c.first_name} {c.last_name}</div>
                                    <div className="text-xs text-neutral-500">{c.role}</div>
                                </div>
                                <input type="hidden" name="candidate_id" value={c.id} />
                                <button className="text-xs bg-black text-white px-2 py-1 rounded dark:bg-white dark:text-black">Add</button>
                            </form>
                        ))}
                        {candidatesToAdd.length === 0 && <p className="text-sm text-neutral-400">No more candidates available.</p>}
                    </div>
                </div>
            </div>
        </div>
    );
}
