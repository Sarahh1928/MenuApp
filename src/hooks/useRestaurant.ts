import { useQuery } from "@tanstack/react-query";
import { supabase } from "../lib/supabase";
import type { Restaurant } from "../types/restaurant";

interface DbRestaurant {
  id: string;
  slug: string;
  name: string;
  name_ar: string;
  name_en: string | null;
  description: string | null;
  description_ar: string | null;
  description_en: string | null;
  logo_url: string | null;
  cover_url: string | null;
  phone: string;
  whatsapp: string;
  location_url: string | null;
  lat: number | null;
  lng: number | null;
  timezone: string;
  view_count: number;
}

function mapRestaurant(row: DbRestaurant): Restaurant {
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    nameAr: row.name_ar,
    nameEn: row.name_en,
    description: row.description,
    descriptionAr: row.description_ar,
    descriptionEn: row.description_en,
    logo_url: row.logo_url,
    cover_url: row.cover_url,
    phone: row.phone,
    whatsapp: row.whatsapp,
    locationUrl: row.location_url,
    lat: row.lat,
    lng: row.lng,
    timezone: row.timezone,
    view_count: row.view_count,
  };
}

export function useRestaurant(slug: string | undefined) {
  const { data, isLoading, error } = useQuery({
    queryKey: ["restaurant", slug],
    enabled: !!slug,
    staleTime: 10 * 60 * 1000,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("restaurants")
        .select("*")
        .eq("slug", slug)
        .single();

      if (error) throw new Error(error.message);
      return mapRestaurant(data as DbRestaurant);
    },
  });

  return {
    restaurant: data ?? null,
    loading: isLoading,
    error: error instanceof Error ? error.message : null,
  };
}
