export default function CandidatesPage() {
  const rows = Array.from({ length: 8 }).map((_, i) => ({
    id: `CND-${1000 + i}`,
    name: `Candidate ${i + 1}`,
    nationality: ['MU', 'IN', 'FR', 'ZA'][i % 4],
    status: ['Green', 'Yellow', 'Red'][i % 3],
    role: ['Welder', 'Driver', 'Nurse', 'Engineer'][i % 4],
    availability: ['Immediate', '2 weeks', '1 month'][i % 3],
  }));

  return (
    <div className="space-y-8">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Candidates</h1>
          <p className="mt-1 text-sm text-neutral-600 dark:text-neutral-400">
            Deep profiles with compliance status and availability (Mauritius).
          </p>
        </div>
        <div className="flex gap-2">
          <button className="rounded-md bg-neutral-900 px-4 py-2 text-sm text-white dark:bg-white dark:text-neutral-900">
            Add Candidate
          </button>
          <button className="rounded-md border border-neutral-200 px-4 py-2 text-sm dark:border-neutral-800">
            Import CVs
          </button>
        </div>
      </header>

      <div className="rounded-xl border border-neutral-200 bg-white p-4 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
        <div className="flex flex-wrap items-center gap-2">
          <input
            className="w-48 rounded-md border border-neutral-200 bg-white px-3 py-2 text-sm dark:border-neutral-800 dark:bg-neutral-950"
            placeholder="Search candidates…"
          />
          <select className="rounded-md border border-neutral-200 bg-white px-3 py-2 text-sm dark:border-neutral-800 dark:bg-neutral-950">
            <option>All Status</option>
            <option>Green</option>
            <option>Yellow</option>
            <option>Red</option>
          </select>
          <select className="rounded-md border border-neutral-200 bg-white px-3 py-2 text-sm dark:border-neutral-800 dark:bg-neutral-950">
            <option>All Roles</option>
            <option>Welder</option>
            <option>Driver</option>
            <option>Nurse</option>
            <option>Engineer</option>
          </select>
        </div>

        <div className="mt-4 overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="text-left text-neutral-500 dark:text-neutral-400">
                <th className="px-3 py-2">ID</th>
                <th className="px-3 py-2">Name</th>
                <th className="px-3 py-2">Nationality</th>
                <th className="px-3 py-2">Role</th>
                <th className="px-3 py-2">Availability</th>
                <th className="px-3 py-2">Compliance</th>
                <th className="px-3 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r, idx) => (
                <tr key={r.id} className={idx % 2 === 0 ? 'bg-neutral-50 dark:bg-neutral-800' : undefined}>
                  <td className="px-3 py-2 font-mono">{r.id}</td>
                  <td className="px-3 py-2">{r.name}</td>
                  <td className="px-3 py-2">{r.nationality}</td>
                  <td className="px-3 py-2">{r.role}</td>
                  <td className="px-3 py-2">{r.availability}</td>
                  <td className="px-3 py-2">
                    <span
                      className={`rounded-full px-2 py-1 text-xs ${
                        r.status === 'Green'
                          ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300'
                          : r.status === 'Yellow'
                          ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300'
                          : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300'
                      }`}
                    >
                      {r.status}
                    </span>
                  </td>
                  <td className="px-3 py-2">
                    <button className="rounded-md border border-neutral-200 px-2 py-1 dark:border-neutral-800">View</button>
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
