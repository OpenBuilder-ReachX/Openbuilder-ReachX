-- Enable necessary extensions
create extension if not exists "uuid-ossp";

-- PROFILES (Agencies)
-- Extends the auth.users table
create table public.profiles (
  id uuid references auth.users on delete cascade not null primary key,
  agency_name text,
  contact_email text,
  currency text default 'MUR',
  tax_registration text,
  country text default 'Mauritius',
  labour_authority text,
  default_working_hours numeric default 9,
  default_min_salary numeric,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- CLIENTS
create table public.clients (
  id uuid default uuid_generate_v4() primary key,
  agency_id uuid references public.profiles(id) on delete cascade not null,
  name text not null,
  contact_email text,
  status text default 'Prospect' check (status in ('Active', 'Prospect', 'Dormant')),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- CANDIDATES
create table public.candidates (
  id uuid default uuid_generate_v4() primary key,
  agency_id uuid references public.profiles(id) on delete cascade not null,
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
alter table public.profiles enable row level security;
alter table public.clients enable row level security;
alter table public.candidates enable row level security;

-- Profiles: Users can see and edit their own profile
create policy "Users can view own profile" on public.profiles
  for select using (auth.uid() = id);

create policy "Users can update own profile" on public.profiles
  for update using (auth.uid() = id);

create policy "Users can insert own profile" on public.profiles
  for insert with check (auth.uid() = id);

-- Clients: Users can see/edit clients belonging to their agency
create policy "Users can view own clients" on public.clients
  for select using (auth.uid() = agency_id);

create policy "Users can insert own clients" on public.clients
  for insert with check (auth.uid() = agency_id);

create policy "Users can update own clients" on public.clients
  for update using (auth.uid() = agency_id);

create policy "Users can delete own clients" on public.clients
  for delete using (auth.uid() = agency_id);

-- Candidates: Users can see/edit candidates belonging to their agency
create policy "Users can view own candidates" on public.candidates
  for select using (auth.uid() = agency_id);

create policy "Users can insert own candidates" on public.candidates
  for insert with check (auth.uid() = agency_id);

create policy "Users can update own candidates" on public.candidates
  for update using (auth.uid() = agency_id);

create policy "Users can delete own candidates" on public.candidates
  for delete using (auth.uid() = agency_id);

-- FUNCTIONS
-- Function to handle new user signup (trigger)
create or replace function public.handle_new_user() 
returns trigger as $$
begin
  insert into public.profiles (id, contact_email)
  values (new.id, new.email);
  return new;
end;
$$ language plpgsql security definer;

-- Trigger for new user signup
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
