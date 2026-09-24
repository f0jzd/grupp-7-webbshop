
import type { Product } from "./types";
import GridCard from "./components/ProductGridCard";
import { Button } from "./components/ui/button";

const API_URL = "http://localhost:4000";

interface ProductsResponse {
  products: Product[];
  total: number;
  limit: number;
  page: number;
  pages: number;
}




function getTagSet(products: Product[]): string[] {
  return [
    ...new Set(
      products.flatMap((product) =>
        (product.tags ?? []).map((tag) => tag.trim().toLowerCase())
      )
    ),
  ].sort((a, b) => a.localeCompare(b));
}


export default async function ProductPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  // default page 1
  const { page = "1" } = await searchParams;

  const res = await fetch(`${API_URL}/products?_page=${page}&_limit=12`)
  const data: ProductsResponse = await res.json();

  const allProducts = await fetch(`${API_URL}/products`).then((res) => res.json());
  const tagSet = getTagSet(allProducts.products);

  return (
    <article >
      <section className="flex flex-col items-center">
        <div className="flex flex-row items-center w-full pb-4">
          <input defaultValue="Search field, style later" className="
          border bg-gray-100 selection:border focus:border-blue-500 focus:outline-0
          rounded-l-sm h-12 w-full text-center"></input>
          <Button className="h-12 w-30 bg-gray-500 border border-gray-600 rounded-r-sm rounded-l-none">Search</Button>
        </div>

        <div className="flex flex-row w-full">
          <div className="flex flex-col min-w-70">
            {tagSet.map((tag) => (
              <p key={tag}>
                {tag}
              </p>
            ))}
          </div>
          <section className="flex-auto w-full pt-4">
            <div className="grid grid-cols-[repeat(auto-fit,minmax(250px,1fr))] *:w-full">
            {
              data.products.map((product:Product) => (
                <GridCard key={product.id} product={product} />
              ))
            }
            </div>
          </section>
        </div>
      </section>
    </article>
  );
}