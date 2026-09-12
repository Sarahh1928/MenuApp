import { useEffect, useRef } from "react";
import { supabase } from "../lib/supabase";

export function useMenuView(restaurantId: string | undefined) {
  const fired = useRef(false);

  useEffect(() => {
    if (!restaurantId || fired.current) return;
    fired.current = true;

    supabase.rpc("increment_menu_view", { p_restaurant_id: restaurantId }).then(({ error }) => {
      if (error) console.error("increment_menu_view failed:", error.message);
    });
  }, [restaurantId]);
}