"use client";

import { useCallback, useEffect, useState } from "react";
import { useAuth } from "@/components/AuthProvider";
import { supabase } from "@/lib/supabase/client";
import type { KakaoPlace } from "@/lib/kakao";

const EMPTY_SET: Set<string> = new Set();

export function useSavedPlaces() {
  const { user, configured, openAuthModal } = useAuth();
  const [loaded, setLoaded] = useState<{ userId: string; ids: Set<string> } | null>(null);

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

      const alreadySaved = savedIds.has(place.id);

      if (alreadySaved) {
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
        return;
      }

      // user_id는 클라이언트에서 넣지 않는다 — DB 컬럼 기본값(auth.uid())이 자동으로 채운다.
      const { error } = await supabase.from("saved_places").insert({
        place_id: place.id,
        place_name: place.place_name,
        address: place.road_address_name || place.address_name || "",
        category_name: place.category_name,
        x: place.x,
        y: place.y,
      });

      if (error) {
        window.alert(`담기 중 문제가 발생했어요. (${error.message})`);
        return;
      }

      setLoaded((prev) => {
        const next = new Set(prev && prev.userId === user.id ? prev.ids : []);
        next.add(place.id);
        return { userId: user.id, ids: next };
      });
    },
    [configured, user, savedIds, openAuthModal]
  );

  return { savedIds, toggleSave };
}
