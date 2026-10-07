// stock nextjs
import Form from "next/form";
import type { Metadata } from "next";
// custom/inhouse
import type { Category, Product } from "./types";
import { getPageRange, Filters } from "./lib/utils";
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

  // pagination data
  const { page = "1", category, q, sort, order, inStock, onSale } = await searchParams;
  const paginationLimit = 18;
  const currentPage = Number(page);
  const filters: Filters = { category, q, sort, order, inStock, onSale };

  // category selection
  const categories: Category[] = await fetch(`${API_URL}/categories`).then(
    (res) => res.json(),
  );
  const selectedCategory = categories.find((c) => c.slug === category);


  const query = new URLSearchParams({
    _page: page,
    _limit: String(paginationLimit),
  });
  if (selectedCategory) query.set("categoryId", String(selectedCategory.id));
  if (q) query.set("title_like", q); // or "search" if you add the middleware block


  // sorting (json-server 0.x: _sort + _order); whitelist so the URL can't inject fields
  const sortField =
    sort && ["price", "rating", "discountPercentage"].includes(sort)
      ? sort
      : "title"; // default: alphabetical by name
  query.set("_sort", sortField);
  query.set("_order", order === "desc" ? "desc" : "asc");

  if (inStock === "1") query.set("availabilityStatus_ne", "Out of Stock");
  if (onSale === "1") query.set("discountPercentage_gte", "10"); // 10 is a guess, check your data

  const data: ProductsResponse = await fetch(
    `${API_URL}/products?${query}`,
  ).then((res) => res.json());


  
  return (
    <article className="max-w-375 m-auto">
      <div className="flex flex-col items-center">



        <section className="flex flex-row w-full">
          {/* catnav desktop */}
          <div className="hidden md:block mr-4">
            <CatNav categories={categories} category={category} filters={filters} />
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
              <Form action="/" role="search" className="max-w-150 mx-auto w-full pb-4">
              {category && <input type="hidden" name="category" value={category} />}
                <ButtonGroup className="w-full"> {/* Contains search field and submit btn */}
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
                              <input type="radio" name="order" value="asc" defaultChecked={order !== "desc"} className="accent-primary" />
                              Ascending
                            </label>
                            <label className="flex items-center gap-1.5">
                              <input type="radio" name="order" value="desc" defaultChecked={order === "desc"} className="accent-primary" />
                              Descending
                            </label>
                        </fieldset>
                        {/* toggles */}
                        <fieldset className="flex flex-col gap-1.5">
                          <legend className="text-sm font-medium">Show only</legend>
                            <label className="flex items-center gap-1.5">
                              <input type="checkbox" name="inStock" value="1" defaultChecked={inStock === "1"} className="accent-primary" />
                              In stock
                            </label>
                            <label className="flex items-center gap-1.5">
                              <input type="checkbox" name="onSale" value="1" defaultChecked={onSale === "1"} className="accent-primary" />
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
            <ShopPagination className="mb-4" currentPage={currentPage} totalPages={data.pages} filters={filters} />

            {/* Shop grid */}
            <ShopCatalog className="
              grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6
              gap-4
              *:w-full"
              data={data.products}
            />

            {/* Bottom nav buttons */}
            <ShopPagination className="mt-4" currentPage={currentPage} totalPages={data.pages} filters={filters} />
          </section>
        </section>
      </div>
    </article>
  );
}
