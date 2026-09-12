import type { ReactNode } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../../hooks/useAuth";
import LanguageSwitcher from "../../common/LanguageSwitcher";
import "./DashboardLayout.css";
import { useTranslation } from "react-i18next";

interface DashboardLayoutProps {
  children: ReactNode;
}

function DashboardLayout({ children }: DashboardLayoutProps) {
  const { t } = useTranslation();
  const { signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate("/login", { replace: true });
  };

  return (
    <div className="dashboard-shell">
      <header className="dashboard-topbar">
        <span className="dashboard-topbar-title">🍔 {t("nav.dashboard")}</span>

        <nav className="dashboard-topbar-nav">
          <NavLink to="/dashboard" end>
            <span className="dashboard-nav-icon">🍽️</span>
            <span>{t("nav.menu")}</span>
          </NavLink>
          <NavLink to="/dashboard/orders">
            <span className="dashboard-nav-icon">🧾</span>
            <span>{t("nav.orders")}</span>
          </NavLink>
          <NavLink to="/dashboard/stats">
            <span className="dashboard-nav-icon">📊</span>
            <span>{t("nav.stats")}</span>
          </NavLink>
          <NavLink to="/dashboard/profile">
            <span className="dashboard-nav-icon">🏠</span>
            <span>{t("nav.profile")}</span>
          </NavLink>
        </nav>

        <div className="dashboard-topbar-actions">
          <LanguageSwitcher inline />
          <button
            type="button"
            className="dashboard-topbar-signout"
            onClick={handleSignOut}
          >
            {t("nav.signOut")}
          </button>
        </div>
      </header>

      <main className="dashboard-main">
        <div className="dashboard-content">{children}</div>
      </main>

      <nav className="dashboard-bottom-nav">
        <NavLink to="/dashboard" end>
          <span className="dashboard-bottom-nav-icon">🍽️</span>
          <span>{t("nav.menu")}</span>
        </NavLink>
        <NavLink to="/dashboard/orders">
          <span className="dashboard-bottom-nav-icon">🧾</span>
          <span>{t("nav.orders")}</span>
        </NavLink>
        <NavLink to="/dashboard/stats">
          <span className="dashboard-bottom-nav-icon">📊</span>
          <span>{t("nav.stats")}</span>
        </NavLink>
        <NavLink to="/dashboard/profile">
          <span className="dashboard-bottom-nav-icon">🏠</span>
          <span>{t("nav.profile")}</span>
        </NavLink>
      </nav>
    </div>
  );
}

export default DashboardLayout;
