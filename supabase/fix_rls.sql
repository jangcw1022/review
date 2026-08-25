-- Run this if "가볼 곳 담기" fails with:
--   new row violates row-level security policy for table "saved_places"
-- even while genuinely logged in. Safe to re-run.
--
-- Most likely cause: the client never sends user_id on insert (by design —
-- see CLAUDE.md/PRD), relying entirely on a column DEFAULT of auth.uid() to
-- fill it. If that default was never actually applied to this project
-- (e.g. saved_places.sql was written for a table that already existed here
-- with its own history, and this specific ALTER never ran), user_id ends up
-- NULL on every insert, and `with check (auth.uid() = user_id)` correctly
-- rejects a NULL user_id — which produces exactly this error even for a
-- fully authenticated, email-confirmed user.

-- 1) Re-assert the default (idempotent — safe even if already set).
alter table public.saved_places alter column user_id set default auth.uid();

-- 2) Recreate every policy from scratch. CREATE POLICY has no "OR REPLACE",
--    so if an earlier version of one of these was subtly wrong, the old
--    "create policy ... exception when duplicate_object then null" pattern
--    would have silently kept the broken version forever. Drop + recreate
--    guarantees the policies below are exactly what's live now.
drop policy if exists "saved_places_select_own" on public.saved_places;
create policy "saved_places_select_own" on public.saved_places
  for select using (auth.uid() = user_id);

drop policy if exists "saved_places_insert_own" on public.saved_places;
create policy "saved_places_insert_own" on public.saved_places
  for insert with check (auth.uid() = user_id);

drop policy if exists "saved_places_update_own" on public.saved_places;
create policy "saved_places_update_own" on public.saved_places
  for update using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop policy if exists "saved_places_delete_own" on public.saved_places;
create policy "saved_places_delete_own" on public.saved_places
  for delete using (auth.uid() = user_id);

-- 3) Sanity check — run this separately afterwards and confirm:
--    - user_id's column_default reads "auth.uid()"
--    - all four policies below are listed
--
-- select column_default from information_schema.columns
--   where table_name = 'saved_places' and column_name = 'user_id';
--
-- select policyname, cmd, qual, with_check from pg_policies
--   where tablename = 'saved_places';
