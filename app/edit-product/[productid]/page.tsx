import { ProductForm } from "@/components/ProductForm";
import { Product } from "@/types";
import { Metadata } from "next";
import { supabase } from "@/lib/supabase";

async function getProduct(id: string): Promise<Product | null> {
  const { data } = await supabase
    .from("products")
    .select("*")
    .eq("id", Number(id))
    .maybeSingle();

  return (data as unknown as Product) ?? null;
}

/* When using metadata titles you need to put explicit export
dynamic = "auto" otherwise npm run build will not complete.
I think this is a next.js bug */
export const dynamic = "auto";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ productid: string }>;
}): Promise<Metadata> {
  const productid = (await params).productid;
  const product = await getProduct(productid);

  return {
    title: "Admin - " + product?.title,
    description:
      "Edit product and view product information like title, price, description, specifications, stock, reviews, etc.",
  };
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
