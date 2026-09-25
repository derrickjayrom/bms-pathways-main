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
  achieve_goals text not null,
  agreed_to_contact boolean default true
);

-- Ensure backwards compatibility if referenced as goals or achieve_goals
alter table public.join_submissions add column if not exists achieve_goals text;

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

-- 6. Pathway Subscriptions (USMLE / Residency Roadmap & Guide Access)
create table if not exists public.pathway_subscriptions (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz default timezone('utc'::text, now()) not null,
  reference_code text unique not null,           -- e.g. "BMS-7842"
  full_name text not null,
  email text not null,
  phone_whatsapp text not null,
  pathway_id text default 'us-residency' not null,
  status text default 'pending' not null,       -- 'pending', 'approved', 'rejected'
  amount_paid text default '',
  approved_at timestamptz,
  notes text
);

-- 7. BMS Site / Admin Settings (WhatsApp number, message template, price, admin pin)
create table if not exists public.bms_settings (
  key text primary key,
  value text not null,
  description text,
  updated_at timestamptz default timezone('utc'::text, now()) not null
);

-- Seed default settings if not exists
insert into public.bms_settings (key, value, description)
values
  ('whatsapp_number', '+233240000000', 'Admin WhatsApp contact number with country code'),
  ('whatsapp_default_message', 'Hello BMS! I would like to activate my subscription for the U.S. Residency Pathway Roadmap & Complete Guide. My reference code is: {code} and email: {email}.', 'Template message opened when user clicks Chat on WhatsApp'),
  ('subscription_price', '$25 / GHS 350', 'Display price for the pathway roadmap & guide access'),
  ('admin_passcode', 'bms-admin-2025', 'Passcode to access the /admin/subscriptions dashboard')
on conflict (key) do nothing;

-- Indexes
create index if not exists idx_pathway_subs_email on public.pathway_subscriptions(lower(email));
create index if not exists idx_pathway_subs_status on public.pathway_subscriptions(status);
create index if not exists idx_pathway_subs_ref on public.pathway_subscriptions(reference_code);

-- Enable Row Level Security
alter table public.pathway_subscriptions enable row level security;
alter table public.bms_settings enable row level security;

-- Policies for pathway_subscriptions
create policy "Allow public insert on pathway_subscriptions"
  on public.pathway_subscriptions for insert
  to anon, authenticated
  with check (true);

create policy "Allow public read on pathway_subscriptions"
  on public.pathway_subscriptions for select
  to anon, authenticated
  using (true);

create policy "Allow update on pathway_subscriptions"
  on public.pathway_subscriptions for update
  to anon, authenticated
  using (true)
  with check (true);

create policy "Allow delete on pathway_subscriptions"
  on public.pathway_subscriptions for delete
  to anon, authenticated
  using (true);

-- Policies for bms_settings
create policy "Allow public read on bms_settings"
  on public.bms_settings for select
  to anon, authenticated
  using (true);

create policy "Allow update on bms_settings"
  on public.bms_settings for update
  to anon, authenticated
  using (true)
  with check (true);

create policy "Allow insert on bms_settings"
  on public.bms_settings for insert
  to anon, authenticated
  with check (true);

