"use client";

import { ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Product } from "@/types";
import { useContext } from "react";
import { CartContext } from "@/ContextProvider";

export function AddToCartButton({ product }: { product: Product }) {
  const {setCart} = useContext(CartContext);
  return (
    <Button
      size="lg"
      className="flex-1 gap-2 text-base"
      onClick={() => setCart(cart => [...cart, {...product}])}
    >
      <ShoppingBag className="h-5 w-5" />
      Add to Cart
    </Button>
  );
}
