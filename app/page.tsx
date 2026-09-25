
import type { Product } from "./types";
import GridCard from "./components/ProductGridCard";
import { Button } from "./components/ui/button";
import { buttonVariants } from "./components/ui/button";
import Link from "next/link";
import { Category } from "./types";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import { ButtonGroup } from "./components/ui/button-group";

const API_URL = "http://localhost:4000";

interface ProductsResponse {
  products: Product[];
  total: number;
  limit: number;
  page: number;
  pages: number;
}

// claude helped dynamically create the hardcoded shadcn pagination component
function getPageRange(current: number, total: number): (number | "ellipsis")[] {
  const delta = 1; // how many neighbors to show around current
  const range: (number | "ellipsis")[] = [];

  for (let i = 1; i <= total; i++) {
    const isEdge = i === 1 || i === total;
    const isNearCurrent = Math.abs(i - current) <= delta;

    if (isEdge || isNearCurrent) {
      range.push(i);
    } else if (range[range.length - 1] !== "ellipsis") {
      range.push("ellipsis");
    }
  }

  return range;
}

// more claude stuff, scrutinized
function buildHref(
  current: Record<string, string | undefined>,
  overrides: Record<string, string | number | undefined>
): string {
  const params = new URLSearchParams();
  const merged = { ...current, ...overrides };

  for (const [key, value] of Object.entries(merged)) {
    if (value === undefined || value === "") continue;
    if (key === "page" && Number(value) === 1) continue; // keep page=1 out of the URL
    params.set(key, String(value));
  }

  const qs = params.toString();
  return qs ? `?${qs}` : "?";
}

export default async function ProductPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; category?: string }>;
}) {
  // pagination data
  const { page = "1", category } = await searchParams;
  const paginationLimit = 15 // tweak here to change page size

  // ===API STUFF===
  // returns a paginated slice of the product list
  const res = await fetch(`${API_URL}/products?_page=${page}&_limit=${paginationLimit}`)
  const data: ProductsResponse = await res.json();
  // returns the list of category objects with name, ID etc
  const categories: Category[] = await fetch(`${API_URL}/categories`).then(
    (res) => res.json(),
  );

  // shadcn dynamic pagination data
  const currentPage = Number(page); // page destruct'd at line 55 for default
  const pageRange = getPageRange(currentPage, data.pages);



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


        <section className="flex flex-row w-full">
          {/* catnav */}
          <ButtonGroup aria-label="Filter by category">
            {categories.map((cat) => (
              <Button
                key={cat.id}
                asChild
                variant={cat.slug === category ? "default" : "outline"}
              >
                <Link href={buildHref({ page, category }, { category: cat.slug, page: undefined })}>
                  {cat.name}
                </Link>
              </Button>
            ))}
          </ButtonGroup>
          

          {/* Shop grid */}
          <section className="flex-col w-full">
            {/* top nav buttons */}
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    href={currentPage > 1 ? `?page=${currentPage - 1}` : undefined}
                    aria-disabled={currentPage <= 1}
                  />
                </PaginationItem>

                {pageRange.map((p, idx) =>
                  p === "ellipsis" ? (
                    <PaginationItem key={`ellipsis-${idx}`}>
                      <PaginationEllipsis />
                    </PaginationItem>
                  ) : (
                    <PaginationItem key={p}>
                      <PaginationLink href={`?page=${p}`} isActive={p === currentPage}>
                        {p}
                      </PaginationLink>
                    </PaginationItem>
                  )
                )}

                <PaginationItem>
                  <PaginationNext
                    href={currentPage < data.pages ? `?page=${currentPage + 1}` : undefined}
                    aria-disabled={currentPage >= data.pages}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>


            {/* Old ver of grid: */}
            {/* <div className="grid grid-cols-[repeat(auto-fit,minmax(250px,1fr))] *:w-full"> */}
            <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-5  *:w-full">
            {
              data.products.map((product:Product) => (
                <GridCard key={product.id} product={product} />
              ))
            }</div>

            {/* Bottom nav buttons, same as line 71 */}
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    href={currentPage > 1 ? `?page=${currentPage - 1}` : undefined}
                    aria-disabled={currentPage <= 1}
                  />
                </PaginationItem>

                {pageRange.map((p, idx) =>
                  p === "ellipsis" ? (
                    <PaginationItem key={`ellipsis-${idx}`}>
                      <PaginationEllipsis />
                    </PaginationItem>
                  ) : (
                    <PaginationItem key={p}>
                      <PaginationLink href={`?page=${p}`} isActive={p === currentPage}>
                        {p}
                      </PaginationLink>
                    </PaginationItem>
                  )
                )}

                <PaginationItem>
                  <PaginationNext
                    href={currentPage < data.pages ? `?page=${currentPage + 1}` : undefined}
                    aria-disabled={currentPage >= data.pages}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </section>
        </section>
      </div>
    </article>
  );
}