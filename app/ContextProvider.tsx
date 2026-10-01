'use client';
import { useCallback, useEffect, useState } from "react";
import { Product } from "./types";
import { CartContext } from "./CartContext";

export function ContextProvider({ children, cart:providedCart }: {children: React.ReactNode, cart: Product[]}) {
  const [cart, setCart] = useState(providedCart);

  useEffect(() => {
    cookieStore.set({maxAge: 604800, name:"cart", value: JSON.stringify(cart.map(p => p.id))} as any);
  }, [cart]);

  useEffect(() => {
    setCart([...providedCart]);
  }, [providedCart]);

  const addProductToCart = useCallback((product: Product) => 
    setCart(products => [...products,{...product}]),
  []);

  const removeProductFromCart = useCallback((product: Product) => setCart(products => {
      const removeIdLast = products.findLastIndex(v => v.id === product.id);
      const filtered = products.filter((_,i) => i !== removeIdLast);
      return [...filtered];
    }),[])

  return (
    <CartContext.Provider value={{cart, addProductToCart,removeProductFromCart}}>
      {children}
    </CartContext.Provider>
  );
}