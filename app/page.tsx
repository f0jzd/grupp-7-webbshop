// stock nextjs
import Link from "next/link";
import Form from "next/form";
import type { Metadata } from "next";
// custom/inhouse
import type { Category, Product } from "./types";
import { buildHref, getPageRange, Filters } from "./lib/utils";
import ShopPagination from "./components/ShopPagination";
import CatNav from "./components/ShopCatnav";
// shadcn
import { buttonVariants } from "./components/ui/button";
import { Button } from "./components/ui/button";
import { ButtonGroup } from "./components/ui/button-group";
import { Input } from "./components/ui/input";
import ShopCatalog from "./components/ShopCatalog";
import { ChevronRight } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "./components/ui/sheet";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Product catalog",
  description:
    "Find products by searching or filtering by category and add products to cart",
};

const API_URL = "http://localhost:4000";

interface ProductsResponse {
  products: Product[];
  total: number;
  limit: number;
  page: number;
  pages: number;
}

export default async function ProductPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; category?: string; q?: string }>;
}) {
  // pagination data
  const { page = "1", category, q } = await searchParams;
  const paginationLimit = 18; // tweak here to change page size
  const state = { page, category, q }; // current search state, built from search params

  // returns the list of categories for the catnav panel
  const categories: Category[] = await fetch(`${API_URL}/categories`).then(
    (res) => res.json(),
  );
  // ↓↓↓ This one reads the category param and returns the corresponding category object from the slug (string) to be used in the next block
  const selectedCategory = categories.find((c) => c.slug === category);

  const query = new URLSearchParams({
    _page: page,
    _limit: String(paginationLimit),
  });
  if (selectedCategory) query.set("categoryId", String(selectedCategory.id));
  if (q) query.set("title_like", q); // or "search" if you add the middleware block

  const data: ProductsResponse = await fetch(
    `${API_URL}/products?${query}`,
  ).then((res) => res.json());

  const categoryMap = new Map(categories.map((c) => [c.id, c]));

  const enrichedProducts = data.products.map((p) => ({
    ...p,
    category: categoryMap.get(p.categoryId),
  }));

  // shadcn dynamic pagination data
  const currentPage = Number(page); // page destruct'd at line 55 for default
  const pageRange = getPageRange(currentPage, data.pages);

  return (
    <article className="max-w-375 m-auto">
      <div className="flex flex-col items-center">



        <section className="flex flex-row w-full">
          {/* catnav desktop */}
          <div className="hidden md:block mr-4">
            <CatNav categories={categories} category={category} page={page} />
          </div>
          {/* catnav mobile */}
          <Sheet>
            {/* Catnav unfold chevron */}
            <SheetTrigger
              render={
                <Button
                  variant="secondary"
                  size="icon"
                  aria-label="Open categories"
                  className="md:hidden fixed left-0 top-1/2 z-40 h-16 w-6 -translate-y-1/2 rounded-l-none rounded-r-lg"
                />
              }
            >
              <ChevronRight />
            </SheetTrigger>

            <SheetContent side="left" className="w-64 p-4 flex flex-col scrollbar-gutter-stable">
              <SheetHeader className="p-0">
                <SheetTitle>Categories</SheetTitle>
                <SheetDescription className="sr-only">
                  Filter products by category
                </SheetDescription>
              </SheetHeader>

              <div className="flex-1 min-h-0 overflow-y-auto overscroll-contain">
                <CatNav
                  categories={categories}
                  category={category}
                  page={page}
                  closeOnSelect
                  className="w-full pr-3"
                />
              </div>
            </SheetContent>
          </Sheet>

          {/* catalong wrapper */}
          <section className="flex-col w-full">

            {/* Search */}
            <Form action="/" role="search" className="max-w-150 mx-auto w-full pb-4">
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
            {/* top nav buttons */}
            <ShopPagination className="mb-4" currentPage={currentPage} totalPages={data.pages} filters={{category, q}} />

            {/* Shop grid */}
            <ShopCatalog className="
              grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6
              gap-4
              *:w-full"
              data={data.products}
            />

            {/* Bottom nav buttons, same as line 71 */}
            <ShopPagination className="mt-4" currentPage={currentPage} totalPages={data.pages} filters={{category, q}} />
          </section>
        </section>
      </div>
    </article>
  );
}
