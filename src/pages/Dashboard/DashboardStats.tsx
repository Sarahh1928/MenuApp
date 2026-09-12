import { useTranslation } from "react-i18next";
import { useAuth } from "../../hooks/useAuth";
import DashboardLayout from "../../components/dashboard/DashboardLayout/DashboardLayout";
import StatsOverview from "../../components/dashboard/StatsOverview/StatsOverview";
import "./Dashboard.css";

function DashboardStats() {
  const { restaurantId } = useAuth();
  const { t } = useTranslation();

  if (!restaurantId) return null;

  return (
    <DashboardLayout>
      <div className="dashboard-page">
        <div className="dashboard-page-header">
          <div>
            <h2>{t("dashboard.stats.title")}</h2>
            <p>{t("dashboard.stats.subtitle")}</p>
          </div>
        </div>

        <StatsOverview restaurantId={restaurantId} />
      </div>
    </DashboardLayout>
  );
}

export default DashboardStats;
