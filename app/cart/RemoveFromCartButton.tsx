"use client";
import { removeItemFromCart } from "@/actions";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export default function RemoveFromCartButton({removeId,count}: {removeId: number;count:number}) {
  const router = useRouter();
  return (
    <Button variant="link" className="no-underline hover:no-underline text-red-400" onClick={async () => {
      await removeItemFromCart(removeId);
      router.refresh();
    }}>{count === 1? "Remove from cart" : "Remove one"}</Button>
  );
}