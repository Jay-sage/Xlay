-- ========================================================
-- XLAY MIGRATIONS: 20261115000000_foundation.sql
-- Phase 0 Foundation: Schema Extensions & Reserved Slugs
-- ========================================================

-- Enable required extensions
create extension if not exists "uuid-ossp";
create extension if not exists "pgcrypto";

-- Table: reserved_usernames
-- Protects critical system routes and high-value reserved keywords
create table if not exists public.reserved_usernames (
    username text primary key,
    reason text not null default 'system_reserved',
    created_at timestamptz not null default now()
);

-- Enable RLS
alter table public.reserved_usernames enable row level security;

-- Policy: Everyone can read reserved usernames to validate during registration
create policy "Allow public read on reserved usernames"
    on public.reserved_usernames
    for select
    using (true);

-- Seed reserved usernames
insert into public.reserved_usernames (username, reason)
values
    ('events', 'system_route'),
    ('admin', 'system_route'),
    ('superadmin', 'system_route'),
    ('api', 'system_route'),
    ('privacy', 'legal_route'),
    ('terms', 'legal_route'),
    ('login', 'auth_route'),
    ('dashboard', 'app_route'),
    ('auth', 'auth_route'),
    ('invite', 'invite_route'),
    ('upgrade', 'app_route'),
    ('go', 'redirect_route'),
    ('support', 'support_route'),
    ('about', 'static_route'),
    ('contact', 'contact_route'),
    ('data-deletion', 'compliance_route')
on conflict (username) do nothing;
