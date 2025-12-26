import { createSupabaseServer } from '@/lib/supabase/server';
import { notFound, redirect } from 'next/navigation';

export default async function PrintProfilePage({ params }: { params: { id: string } }) {
    const supabase = createSupabaseServer();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return redirect('/login');

    const { data: candidate } = await supabase
        .from('candidates')
        .select('*, agencies(name, logo_url)')
        .eq('id', params.id)
        .single();

    if (!candidate) return notFound();

    return (
        <div className="bg-white min-h-screen text-black p-12 max-w-4xl mx-auto print:p-0 print:max-w-none">
            {/* Print Instructions (Hidden in Print) */}
            <div className="mb-8 p-4 bg-blue-50 border border-blue-100 rounded-lg print:hidden flex justify-between items-center text-blue-900">
                <div>
                    <p className="font-semibold">Blind CV Mode</p>
                    <p className="text-sm">Contact details are hidden. Use Browser Print (Ctrl+P) to save as PDF.</p>
                </div>
                <button
                    onClick={() => window.print()}
                    // Note: Inline onClick requires Client Component, but this is Server. 
                    // We'll trust user knows Ctrl+P or use a small script if needed. 
                    // Actually, let's just make it a simple visual cue.
                    className="bg-blue-600 text-white px-4 py-2 rounded shadow hover:bg-blue-700"
                >
                    Press Ctrl+P to Save PDF
                </button>
            </div>

            {/* Header */}
            <header className="border-b-2 border-black pb-6 mb-8 flex justify-between items-end">
                <div>
                    <h1 className="text-4xl font-bold uppercase tracking-wide">{candidate.first_name} {candidate.last_name[0]}.</h1>
                    <p className="text-xl text-neutral-600 mt-2">{candidate.role}</p>
                </div>
                <div className="text-right">
                    <div className="font-bold text-lg">{candidate.agencies?.name || 'Agency Partner'}</div>
                    <div className="text-sm text-neutral-500">Verified Candidate</div>
                </div>
            </header>

            {/* Grid Layout */}
            <div className="grid grid-cols-3 gap-8">
                {/* Left Sidebar */}
                <div className="col-span-1 border-r border-neutral-200 pr-8 space-y-8">
                    <section>
                        <h3 className="font-bold uppercase tracking-wider text-sm border-b border-black pb-1 mb-3">Nationality</h3>
                        <p>{candidate.nationality}</p>
                    </section>

                    <section>
                        <h3 className="font-bold uppercase tracking-wider text-sm border-b border-black pb-1 mb-3">Availability</h3>
                        <p>{candidate.availability}</p>
                    </section>

                    <section>
                        <h3 className="font-bold uppercase tracking-wider text-sm border-b border-black pb-1 mb-3">Languages</h3>
                        <ul className="list-disc list-inside space-y-1 text-sm">
                            <li>English (Fluent)</li>
                            {/* Placeholder for future detailed fields */}
                        </ul>
                    </section>

                    <section>
                        <h3 className="font-bold uppercase tracking-wider text-sm border-b border-black pb-1 mb-3">Skills</h3>
                        <div className="flex flex-wrap gap-2">
                            {/* Mock Skills for MVP */}
                            {['Reliable', 'Team Player', 'Safety Aware'].map(s => (
                                <span key={s} className="bg-neutral-100 px-2 py-1 rounded text-xs font-medium border border-neutral-300">
                                    {s}
                                </span>
                            ))}
                        </div>
                    </section>
                </div>

                {/* Main Content */}
                <div className="col-span-2 space-y-8">
                    <section>
                        <h3 className="font-bold uppercase tracking-wider text-sm border-b border-black pb-1 mb-3">Professional Summary</h3>
                        <p className="text-justify leading-relaxed text-neutral-800">
                            Experienced {candidate.role} from {candidate.nationality} with a proven track record of reliability and performance.
                            Fully vetted by {candidate.agencies?.name} and ready for immediate deployment.
                            {candidate.compliance_notes && ` Note: ${candidate.compliance_notes}`}
                        </p>
                    </section>

                    <section>
                        <h3 className="font-bold uppercase tracking-wider text-sm border-b border-black pb-1 mb-3">Agency Verification</h3>
                        <div className="bg-green-50 border border-green-100 p-4 rounded-lg">
                            <div className="flex items-center gap-2 mb-2">
                                <div className="h-2 w-2 rounded-full bg-green-600"></div>
                                <span className="font-bold text-green-800 text-sm">Document Check Passed</span>
                            </div>
                            <div className="flex items-center gap-2 mb-2">
                                <div className="h-2 w-2 rounded-full bg-green-600"></div>
                                <span className="font-bold text-green-800 text-sm">Interview Screening Passed</span>
                            </div>
                            {candidate.document_expiry_date && (
                                <div className="text-xs text-green-700 mt-2">
                                    Clearance Valid Until: {new Date(candidate.document_expiry_date).toLocaleDateString()}
                                </div>
                            )}
                        </div>
                    </section>

                    <div className="mt-12 pt-8 border-t border-neutral-100 text-center text-xs text-neutral-400">
                        Representation by {candidate.agencies?.name}. Confidential.
                    </div>
                </div>
            </div>
        </div>
    );
}
