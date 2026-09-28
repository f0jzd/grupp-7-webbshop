"use client";

import { ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Product } from "@/types";
import {useContext, useState } from "react";
import { CartContext } from "@/CartContext";

interface GridCardCartControlsProps {
  product: Product;
  count: number;
}

export function GridCardCartControls({
  product,
  count:initialCount,
}: GridCardCartControlsProps) {
  const [count, setCount] = useState(initialCount);
  const {setCart} = useContext(CartContext);

  function handleAdd(e: React.MouseEvent) {
    e.preventDefault();
    setCart((cart) => [...cart, {...product}]);
    setCount(c => c+1)
  }

  function handleRemove(e: React.MouseEvent) {
    e.preventDefault();
    if(count === 1 && !confirm("Would you like to remove " + '"'+ product.title + '"' + " from your cart?")){
        return;
    }

    setCart((cart) => {
      const productIndex = cart.findLastIndex(p => p.id  === product.id);
      const filtered = cart.filter((_,i) => i !== productIndex);
      return [...filtered]
    });
    setCount(c => c-1)
  }

  if (count === 0) {
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
        size="icon-sm"
        variant="outline"
        onClick={handleRemove}
      >
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
