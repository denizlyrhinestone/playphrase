-- Run this once in your Supabase SQL editor or via psql
-- This script is idempotent: it can be run multiple times without error.

-- Enable pgcrypto extension for gen_random_uuid() if not already enabled
create extension if not exists "pgcrypto";

-- Drop existing trigger if it exists to allow recreation
drop trigger if exists set_phrases_updated_at on public.phrases;

-- Drop existing function if it exists to allow recreation
drop function if exists public.set_updated_at();

-- Create the phrases table if it doesn't already exist
create table if not exists public.phrases (
  id uuid primary key default gen_random_uuid(),
  english_text text not null,
  turkish_translation text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Function to automatically update 'updated_at' timestamp on row update
create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- Trigger to call the function before each update on the 'phrases' table
create trigger set_phrases_updated_at
before update on public.phrases
for each row execute procedure public.set_updated_at();
