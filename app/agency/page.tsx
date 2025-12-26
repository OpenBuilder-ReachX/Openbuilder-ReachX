import { createSupabaseServer } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

// Server Component (Fetcher)
export default async function AgencyPage() {
  const supabase = createSupabaseServer();

  // Get User's Agency
  // Schema check: user -> profile -> agency
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return redirect('/login');

  const { data: profile } = await supabase.from('profiles').select('agency_id').eq('id', user.id).single();

  // If no profile, something is wrong with the trigger, or user existed before trigger.
  // For resilience, fetching agency directly might fail if RLS blocks it without profile lookup.

  let agency = null;
  if (profile?.agency_id) {
    const { data } = await supabase.from('agencies').select('*').eq('id', profile.agency_id).single();
    agency = data;
  }

  // Action for Updates
  async function updateAgency(formData: FormData) {
    'use server';
    const supabase = createSupabaseServer();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    // We need to know WHICH agency to update. 
    // Securely, we look up the user's profile AGAIN to ensure they own it.
    const { data: userProfile } = await supabase.from('profiles').select('agency_id').eq('id', user.id).single();
    if (!userProfile?.agency_id) return;

    const name = formData.get('name') as string;
    const contact_email = formData.get('contact_email') as string;
    const currency = formData.get('currency') as string;
    const tax_registration = formData.get('tax_registration') as string;
    const country = formData.get('country') as string;
    const labour_authority = formData.get('labour_authority') as string;
    const default_working_hours = formData.get('default_working_hours');
    const default_min_salary = formData.get('default_min_salary');

    await supabase.from('agencies').update({
      name,
      contact_email,
      currency,
      tax_registration,
      country,
      labour_authority,
      default_working_hours: default_working_hours ? Number(default_working_hours) : 9,
      default_min_salary: default_min_salary ? Number(default_min_salary) : null,
    }).eq('id', userProfile.agency_id);

    revalidatePath('/agency');
    // In a real app, we'd show a toast here.
  }

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-2xl font-semibold">Agency Setup & Jurisdiction</h1>
        <p className="mt-1 text-sm text-neutral-600 dark:text-neutral-400">
          Configure agency profile, jurisdiction, and defaults. All changes are live.
        </p>
      </header>

      {!agency && (
        <div className="p-4 rounded-md bg-red-50 text-red-600 border border-red-200">
          Error: No agency profile found. Please contact support (or reset DB).
        </div>
      )}

      {agency && (
        <form action={updateAgency}>
          <section className="grid gap-6 lg:grid-cols-2">
            <div className="rounded-xl border border-neutral-200 bg-white p-6 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
              <h2 className="text-lg font-semibold">Agency Profile</h2>
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="text-sm text-neutral-600 dark:text-neutral-400">Agency Name</label>
                  <input name="name" aria-label="Agency Name" defaultValue={agency.name} className="mt-1 w-full rounded-md border border-neutral-200 bg-white px-3 py-2 text-sm dark:border-neutral-800 dark:bg-neutral-950" placeholder="ReachX" />
                </div>
                <div>
                  <label className="text-sm text-neutral-600 dark:text-neutral-400">Contact Email</label>
                  <input name="contact_email" aria-label="Contact Email" defaultValue={agency.contact_email} className="mt-1 w-full rounded-md border border-neutral-200 bg-white px-3 py-2 text-sm dark:border-neutral-800 dark:bg-neutral-950" placeholder="ops@reachx.com" />
                </div>
                <div>
                  <label className="text-sm text-neutral-600 dark:text-neutral-400">Default Currency</label>
                  <select name="currency" aria-label="Default Currency" defaultValue={agency.currency || 'MUR'} className="mt-1 w-full rounded-md border border-neutral-200 bg-white px-3 py-2 text-sm dark:border-neutral-800 dark:bg-neutral-950">
                    <option value="MUR">MUR</option>
                    <option value="USD">USD</option>
                    <option value="EUR">EUR</option>
                    <option value="GBP">GBP</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm text-neutral-600 dark:text-neutral-400">Tax Registration</label>
                  <input name="tax_registration" aria-label="Tax Registration" defaultValue={agency.tax_registration || ''} className="mt-1 w-full rounded-md border border-neutral-200 bg-white px-3 py-2 text-sm dark:border-neutral-800 dark:bg-neutral-950" placeholder="Tax Account No." />
                </div>
              </div>
              <div className="mt-4 flex gap-2">
                <button type="submit" className="rounded-md bg-neutral-900 px-4 py-2 text-sm text-white dark:bg-white dark:text-neutral-900">Save Changes</button>
              </div>
            </div>

            <div className="rounded-xl border border-neutral-200 bg-white p-6 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
              <h2 className="text-lg font-semibold">Jurisdiction & Defaults</h2>
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="text-sm text-neutral-600 dark:text-neutral-400">Country / Jurisdiction</label>
                  <select name="country" aria-label="Country" defaultValue={agency.country || 'Mauritius'} className="mt-1 w-full rounded-md border border-neutral-200 bg-white px-3 py-2 text-sm dark:border-neutral-800 dark:bg-neutral-950">
                    <option value="Mauritius">Mauritius</option>
                    <option value="United States">United States</option>
                    <option value="United Kingdom">United Kingdom</option>
                    <option value="United Arab Emirates">United Arab Emirates</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm text-neutral-600 dark:text-neutral-400">Labour Authority</label>
                  <input name="labour_authority" aria-label="Labour Authority" defaultValue={agency.labour_authority || ''} className="mt-1 w-full rounded-md border border-neutral-200 bg-white px-3 py-2 text-sm dark:border-neutral-800 dark:bg-neutral-950" placeholder="Ministry name" />
                </div>
                <div>
                  <label className="text-sm text-neutral-600 dark:text-neutral-400">Default Working Hours</label>
                  <input name="default_working_hours" aria-label="Default Working Hours" type="number" defaultValue={agency.default_working_hours || 9} className="mt-1 w-full rounded-md border border-neutral-200 bg-white px-3 py-2 text-sm dark:border-neutral-800 dark:bg-neutral-950" placeholder="9" />
                </div>
                <div>
                  <label className="text-sm text-neutral-600 dark:text-neutral-400">Default Minimum Salary (MUR)</label>
                  <input name="default_min_salary" aria-label="Default Minimum Salary" type="number" defaultValue={agency.default_min_salary || ''} className="mt-1 w-full rounded-md border border-neutral-200 bg-white px-3 py-2 text-sm dark:border-neutral-800 dark:bg-neutral-950" placeholder="e.g., 15000" />
                </div>
              </div>
            </div>
          </section>
        </form>
      )}
    </div>
  );
}
