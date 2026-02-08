-- Supabase schema for AgentOps Backend API
-- Run in the Supabase SQL editor.

create extension if not exists "pgcrypto";

create table if not exists devices (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users,
  platform text not null check (platform in ('ios', 'android')),
  push_token text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists workspaces (
  id uuid primary key default gen_random_uuid(),
  device_id uuid references devices(id) on delete cascade,
  machine_id text not null,
  display_name text not null,
  project_fingerprint text not null,
  bridge_secret text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists pair_tokens (
  token uuid primary key,
  machine_id text not null,
  workspace_fingerprint text not null,
  display_name text not null,
  expires_at timestamptz not null,
  created_at timestamptz not null default now()
);

create table if not exists runs (
  id uuid primary key default gen_random_uuid(),
  provider text not null,
  provider_run_id text,
  workspace_id uuid references workspaces(id) on delete set null,
  status text,
  started_at timestamptz,
  ended_at timestamptz,
  last_event_at timestamptz,
  last_message text,
  meta jsonb
);

create table if not exists events (
  id uuid primary key default gen_random_uuid(),
  run_id uuid references runs(id) on delete cascade,
  type text not null,
  created_at timestamptz not null default now(),
  payload jsonb not null default '{}'::jsonb
);

create table if not exists approvals (
  id uuid primary key default gen_random_uuid(),
  run_id uuid references runs(id) on delete cascade,
  status text not null check (status in ('PENDING','APPROVED','DENIED','EXPIRED')) default 'PENDING',
  kind text not null,
  command text not null,
  cwd_hash text not null,
  note text,
  requested_at timestamptz not null default now(),
  decided_at timestamptz,
  decided_by_device_id uuid references devices(id)
);

create index if not exists idx_runs_workspace_id on runs (workspace_id);
create index if not exists idx_events_run_id on events (run_id);
create index if not exists idx_approvals_run_id on approvals (run_id);
create index if not exists idx_pair_tokens_expires_at on pair_tokens (expires_at);
