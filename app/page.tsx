import { FilterCard } from "./components/FilterCard";
import type { Category, ProductsResponse, Stats } from "./types";
import { ProductList } from "@/components/ProductList";
import { SearchBar } from "./components/SearchBar";
import { Pagination } from "./components/Pagination";
import { createUrlSearchParams } from "./lib/utils";

const API_URL = "http://localhost:4000";
const defaultLimit = "6";
export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{
    [key: string]: string | undefined;
  }>;
}) {
  const categories: Category[] = await fetch(`${API_URL}/categories`).then(
    (res) => res.json(),
  );

  const stock = ["In Stock", "Low Stock", "Out of Stock"];

  const {
    total: totalStock,
    lowStock,
    outOfStock,
    inStock,
  }: Stats = await fetch(`${API_URL}/products/stats`).then((res) => res.json());

  // we use the fetch() method to get the products from the API
  // in this fetch we sort using _sort and _order and we limit the number of products using _limit
  // we also use _expand to get the relational category data
  // we can use the other destructed variables like page, total and so on to create pagination or show info
  const {
    page: currentPage = "1",
    category: categorySlug = "",
    stock: stockStatus = "",
    search = "",
  } = await searchParams;

  const urlParams = createUrlSearchParams(await searchParams);

  const selectedCategory = categories.find(
    (category) => category.slug === categorySlug,
  );

  const query = new URLSearchParams({
    _page: String(currentPage),
    _limit: defaultLimit,
    _sort: "id",
    _order: "desc",
    _expand: "category",
  });

  if (selectedCategory) {
    query.set("categoryId", String(selectedCategory.id));
  }
  if (stockStatus) {
    query.set("availabilityStatus", stockStatus);
  }
  if (search) {
    query.set("title_like", search);
  }

  const { products, total, page, pages, limit }: ProductsResponse = await fetch(
    `${API_URL}/products/?${query.toString()}`,
  ).then((res) => res.json());

  return (
    <main className="max-w-7xl w-full mx-auto p-4 flex flex-col gap-4">
      <div className="flex flex-col sm:flex-row gap-2">
        <FilterCard category="products" value={totalStock} />
        <FilterCard category="instock" value={inStock} />
        <FilterCard category="lowstock" value={lowStock} />
        <FilterCard category="outofstock" value={outOfStock} />
      </div>
      <SearchBar categories={categories} stock={stock} />
      <section className="rounded-lg border-gray-300 border overflow-hidden">
        <ProductList products={products} />
        <Pagination
          page={page}
          pages={pages}
          total={total}
          limit={limit}
          urlParams={urlParams}
        />
      </section>
    </main>
  );
}
