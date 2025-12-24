# ReachX: Path to Revenue (14-Day Plan)

**Goal**: Transform ReachX from "UI Prototype" to "Revenue-Generating Recruitment OS".
**Target MRR (30 Days)**: Rs 30,000 - 45,000.
**Promise**: "ReachX gives recruitment agencies a clean, modern operating system to manage candidates and clients — replacing spreadsheets with clarity."

---

## 🏗️ Technical MVP Scope (The "Wiring" Phase)
We are strictly building the **"Minimum Sellable Product"**. No fluff.

### Phase 1: The Core (Days 1-7) - *Sellable at Rs 5k*
**Goal**: Users can Log in, Create Data, and View it clearly.

1.  **Database (Supabase)**:
    -   Tables: `agencies`, `recruiters` (auth.users), `candidates`, `clients`.
    -   Fields: Name, Contact Info, Status (Green/Yellow/Red), Availability.
2.  **Frontend Wiring**:
    -   **Candidates Page**: Replace mock data with `supabase.from('candidates').select()`. Implement "Add Candidate" form.
    -   **Clients Page**: Replace mock data with `supabase.from('clients').select()`. Implement "Add Client" form.
    -   **Auth**: Ensure Login flow redirects to dashboard.

### Phase 2: The Value (Days 8-14) - *Unlocks Rs 10k Tier*
**Goal**: Simple automation and reporting.

1.  **Compliance Logic**: Add `document_expiry` dates. Auto-set Status (Red if expired).
2.  **Exports**: Simple CSV dump of candidates/clients.
3.  **Dashboard**: Wire "Total Candidates" and "Active Clients" counters.

---

## 💰 Pricing & Packaging

| Tier | Price (MUR) | Target Audience | Inclusions |
| :--- | :--- | :--- | :--- |
| **Preview** | **Free** | Evaluators | Demo mode, UI exploration, no persistent data/export. |
| **Guided Pilot** | **5,000 / mo** | Solo/Small Agencies | **Live System**. Real data. 3 Recruiters. Founder onboarding. |
| **Partner** | **10,000 / mo** | Growing Agencies | **Automation**. Expiry tracking. Exports. Priority influence. |

---

## 🚀 Go-To-Market Strategy

### 1. Preparation
-   Rename UI: "Employee" → "Candidate", "Company" → "Client".
-   Hide non-functional buttons (or show "Coming Soon").

### 2. Direct Sales (Founder-Led)
-   **Channel**: WhatsApp / Direct Message.
-   **Script**: *"I’ve built a recruitment operating system for agencies who want clarity now and automation next. I’m onboarding a few agencies personally this month. Want me to show you?"*
-   **Objection Handling**: "Is it ready?" -> *"Yes — live data, real candidates, and we wire automation during the pilot."*

### 3. Rules of Engagement
-   ❌ No custom feature work for Free users.
-   ❌ No discounts.
-   ❌ No new ideas until 3 paying customers.

---

## 🛑 immediate Next Steps (Tech)
1.  **Lock Project**: Ensure `package.json`, `.env.example`, `README.md` are safe (Done).
2.  **Connect Engine**: Run `supabase/seed.sql` to create the tables (Next Action).
3.  **Wire Candidates**: Connect the Candidates table to the UI (Next Action).
