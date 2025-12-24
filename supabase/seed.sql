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
  compliance_notes text,
  document_expiry_date date,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- RLS POLICIES
alter table public.agencies enable row level security;
alter table public.profiles enable row level security;
alter table public.clients enable row level security;
alter table public.candidates enable row level security;

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
