import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { computeOpenStatus, type OpenStatus } from "../lib/openStatus";
import type { RestaurantHours } from "../types/restaurant";

export function useOpenStatus(
  restaurantId: string | undefined,
  timezone: string | undefined,
) {
  const [status, setStatus] = useState<OpenStatus>({ isOpen: false });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!restaurantId || !timezone) return;
    let cancelled = false;

    const fetchAndCompute = () => {
      supabase
        .from("restaurant_hours")
        .select("*")
        .eq("restaurant_id", restaurantId)
        .then(({ data, error }) => {
          if (cancelled) return;
          if (!error && data) {
            setStatus(computeOpenStatus(data as RestaurantHours[], timezone));
          }
          setLoading(false);
        });
    };

    fetchAndCompute();
    const interval = setInterval(fetchAndCompute, 60_000);

    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, [restaurantId, timezone]);

  return { ...status, loading };
}
