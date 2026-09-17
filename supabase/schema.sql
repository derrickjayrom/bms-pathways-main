-- ==============================================================================
-- Beyond Medical School (BMS) - Supabase Database Schema
-- Run this script in the Supabase SQL Editor (supabase.com/dashboard/project/_/sql)
-- ==============================================================================

-- 1. Student / Mentor / Partner Applications
create table if not exists public.join_submissions (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz default timezone('utc'::text, now()) not null,
  role_type text not null, -- 'Student', 'Mentor / Speaker', 'Partner'
  full_name text not null,
  email text not null,
  organization text not null,
  level_or_expertise text not null,
  location text not null,
  primary_interest text not null,
  goals text not null,
  agreed_to_contact boolean default true
);

-- 2. Contact Inquiries
create table if not exists public.contact_messages (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz default timezone('utc'::text, now()) not null,
  full_name text not null,
  email text not null,
  inquiry_type text not null,
  message text not null
);

-- 3. Event Interest Registrations
create table if not exists public.event_registrations (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz default timezone('utc'::text, now()) not null,
  event_title text not null,
  event_type text not null,
  event_date text,
  full_name text not null,
  email text not null
);

-- 4. Newsletter Subscribers
create table if not exists public.newsletter_subscribers (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz default timezone('utc'::text, now()) not null,
  email text unique not null
);

-- 5. User Feedback
create table if not exists public.site_feedback (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz default timezone('utc'::text, now()) not null,
  rating smallint not null,
  feedback text not null,
  full_name text not null,
  email text not null
);

-- ==============================================================================
-- Row-Level Security (RLS)
-- ==============================================================================
alter table public.join_submissions enable row level security;
alter table public.contact_messages enable row level security;
alter table public.event_registrations enable row level security;
alter table public.newsletter_subscribers enable row level security;
alter table public.site_feedback enable row level security;

-- Allow public anonymous/authenticated visitors to submit entries
create policy "Allow public inserts on join_submissions"
  on public.join_submissions for insert
  to anon, authenticated
  with check (true);

create policy "Allow public inserts on contact_messages"
  on public.contact_messages for insert
  to anon, authenticated
  with check (true);

create policy "Allow public inserts on event_registrations"
  on public.event_registrations for insert
  to anon, authenticated
  with check (true);

create policy "Allow public inserts on newsletter_subscribers"
  on public.newsletter_subscribers for insert
  to anon, authenticated
  with check (true);

create policy "Allow public inserts on site_feedback"
  on public.site_feedback for insert
  to anon, authenticated
  with check (true);
