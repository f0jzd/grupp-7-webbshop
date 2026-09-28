"use client";

import { ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { addProductToCart } from "@/actions";
import { Product } from "@/types";

export function AddToCartButton({ product }: { product: Product }) {
  return (
    <Button
      size="lg"
      className="flex-1 gap-2 text-base"
      onClick={() => addProductToCart(product)}
    >
      <ShoppingBag className="h-5 w-5" />
      Add to Cart
    </Button>
  );
}
