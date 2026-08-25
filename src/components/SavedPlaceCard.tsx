import { categoryEmoji, shortCategory } from "@/lib/kakao";
import type { SavedPlaceRow } from "@/lib/savedPlaces";

function formatSavedDate(iso: string): string {
  const date = new Date(iso);
  return date.toLocaleDateString("ko-KR", { year: "numeric", month: "2-digit", day: "2-digit" });
}

export default function SavedPlaceCard({
  place,
  onDelete,
}: {
  place: SavedPlaceRow;
  onDelete: () => void;
}) {
  const category = shortCategory(place.category_name ?? undefined);
  const emoji = categoryEmoji(place.category_name ?? undefined);

  return (
    <article className="group bg-white rounded-xl2 shadow-soft ring-1 ring-black/5 overflow-hidden hover:shadow-soft-lg hover:-translate-y-1 transition-all duration-300">
      <div className="relative h-32 tablet:h-36 bg-gradient-to-br from-primary/25 via-primary/10 to-cream flex items-center justify-center text-4xl">
        {emoji}
        {category && (
          <span className="absolute top-3 right-3 text-xs font-semibold text-primary bg-white/90 px-2.5 py-1 rounded-full shadow-soft">
            {category}
          </span>
        )}
      </div>
      <div className="p-6">
        <h3 className="text-lg font-bold mb-1.5">{place.place_name}</h3>
        <p className="text-sm text-ink/55 mb-1 leading-relaxed">📍 {place.address || "주소 정보 없음"}</p>
        <p className="text-xs text-ink/40 mb-4">{formatSavedDate(place.created_at)}에 담음</p>
        <button
          type="button"
          onClick={onDelete}
          className="w-full text-sm font-semibold px-4 py-2 rounded-full bg-black/5 text-ink/60 hover:bg-red-50 hover:text-red-500 transition-all"
        >
          담기 취소
        </button>
      </div>
    </article>
  );
}
