"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { useAuth } from "@/components/AuthProvider";
import RecommendedPlaces from "@/components/RecommendedPlaces";
import SavedPlaceCard from "@/components/SavedPlaceCard";
import StatusPanel from "@/components/StatusPanel";
import { deleteSavedPlace, fetchSavedPlaces, type SavedPlaceRow } from "@/lib/savedPlaces";
import { primaryButtonClass } from "@/lib/styles";

export default function MypageClient() {
  const { user, configured, loading: authLoading, openAuthModal } = useAuth();
  const [loaded, setLoaded] = useState<{ userId: string; rows: SavedPlaceRow[] } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [reloadToken, setReloadToken] = useState(0);

  const places = loaded && user && loaded.userId === user.id ? loaded.rows : null;

  const reload = useCallback(() => setReloadToken((n) => n + 1), []);

  useEffect(() => {
    if (!configured || !user) return;

    let cancelled = false;

    fetchSavedPlaces(user.id)
      .then((rows) => {
        if (cancelled) return;
        setError(null);
        setLoaded({ userId: user.id, rows });
      })
      .catch((err: unknown) => {
        if (cancelled) return;
        setError(err instanceof Error ? err.message : "알 수 없는 오류가 발생했어요.");
      });

    return () => {
      cancelled = true;
    };
  }, [configured, user, reloadToken]);

  async function handleDelete(row: SavedPlaceRow) {
    if (!user) return;
    try {
      await deleteSavedPlace(user.id, row.id);
      setLoaded((prev) =>
        prev && prev.userId === user.id ? { userId: user.id, rows: prev.rows.filter((p) => p.id !== row.id) } : prev
      );
    } catch (err) {
      window.alert(`삭제 중 문제가 발생했어요. (${err instanceof Error ? err.message : "알 수 없는 오류"})`);
    }
  }

  const heading = (
    <div className="text-center mb-8 tablet:mb-10">
      <h1 className="text-2xl tablet:text-4xl font-extrabold tracking-tight mb-3">마이페이지</h1>
      <p className="text-ink/55 text-sm tablet:text-base">내가 담은 맛집을 모아봤어요</p>
    </div>
  );

  if (!configured) {
    return (
      <section className="px-5 py-8 tablet:px-6 tablet:py-10 desktop:py-12 max-w-6xl desktop:max-w-7xl mx-auto">
        {heading}
        <StatusPanel type="notice" message="로그인 기능이 아직 설정되지 않았어요." />
      </section>
    );
  }

  if (authLoading) {
    return (
      <section className="px-5 py-8 tablet:px-6 tablet:py-10 desktop:py-12 max-w-6xl desktop:max-w-7xl mx-auto">
        {heading}
        <StatusPanel type="loading" message="불러오는 중이에요…" />
      </section>
    );
  }

  if (!user) {
    return (
      <section className="px-5 py-8 tablet:px-6 tablet:py-10 desktop:py-12 max-w-6xl desktop:max-w-7xl mx-auto">
        {heading}
        <StatusPanel
          type="notice"
          icon="🔒"
          title="로그인이 필요해요"
          message="로그인하면 담아둔 맛집을 볼 수 있어요."
          action={
            <button type="button" onClick={openAuthModal} className={primaryButtonClass}>
              로그인
            </button>
          }
        />
      </section>
    );
  }

  if (error) {
    return (
      <section className="px-5 py-8 tablet:px-6 tablet:py-10 desktop:py-12 max-w-6xl desktop:max-w-7xl mx-auto">
        {heading}
        <StatusPanel type="error" message={`목록을 불러오지 못했어요. (${error})`} onRetry={reload} />
      </section>
    );
  }

  if (places === null) {
    return (
      <section className="px-5 py-8 tablet:px-6 tablet:py-10 desktop:py-12 max-w-6xl desktop:max-w-7xl mx-auto">
        {heading}
        <StatusPanel type="loading" message="불러오는 중이에요…" />
      </section>
    );
  }

  return (
    <section className="px-5 py-8 tablet:px-6 tablet:py-10 desktop:py-12 max-w-6xl desktop:max-w-7xl mx-auto">
      {heading}

      {places.length === 0 ? (
        <StatusPanel
          type="empty"
          icon="🍽️"
          title="아직 담은 맛집이 없어요"
          message="마음에 드는 곳을 검색해서 담아보세요."
          action={
            <Link href="/search" className={primaryButtonClass}>
              검색하러 가기
            </Link>
          }
        />
      ) : (
        <div className="grid grid-cols-1 tablet:grid-cols-2 desktop:grid-cols-3 gap-5 tablet:gap-6 desktop:gap-7">
          {places.map((place) => (
            <SavedPlaceCard key={place.id} place={place} onDelete={() => handleDelete(place)} />
          ))}
        </div>
      )}

      <RecommendedPlaces savedPlaces={places} />
    </section>
  );
}
