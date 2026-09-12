import { useState } from "react";
import { useCart } from "../../hooks/useCart";
import type { Restaurant } from "../../types/restaurant";
import CheckoutForm from "./CheckoutForm";
import "./cart.css";
import { useTranslation } from "react-i18next";

interface CartDrawerProps {
  restaurant: Restaurant;
  onClose: () => void;
}

function CartDrawer({ restaurant, onClose }: CartDrawerProps) {
  const { t } = useTranslation();
  const { lines, setQty, removeItem, total } = useCart();
  const [step, setStep] = useState<"cart" | "checkout">("cart");

  return (
    <div className="cart-drawer-overlay" onClick={onClose}>
      <div className="cart-drawer" onClick={(e) => e.stopPropagation()}>
        <div className="cart-drawer-header">
          <h3>{step === "cart" ? t("cart.title") : t("checkout.title")}</h3>
          <button type="button" className="cart-drawer-close" onClick={onClose}>
            ✕
          </button>
        </div>

        {step === "cart" && (
          <>
            {lines.length === 0 ? (
              <p className="cart-drawer-empty">{t("cart.empty")}</p>
            ) : (
              <>
                <div className="cart-drawer-lines">
                  {lines.map((line) => (
                    <div key={line.item.id} className="cart-drawer-line">
                      <div className="cart-line-info">
                        <strong>{line.item.name}</strong>
                        <span>
                          {line.item.price.toFixed(2)} {t("cart.currency")}
                        </span>
                      </div>

                      <div className="cart-line-qty">
                        <button
                          type="button"
                          onClick={() => setQty(line.item.id, line.qty - 1)}
                        >
                          −
                        </button>
                        <span>{line.qty}</span>
                        <button
                          type="button"
                          onClick={() => setQty(line.item.id, line.qty + 1)}
                        >
                          +
                        </button>
                      </div>

                      <button
                        type="button"
                        className="cart-line-remove"
                        onClick={() => removeItem(line.item.id)}
                      >
                        🗑
                      </button>
                    </div>
                  ))}
                </div>

                <div className="cart-drawer-total">
                  <span>{t("cart.total")}</span>
                  <strong>
                    {total.toFixed(2)} {t("cart.currency")}
                  </strong>
                </div>

                <button
                  type="button"
                  className="cart-drawer-checkout-btn"
                  onClick={() => setStep("checkout")}
                >
                  {t("cart.checkout")}
                </button>
              </>
            )}
          </>
        )}

        {step === "checkout" && (
          <CheckoutForm
            restaurant={restaurant}
            onBack={() => setStep("cart")}
            onComplete={onClose}
          />
        )}
      </div>
    </div>
  );
}

export default CartDrawer;
