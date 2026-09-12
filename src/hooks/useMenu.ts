import { useCallback, useEffect, useState } from "react";
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
  const [categories, setCategories] = useState<Category[]>([]);
  const [items, setItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMenu = useCallback(async () => {
    if (!restaurantId) return;
    setLoading(true);
    setError(null);

    const [categoriesRes, itemsRes] = await Promise.all([
      supabase
        .from("categories")
        .select("*")
        .eq("restaurant_id", restaurantId)
        .order("sort_order", { ascending: true }),
      supabase.from("menu_items").select("*").eq("restaurant_id", restaurantId),
    ]);

    if (categoriesRes.error) setError(categoriesRes.error.message);
    else setCategories((categoriesRes.data as DbCategory[]).map(mapCategory));

    if (itemsRes.error) setError(itemsRes.error.message);
    else setItems((itemsRes.data as DbMenuItem[]).map(mapItem));

    setLoading(false);
  }, [restaurantId]);

  useEffect(() => {
    fetchMenu();
  }, [fetchMenu]);

  return { categories, items, loading, error, refetch: fetchMenu };
}
