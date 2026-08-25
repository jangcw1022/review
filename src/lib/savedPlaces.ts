import { supabase } from "@/lib/supabase/client";

export type SavedPlaceStatus = "to_visit" | "visited";

export interface SavedPlaceRow {
  id: string;
  place_id: string;
  place_name: string;
  address: string | null;
  category_name: string | null;
  created_at: string;
  status: SavedPlaceStatus;
  tags: string[];
  revisit_intent: boolean | null;
  memo: string | null;
}

export interface VisitUpdate {
  status: SavedPlaceStatus;
  tags: string[];
  revisit_intent: boolean | null;
  memo: string | null;
}

export async function fetchSavedPlaces(userId: string): Promise<SavedPlaceRow[]> {
  if (!supabase) return [];

  const { data, error } = await supabase
    .from("saved_places")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data ?? [];
}

export async function deleteSavedPlace(userId: string, id: string): Promise<void> {
  if (!supabase) return;

  const { error } = await supabase.from("saved_places").delete().eq("user_id", userId).eq("id", id);

  if (error) throw error;
}

export async function updateSavedPlaceVisit(userId: string, id: string, update: VisitUpdate): Promise<void> {
  if (!supabase) return;

  const { error } = await supabase.from("saved_places").update(update).eq("user_id", userId).eq("id", id);

  if (error) throw error;
}
