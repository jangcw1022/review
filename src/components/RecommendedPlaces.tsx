"use client";

import { useEffect, useState } from "react";
import PlaceCard from "./PlaceCard";
import SaveWithTagsModal from "./SaveWithTagsModal";
import StatusPanel from "./StatusPanel";
import { useSavedPlaces } from "@/hooks/useSavedPlaces";
import { fetchPlaces } from "@/lib/fetchPlaces";
import { broadCategory, FOOD_CATEGORY_GROUP_CODE, type KakaoPlace } from "@/lib/kakao";
import type { SavedPlaceRow } from "@/lib/savedPlaces";

const RECOMMEND_LIMIT = 6;

function findTopCategory(savedPlaces: SavedPlaceRow[]): string | null {
  const counts = new Map<string, number>();

  for (const place of savedPlaces) {
    const category = broadCategory(place.category_name);
    if (!category) continue;
    counts.set(category, (counts.get(category) ?? 0) + 1);
  }

  let best: string | null = null;
  let bestCount = 0;
  for (const [category, count] of counts) {
    if (count > bestCount) {
      best = category;
      bestCount = count;
    }
  }
  return best;
}

export default function RecommendedPlaces({ savedPlaces }: { savedPlaces: SavedPlaceRow[] }) {
  const { savedIds, toggleSave, pendingPlace, confirmSave, cancelSave } = useSavedPlaces();
  const [loaded, setLoaded] = useState<{ category: string; documents: KakaoPlace[] } | null>(null);
  const [error, setError] = useState<string | null>(null);

  const category = findTopCategory(savedPlaces);
  const places = loaded && loaded.category === category ? loaded.documents : null;
  const alreadySavedIds = new Set(savedPlaces.map((p) => p.place_id));

  useEffect(() => {
    if (!category) return;

    let cancelled = false;

    fetchPlaces(category, { endpoint: "keyword", categoryGroupCode: FOOD_CATEGORY_GROUP_CODE })
      .then((documents) => {
        if (cancelled) return;
        setError(null);
        setLoaded({ category, documents });
      })
      .catch((err: unknown) => {
        if (cancelled) return;
        setError(err instanceof Error ? err.message : "알 수 없는 오류가 발생했어요.");
      });

    return () => {
      cancelled = true;
    };
  }, [category]);

  const recommendations = (places ?? []).filter((place) => !alreadySavedIds.has(place.id)).slice(0, RECOMMEND_LIMIT);

  return (
    <section className="mt-16 tablet:mt-20">
      <div className="text-center mb-8 tablet:mb-10">
        <h2 className="text-xl tablet:text-2xl font-extrabold tracking-tight mb-2">나를 위한 추천</h2>
        <p className="text-ink/55 text-sm">
          {category ? `자주 담은 "${category}" 카테고리에서 골라봤어요` : "맛집을 담아보시면 취향에 맞는 추천을 보여드려요"}
        </p>
      </div>

      {!category && (
        <StatusPanel
          type="notice"
          icon="✨"
          title="아직 추천할 게 없어요"
          message="맛집을 몇 개 담아보시면 취향에 맞춰 추천해드릴게요."
        />
      )}

      {category && error && <StatusPanel type="error" message={`추천을 불러오지 못했어요. (${error})`} />}

      {category && !error && places === null && <StatusPanel type="loading" message="추천을 찾고 있어요…" />}

      {category && !error && places !== null && recommendations.length === 0 && (
        <StatusPanel
          type="notice"
          icon="🤔"
          title="추천할 새로운 곳을 못 찾았어요"
          message="이 카테고리는 대부분 이미 담아보신 것 같아요."
        />
      )}

      {category && !error && places !== null && recommendations.length > 0 && (
        <div className="grid grid-cols-1 tablet:grid-cols-2 desktop:grid-cols-3 gap-5 tablet:gap-6 desktop:gap-7">
          {recommendations.map((place) => (
            <PlaceCard
              key={place.id}
              place={place}
              saved={savedIds.has(place.id)}
              onToggleSave={() => toggleSave(place)}
            />
          ))}
        </div>
      )}

      {pendingPlace && (
        <SaveWithTagsModal place={pendingPlace} onConfirm={confirmSave} onCancel={cancelSave} />
      )}
    </section>
  );
}
