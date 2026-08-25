import { supabase } from "@/lib/supabase/client";

export interface PlaceAiSummary {
  place_id: string;
  summary: string;
  positive_ratio: number;
  review_count: number;
  computed_at: string;
}

export async function fetchPlaceReviewMemos(placeId: string): Promise<string[]> {
  if (!supabase) return [];

  const { data, error } = await supabase.rpc("place_review_memos", { target_place_id: placeId });
  if (error) throw error;
  return (data ?? []).map((row: { memo: string }) => row.memo);
}

export async function fetchCachedSummary(placeId: string): Promise<PlaceAiSummary | null> {
  if (!supabase) return null;

  const { data, error } = await supabase
    .from("place_ai_summaries")
    .select("*")
    .eq("place_id", placeId)
    .maybeSingle();

  if (error) throw error;
  return data;
}

export async function upsertCachedSummary(
  placeId: string,
  summary: string,
  positiveRatio: number,
  reviewCount: number
): Promise<void> {
  if (!supabase) return;

  const { error } = await supabase.rpc("upsert_place_ai_summary", {
    target_place_id: placeId,
    new_summary: summary,
    new_positive_ratio: positiveRatio,
    new_review_count: reviewCount,
  });

  if (error) throw error;
}
