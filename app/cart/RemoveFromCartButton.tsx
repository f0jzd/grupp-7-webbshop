"use client";
import { removeItemFromCart } from "@/actions";
import { useRouter } from "next/navigation";

export default function RemoveFromCartButton({removeId,count}: {removeId: number;count:number}) {
  const router = useRouter();
  return (
    <button className="cursor-pointer" onClick={async () => {
      await removeItemFromCart(removeId);
      router.refresh();
    }}>{count === 1? "Remove from cart" : "Remove one"}</button>
  );
}