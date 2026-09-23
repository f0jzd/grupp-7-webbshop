"use client";
import { useRouter } from "next/navigation";

export default function RemoveFromCartButton({removeId,count}: {removeId: number;count:number}) {
  const router = useRouter();
  return (
    <button className="cursor-pointer" onClick={() => {
      router.refresh();
    }}>{count === 1? "Remove from cart" : "Remove one"}</button>
  );
}