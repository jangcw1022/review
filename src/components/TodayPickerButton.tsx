"use client";

import { useState } from "react";
import TodayPickerModal from "./TodayPickerModal";

export default function TodayPickerButton() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="fixed bottom-6 right-5 tablet:right-8 z-40 flex items-center gap-2 bg-primary text-white font-semibold text-sm px-5 py-3.5 rounded-full shadow-soft-lg hover:bg-primary/90 active:scale-95 transition-all"
      >
        <span aria-hidden="true">🍽️</span>
        오늘 뭐 먹지
      </button>
      {open && <TodayPickerModal onClose={() => setOpen(false)} />}
    </>
  );
}
