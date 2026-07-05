"use client";
import { useEffect, useState } from "react";
import { supabase } from "./supabaseClient";

// Client hook: current Supabase user + loading flag, kept in sync with auth changes.
export function useUser() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!supabase) {
      setLoading(false);
      return;
    }
    let active = true;
    // getSession reads localStorage (no network) — resolves even offline.
    supabase.auth
      .getSession()
      .then(({ data }) => {
        if (active) {
          setUser((data && data.session && data.session.user) || null);
          setLoading(false);
        }
      })
      .catch(() => {
        if (active) {
          setUser(null);
          setLoading(false);
        }
      });
    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => {
      setUser((session && session.user) || null);
      setLoading(false);
    });
    return () => {
      active = false;
      sub && sub.subscription && sub.subscription.unsubscribe();
    };
  }, []);

  return { user, loading };
}
