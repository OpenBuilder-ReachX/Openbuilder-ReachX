import { createSupabaseServer } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export default function ImportPage() {
    async function importCandidates(formData: FormData) {
        'use server';
        const supabase = createSupabaseServer();
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return redirect('/login');

        const { data: profile } = await supabase.from('profiles').select('agency_id').eq('id', user.id).single();
        if (!profile?.agency_id) return;

        const file = formData.get('csv_file') as File;
        if (!file) return;

        const text = await file.text();
        const lines = text.split('\n');
        let count = 0;

        for (let i = 1; i < lines.length; i++) { // Skip header
            const line = lines[i].trim();
            if (!line) continue;

            const [first, last, role, nat] = line.split(',');
            if (!first || !last) continue;

            const expiry = new Date();
            expiry.setFullYear(expiry.getFullYear() + 1);

            await supabase.from('candidates').insert({
                agency_id: profile.agency_id,
                first_name: first.trim(),
                last_name: last.trim(),
                role: role?.trim() || 'General Worker',
                nationality: nat?.trim() || 'MU',
                status: 'Green',
                document_expiry_date: expiry.toISOString(),
                compliance_notes: 'Imported via CSV',
            });
            count++;
        }

        revalidatePath('/candidates');
        redirect('/candidates?message=Imported ' + count + ' candidates');
    }

    return (
        <div className="max-w-md mx-auto mt-10 space-y-6">
            <h1 className="text-2xl font-bold">Import Candidates</h1>
            <p className="text-sm text-neutral-600">
                Upload a CSV file with format: <code>First Name, Last Name, Role, Nationality</code>.
            </p>

            <div className="rounded-xl border border-neutral-200 bg-white p-6 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
                <form action={importCandidates} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium mb-1">Select CSV File</label>
                        <input
                            type="file"
                            name="csv_file"
                            accept=".csv"
                            className="w-full text-sm text-neutral-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-neutral-900 file:text-white hover:file:bg-neutral-800 cursor-pointer"
                            required
                            aria-label="Upload CSV File"
                        />
                    </div>
                    <button type="submit" className="w-full rounded-md bg-green-600 px-4 py-2 text-white font-medium hover:bg-green-700">
                        Start Import
                    </button>
                </form>
            </div>
        </div>
    );
}
