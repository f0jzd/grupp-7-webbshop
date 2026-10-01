"use client";

import { ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Product } from "@/types";
import {useContext, useState } from "react";
import { CartContext } from "@/CartContext";

interface GridCardCartControlsProps {
  product: Product;
}

export function GridCardCartControls({
  product
}: GridCardCartControlsProps) {
  const {cart} = useContext(CartContext);
  const initialCount = cart.reduce((acc, p) => p.id === product.id ? acc + 1 : acc, 0);
  const [count, setCount] = useState(initialCount);
  const {addProductToCart, removeProductFromCart} = useContext(CartContext);

  function handleAdd(e: React.MouseEvent) {
    e.preventDefault();
    addProductToCart(product);
    setCount(c => c+1)
  }

  function handleRemove(e: React.MouseEvent) {
    e.preventDefault();
    removeProductFromCart(product);
    setCount(c => c-1)
  }

  if (count === 0) {
    return (
      <Button size="sm" className="w-full gap-2" onClick={handleAdd}>
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
      <Button size="icon-sm" variant="outline" onClick={handleRemove}>
        –
      </Button>
      <span className="font-semibold tabular-nums">{count}</span>
      <Button
        size="icon-sm"
        variant="outline"
        onClick={handleAdd}
      >
        +
      </Button>
    </div>
  );
}
