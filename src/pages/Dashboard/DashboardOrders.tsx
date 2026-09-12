import { useAuth } from "../../hooks/useAuth";
import { useOrders } from "../../hooks/useOrders";
import DashboardLayout from "../../components/dashboard/DashboardLayout/DashboardLayout";
import OrdersList from "../../components/dashboard/OrdersList/OrdersList";
import "./Dashboard.css";
import { useTranslation } from "react-i18next";

function DashboardOrders() {
  const { t } = useTranslation();
  const { restaurantId } = useAuth();
  const { orders, loading, error, refetch } = useOrders(restaurantId);

  return (
    <DashboardLayout>
      <div className="dashboard-page">
        <div className="dashboard-page-header">
          <div>
            <h2>{t("dashboard.orders.title")}</h2>
            <p>{t("dashboard.orders.subtitle")}</p>
          </div>

          <button
            type="button"
            className="dashboard-refresh-btn"
            onClick={refetch}
          >
            ↻ {t("dashboard.orders.refresh")}
          </button>
        </div>

        {loading && <p>{t("dashboard.orders.loading")}</p>}
        {error && (
          <p className="dashboard-error">
            {t("dashboard.orders.error")} {error}
          </p>
        )}
        {!loading && !error && <OrdersList orders={orders} />}
      </div>
    </DashboardLayout>
  );
}

export default DashboardOrders;
