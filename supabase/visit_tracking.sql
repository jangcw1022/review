-- Run once in the Supabase SQL editor. Safe to re-run (every statement is
-- idempotent). Adds F2 (방문기록: status/재방문의사/메모) and F4 (태그)
-- columns to saved_places, plus the UPDATE policy needed to edit them —
-- saved_places.sql only granted select/insert/delete, and F2 needs update.

alter table public.saved_places
  add column if not exists status text not null default 'to_visit',
  add column if not exists tags text[] not null default '{}',
  add column if not exists revisit_intent boolean,
  add column if not exists memo text;

do $$ begin
  alter table public.saved_places
    add constraint saved_places_status_check check (status in ('to_visit', 'visited'));
exception when duplicate_object then null;
end $$;

do $$ begin
  create policy "saved_places_update_own" on public.saved_places
    for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
exception when duplicate_object then null;
end $$;
