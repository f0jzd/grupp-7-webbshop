"use client";
import { addProductToCart} from "@/actions";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Product } from "@/types";

export default function IncreaseCountButton({product}: {product: Product}) {
  const router = useRouter();
  return (
    <Button variant="link" 
        className="no-underline hover:no-underline cursor-pointer"
        onClick={async () => {
        await addProductToCart(product);
        router.refresh();
    }}>
      +
    </Button>
  );
}