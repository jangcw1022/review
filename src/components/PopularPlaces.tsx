"use client";

import { useEffect, useState } from "react";
import PlaceCard from "./PlaceCard";
import SaveWithTagsModal from "./SaveWithTagsModal";
import StatusPanel from "./StatusPanel";
import { useSavedPlaces } from "@/hooks/useSavedPlaces";
import { fetchPopularPlaces, popularPlaceToKakaoPlace, type PopularPlaceRow } from "@/lib/popularPlaces";
import { isSupabaseConfigured } from "@/lib/supabase/client";

export default function PopularPlaces() {
  const { savedIds, toggleSave, pendingPlace, confirmSave, cancelSave } = useSavedPlaces();
  const [rows, setRows] = useState<PopularPlaceRow[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isSupabaseConfigured) return;

    let cancelled = false;

    fetchPopularPlaces(5)
      .then((data) => {
        if (cancelled) return;
        setError(null);
        setRows(data);
      })
      .catch((err: unknown) => {
        if (cancelled) return;
        setError(err instanceof Error ? err.message : "알 수 없는 오류가 발생했어요.");
      });

    return () => {
      cancelled = true;
    };
  }, []);

  if (!isSupabaseConfigured) {
    return <StatusPanel type="notice" message="랭킹 기능이 아직 설정되지 않았어요." />;
  }

  if (error) {
    return <StatusPanel type="error" message={`랭킹을 불러오지 못했어요. (${error})`} />;
  }

  if (rows === null) {
    return <StatusPanel type="loading" message="랭킹을 불러오는 중이에요…" />;
  }

  if (rows.length === 0) {
    return (
      <StatusPanel
        type="notice"
        icon="🏆"
        title="아직 담긴 맛집이 없어요"
        message="가장 먼저 맛집을 담아 랭킹에 이름을 올려보세요."
      />
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 tablet:grid-cols-2 desktop:grid-cols-3 gap-6 tablet:gap-7">
        {rows.map((row, i) => {
          const place = popularPlaceToKakaoPlace(row);
          return (
            <PlaceCard
              key={row.place_id}
              place={place}
              saved={savedIds.has(place.id)}
              onToggleSave={() => toggleSave(place)}
              rank={i + 1}
              saveCount={row.save_count}
            />
          );
        })}
      </div>

      {pendingPlace && (
        <SaveWithTagsModal place={pendingPlace} onConfirm={confirmSave} onCancel={cancelSave} />
      )}
    </>
  );
}
