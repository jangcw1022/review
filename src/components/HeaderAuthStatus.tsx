"use client";

import { useAuth } from "./AuthProvider";
import { supabase } from "@/lib/supabase/client";

export default function HeaderAuthStatus() {
  const { user, configured, loading, openAuthModal } = useAuth();

  if (!configured || loading) return null;

  if (!user) {
    return (
      <button
        type="button"
        onClick={openAuthModal}
        className="text-ink/50 hover:text-primary transition-colors"
      >
        로그인
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={() => supabase?.auth.signOut()}
      title={user.email ?? undefined}
      className="text-ink/50 hover:text-primary transition-colors"
    >
      로그아웃
    </button>
  );
}
