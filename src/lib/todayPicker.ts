import { supabase } from "@/lib/supabase/client";
import type { SavedPlaceRow } from "@/lib/savedPlaces";

// Every filter dimension "오늘 뭐 먹지" supports lives here as one field.
// Adding tags or a 가볼 곳/가본 곳 status filter later means: add a field to
// this interface, and one more chained condition on `query` below that reads
// it — the UI side adds one more filter section the same way categories did.
export interface TodayPickerFilter {
  categories: string[]; // empty = 전체 (no category restriction)
}

export async function fetchTodayCandidates(userId: string, filter: TodayPickerFilter): Promise<SavedPlaceRow[]> {
  if (!supabase) return [];

  let query = supabase
    .from("saved_places")
    .select("id, place_id, place_name, address, category_name, created_at")
    .eq("user_id", userId);

  if (filter.categories.length > 0) {
    query = query.or(filter.categories.map((category) => `category_name.ilike.%${category}%`).join(","));
  }

  const { data, error } = await query;
  if (error) throw error;
  return data ?? [];
}
