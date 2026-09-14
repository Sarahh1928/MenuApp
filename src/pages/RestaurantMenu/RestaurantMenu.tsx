import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";
import MenuSearch from "../../components/menu/MenuSearch";
import CategoryTabs from "../../components/menu/CategoryTabs";
import MenuList from "../../components/menu/MenuList";
import RestaurantHeader from "../../components/restaurant/RestaurantHeader";
import RestaurantInfo from "../../components/restaurant/RestaurantInfo";
import FloatingCartButton from "../../components/cart/FloatingCartButton";
import CartDrawer from "../../components/cart/CartDrawer";
import { useRestaurant } from "../../hooks/useRestaurant";
import { useMenu } from "../../hooks/useMenu";
import { useMenuView } from "../../hooks/useMenuView";
import { useOpenStatus } from "../../hooks/useOpenStatus";
import "./RestaurantMenu.css";
import "../../components/restaurant/restaurant.css";

function RestaurantMenu() {
  const { t } = useTranslation();
  const { restaurantSlug } = useParams<{ restaurantSlug: string }>();

  const {
    restaurant,
    loading: restaurantLoading,
    error: restaurantError,
  } = useRestaurant(restaurantSlug);

  const {
    categories,
    items,
    loading: menuLoading,
    error: menuError,
  } = useMenu(restaurant?.id);

  const { isOpen, closingTime, openingTime, openingDayOffset } = useOpenStatus(
    restaurant?.id,
    restaurant?.timezone,
  );

  useMenuView(restaurant?.id);

  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [cartOpen, setCartOpen] = useState(false);

  if (restaurantLoading) {
    return (
      <div className="restaurant-page-status">{t("restaurant.loading")}</div>
    );
  }

  if (restaurantError || !restaurant) {
    return (
      <div className="restaurant-page-status">{t("restaurant.notFound")}</div>
    );
  }

  const filteredItems = items.filter((item) => {
    const matchesCategory =
      selectedCategory === "all" || item.categoryId === selectedCategory;
    const searchText = search.toLowerCase();
    const matchesSearch =
      item.name.toLowerCase().includes(searchText) ||
      item.description.toLowerCase().includes(searchText);
    return matchesCategory && matchesSearch;
  });

  return (
    <main className="restaurant-page">
      <RestaurantHeader
        name={restaurant.name}
        description={restaurant.description ?? ""}
        image={restaurant.cover_url ?? ""}
        logo={restaurant.logo_url ?? undefined}
      />

      <RestaurantInfo
        isOpen={isOpen}
        closingTime={closingTime}
        openingTime={openingTime}
        openingDayOffset={openingDayOffset}
        phone={restaurant.phone}
        whatsapp={restaurant.whatsapp}
        address={restaurant.address}
        locationUrl={
          restaurant.lat && restaurant.lng
            ? `https://maps.google.com/?q=${restaurant.lat},${restaurant.lng}`
            : undefined
        }
      />

      <section className="menu-section">
        <div className="menu-heading">
          <div>
            <h2>{t("menu.ourMenu")}</h2>
            <p>{restaurant.description}</p>
          </div>
        </div>

        <MenuSearch value={search} onChange={setSearch} />

        <CategoryTabs
          categories={categories}
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
        />

        {menuLoading && <p>{t("menu.loading")}</p>}
        {menuError && <p>{t("menu.error", { error: menuError })}</p>}
        {!menuLoading && !menuError && <MenuList items={filteredItems} />}
      </section>

      <FloatingCartButton onClick={() => setCartOpen(true)} />

      {cartOpen && (
        <CartDrawer
          restaurant={restaurant}
          onClose={() => setCartOpen(false)}
        />
      )}
    </main>
  );
}

export default RestaurantMenu;
