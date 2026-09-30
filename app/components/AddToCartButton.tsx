"use client";

import { Minus, Plus, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { addProductToCart, removeItemFromCart } from "@/actions";
import { Product } from "@/types";
import { useOptimistic, startTransition } from "react";

interface AddToCartButtonProps {
  product: Product;
  count: number;
}

export function AddToCartButton({ product, count }: AddToCartButtonProps) {
  const [optimisticCount, updateOptimisticCount] = useOptimistic(
    count,
    (current, delta: number) => current + delta
  );

  function handleAdd() {
    startTransition(async () => {
      updateOptimisticCount(1);
      await addProductToCart(product);
    });
  }

  function handleRemove() {
    startTransition(async () => {
      updateOptimisticCount(-1);
      await removeItemFromCart(product.id);
    });
  }

  if (optimisticCount === 0) {
    return (
      <Button size="lg" className="flex-1 gap-2 text-base" onClick={handleAdd}>
        <ShoppingBag className="h-5 w-5" />
        Add to Cart
      </Button>
    );
  }

  return (
    <div className="flex flex-1 items-center justify-between gap-3">
      <Button size="lg" variant="outline" className="px-4" onClick={handleRemove}>
        <Minus className="h-5 w-5" />
      </Button>
      <span className="flex-1 text-center text-lg font-semibold tabular-nums">
        {optimisticCount} in cart
      </span>
      <Button size="lg" variant="outline" className="px-4" onClick={handleAdd}>
        <Plus className="h-5 w-5" />
      </Button>
    </div>
  );
}
