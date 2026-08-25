"use client";

import { useState } from "react";
import PlaceCard from "@/components/PlaceCard";
import StatusPanel, { type StatusType } from "@/components/StatusPanel";
import { fetchPlaces } from "@/lib/fetchPlaces";
import { CATEGORIES, type KakaoPlace } from "@/lib/kakao";
import { REGIONS } from "@/lib/regions";
import { useSavedPlaces } from "@/hooks/useSavedPlaces";

function Chip({
  label,
  isActive,
  onClick,
}: {
  label: string;
  isActive: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={
        isActive
          ? "shrink-0 snap-start text-xs tablet:text-sm font-semibold px-4 py-2 rounded-full transition-colors bg-primary text-white shadow-soft"
          : "shrink-0 snap-start text-xs tablet:text-sm font-semibold px-4 py-2 rounded-full transition-colors bg-white ring-1 ring-black/10 text-ink/60 hover:bg-black/5"
      }
    >
      {label}
    </button>
  );
}

export default function BrowseClient({ hasApiKey }: { hasApiKey: boolean }) {
  const [activeSido, setActiveSido] = useState(Object.keys(REGIONS)[0]);
  const [activeSigungu, setActiveSigungu] = useState("");
  const [activeCategory, setActiveCategory] = useState("");
  const [results, setResults] = useState<KakaoPlace[]>([]);
  const [status, setStatus] = useState<{ type: StatusType; message: string } | null>({
    type: "notice",
    message: "시/군/구를 선택해주세요.",
  });
  const { savedIds, toggleSave } = useSavedPlaces();

  async function runSearch(sigungu: string, category: string) {
    if (!sigungu) {
      setStatus({ type: "notice", message: "지역을 선택해주세요." });
      return;
    }

    if (!hasApiKey) {
      setStatus({
        type: "notice",
        message: "카카오 REST API 키가 설정되지 않았어요. 페이지 상단 안내를 참고해 키를 설정해주세요.",
      });
      return;
    }

    setStatus({ type: "loading", message: "검색 중이에요…" });
    setResults([]);

    try {
      const query = category ? `${sigungu} ${category}` : sigungu;
      const documents = await fetchPlaces(query, { endpoint: "keyword" });

      if (documents.length === 0) {
        setStatus({ type: "empty", message: "검색 결과가 없어요. 다른 지역이나 음식 종류로 시도해보세요." });
        return;
      }

      setStatus(null);
      setResults(documents);
    } catch (err) {
      setStatus({
        type: "error",
        message: err instanceof Error ? `검색 중 문제가 발생했어요. (${err.message})` : "검색 중 알 수 없는 문제가 발생했어요. 잠시 후 다시 시도해주세요.",
      });
    }
  }

  function handleSidoClick(sido: string) {
    setActiveSido(sido);
    setActiveSigungu("");
    setStatus({ type: "notice", message: "시/군/구를 선택해주세요." });
    setResults([]);
  }

  function handleSigunguClick(sigungu: string) {
    setActiveSigungu(sigungu);
    runSearch(sigungu, activeCategory);
  }

  function handleCategoryClick(category: string) {
    setActiveCategory(category);
    if (activeSigungu) runSearch(activeSigungu, category);
  }

  return (
    <section className="px-5 py-8 tablet:px-6 tablet:py-10 desktop:py-12 max-w-6xl desktop:max-w-7xl mx-auto">
      <div className="text-center mb-8 tablet:mb-10">
        <h1 className="text-2xl tablet:text-4xl font-extrabold tracking-tight mb-3">지역별 둘러보기</h1>
        <p className="text-ink/55 text-sm tablet:text-base">시/도와 시/군/구, 음식 종류를 골라 맛집을 찾아보세요</p>
      </div>

      <div className="max-w-3xl mx-auto space-y-5 mb-8">
        <div>
          <h2 className="text-xs tablet:text-sm font-semibold text-ink/45 mb-2.5">1. 시/도</h2>
          <div className="flex items-center gap-2 overflow-x-auto snap-x snap-mandatory pb-1 -mx-5 px-5 tablet:mx-0 tablet:px-0 tablet:pb-0 tablet:flex-wrap">
            {Object.keys(REGIONS).map((sido) => (
              <Chip key={sido} label={sido} isActive={sido === activeSido} onClick={() => handleSidoClick(sido)} />
            ))}
          </div>
        </div>

        <div>
          <h2 className="text-xs tablet:text-sm font-semibold text-ink/45 mb-2.5">2. 시/군/구</h2>
          <div className="flex items-center gap-2 overflow-x-auto snap-x snap-mandatory pb-1 -mx-5 px-5 tablet:mx-0 tablet:px-0 tablet:pb-0 tablet:flex-wrap">
            {activeSido ? (
              REGIONS[activeSido].map((gu) => (
                <Chip key={gu} label={gu} isActive={gu === activeSigungu} onClick={() => handleSigunguClick(gu)} />
              ))
            ) : (
              <p className="text-sm text-ink/40 py-2">먼저 시/도를 선택해주세요.</p>
            )}
          </div>
        </div>

        <div>
          <h2 className="text-xs tablet:text-sm font-semibold text-ink/45 mb-2.5">3. 음식 종류</h2>
          <div className="flex items-center gap-2 overflow-x-auto snap-x snap-mandatory pb-1 -mx-5 px-5 tablet:mx-0 tablet:px-0 tablet:pb-0 tablet:flex-wrap">
            <Chip label="전체" isActive={activeCategory === ""} onClick={() => handleCategoryClick("")} />
            {CATEGORIES.map((category) => (
              <Chip
                key={category}
                label={category}
                isActive={category === activeCategory}
                onClick={() => handleCategoryClick(category)}
              />
            ))}
          </div>
        </div>
      </div>

      {status && (
        <StatusPanel
          type={status.type}
          message={status.message}
          onRetry={() => runSearch(activeSigungu, activeCategory)}
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
