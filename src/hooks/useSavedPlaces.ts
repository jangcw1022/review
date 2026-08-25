"use client";

import { useCallback, useEffect, useState } from "react";
import { useAuth } from "@/components/AuthProvider";
import { supabase } from "@/lib/supabase/client";
import type { KakaoPlace } from "@/lib/kakao";

const EMPTY_SET: Set<string> = new Set();

export function useSavedPlaces() {
  const { user, configured, openAuthModal } = useAuth();
  const [loaded, setLoaded] = useState<{ userId: string; ids: Set<string> } | null>(null);
  const [pendingPlace, setPendingPlace] = useState<KakaoPlace | null>(null);

  const savedIds = loaded && user && loaded.userId === user.id ? loaded.ids : EMPTY_SET;

  useEffect(() => {
    if (!configured || !supabase || !user) return;

    let cancelled = false;

    supabase
      .from("saved_places")
      .select("place_id")
      .then(({ data }) => {
        if (cancelled || !data) return;
        setLoaded({ userId: user.id, ids: new Set(data.map((row) => row.place_id as string)) });
      });

    return () => {
      cancelled = true;
    };
  }, [configured, user]);

  // 담김 상태(이미 저장됨)면 바로 취소(삭제)하고, 아직 안 담겼으면 태그를 고를 수
  // 있도록 모달을 띄운다 — 실제 insert는 confirmSave에서 일어난다.
  const toggleSave = useCallback(
    async (place: KakaoPlace) => {
      if (!configured || !supabase) {
        window.alert("로그인 기능이 아직 설정되지 않았어요.");
        return;
      }

      if (!user) {
        window.alert("로그인이 필요한 기능이에요. 로그인 후 다시 시도해주세요.");
        openAuthModal();
        return;
      }

      if (!savedIds.has(place.id)) {
        setPendingPlace(place);
        return;
      }

      const { error } = await supabase
        .from("saved_places")
        .delete()
        .eq("user_id", user.id)
        .eq("place_id", place.id);

      if (error) {
        window.alert(`담기 취소 중 문제가 발생했어요. (${error.message})`);
        return;
      }

      setLoaded((prev) => {
        const next = new Set(prev && prev.userId === user.id ? prev.ids : []);
        next.delete(place.id);
        return { userId: user.id, ids: next };
      });
    },
    [configured, user, savedIds, openAuthModal]
  );

  const confirmSave = useCallback(
    async (tags: string[]) => {
      if (!supabase || !user || !pendingPlace) return;
      const place = pendingPlace;

      // user_id는 클라이언트에서 넣지 않는다 — DB 컬럼 기본값(auth.uid())이 자동으로 채운다.
      // (로그인한 사용자 id는 참고용으로만 로그를 찍는다. insert 페이로드에는 넣지 않음.)
      console.log("[saved_places] insert as user.id =", user.id, "(payload에는 user_id를 포함하지 않음)");

      const { error } = await supabase.from("saved_places").insert({
        place_id: place.id,
        place_name: place.place_name,
        address: place.road_address_name || place.address_name || "",
        category_name: place.category_name,
        x: place.x,
        y: place.y,
        tags,
      });

      if (error) {
        console.error("[saved_places] insert failed:", error);
        window.alert(`담기 중 문제가 발생했어요. (${error.message})`);
        return;
      }

      setLoaded((prev) => {
        const next = new Set(prev && prev.userId === user.id ? prev.ids : []);
        next.add(place.id);
        return { userId: user.id, ids: next };
      });
      setPendingPlace(null);
    },
    [user, pendingPlace]
  );

  const cancelSave = useCallback(() => setPendingPlace(null), []);

  return { savedIds, toggleSave, pendingPlace, confirmSave, cancelSave };
}
