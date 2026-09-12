import { useCallback, useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import type { Order } from "../types/order";

export function useOrders(restaurantId: string | undefined) {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchOrders = useCallback(async () => {
    if (!restaurantId) return;
    setLoading(true);
    setError(null);

    const { data, error } = await supabase
      .from("orders")
      .select("*")
      .eq("restaurant_id", restaurantId)
      .order("created_at", { ascending: false });

    if (error) setError(error.message);
    else setOrders((data ?? []) as Order[]);

    setLoading(false);
  }, [restaurantId]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  useEffect(() => {
    if (!restaurantId) return;

    const channel = supabase
      .channel(`orders-${restaurantId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "orders",
          filter: `restaurant_id=eq.${restaurantId}`,
        },
        (payload) => {
          setOrders((current) => [payload.new as Order, ...current]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [restaurantId]);

  return { orders, loading, error, refetch: fetchOrders };
}