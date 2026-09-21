"use client";
import type { Product } from "@/types";
import { Modal } from "./Modal";
import Link from "next/link";
import Image from "next/image";
import { useTransition, useState } from "react";
import { deleteProduct } from "@/actions";

type ProductCardProps = Pick<
  Product,
  | "id"
  | "title"
  | "sku"
  | "thumbnail"
  | "brand"
  | "category"
  | "availabilityStatus"
  | "stock"
  | "price"
>;

export default function ProductCard({
  id,
  title,
  sku,
  thumbnail,
  brand,
  category,
  availabilityStatus,
  stock,
  price,
}: ProductCardProps) {
  const availabilityColor: string =
    availabilityStatus === "In Stock"
      ? "text-green-500"
      : availabilityStatus === "Low Stock"
        ? "text-amber-500"
        : "text-red-500";

  const [isOpen, setIsOpen] = useState(false);

  const handleDeleteClick = () => {
    setIsOpen(true);
  };

  const [isPending, startTransition] = useTransition();

  const handleConfirmDelete = () => {
    startTransition(async () => {
      const result = await deleteProduct(id);
      setIsOpen(false);
      if (result?.message) {
        console.error(result.message);
      }
    });
  };

  return (
    <article className="product-table-grid | bg-white">
      <div className="grid grid-cols-[4rem_7fr] items-center gap-x-4 pbs-4 md:pbs-0">
        <div>
          <h2 className="font-bold">{title}</h2>
          <p className="text-sm text-gray-500">{`SKU: ${sku}`}</p>
        </div>
        <Image
          src={thumbnail}
          alt=""
          width={300}
          height={300}
          className="order-first my-2 border border-gray-300 rounded-sm"
        />
      </div>
      <p className="text-left">{brand}</p>
      <p className="text-left">{category?.name}</p>
      <p className="text-right">
        <span className={`font-semibold ${availabilityColor}`}>
          {availabilityStatus}
        </span>
        (<span>{stock}</span>)
      </p>
      <p className="text-right font-semibold">{euros.format(price)}</p>
      <div className="flex justify-end md:justify-center gap-2 text-2xl  py-4">
        <button
          type="button"
          className="material-symbols p-1 text-red-800 rounded-lg hover:outline-2 hover:bg-red-800 hover:text-white"
          onClick={handleDeleteClick}
        >
          delete
        </button>

        <Link
          className="material-symbols p-1 rounded-lg hover:outline-2 hover:bg-indigo-500 hover:text-white"
          href={`/edit-product/${id}`}
        >
          edit
        </Link>
      </div>
      <Modal
        isOpen={isOpen}
        onConfirm={handleConfirmDelete}
        onClose={() => setIsOpen(false)}
        title="Are you sure you want to delete this item?"
        isPending={isPending}
        pendingText="Deleting..."
      >
        <p>{title}</p>
      </Modal>
    </article>
  );
}

const euros = new Intl.NumberFormat("en-IE", {
  style: "currency",
  currency: "EUR",
});
