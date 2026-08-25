import type { KakaoPlace } from "@/lib/kakao";

export class SearchApiError extends Error {}

export async function fetchPlaces(
  query: string,
  options: { endpoint?: "keyword" | "category"; categoryGroupCode?: string } = {}
): Promise<KakaoPlace[]> {
  const url = new URL("/api/search", window.location.origin);
  url.searchParams.set("query", query);
  if (options.endpoint) url.searchParams.set("endpoint", options.endpoint);
  if (options.categoryGroupCode) url.searchParams.set("categoryGroupCode", options.categoryGroupCode);

  const response = await fetch(url.toString());
  const data = await response.json();

  if (!response.ok) {
    throw new SearchApiError(data.message || `HTTP ${response.status}`);
  }

  return data.documents ?? [];
}
