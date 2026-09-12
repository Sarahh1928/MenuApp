import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import type { Restaurant } from "../types/restaurant";

export function useRestaurant(slug: string | undefined) {
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!slug) return;
    let cancelled = false;
    setLoading(true);
    setError(null);

    supabase
      .from("restaurants")
      .select("*")
      .eq("slug", slug)
      .single()
      .then(({ data, error }) => {
        if (cancelled) return;
        if (error) setError(error.message);
        else setRestaurant(data as Restaurant);
        setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [slug]);

  return { restaurant, loading, error };
}