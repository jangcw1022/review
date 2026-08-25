import { useState } from "react";
import type { KakaoPlace } from "@/lib/kakao";
import { categoryEmoji, shortCategory } from "@/lib/kakao";
import PlaceDetailModal from "./PlaceDetailModal";

export default function PlaceCard({
  place,
  saved,
  onToggleSave,
  rank,
  saveCount,
}: {
  place: KakaoPlace;
  saved: boolean;
  onToggleSave: () => void;
  rank?: number;
  saveCount?: number;
}) {
  const [showDetail, setShowDetail] = useState(false);

  const name = place.place_name || "이름 없음";
  const category = shortCategory(place.category_name);
  const emoji = categoryEmoji(place.category_name);
  const address = place.road_address_name || place.address_name || "주소 정보 없음";
  const phone = place.phone;
  const placeUrl = place.place_url;

  return (
    <article className="group bg-white rounded-xl2 shadow-soft ring-1 ring-black/5 overflow-hidden hover:shadow-soft-lg hover:-translate-y-1 transition-all duration-300">
      <button
        type="button"
        onClick={() => setShowDetail(true)}
        className="block w-full text-left"
      >
        <div className="relative h-32 tablet:h-36 bg-gradient-to-br from-primary/25 via-primary/10 to-cream flex items-center justify-center text-4xl">
          {emoji}
          {rank !== undefined && (
            <span className="absolute top-3 left-3 text-xs font-bold text-white bg-primary px-2.5 py-1 rounded-full shadow-soft">
              {rank}위
            </span>
          )}
          {category && (
            <span className="absolute top-3 right-3 text-xs font-semibold text-primary bg-white/90 px-2.5 py-1 rounded-full shadow-soft">
              {category}
            </span>
          )}
        </div>
        <div className="px-6 pt-6">
          <h3 className="text-lg font-bold mb-1.5">{name}</h3>
        </div>
      </button>
      <div className="px-6 pb-6">
        <p className="text-sm text-ink/55 mb-1 leading-relaxed">📍 {address}</p>
        {phone ? (
          <p className={`text-sm text-ink/55 leading-relaxed ${saveCount !== undefined ? "mb-1" : "mb-4"}`}>
            📞 {phone}
          </p>
        ) : (
          <div className={saveCount !== undefined ? "mb-1" : "mb-4"} />
        )}
        {saveCount !== undefined && (
          <p className="text-xs text-primary/80 font-medium mb-4">{saveCount}명이 담았어요</p>
        )}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onToggleSave}
            className={
              saved
                ? "flex-1 text-sm font-semibold px-4 py-2 rounded-full bg-primary/10 text-primary ring-1 ring-primary/30 transition-all"
                : "flex-1 text-sm font-semibold px-4 py-2 rounded-full bg-primary text-white hover:bg-primary/90 active:scale-95 transition-all"
            }
          >
            {saved ? "담김" : "가볼 곳 담기"}
          </button>
          {placeUrl && (
            <a
              href={placeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="shrink-0 text-xs text-ink/50 hover:text-primary transition-colors px-1"
            >
              카카오맵 →
            </a>
          )}
        </div>
      </div>

      <PlaceDetailModal
        open={showDetail}
        placeId={place.id}
        placeName={name}
        address={address}
        categoryName={place.category_name}
        onClose={() => setShowDetail(false)}
      />
    </article>
  );
}
