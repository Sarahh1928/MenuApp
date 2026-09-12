import { useTranslation } from "react-i18next";
import type { Order } from "../../../types/order";
import OrderCard from "../OrderCard/OrderCard";
import "./OrdersList.css";

interface OrdersListProps {
  orders: Order[];
}

function OrdersList({ orders }: OrdersListProps) {
  const { t } = useTranslation();

  if (orders.length === 0) {
    return (
      <div className="orders-empty">
        <p>{t("dashboard.orders.empty")}</p>
      </div>
    );
  }

  return (
    <div className="orders-list">
      {orders.map((order) => (
        <OrderCard key={order.id} order={order} />
      ))}
    </div>
  );
}

export default OrdersList;
