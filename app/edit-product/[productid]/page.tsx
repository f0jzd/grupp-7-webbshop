import { ProductForm } from "@/components/ProductForm";
import { Product } from "@/types";
import { Metadata } from "next";

const API_URL = "http://localhost:4000";

async function getProduct(id: string): Promise<Product | null> {
  const response = await fetch(
    `${API_URL}/products/${id}`,
    { cache: "no-store" },
  );
  if (!response.ok) return null;
  const data = await response.json();

  return data;
}

export async function generateMetadata(
  { params }:{params: Promise<{ productid: string }>}): Promise<Metadata> {
  const productid = (await params).productid;
  const product = await getProduct(productid);
 
  return {
    title: "Admin - " + product?.title,
    description: "Edit product and view product information like title, price, description, specifications, stock, reviews, etc.",
  }
}

type Props = {
  params: Promise<{
    productid: string;
  }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function EditProductPage({ params, searchParams }: Props) {
  const { productid } = await params;
  const query = await searchParams;
  const productId = Number(productid);

  return <ProductForm productId={productId} searchParams={query} />;
}
