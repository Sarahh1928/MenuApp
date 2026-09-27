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
  nameAr: string;
  nameEn: string | null;
  description: string | null;
  descriptionAr: string | null;
  descriptionEn: string | null;
  logo_url: string | null;
  cover_url: string | null;
  phone: string;
  whatsapp: string;
  locationUrl: string | null;
  lat: number | null;
  lng: number | null;
  timezone: string;
  view_count: number;
}
