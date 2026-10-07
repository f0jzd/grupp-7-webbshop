import { ProductForm } from "@/components/ProductForm";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: 'Admin - Add product',
  description: 'Add product to product catalog',
}

/* When using metadata titles you need to put explicit export
dynamic = "auto" otherwise npm run build will not complete.
I think this is a next.js bug */
export const dynamic = "auto";

export default async function ProductPage() {
  return (
    <main>
      <ProductForm />
    </main>
  );
}
