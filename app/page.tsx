// stock nextjs
import Form from "next/form";
import type { Metadata } from "next";
// custom/inhouse
import type { Category, Product } from "./types";
import { Filters } from "./lib/utils";
import ShopPagination from "./components/ShopPagination";
import CatNav from "./components/ShopCatnav";
import ShopCatalog from "./components/ShopCatalog";
// shadcn
import { Button } from "./components/ui/button";
import { ButtonGroup } from "./components/ui/button-group";
import { Input } from "./components/ui/input";
import { ChevronRight } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "./components/ui/sheet";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "./components/ui/accordion";
import { supabase } from "./lib/supabase";
import { unstable_cache } from "next/cache";

/* When using metadata titles you need to put explicit export
dynamic = "auto" otherwise npm run build will not complete.
I think this is a next.js bug */
export const dynamic = "auto";

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

// Fetches products per page, category, search query, sorting and filters directly from Supabase
async function getProducts(
  currentPage: number,
  limit: number,
  categoryId?: number,
  q?: string,
  sort?: string,
  order?: string,
  inStock?: string,
  onSale?: string,
) {
  const from = (currentPage - 1) * limit;
  const to = from + limit - 1;

  const sortField =
    sort && ["price", "rating", "discountPercentage"].includes(sort)
      ? sort
      : "title";
  const isAscending = order !== "desc";

  let query = supabase
    .from("products")
    .select("*", { count: "exact" })
    .range(from, to)
    .order(sortField, { ascending: isAscending, nullsFirst: false });

  if (sortField !== "id") {
    query = query.order("id", { ascending: true });
  }

  if (categoryId) {
    query = query.eq("categoryId", categoryId);
  }
  if (q) {
    query = query.ilike("title", `%${q}%`);
  }
  if (inStock === "1") {
    query = query.neq("availabilityStatus", "Out of Stock");
  }
  if (onSale === "1") {
    query = query.gte("discountPercentage", 1);
  }

  const { data, count } = await query;
  const total = count || 0;
  const pages = Math.ceil(total / limit) || 1;
  const products = (data || []) as Product[];

  return { products, total, pages };
}

export default async function ProductPage({
  searchParams,
}: {
  searchParams: Promise<{
    page?: string;
    category?: string;
    q?: string;
    sort?: string;
    order?: string;
    inStock?: string;
    onSale?: string;
  }>;
}) {
  const {
    page = "1",
    category,
    q,
    sort,
    order,
    inStock,
    onSale,
  } = await searchParams;
  const paginationLimit = 18;
  const currentPage = Number(page) || 1;
  const filters: Filters = { category, q, sort, order, inStock, onSale };

  // 1. Fetch categories (cached)
  const categories = await getCachedCategories();
  const selectedCategory = categories.find((c) => c.slug === category);

  // 2. Fetch products for this page from Supabase
  const data = await getProducts(
    currentPage,
    paginationLimit,
    selectedCategory?.id,
    q,
    sort,
    order,
    inStock,
    onSale,
  );

  const categoryMap = new Map(categories.map((c) => [c.id, c]));
  const products: (Product & { category: Category | undefined })[] =
    data.products.map((p) => ({
      ...p,
      category: categoryMap.get(p.categoryId),
    }));

  return (
    <article className="max-w-375 m-auto">
      <div className="flex flex-col items-center">
        <section className="flex flex-row w-full">
          {/* catnav desktop */}
          <div className="hidden md:block mr-4">
            <CatNav
              categories={categories}
              category={category}
              filters={filters}
            />
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
                  filters={filters}
                  closeOnSelect
                  className="w-full pr-3"
                />
              </div>
            </SheetContent>
          </Sheet>

          {/* catalong wrapper */}
          <section className="flex-col w-full">
            {/* Search */}
            <div>
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
                <Accordion>
                  <AccordionItem value="sort-filter">
                    <AccordionTrigger>Sort &amp; filter</AccordionTrigger>
                    <AccordionContent>
                      {/* key remounts the uncontrolled inputs when the URL changes, same trick as key={q} on the search input */}
                      {/* effectively, by pressing Back in the browser, this prevents erroneous filter choices */}
                      <div
                        key={`${sort}-${order}-${inStock}-${onSale}`}
                        className="flex flex-col gap-4 pt-2 sm:flex-row sm:flex-wrap sm:items-end"
                      >
                        {/* sort by */}
                        <div className="flex flex-col gap-1.5">
                          <label htmlFor="sort" className="text-sm font-medium">
                            Sort by
                          </label>
                          <select
                            id="sort"
                            name="sort"
                            defaultValue={sort ?? ""}
                            className="h-8 rounded-lg border border-input bg-transparent px-2.5 text-sm"
                          >
                            <option value="">Default</option>
                            <option value="price">Price</option>
                            <option value="rating">Rating</option>
                            <option value="discountPercentage">Discount</option>
                          </select>
                        </div>
                        {/* order choice*/}
                        <fieldset className="flex flex-col gap-1.5">
                          <legend className="text-sm font-medium">Order</legend>
                          <label className="flex items-center gap-1.5">
                            <input
                              type="radio"
                              name="order"
                              value="asc"
                              defaultChecked={order !== "desc"}
                              className="accent-primary"
                            />
                            Ascending
                          </label>
                          <label className="flex items-center gap-1.5">
                            <input
                              type="radio"
                              name="order"
                              value="desc"
                              defaultChecked={order === "desc"}
                              className="accent-primary"
                            />
                            Descending
                          </label>
                        </fieldset>
                        {/* toggles */}
                        <fieldset className="flex flex-col gap-1.5">
                          <legend className="text-sm font-medium">
                            Show only
                          </legend>
                          <label className="flex items-center gap-1.5">
                            <input
                              type="checkbox"
                              name="inStock"
                              value="1"
                              defaultChecked={inStock === "1"}
                              className="accent-primary"
                            />
                            In stock
                          </label>
                          <label className="flex items-center gap-1.5">
                            <input
                              type="checkbox"
                              name="onSale"
                              value="1"
                              defaultChecked={onSale === "1"}
                              className="accent-primary"
                            />
                            On sale
                          </label>
                        </fieldset>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </Form>
            </div>
            {/* top nav buttons */}
            <ShopPagination
              className="mb-4"
              currentPage={currentPage}
              totalPages={data.pages}
              filters={filters}
            />

            {/* Shop grid */}
            <ShopCatalog
              className="
              grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6
              gap-4
              *:w-full"
              data={products}
            />

            {/* Bottom nav buttons */}
            <ShopPagination
              className="mt-4"
              currentPage={currentPage}
              totalPages={data.pages}
              filters={filters}
            />
          </section>
        </section>
      </div>
    </article>
  );
}
