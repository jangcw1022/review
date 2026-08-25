"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function HeroSearchForm() {
  const router = useRouter();
  const [keyword, setKeyword] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = keyword.trim();
    router.push(trimmed ? `/search?keyword=${encodeURIComponent(trimmed)}` : "/search");
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full max-w-md flex items-center gap-2 bg-white rounded-full shadow-soft ring-1 ring-black/5 p-2 mb-7 focus-within:ring-2 focus-within:ring-primary/40 transition-shadow"
    >
      <input
        type="text"
        value={keyword}
        onChange={(e) => setKeyword(e.target.value)}
        placeholder="가고 싶은 동네나 맛집을 검색해보세요"
        className="flex-1 min-w-0 bg-transparent outline-none px-4 py-2.5 text-sm tablet:text-base placeholder:text-ink/40"
      />
      <button
        type="submit"
        className="shrink-0 bg-primary text-white font-semibold text-sm tablet:text-base px-5 tablet:px-7 py-2.5 rounded-full hover:bg-primary/90 active:scale-95 transition-all"
      >
        검색
      </button>
    </form>
  );
}
