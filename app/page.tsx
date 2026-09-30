// stock nextjs
import Link from "next/link";
import Form from "next/form";
// custom/inhouse
import type { Category, Product } from "./types";
import GridCard from "./components/ProductGridCard";
// shadcn
import { buttonVariants } from "./components/ui/button";
import { Button } from "./components/ui/button";
import { ButtonGroup } from "./components/ui/button-group";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import { Input } from "./components/ui/input";


import type { Metadata } from 'next'
 
export const metadata: Metadata = {
  title: 'Product catalog',
  description: 'Find products by searching or filtering by category and add products to cart',
}

const API_URL = "http://localhost:4000";

interface ProductsResponse {
  products: Product[];
  total: number;
  limit: number;
  page: number;
  pages: number;
}

// claude helped dynamically create the hardcoded shadcn pagination component
// this is just 
function getPageRange(current: number, total: number): (number | "ellipsis")[] {
  const delta = 2; // how many neighbors to show around current
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

// This one is a bit chunky:
// basically this is a url state handler that takes originalState and overrides it with newState
function buildHref(
  originalState: Record<string, string | undefined>,
  newState: Record<string, string | number | undefined>
): string {
  const params = new URLSearchParams();
  const merged = { ...originalState, ...newState };

  for (const [key, value] of Object.entries(merged)) {
    if (value === undefined || value === "") continue;
    if (key === "page" && Number(value) === 1) continue; // keep page=1 out of the URL
    params.set(key, String(value));
  }

  const qs = params.toString();
  return qs ? `?${qs}` : "?"; // i hate manual string building
}

export default async function ProductPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; category?: string; q?: string }>;
}) {
  // pagination data
  const { page = "1", category, q} = await searchParams;
  const paginationLimit = 15 // tweak here to change page size
  const state = { page, category, q }; // current search state, built from search params

  // returns the list of categories for the catnav panel
  const categories: Category[] = await fetch(
    `${API_URL}/categories`
  ).then((res) => res.json());
  // ↓↓↓ This one reads the category param and returns the corresponding category object from the slug (string) to be used in the next block
  const selectedCategory = categories.find((c) => c.slug === category); 
  
  const query = new URLSearchParams({
    _page: page,
    _limit: String(paginationLimit),
  });
  if (selectedCategory) query.set("categoryId", String(selectedCategory.id));
  if (q) query.set("title_like", q); // or "search" if you add the middleware block

    const data: ProductsResponse = await fetch(
    `${API_URL}/products?${query}`
  ).then((res) => res.json());



  // shadcn dynamic pagination data
  const currentPage = Number(page); // page destruct'd at line 55 for default
  const pageRange = getPageRange(currentPage, data.pages);



  return (
    <article>
      <div className="flex flex-col items-center">
        {/* Search */}
        <Form action="/" role="search" className="w-full pb-4">
          {category && <input type="hidden" name="category" value={category} />}
          <ButtonGroup className="w-full">
            <Input
              key={q}
              name="q"
              type="search"
              defaultValue={q}
              placeholder="Search products…"
              aria-label="Search products"
            />
            <Button type="submit">Search</Button>
          </ButtonGroup>
        </Form>


        <section className="flex flex-row w-full">
          
        {/* catnav */}
        <ButtonGroup orientation="vertical" className="mr-4">
          <Link
            scroll={false}
            href={buildHref({ page, category }, { category: undefined, page: 1 })}
          >
            Reset
          </Link>

          {categories.map((cat) => (
            <Link
              scroll={false}
              key={cat.id}
              href={buildHref({ page, category }, { category: cat.slug, page: 1 })}
              className={buttonVariants({ variant: category === cat.slug ? "default" : "outline" }) + " justify-start"}
            >
              {cat.name}
            </Link>
          ))}
        </ButtonGroup>
          

          {/* Shop grid */}
          <section className="flex-col w-full">
            {/* top nav buttons */}
            <Pagination>
              <PaginationContent>

                <PaginationItem>
                  <PaginationPrevious
                    href={
                      currentPage > 1
                        ? buildHref({ page, category }, { page: currentPage - 1 })
                        : undefined
                    }
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
                      <PaginationLink
                        href={buildHref(state, { page: p })}
                        isActive={p === currentPage}
                      >
                        {p}
                      </PaginationLink>
                    </PaginationItem>
                  )
                )}

                <PaginationItem>
                  <PaginationNext
                    href={
                      currentPage < data.pages
                        ? buildHref({ page, category }, { page: currentPage + 1 })
                        : undefined
                    }
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
                    href={
                      currentPage > 1
                        ? buildHref({ page, category }, { page: currentPage - 1 })
                        : undefined
                    }
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
                      <PaginationLink
                        href={buildHref(state, { page: p })}
                        isActive={p === currentPage}
                      >
                        {p}
                      </PaginationLink>
                    </PaginationItem>
                  )
                )}

                <PaginationItem>
                  <PaginationNext
                    href={
                      currentPage < data.pages
                        ? buildHref({ page, category }, { page: currentPage + 1 })
                        : undefined
                    }
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
