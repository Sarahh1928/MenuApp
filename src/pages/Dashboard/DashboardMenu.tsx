import { useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import { useMenu } from "../../hooks/useMenu";
import DashboardLayout from "../../components/dashboard/DashboardLayout/DashboardLayout";
import CategoryManager from "../../components/dashboard/CategoryManager/CategoryManager";
import MenuItemsTable from "../../components/dashboard/MenuItemsTable/MenuItemsTable";
import MenuItemForm from "../../components/dashboard/MenuItemForm/MenuItemForm";
import type { MenuItem } from "../../types/menu";
import "./Dashboard.css";
import { useTranslation } from "react-i18next";
import Spinner from "../../components/common/Spinner";

function DashboardMenu() {
  const { t } = useTranslation();
  const { restaurantId } = useAuth();
  const { categories, items, loading, error, refetch } = useMenu(
    restaurantId ?? undefined,
  );
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [formOpen, setFormOpen] = useState(false);

  if (!restaurantId) return null;

  return (
    <DashboardLayout>
      <div className="dashboard-page">
        <div className="dashboard-page-header">
          <div>
            <h2>{t("dashboard.menu.title")}</h2>
            <p>{t("dashboard.menu.subtitle")}</p>
          </div>

          <button
            type="button"
            className="dashboard-refresh-btn"
            onClick={() => {
              setEditingItem(null);
              setFormOpen(true);
            }}
            disabled={categories.length === 0}
          >
            {t("dashboard.menu.addItem")}
          </button>
        </div>
        {loading && (
          <p className="dashboard-loading">
            <Spinner size={16} inline /> {t("dashboard.menu.loading")}
          </p>
        )}{" "}
        {error && (
          <p className="dashboard-error">
            {t("dashboard.menu.error")} {error}
          </p>
        )}
        {!loading && !error && (
          <>
            <CategoryManager
              restaurantId={restaurantId}
              categories={categories}
              onChanged={refetch}
            />

            {categories.length === 0 ? (
              <p className="menu-items-empty">{t("dashboard.manager.empty")}</p>
            ) : (
              <MenuItemsTable
                items={items}
                categories={categories}
                onEdit={(item) => {
                  setEditingItem(item);
                  setFormOpen(true);
                }}
                onChanged={refetch}
              />
            )}
          </>
        )}
        {formOpen && (
          <MenuItemForm
            restaurantId={restaurantId}
            categories={categories}
            item={editingItem}
            onSaved={() => {
              setFormOpen(false);
              refetch();
            }}
            onCancel={() => setFormOpen(false)}
          />
        )}
      </div>
    </DashboardLayout>
  );
}

export default DashboardMenu;
