import { useTranslation } from "react-i18next";
import { supabase } from "../../../lib/supabase";
import { localizedName } from "../../../lib/localize";
import type { MenuItem } from "../../../types/menu";
import type { Category } from "../../../types/restaurant";
import "./MenuItemsTable.css";

interface MenuItemsTableProps {
  items: MenuItem[];
  categories: Category[];
  onEdit: (item: MenuItem) => void;
  onChanged: () => void;
}

function MenuItemsTable({
  items,
  categories,
  onEdit,
  onChanged,
}: MenuItemsTableProps) {
  const { t, i18n } = useTranslation();
  const lang = i18n.language;

  const handleDelete = async (itemId: string) => {
    if (!confirm(t("menuItems.deleteConfirm"))) return;
    await supabase.from("menu_items").delete().eq("id", itemId);
    onChanged();
  };

  const handleToggle = async (item: MenuItem) => {
    await supabase
      .from("menu_items")
      .update({ available: !item.available })
      .eq("id", item.id);
    onChanged();
  };

  if (items.length === 0) {
    return <p className="menu-items-empty">{t("menuItems.empty")}</p>;
  }

  return (
    <div className="menu-items-table">
      {categories.map((cat) => {
        const catItems = items.filter((i) => i.categoryId === cat.id);
        if (catItems.length === 0) return null;

        const catPrimary = localizedName(cat, lang);
        const catSecondary = lang === "ar" ? cat.nameEn : cat.nameAr;

        return (
          <div key={cat.id} className="menu-items-group">
            <h4>
              {catPrimary}
              {catSecondary && (
                <span className="menu-items-secondary-name">
                  {" "}
                  · {catSecondary}
                </span>
              )}
            </h4>

            {catItems.map((item) => {
              const itemPrimary = localizedName(item, lang);
              const itemSecondary = lang === "ar" ? item.nameEn : item.nameAr;

              return (
                <div key={item.id} className="menu-items-row">
                  <img src={item.image} alt={itemPrimary} />

                  <div className="menu-items-row-info">
                    <strong>
                      {itemPrimary}
                      {itemSecondary && (
                        <span className="menu-items-secondary-name">
                          {" "}
                          · {itemSecondary}
                        </span>
                      )}
                    </strong>
                    <span>
                      {item.price.toFixed(2)} {t("cart.currency")}
                    </span>
                  </div>

                  <label className="menu-items-row-toggle">
                    <input
                      type="checkbox"
                      checked={item.available}
                      onChange={() => handleToggle(item)}
                    />
                    {t("menuItems.available")}
                  </label>

                  <button type="button" onClick={() => onEdit(item)}>
                    {t("menuItems.edit")}
                  </button>
                  <button type="button" onClick={() => handleDelete(item.id)}>
                    {t("menuItems.delete")}
                  </button>
                </div>
              );
            })}
          </div>
        );
      })}
    </div>
  );
}

export default MenuItemsTable;
