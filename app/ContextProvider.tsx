'use client';
import { useEffect, useState } from "react";
import { Product } from "./types";
import { CartContext } from "./CartContext";
import { useRouter } from "next/navigation";

export function ContextProvider({ children, cart:initialCart }: {children: React.ReactNode, cart: Product[]}) {
  const [cart, setCart] = useState(initialCart);

  useEffect(() => {
    cookieStore.set({maxAge: 604800, name:"cart", value: JSON.stringify(cart.map(p => p.id))} as any);
  }, [cart])

  return (
    <CartContext.Provider value={{cart, setCart}}>
      {children}
    </CartContext.Provider>
  );
}