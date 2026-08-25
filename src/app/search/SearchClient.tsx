"use client";

import { useEffect, useState } from "react";
import PlaceCard from "@/components/PlaceCard";
import StatusPanel, { type StatusType } from "@/components/StatusPanel";
import { fetchPlaces } from "@/lib/fetchPlaces";
import { CATEGORIES, FOOD_CATEGORY_GROUP_CODE, type KakaoPlace } from "@/lib/kakao";
import { useSavedPlaces } from "@/hooks/useSavedPlaces";

type Status = { type: StatusType; message: string };

const NO_API_KEY_STATUS: Status = {
  type: "notice",
  message: "카카오 REST API 키가 설정되지 않았어요. 페이지 상단 안내를 참고해 키를 설정해주세요.",
};

function toErrorStatus(err: unknown): Status {
  return {
    type: "error",
    message:
      err instanceof Error
        ? `검색 중 문제가 발생했어요. (${err.message})`
        : "검색 중 알 수 없는 문제가 발생했어요. 잠시 후 다시 시도해주세요.",
  };
}

export default function SearchClient({
  hasApiKey,
  initialKeyword,
}: {
  hasApiKey: boolean;
  initialKeyword?: string;
}) {
  const [keyword, setKeyword] = useState(initialKeyword ?? "");
  const [activeCategory, setActiveCategory] = useState("");
  const [results, setResults] = useState<KakaoPlace[]>([]);
  const { savedIds, toggleSave } = useSavedPlaces();
  const [status, setStatus] = useState<Status | null>(() => {
    if (!initialKeyword) return null;
    return hasApiKey ? { type: "loading", message: "검색 중이에요…" } : NO_API_KEY_STATUS;
  });

  useEffect(() => {
    if (!initialKeyword || !hasApiKey) return;

    fetchPlaces(initialKeyword, { endpoint: "keyword", categoryGroupCode: FOOD_CATEGORY_GROUP_CODE })
      .then((documents) => {
        if (documents.length === 0) {
          setStatus({ type: "empty", message: "검색 결과가 없어요. 다른 키워드나 카테고리로 시도해보세요." });
          return;
        }
        setStatus(null);
        setResults(documents);
      })
      .catch((err) => setStatus(toErrorStatus(err)));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function runSearch(searchKeyword: string, category: string) {
    if (!searchKeyword && !category) {
      setStatus({ type: "notice", message: "검색어를 입력하거나 카테고리를 선택해주세요." });
      return;
    }

    if (!hasApiKey) {
      setStatus(NO_API_KEY_STATUS);
      return;
    }

    setStatus({ type: "loading", message: "검색 중이에요…" });
    setResults([]);

    try {
      const useKeywordSearch = searchKeyword.length > 0;
      const query = useKeywordSearch
        ? category
          ? `${category} ${searchKeyword}`
          : searchKeyword
        : category;

      const documents = await fetchPlaces(query, {
        endpoint: useKeywordSearch ? "keyword" : "category",
        categoryGroupCode: FOOD_CATEGORY_GROUP_CODE,
      });

      if (documents.length === 0) {
        setStatus({ type: "empty", message: "검색 결과가 없어요. 다른 키워드나 카테고리로 시도해보세요." });
        return;
      }

      setStatus(null);
      setResults(documents);
    } catch (err) {
      setStatus(toErrorStatus(err));
    }
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    runSearch(keyword.trim(), activeCategory);
  }

  function handleCategoryClick(category: string) {
    setActiveCategory(category);
    runSearch(keyword.trim(), category);
  }

  return (
    <section className="px-5 py-8 tablet:px-6 tablet:py-10 desktop:py-12 max-w-6xl desktop:max-w-7xl mx-auto">
      <div className="text-center mb-8 tablet:mb-10">
        <h1 className="text-2xl tablet:text-4xl font-extrabold tracking-tight mb-3">맛집 검색</h1>
        <p className="text-ink/55 text-sm tablet:text-base">카카오맵 데이터로 가고 싶은 맛집을 찾아보세요</p>
      </div>

      <form onSubmit={handleSubmit} className="max-w-2xl mx-auto mb-6">
        <div className="sticky top-0 z-10 -mx-5 tablet:mx-0 px-5 tablet:px-0 py-3 tablet:py-0 mb-4 bg-cream/90 backdrop-blur tablet:bg-transparent tablet:backdrop-blur-none">
          <div className="flex items-center gap-2 bg-white rounded-full shadow-soft ring-1 ring-black/5 p-2 focus-within:ring-2 focus-within:ring-primary/40 transition-shadow">
            <input
              type="text"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              placeholder="예: 연남동 소금구이, 성수동 카페"
              className="flex-1 min-w-0 bg-transparent outline-none px-4 py-2.5 text-sm tablet:text-base placeholder:text-ink/40"
            />
            <button
              type="submit"
              className="shrink-0 bg-primary text-white font-semibold text-sm tablet:text-base px-5 tablet:px-7 py-2.5 rounded-full hover:bg-primary/90 active:scale-95 transition-all"
            >
              검색
            </button>
          </div>
        </div>

        <div className="flex items-center gap-2 overflow-x-auto snap-x snap-mandatory pb-1 -mx-5 px-5 tablet:mx-0 tablet:px-0 tablet:pb-0 tablet:flex-wrap tablet:justify-center tablet:overflow-visible">
          <button
            type="button"
            onClick={() => handleCategoryClick("")}
            className={
              activeCategory === ""
                ? "shrink-0 snap-start text-xs tablet:text-sm font-semibold px-4 py-2 rounded-full transition-colors bg-primary text-white shadow-soft"
                : "shrink-0 snap-start text-xs tablet:text-sm font-semibold px-4 py-2 rounded-full transition-colors bg-white ring-1 ring-black/10 text-ink/60 hover:bg-black/5"
            }
          >
            전체
          </button>
          {CATEGORIES.map((category) => (
            <button
              key={category}
              type="button"
              onClick={() => handleCategoryClick(category)}
              className={
                activeCategory === category
                  ? "shrink-0 snap-start text-xs tablet:text-sm font-semibold px-4 py-2 rounded-full transition-colors bg-primary text-white shadow-soft"
                  : "shrink-0 snap-start text-xs tablet:text-sm font-semibold px-4 py-2 rounded-full transition-colors bg-white ring-1 ring-black/10 text-ink/60 hover:bg-black/5"
              }
            >
              {category}
            </button>
          ))}
        </div>
      </form>

      {status && (
        <StatusPanel
          type={status.type}
          message={status.message}
          onRetry={() => runSearch(keyword.trim(), activeCategory)}
        />
      )}

      <div className="grid grid-cols-1 tablet:grid-cols-2 desktop:grid-cols-3 gap-5 tablet:gap-6 desktop:gap-7">
        {results.map((place) => (
          <PlaceCard
            key={place.id}
            place={place}
            saved={savedIds.has(place.id)}
            onToggleSave={() => toggleSave(place)}
          />
        ))}
      </div>
    </section>
  );
}
