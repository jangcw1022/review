import { supabase } from "@/lib/supabase/client";
import type { SavedPlaceRow, SavedPlaceStatus } from "@/lib/savedPlaces";

// Every filter dimension "오늘 뭐 먹지" supports lives here as one field.
// Adding a new one later means: add a field to this interface, one more
// chained condition on `query` below that reads it, and one more filter
// section in TodayPickerModal — the same way categories/tags/status did.
export interface TodayPickerFilter {
  categories: string[]; // empty = 전체 (no category restriction)
  tags: string[]; // empty = 태그 무관
  status: "all" | SavedPlaceStatus; // 가볼 곳 / 가본 곳 / 둘 다
}

export async function fetchTodayCandidates(userId: string, filter: TodayPickerFilter): Promise<SavedPlaceRow[]> {
  if (!supabase) return [];

  let query = supabase.from("saved_places").select("*").eq("user_id", userId);

  if (filter.categories.length > 0) {
    query = query.or(filter.categories.map((category) => `category_name.ilike.%${category}%`).join(","));
  }

  if (filter.tags.length > 0) {
    query = query.overlaps("tags", filter.tags);
  }

  if (filter.status !== "all") {
    query = query.eq("status", filter.status);
  }

  const { data, error } = await query;
  if (error) throw error;
  return data ?? [];
}
