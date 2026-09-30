import { ProductForm } from "@/components/ProductForm";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: 'Admin - Add product',
  description: 'Add product to product catalog',
}

export default async function ProductPage() {
  return (
    <main>
      <ProductForm />
    </main>
  );
}
