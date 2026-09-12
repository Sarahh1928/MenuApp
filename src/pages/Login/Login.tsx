import { useTranslation } from "react-i18next";
import { Navigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import LoginForm from "../../components/auth/LoginForm";
import "./Login.css";

function Login() {
  const { t } = useTranslation();
  const { user, loading } = useAuth();

  if (!loading && user) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="login-page">
      <div className="login-card">
        <h1>{t("login.title")}</h1>
        <p>{t("login.subtitle")}</p>
        <LoginForm />
      </div>
    </div>
  );
}

export default Login;
