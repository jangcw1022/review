-- Run this once in the Supabase SQL editor. Safe to re-run (CREATE OR REPLACE).
--
-- saved_places has RLS restricting each user to their own rows, so a plain
-- `select place_id, count(*) ... group by place_id` from the client would only
-- ever count the caller's own saves. This SECURITY DEFINER function runs with
-- the privileges of its owner (postgres, which is exempt from saved_places'
-- RLS since FORCE ROW LEVEL SECURITY was never set), so it can aggregate
-- across every user's rows — but it only ever returns place info + a count,
-- never user_id, so no one user's identity or list leaks to another.

create or replace function public.popular_places(limit_count integer default 5)
returns table (
  place_id text,
  place_name text,
  address text,
  category_name text,
  x text,
  y text,
  save_count bigint
)
language sql
security definer
set search_path = public
stable
as $$
  select
    place_id,
    max(place_name) as place_name,
    max(address) as address,
    max(category_name) as category_name,
    max(x) as x,
    max(y) as y,
    count(*) as save_count
  from public.saved_places
  group by place_id
  order by count(*) desc, place_id
  limit greatest(limit_count, 0)
$$;

grant execute on function public.popular_places(integer) to anon, authenticated;
