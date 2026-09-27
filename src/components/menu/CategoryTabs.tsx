import { useTranslation } from "react-i18next";
import { localizedName } from "../../lib/localize";
import type { Category } from "../../types/restaurant";
import { t } from "i18next";

interface CategoryTabsProps {
  categories: Category[];
  selectedCategory: string;
  onCategoryChange: (categoryId: string) => void;
}

function CategoryTabs({
  categories,
  selectedCategory,
  onCategoryChange,
}: CategoryTabsProps) {
  const { t, i18n } = useTranslation();
  const lang = i18n.language;

  return (
    <div className="category-tabs">
      <button
        type="button"
        className={selectedCategory === "all" ? "active" : ""}
        onClick={() => onCategoryChange("all")}
      >
        {t("menu.all")}
      </button>

      {categories.map((category) => (
        <button
          key={category.id}
          type="button"
          className={selectedCategory === category.id ? "active" : ""}
          onClick={() => onCategoryChange(category.id)}
        >
          {localizedName(category, lang)}
        </button>
      ))}
    </div>
  );
}

export default CategoryTabs;
