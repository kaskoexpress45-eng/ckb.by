-- Run once in Supabase SQL Editor. No public read/write policies.
create table if not exists public.leads (
 id uuid primary key default gen_random_uuid(),
 created_at timestamptz not null default now(),
 name text not null check (char_length(name) between 1 and 100),
 phone text check (char_length(phone) <= 40),
 telegram text check (char_length(telegram) <= 80),
 direction text not null check (direction in ('development','protection','capital')),
 message text not null default '' check (char_length(message) <= 2000),
 page text check (char_length(page) <= 1000),
 utm jsonb not null default '{}'::jsonb,
 consent boolean not null check (consent = true),
 check (coalesce(phone, '') <> '' or coalesce(telegram, '') <> '')
);
alter table public.leads enable row level security;
revoke all on public.leads from anon, authenticated;
