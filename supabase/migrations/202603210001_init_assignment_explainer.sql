create extension if not exists pgcrypto;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  university text not null default 'Cavendish University',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.assignments (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text,
  course_name text,
  question_text text not null check (char_length(question_text) between 20 and 5000),
  word_count integer check (word_count is null or word_count > 0),
  level text,
  created_at timestamptz not null default now()
);

create table if not exists public.assignment_explanations (
  id uuid primary key default gen_random_uuid(),
  assignment_id uuid not null references public.assignments(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  status text not null default 'pending' check (status in ('pending', 'completed', 'failed', 'refused')),
  model text not null,
  simplified_explanation text,
  lecturer_intent text,
  step_by_step jsonb,
  suggested_structure jsonb,
  key_topics jsonb,
  common_mistakes jsonb,
  refusal_reason text,
  error_message text,
  raw_response jsonb,
  created_at timestamptz not null default now(),
  completed_at timestamptz
);

create index if not exists assignments_user_id_created_at_idx
  on public.assignments(user_id, created_at desc);

create index if not exists assignment_explanations_user_id_created_at_idx
  on public.assignment_explanations(user_id, created_at desc);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists profiles_set_updated_at on public.profiles;
create trigger profiles_set_updated_at
before update on public.profiles
for each row execute procedure public.set_updated_at();

alter table public.profiles enable row level security;
alter table public.assignments enable row level security;
alter table public.assignment_explanations enable row level security;

drop policy if exists "Users can view own profile" on public.profiles;
create policy "Users can view own profile"
on public.profiles
for select
using (auth.uid() = id);

drop policy if exists "Users can insert own profile" on public.profiles;
create policy "Users can insert own profile"
on public.profiles
for insert
with check (auth.uid() = id);

drop policy if exists "Users can update own profile" on public.profiles;
create policy "Users can update own profile"
on public.profiles
for update
using (auth.uid() = id)
with check (auth.uid() = id);

drop policy if exists "Users can view own assignments" on public.assignments;
create policy "Users can view own assignments"
on public.assignments
for select
using (auth.uid() = user_id);

drop policy if exists "Users can insert own assignments" on public.assignments;
create policy "Users can insert own assignments"
on public.assignments
for insert
with check (auth.uid() = user_id);

drop policy if exists "Users can update own assignments" on public.assignments;
create policy "Users can update own assignments"
on public.assignments
for update
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

drop policy if exists "Users can view own explanations" on public.assignment_explanations;
create policy "Users can view own explanations"
on public.assignment_explanations
for select
using (auth.uid() = user_id);

drop policy if exists "Users can insert own explanations" on public.assignment_explanations;
create policy "Users can insert own explanations"
on public.assignment_explanations
for insert
with check (auth.uid() = user_id);

drop policy if exists "Users can update own explanations" on public.assignment_explanations;
create policy "Users can update own explanations"
on public.assignment_explanations
for update
using (auth.uid() = user_id)
with check (auth.uid() = user_id);
