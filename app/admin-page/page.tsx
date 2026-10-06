import { FilterCard } from "../components/FilterCard";
import type { Category, Product, Stats } from "../types";
import { ProductList } from "@/components/ProductList";
import { SearchBar } from "../components/SearchBar";
import { Pagination } from "../components/Pagination";
import { createUrlSearchParams } from "../lib/utils";
import { Metadata } from "next";
import { supabase } from "../lib/supabase";

export const metadata: Metadata = {
  title: 'Admin - Product catalog',
  description: 'Find products by searching or filtering by category',
}

export const dynamic = "auto";

const defaultLimit = 6;
export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{
    [key: string]: string | undefined;
  }>;
}) {
  const stock = ["In Stock", "Low Stock", "Out of Stock"];

  // 1. Fetch categories from Supabase
  const { data: categoriesData } = await supabase
    .from("categories")
    .select("*")
    .order("name");
  const categories: Category[] = categoriesData || [];

  // 2. Fetch stock counts for live stats from Supabase
  const { data: stockData } = await supabase
    .from("products")
    .select("stock");

  const stats: Stats = (stockData || []).reduce(
    (acc, item) => {
      const s = Number(item.stock) || 0;
      acc.total += 1;
      if (s <= 0) acc.outOfStock += 1;
      else if (s < 10) acc.lowStock += 1;
      else acc.inStock += 1;
      return acc;
    },
    { total: 0, inStock: 0, lowStock: 0, outOfStock: 0 }
  );

  const params = await searchParams;
  const {
    page: currentPage = "1",
    category: categorySlug = "",
    stock: stockStatus = "",
    search = "",
  } = params;

  const urlParams = createUrlSearchParams(params);

  const selectedCategory = categories.find(
    (category) => category.slug === categorySlug,
  );

  const pageNum = Number(currentPage) || 1;
  const from = (pageNum - 1) * defaultLimit;
  const to = from + defaultLimit - 1;

  // 3. Query products from Supabase
  let query = supabase
    .from("products")
    .select("*", { count: "exact" })
    .order("id", { ascending: false })
    .range(from, to);

  if (selectedCategory) {
    query = query.eq("categoryId", selectedCategory.id);
  }
  if (stockStatus) {
    query = query.eq("availabilityStatus", stockStatus);
  }
  if (search) {
    query = query.ilike("title", `%${search}%`);
  }

  const { data: productsData, count } = await query;
  const total = count || 0;
  const pages = Math.ceil(total / defaultLimit) || 1;

  const categoryMap = new Map(categories.map((c) => [c.id, c]));
  const products: Product[] = (productsData || []).map((p) => ({
    ...(p as unknown as Product),
    category: categoryMap.get(p.categoryId),
  }));

  return (
    <main className="max-w-7xl w-full mx-auto p-4 flex flex-col gap-4">
      <div className="flex flex-col sm:flex-row gap-2">
        <FilterCard category="products" value={stats.total} />
        <FilterCard category="instock" value={stats.inStock} />
        <FilterCard category="lowstock" value={stats.lowStock} />
        <FilterCard category="outofstock" value={stats.outOfStock} />
      </div>
      <SearchBar categories={categories} stock={stock} />
      <section className="rounded-lg border-gray-300 border overflow-hidden">
        <ProductList products={products} />
        <Pagination
          page={pageNum}
          pages={pages}
          total={total}
          limit={defaultLimit}
          urlParams={urlParams}
        />
      </section>
    </main>
  );
}
