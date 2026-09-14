import { createContext, useEffect, useState, type ReactNode } from "react";
import type { Session } from "@supabase/supabase-js";
import { supabase } from "../lib/supabase";
import type { AuthUser } from "../types/auth";

interface AuthContextValue {
  user: AuthUser | null;
  restaurantId: string | null;
  loading: boolean;
  signIn: (
    email: string,
    password: string,
  ) => Promise<{ error: string | null }>;
  signOut: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextValue | undefined>(
  undefined,
);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [restaurantId, setRestaurantId] = useState<string | null>(null);
  const [sessionLoading, setSessionLoading] = useState(true);
  const [restaurantLoading, setRestaurantLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setSessionLoading(false);
    });

    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, newSession) => {
        setSession(newSession);
      },
    );

    return () => listener.subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (!session?.user) {
      setRestaurantId(null);
      setRestaurantLoading(false);
      return;
    }

    let cancelled = false;
    setRestaurantLoading(true);

    supabase
      .from("restaurant_owners")
      .select("restaurant_id")
      .eq("user_id", session.user.id)
      .single()
      .then(({ data, error }) => {
        if (cancelled) return;
        setRestaurantId(error ? null : (data?.restaurant_id ?? null));
        setRestaurantLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [session]);

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    return { error: error?.message ?? null };
  };

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  const user: AuthUser | null = session?.user
    ? { id: session.user.id, email: session.user.email ?? null }
    : null;

  const loading = sessionLoading || restaurantLoading;

  return (
    <AuthContext.Provider
      value={{ user, restaurantId, loading, signIn, signOut }}
    >
      {children}
    </AuthContext.Provider>
  );
}
