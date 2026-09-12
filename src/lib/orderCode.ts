export function generateOrderCode(restaurantSlug: string): string {
  const prefix = restaurantSlug
    .split("-")
    .map((word) => word.charAt(0))
    .join("")
    .toUpperCase()
    .slice(0, 3) || "ORD";

  const suffix = Math.floor(1000 + Math.random() * 9000); // 4 digits

  return `${prefix}-${suffix}`;
}