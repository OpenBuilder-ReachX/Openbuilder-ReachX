-- Enable necessary extensions
create extension if not exists "uuid-ossp";

-- AGENCIES (Tenants)
create table public.agencies (
  id uuid default uuid_generate_v4() primary key,
  name text not null, -- Agency Name
  contact_email text,
  currency text default 'MUR',
  tax_registration text,
  country text default 'Mauritius',
  labour_authority text,
  default_working_hours numeric default 9,
  default_min_salary numeric,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- PROFILES (Users)
-- Extends the auth.users table, links to an Agency
create table public.profiles (
  id uuid references auth.users on delete cascade not null primary key,
  agency_id uuid references public.agencies(id) on delete set null,
  role text default 'Owner', -- Owner, Recruiter, Admin
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- CLIENTS
create table public.clients (
  id uuid default uuid_generate_v4() primary key,
  agency_id uuid references public.agencies(id) on delete cascade not null,
  name text not null,
  contact_email text,
  status text default 'Prospect' check (status in ('Active', 'Prospect', 'Dormant')),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- CANDIDATES
create table public.candidates (
  id uuid default uuid_generate_v4() primary key,
  agency_id uuid references public.agencies(id) on delete cascade not null,
  first_name text not null,
  last_name text not null,
  nationality text,
  role text,
  availability text,
  status text default 'Green' check (status in ('Green', 'Yellow', 'Red')),
  cv_file_path text, -- Path to evidence/CV in Storage
  document_expiry_date date,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- JOBS (Requisitions)
create table public.jobs (
  id uuid default uuid_generate_v4() primary key,
  agency_id uuid references public.agencies(id) on delete cascade not null,
  client_id uuid references public.clients(id) on delete cascade,
  title text not null,
  status text default 'Open' check (status in ('Open', 'Closed', 'Filled')),
  share_token uuid default uuid_generate_v4(), -- The "Magic Link" secret
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- JOB APPLICATIONS (Shortlist)
create table public.job_applications (
  id uuid default uuid_generate_v4() primary key,
  job_id uuid references public.jobs(id) on delete cascade not null,
  candidate_id uuid references public.candidates(id) on delete cascade not null,
  stage text default 'Shortlisted' check (stage in ('Shortlisted', 'Interviewing', 'Rejected', 'Hired')),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(job_id, candidate_id)
);

-- STORAGE (Evidence Bucket)
insert into storage.buckets (id, name, public) 
values ('evidence', 'evidence', true)
on conflict (id) do nothing;

-- Storage Policies
create policy "Agency users can upload evidence" on storage.objects
  for insert with check (bucket_id = 'evidence' and auth.role() = 'authenticated');

create policy "Agency users can view evidence" on storage.objects
  for select using (bucket_id = 'evidence' and auth.role() = 'authenticated');

-- RLS POLICIES
alter table public.agencies enable row level security;
alter table public.profiles enable row level security;
alter table public.clients enable row level security;
alter table public.candidates enable row level security;
alter table public.jobs enable row level security;
alter table public.job_applications enable row level security;

-- JOBS Policies
create policy "Agency users can view own jobs" on public.jobs
  for select using (agency_id in (select agency_id from public.profiles where id = auth.uid()));

create policy "Agency users can insert jobs" on public.jobs
  for insert with check (agency_id in (select agency_id from public.profiles where id = auth.uid()));

create policy "Agency users can update jobs" on public.jobs
  for update using (agency_id in (select agency_id from public.profiles where id = auth.uid()));

-- PUBLIC ACCESS POLICY (Magic Link)
-- Allow anyone to read a JOB if they have the share_token (This requires a secure view or careful querying)
-- Ideally, we use a function or a view, but for MVP RLS:
-- We will allow 'anon' access IF the query filters by the known share_token.
-- INTERVIEWS (Logistics)
create table public.interviews (
  id uuid default uuid_generate_v4() primary key,
  agency_id uuid references public.agencies(id) on delete cascade not null,
  job_id uuid references public.jobs(id) on delete set null, -- Optional
  candidate_id uuid references public.candidates(id) on delete cascade not null,
  start_time timestamp with time zone not null,
  location text default 'Office' not null,
  status text default 'Scheduled' check (status in ('Scheduled', 'Completed', 'Cancelled')),
  notes text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- RLS: Agency Access Only
alter table public.interviews enable row level security;

create policy "Agency users can view their interviews" on public.interviews
  for select using (
    agency_id in (
      select agency_id from public.profiles where id = auth.uid()
    )
  );

create policy "Agency users can insert their interviews" on public.interviews
  for insert with check (
    agency_id in (
      select agency_id from public.profiles where id = auth.uid()
    )
  );

create policy "Agency users can update their interviews" on public.interviews
  for update using (
    agency_id in (
      select agency_id from public.profiles where id = auth.uid()
    )
  );

-- JOB APPLICATIONS Policies
create policy "Agency users can view applications" on public.job_applications
  for select using (job_id in (select id from public.jobs));

create policy "Agency users can insert applications" on public.job_applications
  for insert with check (job_id in (select id from public.jobs));

create policy "Public can view applications for shared job" on public.job_applications
  for select to anon using (job_id in (select id from public.jobs)); 
-- Again, relies on the parent Job being accessible via token logic in the app.

-- Policies Helper Function: Get User's Agency ID
-- (Performance note: For high scale, use JWT claims. For MVP, this join is fine)

-- AGENCIES: Users can view/update their OWN agency
create policy "Users can view own agency" on public.agencies
  for select using (id in (select agency_id from public.profiles where id = auth.uid()));

create policy "Users can update own agency" on public.agencies
  for update using (id in (select agency_id from public.profiles where id = auth.uid()));

-- PROFILES: Users can view own profile
create policy "Users can view own profile" on public.profiles
  for select using (auth.uid() = id);

-- CLIENTS: Users can view clients of their agency
create policy "Agency users can view clients" on public.clients
  for select using (agency_id in (select agency_id from public.profiles where id = auth.uid()));

create policy "Agency users can insert clients" on public.clients
  for insert with check (agency_id in (select agency_id from public.profiles where id = auth.uid()));

create policy "Agency users can update clients" on public.clients
  for update using (agency_id in (select agency_id from public.profiles where id = auth.uid()));

-- CANDIDATES: Users can view candidates of their agency
create policy "Agency users can view candidates" on public.candidates
  for select using (agency_id in (select agency_id from public.profiles where id = auth.uid()));

create policy "Agency users can insert candidates" on public.candidates
  for insert with check (agency_id in (select agency_id from public.profiles where id = auth.uid()));

create policy "Agency users can update candidates" on public.candidates
  for update using (agency_id in (select agency_id from public.profiles where id = auth.uid()));


-- FUNCTIONS
-- Handle new user signup: Create Agency + Profile (Solo Model)
create or replace function public.handle_new_user() 
returns trigger as $$
declare
  new_agency_id uuid;
begin
  -- 1. Create a new Agency for this user
  insert into public.agencies (name, contact_email)
  values ('My Agency', new.email)
  returning id into new_agency_id;

  -- 2. Create Profile linked to that Agency
  insert into public.profiles (id, agency_id)
  values (new.id, new_agency_id);
  
  return new;
end;
$$ language plpgsql security definer;

-- Trigger
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
