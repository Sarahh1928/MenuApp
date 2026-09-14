import { useState } from "react";
import { useTranslation } from "react-i18next";
import "./LanguageSwitcher.css";

interface LanguageSwitcherProps {
  inline?: boolean;
}

function LanguageSwitcher({ inline = false }: LanguageSwitcherProps) {
  const { i18n } = useTranslation();
  const [switching, setSwitching] = useState(false);

  const toggle = () => {
    if (switching) return;
    setSwitching(true);

    // brief delay so the overlay is visible before the actual switch happens
    setTimeout(() => {
      i18n.changeLanguage(i18n.language === "ar" ? "en" : "ar");

      // hold the overlay a touch longer after switching so layout settles
      // (RTL/LTR flip, font change) before revealing it
      setTimeout(() => {
        setSwitching(false);
      }, 200);
    }, 150);
  };

  return (
    <>
      <button
        type="button"
        className={
          inline
            ? "language-switcher language-switcher-inline"
            : "language-switcher"
        }
        onClick={toggle}
        disabled={switching}
      >
        <span className="language-switcher-icon">🌐</span>
        <span>{i18n.language === "ar" ? "English" : "العربية"}</span>
      </button>

      {switching && (
        <div className="language-switch-overlay">
          <div className="language-switch-spinner" />
        </div>
      )}
    </>
  );
}

export default LanguageSwitcher;
