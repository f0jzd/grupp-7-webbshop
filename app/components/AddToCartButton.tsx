"use client";

import { Minus, Plus, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Product } from "@/types";
import { useContext } from "react";
import { CartContext } from '@/CartContext';

export function AddToCartButton({ product }: { product: Product }) {
  const {addProductToCart} = useContext(CartContext);
  return (
    <Button
      size="lg"
      className="flex-1 gap-2 text-base"
      onClick={() => {
        addProductToCart(product);
      }}
    >
      <ShoppingBag className="h-5 w-5" />
      Add to Cart
    </Button>
  );
}
