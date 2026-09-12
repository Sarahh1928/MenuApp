import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { useTranslation } from "react-i18next";

function LoginForm() {
  const { t } = useTranslation();
  const { signIn } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    const { error } = await signIn(email.trim(), password);

    if (error) {
      setError("Incorrect email or password.");
      setSubmitting(false);
      return;
    }

    navigate("/dashboard", { replace: true });
  };

  return (
    <form className="login-form" onSubmit={handleSubmit}>
      <label>
        {t("login.email")}
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          autoComplete="email"
          required
        />
      </label>

      <label>
        {t("login.password")}
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete="current-password"
          required
        />
      </label>

      {error && <p className="login-error">{t("login.error")}</p>}

      <button type="submit" className="login-submit-btn" disabled={submitting}>
        {submitting ? t("login.signingIn") : t("login.signIn")}
      </button>
    </form>
  );
}

export default LoginForm;
