import type { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import Spinner from "../common/Spinner";
import { useTranslation } from "react-i18next";

interface ProtectedRouteProps {
  children: ReactNode;
}

function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { t } = useTranslation();
  const { user, restaurantId, loading } = useAuth();

  if (loading) {
    return (
      <p className="dashboard-loading">
        <Spinner size={16} inline /> {t("restaurant.loading")}
      </p>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (!restaurantId) {
    return (
      <div className="auth-error-page">
        <p>Your account isn't linked to a restaurant yet.</p>
        <p>Contact support to finish setup.</p>
      </div>
    );
  }

  return <>{children}</>;
}

export default ProtectedRoute;
