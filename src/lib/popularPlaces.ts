import { supabase } from "@/lib/supabase/client";
import type { KakaoPlace } from "@/lib/kakao";

export interface PopularPlaceRow {
  place_id: string;
  place_name: string;
  address: string | null;
  category_name: string | null;
  x: string | null;
  y: string | null;
  save_count: number;
}

export async function fetchPopularPlaces(limit = 5): Promise<PopularPlaceRow[]> {
  if (!supabase) return [];

  const { data, error } = await supabase.rpc("popular_places", { limit_count: limit });
  if (error) throw error;
  return data ?? [];
}

export function popularPlaceToKakaoPlace(row: PopularPlaceRow): KakaoPlace {
  return {
    id: row.place_id,
    place_name: row.place_name,
    category_name: row.category_name ?? "",
    road_address_name: row.address ?? "",
    address_name: row.address ?? "",
    phone: "",
    place_url: "",
    x: row.x ?? "",
    y: row.y ?? "",
  };
}
