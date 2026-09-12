export interface CartItemSnapshot {
  name: string;
  price: number;
  qty: number;
}

export type FulfillmentType = "pickup" | "delivery";

export interface Order {
  id: string;
  restaurant_id: string;
  created_at: string;
  customer_name: string;
  customer_phone: string;
  customer_address: string | null;
  fulfillment_type: FulfillmentType;
  items: CartItemSnapshot[];
  total: number;
  order_code: string;
  status: string;
}