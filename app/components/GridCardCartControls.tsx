"use client";

import { Minus, Plus, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { addProductToCart, removeItemFromCart } from "@/actions";
import { Product } from "@/types";
import { useOptimistic, startTransition } from "react";

interface GridCardCartControlsProps {
  product: Product;
  count: number;
}

export function GridCardCartControls({
  product,
  count,
}: GridCardCartControlsProps) {
  const [optimisticCount, updateOptimisticCount] = useOptimistic(
    count,
    (current, delta: number) => current + delta,
  );

  function handleAdd(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    startTransition(async () => {
      updateOptimisticCount(1);
      await addProductToCart(product);
    });
  }

  function handleRemove(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    startTransition(async () => {
      updateOptimisticCount(-1);
      await removeItemFromCart(product.id);
    });
  }

  if (optimisticCount === 0) {
    return (
      <Button
        size="sm"
        className="w-full gap-2 rounded-xl h-9"
        onClick={handleAdd}
      >
        <ShoppingBag className="h-4 w-4" />
        Add to Cart
      </Button>
    );
  }

  return (
    <div
      className="flex items-center justify-between w-full gap-2"
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
      }}
    >
      <Button
        size="icon-sm"
        variant="outline"
        className="h-9 w-9 rounded-xl shrink-0"
        onClick={handleRemove}
      >
        <Minus className="h-3.5 w-3.5" />
      </Button>
      <span className="font-semibold tabular-nums text-sm text-center flex-1">
        {optimisticCount} in cart
      </span>
      <Button
        size="icon-sm"
        variant="outline"
        className="h-9 w-9 rounded-xl shrink-0"
        onClick={handleAdd}
      >
        <Plus className="h-3.5 w-3.5" />
      </Button>
    </div>
  );
}

