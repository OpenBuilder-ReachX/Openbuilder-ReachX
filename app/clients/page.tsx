'use client';

type ClientRow = {
  id: string;
  name: string;
  contact: string;
  projects: number;
  status: 'Active' | 'Prospect' | 'Dormant';
};

export default function ClientsPage() {
  const rows: ClientRow[] = Array.from({ length: 8 }).map((_, i) => ({
    id: `CLI-${2000 + i}`,
    name: `Client ${String.fromCharCode(65 + (i % 26))}`,
    contact: `contact${i + 1}@example.com`,
    projects: (i % 5) + 1,
    status: (['Active', 'Prospect', 'Dormant'] as const)[i % 3],
  }));

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
          <button className="rounded-md bg-neutral-900 px-4 py-2 text-sm text-white dark:bg-white dark:text-neutral-900">
            New Client
          </button>
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
          />
          <select className="rounded-md border border-neutral-200 bg-white px-3 py-2 text-sm dark:border-neutral-800 dark:bg-neutral-950">
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
                <th className="px-3 py-2">ID</th>
                <th className="px-3 py-2">Name</th>
                <th className="px-3 py-2">Primary Contact</th>
                <th className="px-3 py-2">Projects</th>
                <th className="px-3 py-2">Status</th>
                <th className="px-3 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r, idx) => (
                <tr key={r.id} className={idx % 2 === 0 ? 'bg-neutral-50 dark:bg-neutral-800' : undefined}>
                  <td className="px-3 py-2 font-mono">{r.id}</td>
                  <td className="px-3 py-2">{r.name}</td>
                  <td className="px-3 py-2">{r.contact}</td>
                  <td className="px-3 py-2">{r.projects}</td>
                  <td className="px-3 py-2">
                    <span
                      className={`rounded-full px-2 py-1 text-xs ${
                        r.status === 'Active'
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
