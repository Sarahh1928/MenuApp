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

    document.documentElement.classList.add("lang-transitioning");

    // let the fade-out play, then swap language, then fade back in
    setTimeout(() => {
      i18n.changeLanguage(i18n.language === "ar" ? "en" : "ar");

      setTimeout(() => {
        document.documentElement.classList.remove("lang-transitioning");
        setSwitching(false);
      }, 150);
    }, 150);
  };

  return (
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
      <span className="language-switcher-icon">{switching ? "⏳" : "🌐"}</span>
      <span>{i18n.language === "ar" ? "English" : "العربية"}</span>
    </button>
  );
}

export default LanguageSwitcher;
