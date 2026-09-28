'use client';
import { createContext, Dispatch, SetStateAction, useEffect, useState } from "react";
import { Product } from "./types";

export const CartContext = createContext<{cart:Product[]; setCart: Dispatch<SetStateAction<Product[]>>}>({cart:[], setCart: () => null});

export function ContextProvider({ children, cart:initialCart }: {children: React.ReactNode, cart: Product[]}) {
  const [cart, setCart] = useState(initialCart);

  useEffect(() => {
    cookieStore.set({maxAge: 604800, name:"cart", value: JSON.stringify(cart.map(p => p.id))} as any)
  }, [cart])

  return (
    <CartContext.Provider value={{cart, setCart}}>
      {children}
    </CartContext.Provider>
  );
}