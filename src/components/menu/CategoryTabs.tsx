interface Category {
  id: string;
  name: string;
}

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
  return (
    <div className="category-tabs">
      <button
        type="button"
        className={selectedCategory === "all" ? "active" : ""}
        onClick={() => onCategoryChange("all")}
      >
        All
      </button>

      {categories.map((category) => (
        <button
          key={category.id}
          type="button"
          className={selectedCategory === category.id ? "active" : ""}
          onClick={() => onCategoryChange(category.id)}
        >
          {category.name}
        </button>
      ))}
    </div>
  );
}

export default CategoryTabs;
