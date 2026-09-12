import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

export interface DailyViewCount {
  day: string;
  count: number;
}

export function useMenuStats(restaurantId: string | undefined, days = 14) {
  const [data, setData] = useState<DailyViewCount[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!restaurantId) return;
    let cancelled = false;
    setLoading(true);
    setError(null);

    const since = new Date();
    since.setDate(since.getDate() - days);

    supabase
      .from("menu_views")
      .select("day, count")
      .eq("restaurant_id", restaurantId)
      .gte("day", since.toISOString().slice(0, 10))
      .order("day", { ascending: true })
      .then(({ data, error }) => {
        if (cancelled) return;
        if (error) setError(error.message);
        else setData((data ?? []) as DailyViewCount[]);
        setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [restaurantId, days]);

  return { data, loading, error };
}