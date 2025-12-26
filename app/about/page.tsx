import Link from 'next/link';

export default function AboutPage() {
    return (
        <div className="max-w-4xl mx-auto space-y-8 py-8 px-4">
            <header className="space-y-4">
                <h1 className="text-3xl font-bold tracking-tight">How ReachX Works</h1>
                <p className="text-lg text-neutral-600 dark:text-neutral-400">
                    A step-by-step guide to running your recruitment agency on ReachX.
                </p>
            </header>

            <section className="space-y-4">
                <h2 className="text-2xl font-semibold">1. Agency Setup (One-Time)</h2>
                <div className="rounded-xl border border-neutral-200 bg-white p-6 dark:border-neutral-800 dark:bg-neutral-900">
                    <ul className="list-disc list-inside space-y-2 text-neutral-600 dark:text-neutral-400">
                        <li><strong>Action:</strong> Navigate to <Link href="/agency" className="text-blue-600 hover:underline">Agency Setup</Link>.</li>
                        <li><strong>Input:</strong> Enter your Agency Name, Jurisdiction (e.g., Mauritius), and Operating Currency.</li>
                        <li><strong>Outcome:</strong> Your Dashboard will verify your identity. All data you create (Candidates, Clients) will be legally isolated to this Agency profile.</li>
                    </ul>
                </div>
            </section>

            <section className="space-y-4">
                <h2 className="text-2xl font-semibold">2. Managing Candidates (Daily)</h2>
                <div className="rounded-xl border border-neutral-200 bg-white p-6 dark:border-neutral-800 dark:bg-neutral-900">
                    <ul className="list-disc list-inside space-y-2 text-neutral-600 dark:text-neutral-400">
                        <li><strong>Action:</strong> Go to <Link href="/candidates" className="text-blue-600 hover:underline">Candidates</Link>.</li>
                        <li><strong>Input:</strong> Use "Quick Add" to register a new profile. This creates a standard compliant profile (valid for 1 year).</li>
                        <li><strong>Validation:</strong> The system automatically checks `Document Expiry Date`.</li>
                        <li><strong>Expected Outcome:</strong>
                            <ul className="pl-6 mt-1 list-circle space-y-1">
                                <li><span className="text-green-600 font-medium">Green</span>: Valid (&gt; 30 days remaining). Ready to deploy.</li>
                                <li><span className="text-yellow-600 font-medium">Yellow</span>: Warning (&lt; 30 days). Needs renewal.</li>
                                <li><span className="text-red-600 font-medium">Red</span>: Expired. Illegal to deploy.</li>
                            </ul>
                        </li>
                    </ul>
                </div>
            </section>

            <section className="space-y-4">
                <h2 className="text-2xl font-semibold">3. Managing Clients (Sales)</h2>
                <div className="rounded-xl border border-neutral-200 bg-white p-6 dark:border-neutral-800 dark:bg-neutral-900">
                    <ul className="list-disc list-inside space-y-2 text-neutral-600 dark:text-neutral-400">
                        <li><strong>Action:</strong> Go to <Link href="/clients" className="text-blue-600 hover:underline">Clients</Link>.</li>
                        <li><strong>Input:</strong> Add your clients and contacts.</li>
                        <li><strong>Outcome:</strong>
                            <ul className="pl-6 mt-1 list-circle space-y-1">
                                <li><strong>Prospect</strong>: Leads you are chasing.</li>
                                <li><strong>Active</strong>: Clients with open contracts.</li>
                            </ul>
                        </li>
                        <li><strong>Filter:</strong> Use the search bar to instantly find client details during calls.</li>
                    </ul>
                </div>
            </section>

            <section className="space-y-4">
                <h2 className="text-2xl font-semibold">4. The Dashboard (Command Center)</h2>
                <div className="rounded-xl border border-neutral-200 bg-white p-6 dark:border-neutral-800 dark:bg-neutral-900">
                    <p className="text-neutral-600 dark:text-neutral-400 mb-4">
                        Your home verification screen. It queries the live database to tell you the truth.
                    </p>
                    <ul className="list-disc list-inside space-y-2 text-neutral-600 dark:text-neutral-400">
                        <li><strong>"Ready to Deploy":</strong> The single most important number. It counts only candidates who are <span className="text-green-600">Green</span>.</li>
                        <li><strong>"Total Candidates":</strong> Your total database size.</li>
                        <li><strong>"Active Clients":</strong> Your current revenue base.</li>
                    </ul>
                </div>
            </section>

            <div className="pt-8 border-t border-neutral-200 dark:border-neutral-800">
                <p className="text-sm text-neutral-500">
                    ReachX Operating System v1.0. For support, contact <a href="mailto:support@reachx.com" className="underline">support@reachx.com</a>.
                </p>
            </div>
        </div>
    );
}
