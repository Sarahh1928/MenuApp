import { useCallback, useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

export interface DailyViewCount {
  day: string;
  count: number;
}

export function useMenuStats(restaurantId: string | undefined, days = 14) {
  const [data, setData] = useState<DailyViewCount[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = useCallback(async () => {
    if (!restaurantId) return;
    setError(null);

    const since = new Date();
    since.setDate(since.getDate() - days);

    const { data, error } = await supabase
      .from("menu_views")
      .select("day, count")
      .eq("restaurant_id", restaurantId)
      .gte("day", since.toISOString().slice(0, 10))
      .order("day", { ascending: true });

    if (error) setError(error.message);
    else setData((data ?? []) as DailyViewCount[]);

    setLoading(false);
  }, [restaurantId, days]);

  useEffect(() => {
    setLoading(true);
    fetchStats();
  }, [fetchStats]);

  useEffect(() => {
    if (!restaurantId) return;

    const channel = supabase
      .channel(`menu-views-${restaurantId}`)
      .on(
        "postgres_changes",
        {
          event: "*", // insert (first view of the day) and update (subsequent views)
          schema: "public",
          table: "menu_views",
          filter: `restaurant_id=eq.${restaurantId}`,
        },
        () => {
          fetchStats();
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [restaurantId, fetchStats]);

  return { data, loading, error };
}
