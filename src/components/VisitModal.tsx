"use client";

import { useState } from "react";
import { TAGS } from "@/lib/tags";
import { primaryButtonClass } from "@/lib/styles";
import type { SavedPlaceRow } from "@/lib/savedPlaces";

const activeChipClass =
  "shrink-0 text-xs tablet:text-sm font-semibold px-4 py-2 rounded-full transition-colors bg-primary text-white shadow-soft";
const inactiveChipClass =
  "shrink-0 text-xs tablet:text-sm font-semibold px-4 py-2 rounded-full transition-colors bg-white ring-1 ring-black/10 text-ink/60 hover:bg-black/5";

export interface VisitFormData {
  tags: string[];
  revisitIntent: boolean | null;
  memo: string;
}

export default function VisitModal({
  place,
  onSave,
  onClose,
}: {
  place: SavedPlaceRow;
  onSave: (data: VisitFormData) => Promise<void>;
  onClose: () => void;
}) {
  const [tags, setTags] = useState<string[]>(place.tags ?? []);
  const [revisitIntent, setRevisitIntent] = useState<boolean | null>(place.revisit_intent);
  const [memo, setMemo] = useState(place.memo ?? "");
  const [saving, setSaving] = useState(false);

  function toggleTag(tag: string) {
    setTags((prev) => (prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]));
  }

  async function handleSave() {
    setSaving(true);
    await onSave({ tags, revisitIntent, memo: memo.trim() });
    setSaving(false);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-5" onClick={onClose}>
      <div
        className="w-full max-w-sm bg-white rounded-xl2 shadow-soft-lg p-7 max-h-[85vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-lg font-bold">{place.status === "visited" ? "방문 정보 수정" : "가본 곳으로 전환"}</h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="닫기"
            className="text-ink/40 hover:text-ink/70 text-xl leading-none"
          >
            ×
          </button>
        </div>
        <p className="text-sm text-ink/55 mb-5 truncate">{place.place_name}</p>

        <h3 className="text-xs font-semibold text-ink/45 mb-2.5">재방문 의사</h3>
        <div className="flex gap-2 mb-5">
          <button
            type="button"
            onClick={() => setRevisitIntent(true)}
            className={revisitIntent === true ? activeChipClass : inactiveChipClass}
          >
            또 갈래요
          </button>
          <button
            type="button"
            onClick={() => setRevisitIntent(false)}
            className={revisitIntent === false ? activeChipClass : inactiveChipClass}
          >
            글쎄요
          </button>
        </div>

        <h3 className="text-xs font-semibold text-ink/45 mb-2.5">한줄 메모</h3>
        <textarea
          value={memo}
          onChange={(e) => setMemo(e.target.value)}
          maxLength={200}
          rows={3}
          placeholder="이 곳에 대한 짧은 기록을 남겨보세요"
          className="w-full bg-cream rounded-xl px-4 py-3 text-sm outline-none ring-1 ring-black/5 focus:ring-2 focus:ring-primary/40 mb-5 resize-none"
        />

        <h3 className="text-xs font-semibold text-ink/45 mb-2.5">태그</h3>
        <div className="flex flex-wrap gap-2 mb-6">
          {TAGS.map((tag) => (
            <button
              key={tag}
              type="button"
              onClick={() => toggleTag(tag)}
              className={tags.includes(tag) ? activeChipClass : inactiveChipClass}
            >
              {tag}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 text-sm font-semibold px-4 py-2.5 rounded-full bg-black/5 text-ink/60 hover:bg-black/10 transition-all"
          >
            취소
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className={`flex-1 text-center disabled:opacity-60 ${primaryButtonClass}`}
          >
            {saving ? "저장 중…" : "저장"}
          </button>
        </div>
      </div>
    </div>
  );
}
