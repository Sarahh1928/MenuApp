import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "../lib/supabase";
import type { Category } from "../types/restaurant";
import type { MenuItem } from "../types/menu";

interface DbMenuItem {
  id: string;
  category_id: string;
  name: string;
  name_ar: string;
  name_en: string | null;
  description: string;
  description_ar: string;
  description_en: string | null;
  price: number;
  image_url: string;
  available: boolean;
}

interface DbCategory {
  id: string;
  restaurant_id: string;
  name: string;
  name_ar: string;
  name_en: string | null;
  sort_order: number;
}

function mapItem(row: DbMenuItem): MenuItem {
  return {
    id: row.id,
    categoryId: row.category_id,
    name: row.name,
    nameAr: row.name_ar,
    nameEn: row.name_en,
    description: row.description,
    descriptionAr: row.description_ar,
    descriptionEn: row.description_en,
    price: row.price,
    image: row.image_url,
    available: row.available,
  };
}

function mapCategory(row: DbCategory): Category {
  return {
    id: row.id,
    restaurant_id: row.restaurant_id,
    name: row.name,
    nameAr: row.name_ar,
    nameEn: row.name_en,
    sort_order: row.sort_order,
  };
}

export function useMenu(restaurantId: string | undefined) {
  const queryClient = useQueryClient();

  const { data, isLoading, error } = useQuery({
    queryKey: ["menu", restaurantId],
    enabled: !!restaurantId,
    queryFn: async () => {
      const [categoriesRes, itemsRes] = await Promise.all([
        supabase
          .from("categories")
          .select("*")
          .eq("restaurant_id", restaurantId)
          .order("sort_order", { ascending: true }),
        supabase
          .from("menu_items")
          .select("*")
          .eq("restaurant_id", restaurantId),
      ]);

      if (categoriesRes.error) throw new Error(categoriesRes.error.message);
      if (itemsRes.error) throw new Error(itemsRes.error.message);

      return {
        categories: (categoriesRes.data as DbCategory[]).map(mapCategory),
        items: (itemsRes.data as DbMenuItem[]).map(mapItem),
      };
    },
  });

  return {
    categories: data?.categories ?? [],
    items: data?.items ?? [],
    loading: isLoading,
    error: error instanceof Error ? error.message : null,
    refetch: () =>
      queryClient.invalidateQueries({ queryKey: ["menu", restaurantId] }),
  };
}
