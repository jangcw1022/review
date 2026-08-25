"use client";

import type { User } from "@supabase/supabase-js";
import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { isSupabaseConfigured, supabase } from "@/lib/supabase/client";
import AuthModal from "./AuthModal";

interface AuthContextValue {
  user: User | null;
  loading: boolean;
  configured: boolean;
  openAuthModal: () => void;
}

const AuthContext = createContext<AuthContextValue>({
  user: null,
  loading: false,
  configured: false,
  openAuthModal: () => {},
});

export function useAuth() {
  return useContext(AuthContext);
}

export default function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(isSupabaseConfigured);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    if (!supabase) return;

    supabase.auth.getSession().then(({ data }) => {
      setUser(data.session?.user ?? null);
      setLoading(false);
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => listener.subscription.unsubscribe();
  }, []);

  const openAuthModal = useCallback(() => setModalOpen(true), []);

  return (
    <AuthContext.Provider value={{ user, loading, configured: isSupabaseConfigured, openAuthModal }}>
      {children}
      {isSupabaseConfigured && <AuthModal open={modalOpen} onClose={() => setModalOpen(false)} />}
    </AuthContext.Provider>
  );
}
