'use client';
import { createContext, Dispatch, SetStateAction, useEffect, useState } from "react";
import { Product } from "./types";

export const CartContext = createContext<{cart:Product[]; setCart: Dispatch<SetStateAction<Product[]>>}>({cart:[], setCart: () => null});

export function ContextProvider({ children, cart:initialCart }: {children: React.ReactNode, cart: Product[]}) {
  const [cart, setCart] = useState(initialCart);

  useEffect(() => {
    document.cookie = `cart=${JSON.stringify(cart.map(p => p.id))}; max-age=604800`;
  }, [cart])

  return (
    <CartContext.Provider value={{cart, setCart}}>
      {children}
    </CartContext.Provider>
  );
}