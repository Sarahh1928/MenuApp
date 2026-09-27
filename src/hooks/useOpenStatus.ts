import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "../lib/supabase";
import { computeOpenStatus, type OpenStatus } from "../lib/openStatus";
import type { RestaurantHours } from "../types/restaurant";

export function useOpenStatus(
  restaurantId: string | undefined,
  timezone: string | undefined,
) {
  const { data: hours, isLoading } = useQuery({
    queryKey: ["restaurant-hours", restaurantId],
    enabled: !!restaurantId,
    staleTime: 30 * 60 * 1000,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("restaurant_hours")
        .select("*")
        .eq("restaurant_id", restaurantId);

      if (error) throw new Error(error.message);
      return (data ?? []) as RestaurantHours[];
    },
  });

  const [status, setStatus] = useState<OpenStatus>({ isOpen: false });

  useEffect(() => {
    if (!hours || !timezone) return;

    const recompute = () => setStatus(computeOpenStatus(hours, timezone));

    recompute();
    const interval = setInterval(recompute, 60_000);

    return () => clearInterval(interval);
  }, [hours, timezone]);

  return { ...status, loading: isLoading };
}
