"use client";

import { useEffect, useState } from "react";
import { useAuth } from "./AuthProvider";
import StatusPanel from "./StatusPanel";
import { CATEGORIES, categoryEmoji, shortCategory } from "@/lib/kakao";
import { primaryButtonClass } from "@/lib/styles";
import { TAGS } from "@/lib/tags";
import { fetchTodayCandidates, type TodayPickerFilter } from "@/lib/todayPicker";
import type { SavedPlaceRow, SavedPlaceStatus } from "@/lib/savedPlaces";

const STATUS_OPTIONS: { value: "all" | SavedPlaceStatus; label: string }[] = [
  { value: "all", label: "둘 다" },
  { value: "to_visit", label: "가볼 곳" },
  { value: "visited", label: "가본 곳" },
];

const activeChipClass =
  "shrink-0 text-xs tablet:text-sm font-semibold px-4 py-2 rounded-full transition-colors bg-primary text-white shadow-soft";
const inactiveChipClass =
  "shrink-0 text-xs tablet:text-sm font-semibold px-4 py-2 rounded-full transition-colors bg-white ring-1 ring-black/10 text-ink/60 hover:bg-black/5";

type ViewState = { step: "list" } | { step: "picked"; place: SavedPlaceRow };

export default function TodayPickerModal({ onClose }: { onClose: () => void }) {
  const { user, configured, loading: authLoading, openAuthModal } = useAuth();
  const [filter, setFilter] = useState<TodayPickerFilter>({ categories: [], tags: [], status: "all" });
  const [candidates, setCandidates] = useState<SavedPlaceRow[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [view, setView] = useState<ViewState>({ step: "list" });

  useEffect(() => {
    if (!configured || !user) return;

    let cancelled = false;

    fetchTodayCandidates(user.id, filter)
      .then((rows) => {
        if (cancelled) return;
        setError(null);
        setCandidates(rows);
      })
      .catch((err: unknown) => {
        if (cancelled) return;
        setError(err instanceof Error ? err.message : "알 수 없는 오류가 발생했어요.");
      });

    return () => {
      cancelled = true;
    };
  }, [configured, user, filter]);

  function toggleCategory(category: string) {
    setView({ step: "list" });
    setFilter((prev) => ({
      ...prev,
      categories: prev.categories.includes(category)
        ? prev.categories.filter((c) => c !== category)
        : [...prev.categories, category],
    }));
  }

  function selectAllCategories() {
    setView({ step: "list" });
    setFilter((prev) => ({ ...prev, categories: [] }));
  }

  function toggleTag(tag: string) {
    setView({ step: "list" });
    setFilter((prev) => ({
      ...prev,
      tags: prev.tags.includes(tag) ? prev.tags.filter((t) => t !== tag) : [...prev.tags, tag],
    }));
  }

  function selectAllTags() {
    setView({ step: "list" });
    setFilter((prev) => ({ ...prev, tags: [] }));
  }

  function setStatus(status: TodayPickerFilter["status"]) {
    setView({ step: "list" });
    setFilter((prev) => ({ ...prev, status }));
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-5"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md bg-white rounded-xl2 shadow-soft-lg p-7 max-h-[85vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-bold">오늘 뭐 먹지 🍽️</h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="닫기"
            className="text-ink/40 hover:text-ink/70 text-xl leading-none"
          >
            ×
          </button>
        </div>

        {!configured && <StatusPanel type="notice" message="이 기능은 아직 설정되지 않았어요." />}

        {configured && authLoading && <StatusPanel type="loading" message="불러오는 중이에요…" />}

        {configured && !authLoading && !user && (
          <StatusPanel
            type="notice"
            icon="🔒"
            title="로그인이 필요해요"
            message="로그인하면 담아둔 맛집 중에서 골라드려요."
            action={
              <button type="button" onClick={openAuthModal} className={primaryButtonClass}>
                로그인
              </button>
            }
          />
        )}

        {configured && !authLoading && user && view.step === "picked" && (
          <div className="text-center py-6">
            <p className="text-sm text-ink/50 mb-3">오늘은 여기 어때요? 🎉</p>
            <div className="w-16 h-16 mx-auto rounded-full bg-primary/10 flex items-center justify-center text-3xl mb-4">
              {categoryEmoji(view.place.category_name ?? undefined)}
            </div>
            <h3 className="text-xl font-bold mb-1.5">{view.place.place_name}</h3>
            <p className="text-sm text-ink/55 mb-1">📍 {view.place.address || "주소 정보 없음"}</p>
            {view.place.category_name && (
              <p className="text-xs text-primary font-semibold mb-6">{shortCategory(view.place.category_name)}</p>
            )}
            <div className="flex items-center gap-2 justify-center">
              <button
                type="button"
                onClick={() => setView({ step: "list" })}
                className="text-sm font-semibold px-5 py-2.5 rounded-full bg-black/5 text-ink/60 hover:bg-black/10 transition-all"
              >
                다시 고르기
              </button>
              <button type="button" onClick={onClose} className={primaryButtonClass}>
                닫기
              </button>
            </div>
          </div>
        )}

        {configured && !authLoading && user && view.step === "list" && (
          <>
            <div className="mb-5">
              <h3 className="text-xs font-semibold text-ink/45 mb-2.5">카테고리</h3>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={selectAllCategories}
                  className={filter.categories.length === 0 ? activeChipClass : inactiveChipClass}
                >
                  전체
                </button>
                {CATEGORIES.map((category) => (
                  <button
                    key={category}
                    type="button"
                    onClick={() => toggleCategory(category)}
                    className={filter.categories.includes(category) ? activeChipClass : inactiveChipClass}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>

            <div className="mb-5">
              <h3 className="text-xs font-semibold text-ink/45 mb-2.5">태그</h3>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={selectAllTags}
                  className={filter.tags.length === 0 ? activeChipClass : inactiveChipClass}
                >
                  전체
                </button>
                {TAGS.map((tag) => (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => toggleTag(tag)}
                    className={filter.tags.includes(tag) ? activeChipClass : inactiveChipClass}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>

            <div className="mb-5">
              <h3 className="text-xs font-semibold text-ink/45 mb-2.5">가볼 곳 / 가본 곳</h3>
              <div className="flex flex-wrap gap-2">
                {STATUS_OPTIONS.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => setStatus(option.value)}
                    className={filter.status === option.value ? activeChipClass : inactiveChipClass}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>

            {error && <StatusPanel type="error" message={`후보를 불러오지 못했어요. (${error})`} />}

            {!error && candidates === null && <StatusPanel type="loading" message="후보를 찾고 있어요…" />}

            {!error && candidates !== null && candidates.length === 0 && (
              <StatusPanel
                type="empty"
                icon="🤷"
                title="조건에 맞는 곳이 없어요"
                message="다른 카테고리나 태그를 선택해보세요."
              />
            )}

            {!error && candidates !== null && candidates.length > 0 && (
              <ul className="space-y-2">
                {candidates.map((place) => (
                  <li key={place.id}>
                    <button
                      type="button"
                      onClick={() => setView({ step: "picked", place })}
                      className="w-full flex items-center gap-3 text-left bg-cream hover:bg-primary/10 rounded-xl px-4 py-3 transition-colors"
                    >
                      <span className="text-2xl shrink-0">{categoryEmoji(place.category_name ?? undefined)}</span>
                      <span className="min-w-0 flex-1">
                        <span className="block font-semibold text-sm truncate">{place.place_name}</span>
                        <span className="block text-xs text-ink/50 truncate">{place.address || "주소 정보 없음"}</span>
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </>
        )}
      </div>
    </div>
  );
}
