
interface MenuSearchProps {
  value: string;
  onChange: (value: string) => void;
}

import { useTranslation } from "react-i18next";

function MenuSearch({ value, onChange }: MenuSearchProps) {
  const { t } = useTranslation();
  return (
    <div className="menu-search">
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={t("menu.searchPlaceholder")}
      />
    </div>
  );
}
export default MenuSearch;

