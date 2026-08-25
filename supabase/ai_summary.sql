-- Run once in the Supabase SQL editor. Safe to re-run.
--
-- Adds AI review summary + sentiment caching for a place, aggregated across
-- every user who visited it. saved_places.memo is per-user RLS-protected
-- data, so — same trick as popular_places() — a SECURITY DEFINER function
-- is used to read memo text across users without ever exposing user_id.
-- The cache table itself holds only derived, non-personal data (one row
-- per place: a summary string + a percentage), so it's readable by anyone;
-- writes only ever happen through the SECURITY DEFINER upsert function
-- below, called from the server-side /api/summarize route.

create table if not exists public.place_ai_summaries (
  place_id text primary key,
  summary text not null,
  positive_ratio numeric not null,
  review_count integer not null,
  computed_at timestamptz not null default now()
);

alter table public.place_ai_summaries enable row level security;

drop policy if exists "place_ai_summaries_select_all" on public.place_ai_summaries;
create policy "place_ai_summaries_select_all" on public.place_ai_summaries
  for select using (true);

-- Read: every visited place's memo across all users, for one place_id.
create or replace function public.place_review_memos(target_place_id text)
returns table (memo text)
language sql
security definer
set search_path = public
stable
as $$
  select memo
  from public.saved_places
  where place_id = target_place_id
    and status = 'visited'
    and memo is not null
    and length(trim(memo)) > 0
$$;

grant execute on function public.place_review_memos(text) to anon, authenticated;

-- Write: upsert the cached summary for a place.
create or replace function public.upsert_place_ai_summary(
  target_place_id text,
  new_summary text,
  new_positive_ratio numeric,
  new_review_count integer
)
returns void
language sql
security definer
set search_path = public
as $$
  insert into public.place_ai_summaries (place_id, summary, positive_ratio, review_count, computed_at)
  values (target_place_id, new_summary, new_positive_ratio, new_review_count, now())
  on conflict (place_id) do update set
    summary = excluded.summary,
    positive_ratio = excluded.positive_ratio,
    review_count = excluded.review_count,
    computed_at = excluded.computed_at
$$;

grant execute on function public.upsert_place_ai_summary(text, numeric, integer) to anon, authenticated;
