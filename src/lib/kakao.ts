export interface KakaoPlace {
  place_name: string;
  category_name: string;
  road_address_name: string;
  address_name: string;
  phone: string;
  place_url: string;
}

export const FOOD_CATEGORY_GROUP_CODE = "FD6";

export const CATEGORIES = ["한식", "중식", "일식", "양식", "카페", "술집", "분식", "디저트"];

export function shortCategory(categoryName: string | undefined): string {
  if (!categoryName) return "";
  const parts = categoryName
    .split(">")
    .map((s) => s.trim())
    .filter(Boolean);
  return parts[parts.length - 1] || categoryName;
}

export function categoryEmoji(categoryName: string | undefined): string {
  const name = categoryName || "";
  if (name.includes("한식")) return "🍚";
  if (name.includes("중식")) return "🥡";
  if (name.includes("일식") || name.includes("돈까스") || name.includes("초밥")) return "🍣";
  if (name.includes("양식")) return "🍝";
  if (name.includes("카페") || name.includes("디저트") || name.includes("베이커리")) return "☕";
  if (name.includes("술") || name.includes("호프") || name.includes("포차")) return "🍶";
  if (name.includes("분식")) return "🍢";
  if (name.includes("고기") || name.includes("육류")) return "🥩";
  return "🍽️";
}
