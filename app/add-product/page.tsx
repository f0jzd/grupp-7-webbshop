import { ProductForm } from "@/components/ProductForm";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: 'Admin - Add product',
  description: 'Add product to product catalog',
}

export const dynamic = "force-dynamic"

export async function generateMetadata(
  { params }:{params: Promise<{ title: string }>}): Promise<Metadata> {
 
  return {
    title: "title",
    description: "View product information like title, price, description, specifications, stock, reviews, etc. and add product to cart",
  }
}

export default async function ProductPage() {
  return (
    <main>
      <ProductForm />
    </main>
  );
}
