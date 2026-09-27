import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import "./NotFound.css";

function NotFound() {
  const { t } = useTranslation();

  return (
    <div className="notfound-page">
      <div className="notfound-card">
        <span className="notfound-icon">🍔</span>
        <h1>{t("notFound.title")}</h1>
        <p>{t("notFound.message")}</p>
      </div>
    </div>
  );
}

export default NotFound;
