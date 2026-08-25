"use client";

import { useState } from "react";
import { categoryEmoji, shortCategory } from "@/lib/kakao";
import type { SavedPlaceRow } from "@/lib/savedPlaces";
import PlaceDetailModal from "./PlaceDetailModal";

function formatSavedDate(iso: string): string {
  const date = new Date(iso);
  return date.toLocaleDateString("ko-KR", { year: "numeric", month: "2-digit", day: "2-digit" });
}

export default function SavedPlaceCard({
  place,
  onDelete,
  onEditVisit,
}: {
  place: SavedPlaceRow;
  onDelete: () => void;
  onEditVisit: () => void;
}) {
  const [showDetail, setShowDetail] = useState(false);

  const category = shortCategory(place.category_name ?? undefined);
  const emoji = categoryEmoji(place.category_name ?? undefined);
  const visited = place.status === "visited";

  return (
    <article className="group bg-white rounded-xl2 shadow-soft ring-1 ring-black/5 overflow-hidden hover:shadow-soft-lg hover:-translate-y-1 transition-all duration-300">
      <button
        type="button"
        onClick={() => setShowDetail(true)}
        className="block w-full text-left"
      >
        <div className="relative h-32 tablet:h-36 bg-gradient-to-br from-primary/25 via-primary/10 to-cream flex items-center justify-center text-4xl">
          {emoji}
          <span
            className={
              visited
                ? "absolute top-3 left-3 text-xs font-semibold text-white bg-primary px-2.5 py-1 rounded-full shadow-soft"
                : "absolute top-3 left-3 text-xs font-semibold text-ink/60 bg-white/90 px-2.5 py-1 rounded-full shadow-soft"
            }
          >
            {visited ? "✅ 가본 곳" : "🔖 가볼 곳"}
          </span>
          {category && (
            <span className="absolute top-3 right-3 text-xs font-semibold text-primary bg-white/90 px-2.5 py-1 rounded-full shadow-soft">
              {category}
            </span>
          )}
        </div>
        <div className="px-6 pt-6">
          <h3 className="text-lg font-bold mb-1.5">{place.place_name}</h3>
        </div>
      </button>

      <div className="px-6 pb-6">
        <p className="text-sm text-ink/55 mb-1 leading-relaxed">📍 {place.address || "주소 정보 없음"}</p>
        <p className="text-xs text-ink/40 mb-2">{formatSavedDate(place.created_at)}에 담음</p>

        {(place.tags ?? []).length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-2">
            {place.tags.map((tag) => (
              <span key={tag} className="text-xs text-ink/50 bg-black/5 px-2.5 py-1 rounded-full">
                {tag}
              </span>
            ))}
          </div>
        )}

        {visited && place.memo && (
          <p className="text-sm text-ink/65 leading-relaxed mb-2">&quot;{place.memo}&quot;</p>
        )}

        {visited && place.revisit_intent !== null && (
          <p className="text-xs text-ink/40 mb-2">{place.revisit_intent ? "🔁 재방문 의사 있음" : "재방문 의사 없음"}</p>
        )}

        <div className="mb-2" />

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onEditVisit}
            className="flex-1 text-sm font-semibold px-4 py-2 rounded-full bg-primary text-white hover:bg-primary/90 active:scale-95 transition-all"
          >
            {visited ? "방문 정보 수정" : "가본 곳으로 전환"}
          </button>
          <button
            type="button"
            onClick={onDelete}
            className="shrink-0 text-sm font-semibold px-4 py-2 rounded-full bg-black/5 text-ink/60 hover:bg-red-50 hover:text-red-500 transition-all"
          >
            담기 취소
          </button>
        </div>
      </div>

      {showDetail && (
        <PlaceDetailModal
          placeId={place.place_id}
          placeName={place.place_name}
          address={place.address ?? ""}
          categoryName={place.category_name ?? undefined}
          onClose={() => setShowDetail(false)}
        />
      )}
    </article>
  );
}
