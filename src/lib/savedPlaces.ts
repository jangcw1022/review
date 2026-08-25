import { supabase } from "@/lib/supabase/client";

export interface SavedPlaceRow {
  id: string;
  place_id: string;
  place_name: string;
  address: string | null;
  category_name: string | null;
  created_at: string;
}

export async function fetchSavedPlaces(userId: string): Promise<SavedPlaceRow[]> {
  if (!supabase) return [];

  const { data, error } = await supabase
    .from("saved_places")
    .select("id, place_id, place_name, address, category_name, created_at")
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
