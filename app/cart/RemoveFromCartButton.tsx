"use client";

export default function RemoveFromCartButton({removeId}: {removeId: number}) {
  return (
    <button onClick={() => console.log("remove", removeId)}>Remove from cart</button>
  );
}