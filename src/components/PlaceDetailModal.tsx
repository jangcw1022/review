"use client";

import { useEffect, useState } from "react";
import StatusPanel from "./StatusPanel";
import { shortCategory } from "@/lib/kakao";

type SummarizeResponse =
  | { status: "insufficient"; reviewCount: number }
  | { status: "ok"; summary: string; positiveRatio: number; reviewCount: number }
  | { status: "error"; message: string };

export default function PlaceDetailModal({
  placeId,
  placeName,
  address,
  categoryName,
  onClose,
}: {
  placeId: string;
  placeName: string;
  address: string;
  categoryName?: string;
  onClose: () => void;
}) {
  const [result, setResult] = useState<SummarizeResponse | null>(null);

  useEffect(() => {
    let cancelled = false;

    fetch(`/api/summarize?placeId=${encodeURIComponent(placeId)}`)
      .then((res) => res.json())
      .then((data: SummarizeResponse) => {
        if (!cancelled) setResult(data);
      })
      .catch(() => {
        if (!cancelled) setResult({ status: "error", message: "AI 요약을 불러오지 못했어요." });
      });

    return () => {
      cancelled = true;
    };
  }, [placeId]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-5"
      onClick={onClose}
    >
      <div
        className="w-full max-w-sm bg-white rounded-xl2 shadow-soft-lg p-7"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-lg font-bold truncate pr-4">{placeName}</h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="닫기"
            className="text-ink/40 hover:text-ink/70 text-xl leading-none shrink-0"
          >
            ×
          </button>
        </div>
        <p className="text-sm text-ink/55 mb-1">📍 {address || "주소 정보 없음"}</p>
        {categoryName && (
          <p className="text-xs text-primary font-semibold mb-5">{shortCategory(categoryName)}</p>
        )}

        <div className="border-t border-black/5 pt-5">
          <h3 className="text-xs font-semibold text-ink/45 mb-3">✨ AI 리뷰 요약</h3>

          {result === null && <StatusPanel type="loading" message="방문기록을 분석하고 있어요…" />}

          {result?.status === "insufficient" && (
            <StatusPanel
              type="notice"
              icon="📝"
              title="아직 방문기록이 부족해요"
              message={`방문기록이 ${result.reviewCount}개뿐이에요. 3개 이상 모이면 AI 요약을 보여드려요.`}
            />
          )}

          {result?.status === "error" && <StatusPanel type="error" message={result.message} />}

          {result?.status === "ok" && (
            <div className="bg-cream rounded-xl p-5">
              <p className="text-sm text-ink/75 leading-relaxed mb-3">&quot;{result.summary}&quot;</p>
              <div className="flex items-center gap-2">
                <div className="flex-1 h-2 rounded-full bg-black/10 overflow-hidden">
                  <div className="h-full bg-primary" style={{ width: `${result.positiveRatio}%` }} />
                </div>
                <span className="text-xs font-semibold text-primary shrink-0">긍정 {result.positiveRatio}%</span>
              </div>
              <p className="text-xs text-ink/40 mt-2">방문기록 {result.reviewCount}개 기반</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
