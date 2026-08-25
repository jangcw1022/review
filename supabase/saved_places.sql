-- Reference schema for the `saved_places` table already present in this
-- project's Supabase instance (confirmed via the REST API — column names
-- below are the real ones, not a guess). Safe to re-run: every statement
-- is idempotent, so this also works as a repair script if a fresh Supabase
-- project needs the same table set up from scratch.

create table if not exists public.saved_places (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  place_id text not null,
  place_name text not null,
  address text,
  category_name text,
  x text, -- Kakao longitude, kept as the raw string Kakao returns
  y text, -- Kakao latitude, kept as the raw string Kakao returns
  created_at timestamptz not null default now(),
  unique (user_id, place_id)
);

-- user_id must never be trusted from the client. This default fills it
-- from the caller's JWT, so client inserts should omit user_id entirely.
alter table public.saved_places alter column user_id set default auth.uid();

alter table public.saved_places enable row level security;

do $$ begin
  create policy "saved_places_select_own" on public.saved_places
    for select using (auth.uid() = user_id);
exception when duplicate_object then null;
end $$;

do $$ begin
  create policy "saved_places_insert_own" on public.saved_places
    for insert with check (auth.uid() = user_id);
exception when duplicate_object then null;
end $$;

do $$ begin
  create policy "saved_places_delete_own" on public.saved_places
    for delete using (auth.uid() = user_id);
exception when duplicate_object then null;
end $$;
