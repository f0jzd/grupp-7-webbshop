"use client";

import { ShoppingBag } from "lucide-react";
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
    (current, delta: number) => current + delta
  );

  function handleAdd(e: React.MouseEvent) {
    e.preventDefault();
    startTransition(async () => {
      updateOptimisticCount(1);
      await addProductToCart(product);
    });
  }

  function handleRemove(e: React.MouseEvent) {
    e.preventDefault();
    startTransition(async () => {
      updateOptimisticCount(-1);
      await removeItemFromCart(product.id);
    });
  }

  if (optimisticCount === 0) {
    return (
      <Button
        size="sm"
        className="w-full gap-2"
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
      onClick={(e) => e.preventDefault()}
    >
      <Button
        size="sm"
        variant="outline"
        className="h-8 w-8 p-0 cursor-pointer"
        onClick={handleRemove}
      >
        –
      </Button>
      <span className="font-semibold tabular-nums">{optimisticCount}</span>
      <Button
        size="sm"
        variant="outline"
        className="h-8 w-8 p-0 cursor-pointer"
        onClick={handleAdd}
      >
        +
      </Button>
    </div>
  );
}
