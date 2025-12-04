-- LEGAL-EASE DATABASE SCHEMA
-- Run this in Supabase SQL Editor

-- 1. PROFILES
create table profiles (
  id uuid references auth.users on delete cascade primary key,
  email text not null,
  full_name text not null,
  role text check (role in ('advocate', 'client')) default 'client',
  phone text,
  created_at timestamptz default now()
);

-- Auto-create profile on signup
create or replace function handle_new_user()
returns trigger as $$
begin
  insert into profiles (id, email, full_name, role)
  values (new.id, new.email, coalesce(new.raw_user_meta_data->>'full_name', 'User'), 'advocate');
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function handle_new_user();

-- 2. CASES
create table cases (
  id uuid primary key default gen_random_uuid(),
  advocate_id uuid references profiles(id) not null,
  client_id uuid references profiles(id),
  title text not null,
  case_number text,
  court text,
  stage text default 'Filing',
  parties jsonb default '{"petitioners": [], "respondents": []}',
  notes text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- 3. DOCUMENTS
create table documents (
  id uuid primary key default gen_random_uuid(),
  case_id uuid references cases(id) on delete cascade,
  name text not null,
  file_path text not null,
  file_type text,
  uploaded_by uuid references profiles(id),
  created_at timestamptz default now()
);

-- 4. HEARINGS
create table hearings (
  id uuid primary key default gen_random_uuid(),
  case_id uuid references cases(id) on delete cascade,
  title text not null,
  date date not null,
  time time,
  location text,
  notes text,
  reminder boolean default true,
  created_at timestamptz default now()
);

-- 5. TEMPLATES
create table templates (
  id uuid primary key default gen_random_uuid(),
  advocate_id uuid references profiles(id),
  name text not null,
  file_path text not null,
  variables text[] default '{}',
  created_at timestamptz default now()
);

-- 6. MESSAGES
create table messages (
  id uuid primary key default gen_random_uuid(),
  case_id uuid references cases(id),
  sender_id uuid references profiles(id) not null,
  receiver_id uuid references profiles(id) not null,
  content text not null,
  read boolean default false,
  created_at timestamptz default now()
);

-- ROW LEVEL SECURITY
alter table profiles enable row level security;
alter table cases enable row level security;
alter table documents enable row level security;
alter table hearings enable row level security;
alter table templates enable row level security;
alter table messages enable row level security;

-- Policies
create policy "View own profile" on profiles for select using (auth.uid() = id);
create policy "Update own profile" on profiles for update using (auth.uid() = id);

create policy "View own cases" on cases for select using (auth.uid() = advocate_id or auth.uid() = client_id);
create policy "Create cases" on cases for insert with check (auth.uid() = advocate_id);
create policy "Update own cases" on cases for update using (auth.uid() = advocate_id);
create policy "Delete own cases" on cases for delete using (auth.uid() = advocate_id);

create policy "View case docs" on documents for select using (case_id in (select id from cases where advocate_id = auth.uid() or client_id = auth.uid()));
create policy "Manage docs" on documents for all using (case_id in (select id from cases where advocate_id = auth.uid()));

create policy "View hearings" on hearings for select using (case_id in (select id from cases where advocate_id = auth.uid() or client_id = auth.uid()));
create policy "Manage hearings" on hearings for all using (case_id in (select id from cases where advocate_id = auth.uid()));

create policy "View templates" on templates for select using (auth.uid() = advocate_id);
create policy "Manage templates" on templates for all using (auth.uid() = advocate_id);

create policy "View messages" on messages for select using (auth.uid() = sender_id or auth.uid() = receiver_id);
create policy "Send messages" on messages for insert with check (auth.uid() = sender_id);

-- Search function
create or replace function search_cases(search_term text)
returns setof cases as $$
  select * from cases
  where (advocate_id = auth.uid() or client_id = auth.uid())
    and (title ilike '%' || search_term || '%'
      or case_number ilike '%' || search_term || '%'
      or court ilike '%' || search_term || '%')
$$ language sql security definer;

-- Auto-update timestamp
create or replace function update_timestamp()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger cases_updated before update on cases
  for each row execute function update_timestamp();
