import { createSupabaseServer } from '@/lib/supabase/server';
import { notFound } from 'next/navigation';

// PUBLIC VIEW (Client Facing)
// No Auth Required (Relies on Token)
export default async function SharePage({ params }: { params: { token: string } }) {
    const supabase = createSupabaseServer();

    // "Security by Capability"
    // We fetch the job solely by the unique share_token.
    const { data: job } = await supabase
        .from('jobs')
        .select('*, agencies(name, contact_email)')
        .eq('share_token', params.token)
        .single();

    if (!job) return notFound();

    // Fetch Shortlisted Candidates for this Job
    const { data: applications } = await supabase
        .from('job_applications')
        .select('*, candidates(*)')
        .eq('job_id', job.id);

    return (
        <div className="min-h-screen bg-neutral-50 p-8 font-sans dark:bg-neutral-950">
            <div className="max-w-4xl mx-auto space-y-8">
                {/* Header */}
                <header className="bg-white p-8 rounded-2xl shadow-sm border border-neutral-100 dark:bg-neutral-900 dark:border-neutral-800">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-sm font-semibold tracking-wide text-neutral-500 uppercase">{job.agencies?.name} Presents</p>
                            <h1 className="text-4xl font-bold mt-2 text-neutral-900 dark:text-white">{job.title}</h1>
                            <p className="mt-4 text-neutral-600 dark:text-neutral-400">
                                Here are the shortlisted candidates for your review.
                                Please review their profiles below.
                            </p>
                        </div>
                        <div className="text-right">
                            <p className="text-sm text-neutral-400">Job ID: {job.id.slice(0, 8)}</p>
                            <a href={`mailto:${job.agencies?.contact_email}`} className="mt-2 inline-block text-blue-600 hover:underline">
                                Contact Agency
                            </a>
                        </div>
                    </div>
                </header>

                {/* Candidates Grid */}
                <div className="grid gap-6 md:grid-cols-2">
                    {applications?.map((app) => (
                        <div key={app.id} className="bg-white p-6 rounded-xl border border-neutral-200 shadow-sm hover:shadow-md transition-shadow dark:bg-neutral-900 dark:border-neutral-800">
                            <div className="flex items-start justify-between">
                                <div className="h-12 w-12 rounded-full bg-neutral-100 flex items-center justify-center text-lg font-bold text-neutral-500">
                                    {app.candidates?.first_name[0]}{app.candidates?.last_name[0]}
                                </div>
                                <span className="px-2 py-1 rounded bg-green-50 text-green-700 text-xs font-medium border border-green-100">
                                    Verified
                                </span>
                            </div>

                            <h2 className="mt-4 text-xl font-bold">{app.candidates?.first_name} {app.candidates?.last_name}</h2>
                            <p className="text-neutral-500">{app.candidates?.role} from {app.candidates?.nationality}</p>

                            <div className="mt-6 space-y-2 text-sm">
                                <div className="flex justify-between border-b border-neutral-50 pb-2">
                                    <span className="text-neutral-500">Availability</span>
                                    <span className="font-medium">{app.candidates?.availability}</span>
                                </div>
                                <div className="flex justify-between border-b border-neutral-50 pb-2">
                                    <span className="text-neutral-500">Compliance</span>
                                    <span className="font-medium text-green-600">{app.candidates?.status}</span>
                                </div>
                            </div>

                            <div className="mt-6 flex gap-2">
                                {app.candidates?.cv_file_path && (
                                    <a
                                        href={`${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/evidence/${app.candidates?.cv_file_path}`}
                                        target="_blank"
                                        className="flex-1 text-center rounded-lg border border-neutral-200 py-2.5 text-sm font-medium hover:bg-neutral-50 transition-colors"
                                    >
                                        View CV
                                    </a>
                                )}
                                <button className="flex-1 rounded-lg bg-black py-2.5 text-sm font-medium text-white hover:bg-neutral-800 transition-colors dark:bg-white dark:text-black">
                                    Request Interview
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                <footer className="text-center text-sm text-neutral-400 py-8">
                    Powered by ReachX
                </footer>
            </div>
        </div>
    );
}
