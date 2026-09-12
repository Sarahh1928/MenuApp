import type { MenuItem } from "../../types/menu";
import MenuItemCard from "./MenuItemCard";

interface MenuListProps {
  items: MenuItem[];
}

function MenuList({ items }: MenuListProps) {
  if (items.length === 0) {
    return (
      <div className="menu-list-empty">
        <p>No menu items found.</p>
      </div>
    );
  }

  return (
    <div className="menu-list">
      {items.map((item) => (
        <MenuItemCard key={item.id} item={item} />
      ))}
    </div>
  );
}

export default MenuList;