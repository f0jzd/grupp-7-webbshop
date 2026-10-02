import { FilterCard } from "../components/FilterCard";
import type { Category, Product, ProductsResponse, Stats } from "../types";
import { ProductList } from "@/components/ProductList";
import { SearchBar } from "../components/AdminSearchBar";
import { Pagination } from "../components/Pagination";
import { createUrlSearchParams } from "../lib/utils";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: 'Admin - Product catalog',
  description: 'Find products by searching or filtering by category',
}

export const dynamic = "auto";

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

  const allProducts: Product[] = (await fetch(`${API_URL}/products`).then((res) => res.json()));

  const {total:stockTotal, inStock, lowStock, outOfStock}: Stats = allProducts.reduce(
        (acc, item) => {
          const stock = Number(item.stock) || 0;
          acc.total += 1;

          if (stock === 0) {
            acc.outOfStock += 1;
          } else if (stock < 10) {
            acc.lowStock += 1;
          } else {
            acc.inStock += 1;
          }

          return acc;
        },
        { total: 0, inStock: 0, lowStock: 0, outOfStock: 0 },
      );



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
    _per_page: defaultLimit
  });

  if (selectedCategory) {
    query.set("categoryId:eq", String(selectedCategory.id));
  }
  if (stockStatus) {
    query.set("availabilityStatus:eq", stockStatus);
  }
  if (search) {
    query.set("title:contains", search);
  }

  const { data: products, total, page, pages, limit }: ProductsResponse = (await fetch(
    `${API_URL}/products?${query.toString()}`,
  ).then((res) => res.json()));

  return (
    <main className="max-w-7xl w-full mx-auto p-4 flex flex-col gap-4">
      <div className="flex flex-col sm:flex-row gap-2">
        <FilterCard category="products" value={stockTotal} />
        <FilterCard category="instock" value={inStock} />
        <FilterCard category="lowstock" value={lowStock} />
        <FilterCard category="outofstock" value={outOfStock} />
      </div>
      <SearchBar categories={categories} stock={stock} />
      <section className="rounded-lg border-gray-300 border overflow-hidden">
        <ProductList products={products} />
        <Pagination
          page={Number(currentPage)}
          pages={Number(pages)}
          urlParams={urlParams}
        />
      </section>
    </main>
  );
}
