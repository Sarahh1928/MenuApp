import { useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "../lib/supabase";

export interface DailyViewCount {
  day: string;
  count: number;
}

export function useMenuStats(restaurantId: string | undefined, days = 14) {
  const queryClient = useQueryClient();
  const queryKey = ["menu-stats", restaurantId, days];

  const { data, isLoading, error } = useQuery({
    queryKey,
    enabled: !!restaurantId,
    queryFn: async () => {
      const since = new Date();
      since.setDate(since.getDate() - days);

      const { data, error } = await supabase
        .from("menu_views")
        .select("day, count")
        .eq("restaurant_id", restaurantId)
        .gte("day", since.toISOString().slice(0, 10))
        .order("day", { ascending: true });

      if (error) throw new Error(error.message);
      return (data ?? []) as DailyViewCount[];
    },
  });

  useEffect(() => {
    if (!restaurantId) return;

    const channel = supabase
      .channel(`menu-views-${restaurantId}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "menu_views",
          filter: `restaurant_id=eq.${restaurantId}`,
        },
        () => {
          queryClient.invalidateQueries({ queryKey });
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [restaurantId, days, queryClient]);

  return {
    data: data ?? [],
    loading: isLoading,
    error: error instanceof Error ? error.message : null,
  };
}
