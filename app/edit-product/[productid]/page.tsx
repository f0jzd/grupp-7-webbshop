import { ProductForm } from "@/components/ProductForm";

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
