
import type { Product } from "./types";
import GridCard from "./components/ProductGridCard";
import { Button } from "./components/ui/button";
import Link from "next/link";

const API_URL = "http://localhost:4000";

interface ProductsResponse {
  products: Product[];
  total: number;
  limit: number;
  page: number;
  pages: number;
}

const dirtyTailwindButton = "bg-gray-500 text-white h-12 w-22"



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
  // pagination call data
  const { page = "1" } = await searchParams;
  const paginationLimit = 15

  const res = await fetch(`${API_URL}/products?_page=${page}&_limit=${paginationLimit}`)
  const data: ProductsResponse = await res.json();

  const allProducts = await fetch(`${API_URL}/products`).then((res) => res.json());
  const tagSet = getTagSet(allProducts.products);
  

  return (
    <article >
      <div className="flex flex-col items-center">
        {/* Search */}
        <section className="flex flex-row items-center w-full pb-4">
          <input defaultValue="Search field, style later" className="
          border bg-gray-100 selection:border focus:border-blue-500 focus:outline-0
          rounded-l-sm h-12 w-full text-center"></input>
          <Button className="h-12 w-30 bg-gray-500 border border-gray-600 rounded-r-sm rounded-l-none">Search</Button>
        </section>

        {/* tagnav */}
        <section className="flex flex-row w-full">
          <nav className="relative min-w-70">
            <div className="absolute inset-0 overflow-y-auto flex flex-col">
              {tagSet.map((tag) => (
                <p key={tag}>{tag}</p>
              ))}
            </div>
          </nav>

          {/* Shop grid */}
          <section className="flex-col w-full">
            {/* top nav buttons */}
            <nav className="flex flex-row justify-between pb-4">

              {data.page > 1 ? (
                <Button
                  className={`${dirtyTailwindButton}`}
                  variant="outline"
                  nativeButton={false}
                  render={<Link href={`/?page=${data.page - 1}`} />}
                >
                  Prev
                </Button>
              ) : (
                <Button
                  className={`${dirtyTailwindButton}`}
                   variant="outline" disabled>
                  Prev
                </Button>
              )}
              <p>Page: {data.page}</p>
              {data.page < data.pages ? (
                <Button
                  className={`${dirtyTailwindButton}`}
                  variant="outline"
                  nativeButton={false}
                  render={<Link href={`/?page=${data.page + 1}`} />}
                >
                  Next
                </Button>
              ) : (
                <Button 
                  className={`${dirtyTailwindButton}`}
                  variant="outline" disabled>
                  Next
                </Button>
              )}
            </nav>


            {/* Old ver of grid: */}
            {/* <div className="grid grid-cols-[repeat(auto-fit,minmax(250px,1fr))] *:w-full"> */}
            <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-5  *:w-full">
            
            {/* gallery */}
            {
              data.products.map((product:Product) => (
                <GridCard key={product.id} product={product} />
              ))
            }
            </div>
            {/* Bottom nav buttons, same as line 71 */}
            <nav className="flex flex-row justify-between pt-4">
              {data.page > 1 ? (
                <Button
                  className={`${dirtyTailwindButton}`}
                  variant="outline"
                  nativeButton={false}
                  render={<Link href={`/?page=${data.page - 1}`} />}
                >
                  Prev
                </Button>
              ) : (
                <Button
                  className={`${dirtyTailwindButton}`}
                  variant="outline" disabled>
                  Prev
                </Button>
              )}
              <p>Page: {data.page}</p>
              {data.page < data.pages ? (
                <Button
                  className={`${dirtyTailwindButton}`}
                  variant="outline"
                  nativeButton={false}
                  render={<Link href={`/?page=${data.page + 1}`} />}
                >
                  Next
                </Button>
              ) : (
                <Button className={`${dirtyTailwindButton}`} variant="outline" disabled>
                  Next
                </Button>
              )}
            </nav>
          </section>
        </section>
      </div>
    </article>
  );
}