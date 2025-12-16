'use client';

import { useState } from 'react';

type ProjectState = {
  client: string;
  roles: string;
  headcount: number;
  duration: string;
  salaryBands: string;
  workingHours: string;
  compliance: string;
};

const DEFAULT_PROJECT: ProjectState = {
  client: 'Client A',
  roles: '',
  headcount: 10,
  duration: '6 months',
  salaryBands: '$1500 - $2200',
  workingHours: '8/day, 6 days/week',
  compliance: '',
};

export default function ProjectsPage() {
  return (
    <div className="space-y-8">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Projects / Job Builder</h1>
          <p className="mt-1 text-sm text-neutral-600 dark:text-neutral-400">
            Define projects for Mauritius with roles, headcount, salary bands, working hours, and compliance requirements.
          </p>
        </div>
        <button className="rounded-md bg-neutral-900 px-4 py-2 text-sm text-white dark:bg-white dark:text-neutral-900">
          New Project
        </button>
      </header>

      <div className="rounded-xl border border-neutral-200 bg-white p-6 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
        <h2 className="text-lg font-semibold">Project Definition</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <div>
            <label className="text-sm text-neutral-600 dark:text-neutral-400">Client</label>
            <select className="mt-1 w-full rounded-md border border-neutral-200 bg-white px-3 py-2 text-sm dark:border-neutral-800 dark:bg-neutral-950">
              <option>Client A</option>
              <option>Client B</option>
              <option>Client C</option>
            </select>
          </div>
          <div>
            <label className="text-sm text-neutral-600 dark:text-neutral-400">Role(s)</label>
            <input className="mt-1 w-full rounded-md border border-neutral-200 bg-white px-3 py-2 text-sm dark:border-neutral-800 dark:bg-neutral-950" placeholder="e.g., Welder, Driver" />
          </div>
          <div>
            <label className="text-sm text-neutral-600 dark:text-neutral-400">Headcount</label>
            <input type="number" className="mt-1 w-full rounded-md border border-neutral-200 bg-white px-3 py-2 text-sm dark:border-neutral-800 dark:bg-neutral-950" placeholder="10" />
          </div>
          <div>
            <label className="text-sm text-neutral-600 dark:text-neutral-400">Duration</label>
            <input className="mt-1 w-full rounded-md border border-neutral-200 bg-white px-3 py-2 text-sm dark:border-neutral-800 dark:bg-neutral-950" placeholder="6 months" />
          </div>
          <div>
            <label className="text-sm text-neutral-600 dark:text-neutral-400">Salary Bands (MUR)</label>
            <input className="mt-1 w-full rounded-md border border-neutral-200 bg-white px-3 py-2 text-sm dark:border-neutral-800 dark:bg-neutral-950" placeholder="MUR 15,000 - MUR 25,000" />
          </div>
          <div>
            <label className="text-sm text-neutral-600 dark:text-neutral-400">Working Hours</label>
            <input className="mt-1 w-full rounded-md border border-neutral-200 bg-white px-3 py-2 text-sm dark:border-neutral-800 dark:bg-neutral-950" placeholder="9/day, 6 days/week (Mauritius)" />
          </div>
          <div className="sm:col-span-2">
            <label className="text-sm text-neutral-600 dark:text-neutral-400">Compliance Requirements (Mauritius)</label>
            <textarea className="mt-1 w-full rounded-md border border-neutral-200 bg-white px-3 py-2 text-sm dark:border-neutral-800 dark:bg-neutral-950" rows={3} placeholder="Employment Permit (MoLHRDT), Residence Permit (PIO), medical checks, insurance, quotas…" />
          </div>
        </div>

        <div className="mt-6 grid gap-4 lg:grid-cols-2">
          <div className="rounded-lg border border-neutral-200 bg-neutral-50 p-4 dark:border-neutral-800 dark:bg-neutral-800">
            <h3 className="font-semibold">Auto-generated Checklists (Mauritius)</h3>
            <ul className="mt-2 list-disc pl-5 text-sm">
              <li>Employment Contract (conforming to Employment Rights Act)</li>
              <li>Employment Permit application bundle (Ministry of Labour)</li>
              <li>Residence Permit coordination (Passport & Immigration Office)</li>
              <li>Minimum wage and sector agreement validation</li>
              <li>Timeline (submission milestones and renewals)</li>
            </ul>
          </div>
          <div className="rounded-lg border border-neutral-200 bg-neutral-50 p-4 dark:border-neutral-800 dark:bg-neutral-800">
            <h3 className="font-semibold">Risk & Validation (Mauritius)</h3>
            <ul className="mt-2 list-disc pl-5 text-sm">
              <li>Salary below national minimum wage</li>
              <li>Non-compliance with sector collective agreements</li>
              <li>Quota and foreign worker ratio checks</li>
              <li>Permit validity and renewal timelines</li>
            </ul>
          </div>
        </div>

        <div className="mt-6 flex gap-2">
          <button className="rounded-md bg-neutral-900 px-4 py-2 text-sm text-white dark:bg-white dark:text-neutral-900">
            Save Project
          </button>
          <button className="rounded-md border border-neutral-200 px-4 py-2 text-sm dark:border-neutral-800">
            Reset
          </button>
        </div>
      </div>
    </div>
  );
}
