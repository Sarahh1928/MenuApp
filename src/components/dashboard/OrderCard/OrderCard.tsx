import { useTranslation } from "react-i18next";
import type { Order } from "../../../types/order";
import "./OrderCard.css";

interface OrderCardProps {
  order: Order;
}

function timeAgo(dateString: string, t: any) {
  const diffMs = Date.now() - new Date(dateString).getTime();
  const mins = Math.floor(diffMs / 60000);

  if (mins < 1) return t("dashoboard.orders.justNow");
  if (mins < 60) {
    return t("dashoboard.orders.minutesAgo", { count: mins });
  }

  const hours = Math.floor(mins / 60);

  if (hours < 24) {
    return t("dashoboard.orders.hoursAgo", { count: hours });
  }

  const days = Math.floor(hours / 24);

  return t("dashoboard.orders.daysAgo", { count: days });
}

function OrderCard({ order }: OrderCardProps) {
  const { t } = useTranslation();

  return (
    <div className="order-card">
      <div className="order-card-header">
        <span className="order-code">{order.order_code}</span>

        <span className={`order-fulfillment ${order.fulfillment_type}`}>
          {order.fulfillment_type === "pickup"
            ? `🥡 ${t("dashoboard.orders.pickup")}`
            : `🛵 ${t("dashoboard.orders.delivery")}`}
        </span>

        <span className="order-time">{timeAgo(order.created_at, t)}</span>
      </div>

      <div className="order-customer">
        <strong>{order.customer_name}</strong>
        <span>{order.customer_phone}</span>

        {order.fulfillment_type === "delivery" && order.customer_address && (
          <span className="order-address">{order.customer_address}</span>
        )}
      </div>

      <ul className="order-items">
        {order.items.map((item, i) => (
          <li key={i}>
            <span>{item.qty}×</span> {item.name}
            <span className="order-item-price">
              {(item.price * item.qty).toFixed(2)} {t("cart.currency")}
            </span>
          </li>
        ))}
      </ul>

      <div className="order-total">
        <span>{t("dashoboard.orders.total")}</span>

        <strong>
          {order.total.toFixed(2)} {t("cart.currency")}
        </strong>
      </div>

      <a
        href={`https://wa.me/${order.customer_phone.replace(/\D/g, "")}`}
        target="_blank"
        rel="noopener noreferrer"
        className="order-whatsapp-btn"
      >
        💬 {t("dashoboard.orders.messageCustomer")}
      </a>
    </div>
  );
}

export default OrderCard;
