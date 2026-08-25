"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase/client";

export default function AuthModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  if (!open) return null;

  function switchMode(next: "login" | "signup") {
    setMode(next);
    setError(null);
    setNotice(null);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!supabase) return;

    setError(null);
    setNotice(null);
    setLoading(true);

    const { error } =
      mode === "login"
        ? await supabase.auth.signInWithPassword({ email, password })
        : await supabase.auth.signUp({ email, password });

    setLoading(false);

    if (error) {
      setError(error.message);
      return;
    }

    if (mode === "signup") {
      setNotice("가입 확인 메일을 보냈어요. 메일함을 확인해주세요.");
      return;
    }

    setEmail("");
    setPassword("");
    onClose();
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-5"
      onClick={onClose}
    >
      <div
        className="w-full max-w-sm bg-white rounded-xl2 shadow-soft-lg p-7"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-bold">{mode === "login" ? "로그인" : "회원가입"}</h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="닫기"
            className="text-ink/40 hover:text-ink/70 text-xl leading-none"
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            type="email"
            required
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="이메일"
            className="w-full bg-cream rounded-full px-4 py-2.5 text-sm outline-none ring-1 ring-black/5 focus:ring-2 focus:ring-primary/40"
          />
          <input
            type="password"
            required
            minLength={6}
            autoComplete={mode === "login" ? "current-password" : "new-password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="비밀번호 (6자 이상)"
            className="w-full bg-cream rounded-full px-4 py-2.5 text-sm outline-none ring-1 ring-black/5 focus:ring-2 focus:ring-primary/40"
          />

          {error && <p className="text-xs text-red-500 px-1">{error}</p>}
          {notice && <p className="text-xs text-primary px-1">{notice}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary text-white font-semibold text-sm py-2.5 rounded-full hover:bg-primary/90 active:scale-95 transition-all disabled:opacity-60"
          >
            {loading ? "처리 중…" : mode === "login" ? "로그인" : "회원가입"}
          </button>
        </form>

        <button
          type="button"
          onClick={() => switchMode(mode === "login" ? "signup" : "login")}
          className="mt-4 w-full text-center text-xs text-ink/50 hover:text-primary transition-colors"
        >
          {mode === "login" ? "계정이 없으신가요? 회원가입" : "이미 계정이 있으신가요? 로그인"}
        </button>
      </div>
    </div>
  );
}
