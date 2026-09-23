"use client";
import { removeItemFromCart } from "@/actions";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export default function RemoveFromCartButton({removeId,count,productTitle}: {removeId: number;count:number; productTitle: string}) {
  const router = useRouter();
  return (
    <Button variant="link" 
        className="no-underline hover:no-underline cursor-pointer"
        onClick={async () => {
          if(count === 1 && !confirm("Would you like to remove " + '"'+ productTitle + '"' + " from your cart?")){
            return;
          }
          await removeItemFromCart(removeId);
          router.refresh();
    }}>
      -
    </Button>
  );
}