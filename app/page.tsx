
import type { Product } from "./types";
import GridCard from "./components/ProductGridCard";
import { Button } from "./components/ui/button";
import { Field } from "./components/ui/field";
import { Input } from "./components/ui/input";

const API_URL = "http://localhost:4000";

interface ProductsResponse {
  products: Product[];
  total: number;
  limit: number;
  page: number;
  pages: number;
}

const res = await fetch(`${API_URL}/products`);
const data: ProductsResponse = await res.json();

export function getTagSet(products: Product[]): string[] {
  return [
    ...new Set(
      products.flatMap((product) =>
        (product.tags ?? []).map((tag) => tag.trim().toLowerCase())
      )
    ),
  ].sort((a, b) => a.localeCompare(b));
}


export default async function ProductPage() {
  const product: Product = await fetch(`${API_URL}/products/1`).then((res) =>
    res.json(),
  );

  const tags = getTagSet(data.products);

  return (
    <article >
      <section className="flex flex-col items-center">
        <div className="flex flex-col items-center">
          <nav className="flex flex-auto flex-row gap-2">
            <Button variant="outline" className="w-50">Shoes</Button>
            <Button variant="outline" className="w-50">Shirts</Button>
            <Button variant="outline" className="w-50">Pants</Button>
            <Button variant="outline" className="w-50">Watches</Button>
          </nav>
          <input defaultValue="Search field, style later" className="
          border bg-gray-100 selection:border-blue-500 rounded-sm
          h-12 w-full text-center"></input>
        </div>

        <div className="flex flex-row w-full">
          <div className="flex flex-col min-w-70">
            {tags.map((tag) => (
              <p key={tag}>
                {tag}
              </p>
            ))}
          </div>
          <section className="flex-auto w-full border border-amber-300">
            <h1>This should be the main shop grid:</h1>
            <div className="grid grid-cols-[repeat(auto-fit,minmax(250px,1fr))] *:w-full">
            {
              [...Array(99)].map((_, i) => (
                <GridCard key={i} product={product} />
              ))
            }
            </div>
          </section>
        </div>
      </section>
    </article>
  );
}