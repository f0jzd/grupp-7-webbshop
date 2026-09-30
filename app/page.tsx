// stock nextjs
import Link from "next/link";
import Form from "next/form";
// custom/inhouse
import type { Category, Product, ProductsResponse } from "./types";
import GridCard from "./components/ProductGridCard";
// shadcn
import { buttonVariants, Button } from "./components/ui/button";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Input } from "./components/ui/input";
import { Search, Package } from "lucide-react";
import { cn } from "cn";

const API_URL = "http://localhost:4000";

// claude helped dynamically create the hardcoded shadcn pagination component
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

// url state handler that takes originalState and overrides it with newState
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
  return qs ? `?${qs}` : "/";
}

export default async function ProductPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; category?: string; q?: string }>;
}) {
  // pagination data
  const { page = "1", category, q } = await searchParams;
  const paginationLimit = 12; // 12 divides evenly in 1, 2, 3, and 4 columns
  const state = { page, category, q }; // current search state, built from search params

  // returns the list of categories for the catnav panel
  const categories: Category[] = await fetch(
    `${API_URL}/categories`
  ).then((res) => res.json());

  const selectedCategory = categories.find((c) => c.slug === category);

  const query = new URLSearchParams({
    _page: page,
    _limit: String(paginationLimit),
    _expand: "category",
  });
  if (selectedCategory) query.set("categoryId", String(selectedCategory.id));
  if (q) query.set("title_like", q);

  const data: ProductsResponse = await fetch(
    `${API_URL}/products?${query}`
  ).then((res) => res.json());

  // Attach category object to each product if missing
  const products: Product[] = (data.products || []).map((product) => ({
    ...product,
    category:
      product.category ??
      categories.find((c) => c.id === product.categoryId),
  }));

  // dynamic pagination data
  const currentPage = Number(page);
  const pageRange = getPageRange(currentPage, data.pages);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
      {/* 1. Breadcrumbs */}
      <Breadcrumb className="mb-6">
        <BreadcrumbList>
          <BreadcrumbItem>
            {category || q ? (
              <BreadcrumbLink href="/">Home</BreadcrumbLink>
            ) : (
              <BreadcrumbPage>Products</BreadcrumbPage>
            )}
          </BreadcrumbItem>
          {selectedCategory ? (
            <>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                {q ? (
                  <BreadcrumbLink href={`/?category=${selectedCategory.slug}`}>
                    {selectedCategory.name}
                  </BreadcrumbLink>
                ) : (
                  <BreadcrumbPage>{selectedCategory.name}</BreadcrumbPage>
                )}
              </BreadcrumbItem>
            </>
          ) : null}
          {q ? (
            <>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Search: &ldquo;{q}&rdquo;</BreadcrumbPage>
              </BreadcrumbItem>
            </>
          ) : null}
        </BreadcrumbList>
      </Breadcrumb>

      {/* 2. Header: Title, Product Count & Search */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 mb-8 border-b">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            {selectedCategory ? selectedCategory.name : "Product Catalog"}
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            {q
              ? `Search results for "${q}" · ${data.total} ${data.total === 1 ? "product" : "products"} found`
              : selectedCategory
                ? `Browsing ${selectedCategory.name} · ${data.total} ${data.total === 1 ? "product" : "products"}`
                : `Showing all available products · ${data.total} total`}
          </p>
        </div>

        {/* Search */}
        <Form action="/" role="search" className="w-full md:w-80">
          {category && <input type="hidden" name="category" value={category} />}
          <div className="relative flex items-center">
            <Search className="absolute left-3 h-4 w-4 text-muted-foreground pointer-events-none" />
            <Input
              key={q}
              name="q"
              type="search"
              defaultValue={q}
              placeholder="Search products…"
              aria-label="Search products"
              className="pl-9 pr-20 h-10 rounded-xl"
            />
            <Button
              type="submit"
              size="sm"
              className="absolute right-1 h-8 rounded-lg"
            >
              Search
            </Button>
          </div>
        </Form>
      </div>

      {/* 3. Main Content: Category Sidebar + Product Grid */}
      <div className="flex flex-col md:flex-row gap-8 items-start">
        {/* Category Navigation Sidebar */}
        <aside className="w-full md:w-56 shrink-0">
          <div className="sticky top-6 flex flex-col gap-2">
            <div className="flex items-center justify-between pb-2 border-b">
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Categories
              </span>
              {category ? (
                <Link
                  scroll={false}
                  href={buildHref({ q }, { page: 1 })}
                  className="text-xs font-medium text-primary hover:underline"
                >
                  Clear filter
                </Link>
              ) : null}
            </div>

            <div className="flex md:flex-col gap-1.5 overflow-x-auto pb-2 md:pb-0 scrollbar-none">
              <Link
                scroll={false}
                href={buildHref({ q }, { page: 1 })}
                className={cn(
                  buttonVariants({
                    variant: !category ? "default" : "ghost",
                    size: "sm",
                  }),
                  "justify-start text-sm rounded-lg whitespace-nowrap"
                )}
              >
                All Categories
              </Link>
              {categories.map((cat) => (
                <Link
                  scroll={false}
                  key={cat.id}
                  href={buildHref(state, { category: cat.slug, page: 1 })}
                  className={cn(
                    buttonVariants({
                      variant: category === cat.slug ? "default" : "ghost",
                      size: "sm",
                    }),
                    "justify-start text-sm rounded-lg whitespace-nowrap"
                  )}
                >
                  {cat.name}
                </Link>
              ))}
            </div>
          </div>
        </aside>

        {/* Products Grid & Pagination */}
        <section className="flex-1 w-full min-w-0">
          {products.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center border rounded-2xl bg-muted/20">
              <Package className="h-12 w-12 text-muted-foreground/40 mb-3" />
              <h3 className="text-lg font-semibold text-foreground">
                No products found
              </h3>
              <p className="text-sm text-muted-foreground mt-1 max-w-sm">
                We couldn&apos;t find any products matching your criteria. Try resetting filters or searching for something else.
              </p>
              <Link
                href="/"
                className={cn(
                  buttonVariants({ variant: "outline", size: "sm" }),
                  "mt-4 rounded-xl"
                )}
              >
                Reset Filters
              </Link>
            </div>
          ) : (
            <>
              {/* Product Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {products.map((product) => (
                  <GridCard key={product.id} product={product} />
                ))}
              </div>

              {/* Bottom Pagination */}
              {data.pages > 1 && (
                <div className="mt-12 flex justify-center">
                  <Pagination>
                    <PaginationContent>
                      <PaginationItem>
                        <PaginationPrevious
                          href={
                            currentPage > 1
                              ? buildHref(state, { page: currentPage - 1 })
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
                              ? buildHref(state, { page: currentPage + 1 })
                              : undefined
                          }
                          aria-disabled={currentPage >= data.pages}
                        />
                      </PaginationItem>
                    </PaginationContent>
                  </Pagination>
                </div>
              )}
            </>
          )}
        </section>
      </div>
    </div>
  );
}

