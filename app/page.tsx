
import type { Product } from "./types";
import GridCard from "./components/ProductGridCard";
import { Button } from "./components/ui/button";
import { Field } from "./components/ui/field";
import { Input } from "./components/ui/input";

const API_URL = "http://localhost:4000";

export default async function ProductPage() {
  const product: Product = await fetch(`${API_URL}/products/1`).then((res) =>
    res.json(),
  );

  return (
    <article >
      <GridCard product={product} />
      <section className="flex flex-col items-center">
        <nav className="flex flex-row gap-2">
          {/* shadcn buttons */}
          {/* shops tend to have top ribbons for main categories and a sidebar for metadata */}
          {/* example: https://www.ahlens.se/herr/nyheter */}
          <Button variant="outline" className="w-50">Shoes</Button>
          <Button variant="outline" className="w-50">Shirts</Button>
          <Button variant="outline" className="w-50">Pants</Button>
          <Button variant="outline" className="w-50">Watches</Button>
        </nav>
        <p>this is a primary product catalog</p>
        <input defaultValue="Search field, style later" className="
        border bg-gray-100 selection:border-blue-500 rounded-sm"></input>
        <Input></Input>
        <section>
          <h1>This should be the main shop grid:</h1>
          <div className="grid grid-cols-3">
          {

            // dummy element generation loop
            [...Array(10)].map((_, i) => (
              <GridCard key={i} product={product} />
            ))
          }
          </div>
        </section>
      </section>

    </article>
  );
}