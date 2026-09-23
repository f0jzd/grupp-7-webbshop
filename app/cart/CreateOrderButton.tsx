"use client";
import { Button } from "@/components/ui/button";

export default function CreateOrderButton() {
  return (
    <Button onClick={() => {
        alert("Order created!")
    }}>Create order</Button>
  );
}