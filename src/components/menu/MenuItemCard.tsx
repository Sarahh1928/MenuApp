import { useTranslation } from "react-i18next";
import { useCart } from "../../hooks/useCart";
import type { MenuItem } from "../../types/menu";
interface MenuItemCardProps {
  item: MenuItem;
}
function MenuItemCard({ item }: MenuItemCardProps) {
  const { t } = useTranslation();
  const { addItem } = useCart();
  return (
    <div className="menu-item-card">
      {" "}
      <div className="menu-item-image">
        {" "}
        <img src={item.image} alt={item.name} />{" "}
      </div>{" "}
      <div className="menu-item-content">
        {" "}
        <div className="menu-item-header">
          {" "}
          <h3>{item.name}</h3>{" "}
          <span className="menu-item-price">
            {" "}
            {item.price.toFixed(2)}{" "}
          </span>{" "}
        </div>{" "}
        <p className="menu-item-description"> {item.description} </p>{" "}
        {!item.available && (
          <span className="menu-item-unavailable">
            {" "}
            {t("menu.unavailable")}{" "}
          </span>
        )}{" "}
        <button
          type="button"
          disabled={!item.available}
          className="add-to-cart-button"
          onClick={() => addItem(item)}
        >
          {" "}
          {t("menu.addToCart")}{" "}
        </button>{" "}
      </div>{" "}
    </div>
  );
}
export default MenuItemCard;
