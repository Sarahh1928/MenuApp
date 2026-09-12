export interface MenuItem {
  id: string;
  categoryId: string;
  name: string;
  nameAr: string;
  nameEn: string | null;
  description: string;
  descriptionAr: string;
  descriptionEn: string | null;
  price: number;
  image: string;
  available: boolean;
}
