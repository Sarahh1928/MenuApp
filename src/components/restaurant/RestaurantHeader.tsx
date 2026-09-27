import { useTranslation } from "react-i18next";
import { localizedName, localizedDescription } from "../../lib/localize";
import type { Restaurant } from "../../types/restaurant";

interface RestaurantHeaderProps {
  restaurant: Restaurant;
}

function RestaurantHeader({ restaurant }: RestaurantHeaderProps) {
  const { i18n } = useTranslation();
  const lang = i18n.language;

  const name = localizedName(restaurant, lang);
  const description = localizedDescription(restaurant, lang);

  return (
    <section className="restaurant-header">
      <img
        src={restaurant.cover_url ?? ""}
        alt={name}
        className="restaurant-header-cover"
      />

      <div className="restaurant-header-overlay" />

      <div className="restaurant-header-content">
        <div className="restaurant-header-logo">
          {restaurant.logo_url ? (
            <img src={restaurant.logo_url} alt={`${name} logo`} />
          ) : (
            <span>{name.charAt(0).toUpperCase()}</span>
          )}
        </div>

        <div className="restaurant-header-text">
          <h1>{name}</h1>
          <p>{description}</p>
        </div>
      </div>
    </section>
  );
}

export default RestaurantHeader;
