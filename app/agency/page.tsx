'use client';

export default function AgencySetupPage() {
  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-2xl font-semibold">Agency Setup & Jurisdiction</h1>
        <p className="mt-1 text-sm text-neutral-600 dark:text-neutral-400">
          Configure agency profile, jurisdiction, and defaults (Mauritius). All changes are logged.
        </p>
      </header>

      <section className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-xl border border-neutral-200 bg-white p-6 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
          <h2 className="text-lg font-semibold">Agency Profile</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <div>
              <label className="text-sm text-neutral-600 dark:text-neutral-400">Agency Name</label>
              <input className="mt-1 w-full rounded-md border border-neutral-200 bg-white px-3 py-2 text-sm dark:border-neutral-800 dark:bg-neutral-950" placeholder="ReachX" />
            </div>
            <div>
              <label className="text-sm text-neutral-600 dark:text-neutral-400">Contact Email</label>
              <input className="mt-1 w-full rounded-md border border-neutral-200 bg-white px-3 py-2 text-sm dark:border-neutral-800 dark:bg-neutral-950" placeholder="ops@reachx.com" />
            </div>
            <div>
              <label className="text-sm text-neutral-600 dark:text-neutral-400">Default Currency</label>
              <select className="mt-1 w-full rounded-md border border-neutral-200 bg-white px-3 py-2 text-sm dark:border-neutral-800 dark:bg-neutral-950">
                <option>MUR</option>
                <option>USD</option>
                <option>EUR</option>
                <option>GBP</option>
              </select>
            </div>
            <div>
              <label className="text-sm text-neutral-600 dark:text-neutral-400">Tax Registration</label>
              <input className="mt-1 w-full rounded-md border border-neutral-200 bg-white px-3 py-2 text-sm dark:border-neutral-800 dark:bg-neutral-950" placeholder="Tax Account No. / VAT (Mauritius)" />
            </div>
          </div>
          <div className="mt-4 flex gap-2">
            <button className="rounded-md bg-neutral-900 px-4 py-2 text-sm text-white dark:bg-white dark:text-neutral-900">Save</button>
            <button className="rounded-md border border-neutral-200 px-4 py-2 text-sm dark:border-neutral-800">Discard</button>
          </div>
        </div>

        <div className="rounded-xl border border-neutral-200 bg-white p-6 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
          <h2 className="text-lg font-semibold">Jurisdiction & Defaults</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <div>
              <label className="text-sm text-neutral-600 dark:text-neutral-400">Country / Jurisdiction</label>
              <select className="mt-1 w-full rounded-md border border-neutral-200 bg-white px-3 py-2 text-sm dark:border-neutral-800 dark:bg-neutral-950">
                <option>Mauritius</option>
                <option>United States</option>
                <option>United Kingdom</option>
                <option>United Arab Emirates</option>
              </select>
            </div>
            <div>
              <label className="text-sm text-neutral-600 dark:text-neutral-400">Labour Authority</label>
              <input className="mt-1 w-full rounded-md border border-neutral-200 bg-white px-3 py-2 text-sm dark:border-neutral-800 dark:bg-neutral-950" placeholder="Ministry of Labour, Human Resource Development and Training" />
            </div>
            <div>
              <label className="text-sm text-neutral-600 dark:text-neutral-400">Default Working Hours</label>
              <input type="number" className="mt-1 w-full rounded-md border border-neutral-200 bg-white px-3 py-2 text-sm dark:border-neutral-800 dark:bg-neutral-950" placeholder="9" />
            </div>
            <div>
              <label className="text-sm text-neutral-600 dark:text-neutral-400">Default Minimum Salary (MUR)</label>
              <input type="number" className="mt-1 w-full rounded-md border border-neutral-200 bg-white px-3 py-2 text-sm dark:border-neutral-800 dark:bg-neutral-950" placeholder="e.g., 15000" />
            </div>
          </div>
          <div className="mt-4 text-xs text-neutral-500 dark:text-neutral-400">
            Note: Rules are editable and versioned. Validate against Mauritius national minimum wage or sector agreements.
          </div>
        </div>
      </section>
    </div>
  );
}
