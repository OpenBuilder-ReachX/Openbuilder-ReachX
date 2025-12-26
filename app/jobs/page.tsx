import { createSupabaseServer } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import Link from 'next/link';

export default async function JobsPage() {
    const supabase = createSupabaseServer();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return redirect('/login');

    const { data: profile } = await supabase.from('profiles').select('agency_id').eq('id', user.id).single();
    if (!profile?.agency_id) return redirect('/login');

    const { data: jobs } = await supabase
        .from('jobs')
        .select('*, clients(name)')
        .eq('agency_id', profile.agency_id)
        .order('created_at', { ascending: false });

    async function createJob(formData: FormData) {
        'use server';
        const supabase = createSupabaseServer();
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        const { data: profile } = await supabase.from('profiles').select('agency_id').eq('id', user.id).single();
        if (!profile?.agency_id) return;

        const title = formData.get('title') as string;

        await supabase.from('jobs').insert({
            agency_id: profile.agency_id,
            title,
            status: 'Open'
        });
        revalidatePath('/jobs');
    }

    return (
        <div className="space-y-8">
            <header className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-semibold">Job Orders</h1>
                    <p className="mt-1 text-sm text-neutral-600 dark:text-neutral-400">
                        Manage requisitions and share them with clients.
                    </p>
                </div>
                <form action={createJob} className="flex gap-2">
                    <input
                        name="title"
                        placeholder="New Job Title..."
                        className="rounded-md border border-neutral-200 px-3 py-2 text-sm dark:border-neutral-800 dark:bg-neutral-950"
                        required
                        aria-label="New Job Title"
                    />
                    <button className="rounded-md bg-neutral-900 px-4 py-2 text-sm text-white dark:bg-white dark:text-neutral-900">
                        + Create Job
                    </button>
                </form>
            </header>

            <div className="rounded-xl border border-neutral-200 bg-white p-4 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
                <div className="overflow-x-auto">
                    <table className="min-w-full text-sm">
                        <thead>
                            <tr className="text-left text-neutral-500 dark:text-neutral-400">
                                <th className="px-3 py-2">Title</th>
                                <th className="px-3 py-2">Client</th>
                                <th className="px-3 py-2">Status</th>
                                <th className="px-3 py-2">Created</th>
                                <th className="px-3 py-2">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {(!jobs || jobs.length === 0) && (
                                <tr>
                                    <td colSpan={5} className="text-center py-8 text-neutral-500">No active job orders.</td>
                                </tr>
                            )}
                            {jobs?.map((job) => (
                                <tr key={job.id} className="border-t border-neutral-100 dark:border-neutral-800">
                                    <td className="px-3 py-2 font-medium">{job.title}</td>
                                    <td className="px-3 py-2 text-neutral-500">{job.clients?.name || 'Internal'}</td>
                                    <td className="px-3 py-2">
                                        <span className="rounded-full bg-blue-100 px-2 py-1 text-xs text-blue-700 dark:bg-blue-900/30 dark:text-blue-300">
                                            {job.status}
                                        </span>
                                    </td>
                                    <td className="px-3 py-2 text-neutral-500">{new Date(job.created_at).toLocaleDateString()}</td>
                                    <td className="px-3 py-2">
                                        <Link href={`/jobs/${job.id}`} className="rounded-md border border-neutral-200 px-3 py-1 hover:bg-neutral-50 dark:border-neutral-800">
                                            Manage
                                        </Link>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
