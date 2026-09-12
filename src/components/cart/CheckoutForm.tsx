import { useState } from "react";
import { supabase } from "../../lib/supabase";
import { useCart } from "../../hooks/useCart";
import { generateOrderCode } from "../../lib/orderCode";
import { buildOrderMessage, buildWaLink } from "../../lib/whatsapp";
import type { Restaurant } from "../../types/restaurant";
import type { FulfillmentType } from "../../types/order";
import "./cart.css";
import { useTranslation } from "react-i18next";

interface CheckoutFormProps {
  restaurant: Restaurant;
  onBack: () => void;
  onComplete: () => void;
}

function CheckoutForm({ restaurant, onBack, onComplete }: CheckoutFormProps) {
  const { t } = useTranslation();
  const { lines, total, clear } = useCart();

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [fulfillmentType, setFulfillmentType] =
    useState<FulfillmentType>("delivery");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const canSubmit =
    name.trim() &&
    phone.trim() &&
    (fulfillmentType === "pickup" || address.trim()) &&
    lines.length > 0 &&
    !submitting;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;

    setSubmitting(true);
    setError(null);

    const orderCode = generateOrderCode(restaurant.slug);

    const { error: insertError } = await supabase.from("orders").insert({
      restaurant_id: restaurant.id,
      customer_name: name.trim(),
      customer_phone: phone.trim(),
      customer_address: fulfillmentType === "delivery" ? address.trim() : null,
      fulfillment_type: fulfillmentType,
      items: lines.map((l) => ({
        name: l.item.name,
        price: l.item.price,
        qty: l.qty,
      })),
      total,
      order_code: orderCode,
      status: "sent",
    });

    if (insertError) {
      setError(t("checkout.error"));
      setSubmitting(false);
      return;
    }

    const message = buildOrderMessage({
      orderCode,
      restaurantName: restaurant.name,
      customerName: name.trim(),
      customerPhone: phone.trim(),
      customerAddress: address.trim(),
      fulfillmentType,
      lines,
      total,
    });

    const link = buildWaLink(restaurant.whatsapp, message);

    clear();
    onComplete();
    window.open(link, "_blank", "noopener,noreferrer");
  };

  return (
    <form className="checkout-form" onSubmit={handleSubmit}>
      <label>
        {t("checkout.name")}
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </label>

      <label>
        {t("checkout.phone")}
        <input
          type="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          required
        />
      </label>

      <div className="checkout-fulfillment-toggle">
        <button
          type="button"
          className={fulfillmentType === "delivery" ? "active" : ""}
          onClick={() => setFulfillmentType("delivery")}
        >
          🛵 {t("checkout.delivery")}
        </button>
        <button
          type="button"
          className={fulfillmentType === "pickup" ? "active" : ""}
          onClick={() => setFulfillmentType("pickup")}
        >
          🥡 {t("checkout.pickup")}
        </button>
      </div>

      {fulfillmentType === "delivery" && (
        <label>
          {t("checkout.address")}
          <textarea
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            required
          />
        </label>
      )}

      {error && <p className="checkout-error">{error}</p>}

      <div className="checkout-form-actions">
        <button type="button" className="checkout-back-btn" onClick={onBack}>
          ← {t("checkout.back")}
        </button>
        <button
          type="submit"
          className="checkout-submit-btn"
          disabled={!canSubmit}
        >
          {submitting
            ? t("checkout.placing")
            : t("checkout.sendOrder", {
                total: total.toFixed(2),
              })}
        </button>
      </div>
    </form>
  );
}

export default CheckoutForm;
