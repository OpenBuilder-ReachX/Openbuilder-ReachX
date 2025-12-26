---
description: How to Deploy ReachX to Production
---

# Deploying ReachX Pilot

## 1. Push Code to GitHub
The User (`Omran1983`) has authorized the push.
Remote: `origin` (GitHub).

```bash
git add .
git commit -m "feat(release): Pilot Ready - Glass Citadel + Fortress Protocol"
git push origin main
```

## 2. Connect Vercel
1.  Go to [Vercel Dashboard](https://vercel.com/omran-ahmads-projects-).
2.  Select the repository from `Omran1983`.
3.  **Environment Variables (CRITICAL):**
    *   `NEXT_PUBLIC_SUPABASE_URL`: `https://abkprecmhitqmmlzxfad.supabase.co`
    *   `NEXT_PUBLIC_SUPABASE_ANON_KEY`: (Get this from your Supabase Dashboard -> Settings -> API)

## 3. Verify Deployment
Once Vercel finishes building (usually 2 minutes):
1.  Open the Vercel URL.
2.  Login.
3.  Test the **Drop Zone**.

## Supabase Configuration
Ensure your Supabase project `abkprecmhitqmmlzxfad` has the Redirect URL added:
*   Go to Supabase Dashboard -> Authentication -> URL Configuration.
*   Add your Vercel production URL (e.g., `https://reachx-pilot.vercel.app/**`).
