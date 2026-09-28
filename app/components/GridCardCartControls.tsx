"use client";

import { ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { addProductToCart, removeItemFromCart } from "@/actions";
import { Product } from "@/types";
import { useRouter } from "next/navigation";

interface GridCardCartControlsProps {
  product: Product;
  count: number;
}

export function GridCardCartControls({
  product,
  count,
}: GridCardCartControlsProps) {
  const router = useRouter();

  if (count === 0) {
    return (
      <Button
        size="sm"
        className="w-full gap-2"
        onClick={async (e) => {
          e.preventDefault();
          await addProductToCart(product);
          router.refresh();
        }}
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
        onClick={async (e) => {
          e.preventDefault();
          await removeItemFromCart(product.id);
          router.refresh();
        }}
      >
        –
      </Button>
      <span className="font-semibold tabular-nums">{count}</span>
      <Button
        size="sm"
        variant="outline"
        className="h-8 w-8 p-0 cursor-pointer"
        onClick={async (e) => {
          e.preventDefault();
          await addProductToCart(product);
          router.refresh();
        }}
      >
        +
      </Button>
    </div>
  );
}
