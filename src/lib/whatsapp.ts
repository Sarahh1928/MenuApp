import type { CartLine } from "../context/CartContext";
import type { FulfillmentType } from "../types/order";

interface OrderMessageInput {
  orderCode: string;
  restaurantName: string;
  customerName: string;
  customerPhone: string;
  customerAddress: string;
  fulfillmentType: FulfillmentType;
  lines: CartLine[];
  total: number;
}

export function buildOrderMessage(input: OrderMessageInput): string {
  const itemLines = input.lines
    .map((l) => `- ${l.qty}x ${l.item.name} (${(l.item.price * l.qty).toFixed(2)} EGP)`)
    .join("\n");

  const addressLine =
    input.fulfillmentType === "delivery" ? `\nAddress: ${input.customerAddress}` : "";

  return (
    `New order [${input.orderCode}] - ${input.restaurantName}\n\n` +
    `${itemLines}\n\n` +
    `Total: ${input.total.toFixed(2)} EGP\n` +
    `Fulfillment: ${input.fulfillmentType === "pickup" ? "Pickup" : "Delivery"}${addressLine}\n\n` +
    `Customer: ${input.customerName}\n` +
    `Phone: ${input.customerPhone}`
  );
}

export function buildWaLink(whatsappNumber: string, message: string): string {
  const digitsOnly = whatsappNumber.replace(/\D/g, "");
  return `https://wa.me/${digitsOnly}?text=${encodeURIComponent(message)}`;
}