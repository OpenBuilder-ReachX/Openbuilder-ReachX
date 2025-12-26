import { createSupabaseServer } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export default async function ClientsPage() {
  const supabase = createSupabaseServer();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  const { data: clients, error } = await supabase
    .from('clients')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) console.error('Error fetching clients:', error);

  // Helper action to create a dummy client
  async function createDummyClient() {
    'use server';
    const supabase = createSupabaseServer();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return redirect('/login');

    // Get proper Agency ID
    const { data: profile } = await supabase.from('profiles').select('agency_id').eq('id', user.id).single();
    if (!profile?.agency_id) return;

    await supabase.from('clients').insert({
      agency_id: profile.agency_id, // Correct Tenancy Link
      name: 'Client ' + Math.floor(Math.random() * 1000),
      contact_email: 'contact@example.com',
      status: 'Prospect',
    });
    revalidatePath('/clients');
  }

  return (
    <div className="space-y-8">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Clients</h1>
          <p className="mt-1 text-sm text-neutral-600 dark:text-neutral-400">
            Manage client accounts, contacts, and associated projects.
          </p>
        </div>
        <div className="flex gap-2">
          <form action={createDummyClient}>
            <button className="rounded-md bg-neutral-900 px-4 py-2 text-sm text-white dark:bg-white dark:text-neutral-900">
              + Quick Add
            </button>
          </form>
          <button className="rounded-md border border-neutral-200 px-4 py-2 text-sm dark:border-neutral-800">
            Import
          </button>
        </div>
      </header>

      <div className="rounded-xl border border-neutral-200 bg-white p-4 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
        <div className="flex flex-wrap items-center gap-2">
          <input
            className="w-64 rounded-md border border-neutral-200 bg-white px-3 py-2 text-sm dark:border-neutral-800 dark:bg-neutral-950"
            placeholder="Search clients…"
            aria-label="Search clients"
          />
          <select aria-label="Filter status" className="rounded-md border border-neutral-200 bg-white px-3 py-2 text-sm dark:border-neutral-800 dark:bg-neutral-950">
            <option>All Status</option>
            <option>Active</option>
            <option>Prospect</option>
            <option>Dormant</option>
          </select>
        </div>

        <div className="mt-4 overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="text-left text-neutral-500 dark:text-neutral-400">
                <th className="px-3 py-2">Name</th>
                <th className="px-3 py-2">Primary Contact</th>
                <th className="px-3 py-2">Status</th>
                <th className="px-3 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {(!clients || clients.length === 0) && (
                <tr>
                  <td colSpan={4} className="px-3 py-8 text-center text-neutral-500">
                    No clients found.
                  </td>
                </tr>
              )}

              {clients?.map((r) => (
                <tr key={r.id} className="border-t border-neutral-100 dark:border-neutral-800">
                  <td className="px-3 py-2 font-medium">{r.name}</td>
                  <td className="px-3 py-2">{r.contact_email}</td>
                  <td className="px-3 py-2">
                    <span
                      className={`rounded-full px-2 py-1 text-xs ${r.status === 'Active'
                        ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300'
                        : r.status === 'Prospect'
                          ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300'
                          : 'bg-neutral-200 text-neutral-700 dark:bg-neutral-800 dark:text-neutral-300'
                        }`}
                    >
                      {r.status}
                    </span>
                  </td>
                  <td className="px-3 py-2">
                    <button className="rounded-md border border-neutral-200 px-2 py-1 dark:border-neutral-800">
                      View
                    </button>
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
