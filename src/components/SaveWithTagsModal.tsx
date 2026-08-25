"use client";

import { useState } from "react";
import { TAGS } from "@/lib/tags";
import { primaryButtonClass } from "@/lib/styles";
import type { KakaoPlace } from "@/lib/kakao";

const activeChipClass =
  "shrink-0 text-xs tablet:text-sm font-semibold px-4 py-2 rounded-full transition-colors bg-primary text-white shadow-soft";
const inactiveChipClass =
  "shrink-0 text-xs tablet:text-sm font-semibold px-4 py-2 rounded-full transition-colors bg-white ring-1 ring-black/10 text-ink/60 hover:bg-black/5";

export default function SaveWithTagsModal({
  place,
  onConfirm,
  onCancel,
}: {
  place: KakaoPlace;
  onConfirm: (tags: string[]) => void;
  onCancel: () => void;
}) {
  const [selected, setSelected] = useState<string[]>([]);

  function toggle(tag: string) {
    setSelected((prev) => (prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]));
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-5" onClick={onCancel}>
      <div
        className="w-full max-w-sm bg-white rounded-xl2 shadow-soft-lg p-7"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-lg font-bold">가볼 곳 담기</h2>
          <button
            type="button"
            onClick={onCancel}
            aria-label="닫기"
            className="text-ink/40 hover:text-ink/70 text-xl leading-none"
          >
            ×
          </button>
        </div>
        <p className="text-sm text-ink/55 mb-5 truncate">{place.place_name}</p>

        <h3 className="text-xs font-semibold text-ink/45 mb-2.5">태그 (선택)</h3>
        <div className="flex flex-wrap gap-2 mb-6">
          {TAGS.map((tag) => (
            <button
              key={tag}
              type="button"
              onClick={() => toggle(tag)}
              className={selected.includes(tag) ? activeChipClass : inactiveChipClass}
            >
              {tag}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 text-sm font-semibold px-4 py-2.5 rounded-full bg-black/5 text-ink/60 hover:bg-black/10 transition-all"
          >
            취소
          </button>
          <button
            type="button"
            onClick={() => onConfirm(selected)}
            className={`flex-1 text-center ${primaryButtonClass}`}
          >
            담기
          </button>
        </div>
      </div>
    </div>
  );
}
