import { useTranslation } from "react-i18next";
import { useCart } from "../../hooks/useCart";

interface FloatingCartButtonProps {
  onClick: () => void;
}

function FloatingCartButton({ onClick }: FloatingCartButtonProps) {
  const { t } = useTranslation();
  const { count, total } = useCart();

  if (count === 0) return null;

  return (
    <button type="button" className="floating-cart" onClick={onClick}>
      <span className="cart-icon">🛒</span>

      <div>
        <strong>{t("cart.viewCart")}</strong>
        <small>
          {t("cart.itemSummary", {
            count,
            plural: count !== 1 ? "s" : "",
            total: total.toFixed(2),
            currency: t("cart.currency"),
          })}
        </small>
      </div>

      <span className="cart-arrow">→</span>
    </button>
  );
}

export default FloatingCartButton;
