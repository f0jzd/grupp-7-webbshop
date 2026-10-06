// stock nextjs
import Form from "next/form";
import type { Metadata } from "next";
// custom/inhouse
import type { Category, Product } from "./types";
import ShopPagination from "./components/ShopPagination";
import CatNav from "./components/ShopCatnav";
// shadcn
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

//Supabase stuff
import { supabase } from "./lib/supabase";
import { unstable_cache } from "next/cache";

export const metadata: Metadata = {
  title: "Product catalog",
  description:
    "Find products by searching or filtering by category and add products to cart",
};

// Caches categories for 1 hour so pagination never re-fetches them from the cloud
const getCachedCategories = unstable_cache(
  async () => {
    const { data } = await supabase
      .from("categories")
      .select("*")
      .order("name");
    return (data || []) as Category[];
  },
  ["shop-categories-cache"],
  { revalidate: 3600 }, // 1 hour in seconds
);

// Caches products per page, category, and search query
const getCachedProducts = unstable_cache(
  async (
    currentPage: number,
    limit: number,
    categoryId?: number,
    q?: string,
  ) => {
    const from = (currentPage - 1) * limit;
    const to = from + limit - 1;

    let query = supabase
      .from("products")
      .select("*", { count: "exact" })
      .range(from, to)
      .order("id");

    if (categoryId) {
      query = query.eq("categoryId", categoryId);
    }
    if (q) {
      query = query.ilike("title", `%${q}%`);
    }

    const { data, count } = await query;
    const total = count || 0;
    const pages = Math.ceil(total / limit) || 1;
    const products = (data || []) as Product[];

    return { products, total, pages };
  },
  ["shop-products-page-cache"],
  { revalidate: 3600 }, // caches for 1 hour
);

export default async function ProductPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; category?: string; q?: string }>;
}) {
  const { page = "1", category, q } = await searchParams;
  const paginationLimit = 18;
  //Safety Check
  const currentPage = Number(page) || 1;

  // 1. Fetch categories (cached)
  const categories = await getCachedCategories();
  const selectedCategory = categories.find((c) => c.slug === category);

  // 2. Fetch products for this page (cached)
  const { products, pages } = await getCachedProducts(
    currentPage,
    paginationLimit,
    selectedCategory?.id,
    q,
  );

  // 3. Enrich products with category info
  const categoryMap = new Map(categories.map((c) => [c.id, c]));
  const enrichedProducts = products.map((p) => ({
    ...p,
    category: categoryMap.get(p.categoryId),
  }));

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

            <SheetContent
              side="left"
              className="w-64 p-4 flex flex-col scrollbar-gutter-stable"
            >
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
            <Form
              action="/"
              role="search"
              className="max-w-150 mx-auto w-full pb-4"
            >
              {category && (
                <input type="hidden" name="category" value={category} />
              )}
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
            <ShopPagination
              className="mb-4"
              currentPage={currentPage}
              totalPages={pages}
              filters={{ category, q }}
            />

            {/* Shop grid */}
            <ShopCatalog
              className="
              grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6
              gap-4
              *:w-full"
              data={enrichedProducts}
            />

            {/* Bottom nav buttons, same as line 71 */}
            <ShopPagination
              className="mt-4"
              currentPage={currentPage}
              totalPages={pages}
              filters={{ category, q }}
            />
          </section>
        </section>
      </div>
    </article>
  );
}
