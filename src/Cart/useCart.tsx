// context/CartContext.tsx
import React, { createContext, useContext, useEffect, useState } from "react";
import { TECHMART_BASE_URL, DEFAULT_HEADERS } from '../api/client';

type CartContextType = {
  cartCount: number;
  fetchCartCount: () => void;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const [cartCount, setCartCount] = useState(0);

  const fetchCartCount = async () => {
    try {
      const res = await fetch(`${TECHMART_BASE_URL}/GetCartCount`, {
        method: "GET",
        credentials: "include",
        headers: {
          ...DEFAULT_HEADERS,
        }
      });
      const data = await res.json();
      setCartCount(data.count); // assuming response is { "count": 5 }
    } catch (error) {
      console.error("Error fetching cart count:", error);
    }
  };

  useEffect(() => {
    fetchCartCount();
  }, []);

  return (
    <CartContext.Provider value={{ cartCount, fetchCartCount }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within a CartProvider");
  return context;
};
