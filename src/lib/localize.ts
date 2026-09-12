interface LocalizableItem {
  nameAr: string;
  nameEn: string | null;
  name: string;
  descriptionAr?: string;
  descriptionEn?: string | null;
  description?: string;
}

export function localizedName(item: LocalizableItem, lang: string): string {
  if (lang === "ar") return item.nameAr || item.nameEn || item.name || "";
  return item.nameEn || item.nameAr || item.name || "";
}

export function localizedDescription(
  item: LocalizableItem,
  lang: string,
): string {
  if (lang === "ar")
    return item.descriptionAr || item.descriptionEn || item.description || "";
  return item.descriptionEn || item.descriptionAr || item.description || "";
}
