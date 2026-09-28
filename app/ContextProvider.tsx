'use client';
import { useEffect, useState } from "react";
import { Product } from "./types";
import { CartContext } from "./CartContext";

export function ContextProvider({ children, cart:providedCart }: {children: React.ReactNode, cart: Product[]}) {
  const [cart, setCart] = useState(providedCart);

  useEffect(() => {
    cookieStore.set({maxAge: 604800, name:"cart", value: JSON.stringify(cart.map(p => p.id))} as any);
  }, [cart]);

  useEffect(() => {
    setCart([...providedCart]);
  }, [providedCart])

  return (
    <CartContext.Provider value={{cart, setCart}}>
      {children}
    </CartContext.Provider>
  );
}