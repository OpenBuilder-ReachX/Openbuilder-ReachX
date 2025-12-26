import { createSupabaseServer } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export default async function InterviewsPage({ searchParams }: { searchParams: { candidate_id?: string } }) {
    const supabase = createSupabaseServer();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return redirect('/login');

    const { data: profile } = await supabase.from('profiles').select('agency_id').eq('id', user.id).single();
    const agencyId = profile?.agency_id;

    if (!agencyId) return <div>Error: No Agency Profile.</div>;

    // Fetch Upcoming Interviews
    const { data: interviews } = await supabase
        .from('interviews')
        .select('*, candidates(first_name, last_name, role), jobs(title)')
        .eq('agency_id', agencyId)
        .gte('start_time', new Date().toISOString()) // Only future/today
        .order('start_time', { ascending: true });

    // Fetch Candidates for Dropdown
    const { data: candidates } = await supabase
        .from('candidates')
        .select('id, first_name, last_name')
        .eq('agency_id', agencyId)
        .order('last_name');

    // Action: Schedule Interview
    async function scheduleInterview(formData: FormData) {
        'use server';
        const supabase = createSupabaseServer();
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return redirect('/login');
        const { data: profile } = await supabase.from('profiles').select('agency_id').eq('id', user.id).single();

        const candidateId = formData.get('candidate_id') as string;
        const dateStr = formData.get('date') as string;
        const timeStr = formData.get('time') as string;
        const location = formData.get('location') as string;

        // Combine Date + Time
        const start_time = new Date(`${dateStr}T${timeStr}:00`).toISOString();

        await supabase.from('interviews').insert({
            agency_id: profile?.agency_id,
            candidate_id: candidateId,
            start_time: start_time,
            location: location,
            status: 'Scheduled'
        });

        // Auto-update Candidate Status to "Yellow" (Interviewing) if currently Green?
        // Let's do it for better "Alive-ness"
        // await supabase.from('candidates').update({ status: 'Yellow' }).eq('id', candidateId).eq('status', 'Green');

        revalidatePath('/interviews');
    }

    return (
        <div className="space-y-8">
            <header>
                <h1 className="text-2xl font-semibold">Interview Schedule</h1>
                <p className="mt-1 text-sm text-neutral-600 dark:text-neutral-400">
                    Manage upcoming candidate interviews and logistics.
                </p>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* Input Form */}
                <div className="rounded-xl border border-neutral-200 bg-white p-6 shadow-sm dark:border-neutral-800 dark:bg-neutral-900 h-fit">
                    <h2 className="text-lg font-medium mb-4">Schedule New</h2>
                    <form action={scheduleInterview} className="space-y-4">
                        <div>
                            <label className="block text-xs font-medium mb-1">Candidate</label>
                            <select
                                name="candidate_id"
                                required
                                defaultValue={searchParams.candidate_id || ''}
                                className="w-full rounded-md border border-neutral-200 p-2 text-sm bg-white dark:bg-neutral-950 dark:border-neutral-800"
                            >
                                <option value="" disabled>Select Candidate...</option>
                                {candidates?.map(c => (
                                    <option key={c.id} value={c.id}>{c.first_name} {c.last_name}</option>
                                ))}
                            </select>
                        </div>

                        <div className="grid grid-cols-2 gap-2">
                            <div>
                                <label className="block text-xs font-medium mb-1">Date</label>
                                <input name="date" type="date" required className="w-full rounded-md border border-neutral-200 p-2 text-sm dark:bg-neutral-950 dark:border-neutral-800" />
                            </div>
                            <div>
                                <label className="block text-xs font-medium mb-1">Time</label>
                                <input name="time" type="time" required className="w-full rounded-md border border-neutral-200 p-2 text-sm dark:bg-neutral-950 dark:border-neutral-800" />
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-medium mb-1">Location / Link</label>
                            <input
                                name="location"
                                required
                                defaultValue="Office"
                                placeholder="e.g. Office, Zoom Link..."
                                className="w-full rounded-md border border-neutral-200 p-2 text-sm dark:bg-neutral-950 dark:border-neutral-800"
                            />
                        </div>

                        <button className="w-full bg-neutral-900 text-white p-2 rounded-md hover:bg-neutral-800 text-sm font-medium">
                            Schedule Interview
                        </button>
                    </form>
                </div>

                {/* List */}
                <div className="lg:col-span-2 space-y-4">
                    <h2 className="text-lg font-medium">Upcoming</h2>
                    {(!interviews || interviews.length === 0) ? (
                        <div className="p-8 text-center border border-dashed border-neutral-300 rounded-lg text-neutral-500">
                            No interviews scheduled.
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {interviews.map(i => {
                                const date = new Date(i.start_time);
                                return (
                                    <div key={i.id} className="flex items-center justify-between p-4 bg-white border border-neutral-200 rounded-lg shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
                                        <div className="flex gap-4 items-center">
                                            <div className="text-center px-4 py-2 bg-neutral-100 rounded-lg dark:bg-neutral-800">
                                                <div className="text-xs text-neutral-500 uppercase font-bold">{date.toLocaleString('default', { month: 'short' })}</div>
                                                <div className="text-xl font-bold">{date.getDate()}</div>
                                            </div>
                                            <div>
                                                <div className="font-bold text-lg">{i.candidates?.first_name} {i.candidates?.last_name}</div>
                                                <div className="text-sm text-neutral-600 flex gap-2">
                                                    <span>⏰ {date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                                    <span>📍 {i.location}</span>
                                                </div>
                                                {i.jobs?.title && <div className="text-xs text-blue-600 mt-1">For: {i.jobs.title}</div>}
                                            </div>
                                        </div>
                                        <div className="text-xs font-semibold px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full">
                                            {i.status}
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
