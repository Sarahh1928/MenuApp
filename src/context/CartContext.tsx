import { createContext, useState, type ReactNode } from "react";
import type { MenuItem } from "../types/menu";

export interface CartLine {
  item: MenuItem;
  qty: number;
}

interface CartContextValue {
  lines: CartLine[];
  addItem: (item: MenuItem) => void;
  removeItem: (itemId: string) => void;
  setQty: (itemId: string, qty: number) => void;
  clear: () => void;
  total: number;
  count: number;
}

export const CartContext = createContext<CartContextValue | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>([]);

  const addItem = (item: MenuItem) => {
    setLines((current) => {
      const existing = current.find((l) => l.item.id === item.id);
      if (existing) {
        return current.map((l) =>
          l.item.id === item.id ? { ...l, qty: l.qty + 1 } : l
        );
      }
      return [...current, { item, qty: 1 }];
    });
  };

  const removeItem = (itemId: string) => {
    setLines((current) => current.filter((l) => l.item.id !== itemId));
  };

  const setQty = (itemId: string, qty: number) => {
    if (qty <= 0) return removeItem(itemId);
    setLines((current) =>
      current.map((l) => (l.item.id === itemId ? { ...l, qty } : l))
    );
  };

  const clear = () => setLines([]);
  const total = lines.reduce((sum, l) => sum + l.item.price * l.qty, 0);
  const count = lines.reduce((sum, l) => sum + l.qty, 0);

  return (
    <CartContext.Provider value={{ lines, addItem, removeItem, setQty, clear, total, count }}>
      {children}
    </CartContext.Provider>
  );
}