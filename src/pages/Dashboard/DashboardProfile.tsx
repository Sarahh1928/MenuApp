import { useTranslation } from "react-i18next";
import { useAuth } from "../../hooks/useAuth";
import DashboardLayout from "../../components/dashboard/DashboardLayout/DashboardLayout";
import RestaurantProfileForm from "../../components/dashboard/RestaurantProfileForm/RestaurantProfileForm";
import HoursEditor from "../../components/dashboard/HoursEditor/HoursEditor";
import "./Dashboard.css";

function DashboardProfile() {
  const { t } = useTranslation();
  const { restaurantId } = useAuth();

  if (!restaurantId) return null;

  return (
    <DashboardLayout>
      <div className="dashboard-page">
        <div className="dashboard-page-header">
          <div>
            <h2>{t("dashboard.profile.title")}</h2>
            <p>{t("dashboard.profile.subtitle")}</p>
          </div>
        </div>

        <RestaurantProfileForm restaurantId={restaurantId} />

        <h3 className="dashboard-subsection-title">
          {t("dashboard.profile.hours")}
        </h3>

        <HoursEditor restaurantId={restaurantId} />
      </div>
    </DashboardLayout>
  );
}

export default DashboardProfile;
