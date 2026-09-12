import type { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

interface ProtectedRouteProps {
  children: ReactNode;
}

function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { user, restaurantId, loading } = useAuth();

  if (loading) {
    return <div className="auth-loading">Loading...</div>;
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