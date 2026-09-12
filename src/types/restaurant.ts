export interface RestaurantHours {
  day_of_week: number; // 0 = Sunday .. 6 = Saturday
  open_time: string | null; // "10:00"
  close_time: string | null;
  is_closed: boolean;
}

export interface Restaurant {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  logo_url: string | null;
  cover_url: string | null;
  phone: string;
  whatsapp: string;
  address: string;
  lat: number | null;
  lng: number | null;
  timezone: string;
  view_count: number;
}

export interface Category {
  id: string;
  restaurant_id: string;
  name: string;
  nameAr: string;
  nameEn: string | null;
  sort_order: number;
}
