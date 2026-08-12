"use client";

import { useEffect, useState } from "react";
import type { User } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/client";

interface AuthState {
  user: User | null;
  profile: { username: string | null; avatar_url: string | null } | null;
  isGuest: boolean;
  loading: boolean;
  signOut: () => Promise<void>;
}

/**
 * Supabase oturum durumunu takip eden React hook.
 * Env eksikse misafir modunda kalır, uygulama çökmez.
 */
export function useAuth(): AuthState {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<AuthState["profile"]>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const supabase = createClient();

    if (!supabase) {
      setLoading(false);
      return;
    }

    const loadProfile = async (id: string | undefined) => {
      if (!id) { setProfile(null); return; }
      const { data } = await supabase.from("profiles").select("username,avatar_url").eq("id", id).maybeSingle();
      setProfile(data);
    };

    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      void loadProfile(session?.user.id);
      setLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      void loadProfile(session?.user.id);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signOut = async () => {
    const supabase = createClient();
    if (!supabase) return;
    await supabase.auth.signOut();
  };

  return {
    user,
    profile,
    isGuest: !user,
    loading,
    signOut,
  };
}
