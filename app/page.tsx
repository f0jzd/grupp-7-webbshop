
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
      <section className="flex flex-col items-center">
        <div className="flex flex-col items-center">
          <nav className="flex flex-auto flex-row gap-2">
            {/* shadcn buttons */}
            {/* shops tend to have top ribbons for main categories and a sidebar for metadata */}
            {/* example: https://www.ahlens.se/herr/nyheter */}
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
          <div className="flex flex-col min-w-40">
            <p>More buttons</p>
            <p>More buttons</p>
            <p>More buttons</p>
            <p>More buttons</p>
            <p>More buttons</p>
            <p>More buttons</p>
            <p>More buttons</p>
            <p>More buttons</p>
            <p>More buttons</p>
            <p>More buttons</p>
            <p>More buttons</p>
            <p>More buttons</p>
            <p>More buttons</p>
            <p>More buttons</p>
            <p>More buttons</p>
            <p>More buttons</p>
            <p>More buttons</p>
            <p>More buttons</p>
          </div>
          <section className="flex-auto w-full border border-amber-300">
            <h1>This should be the main shop grid:</h1>
            <div className="grid grid-cols-[repeat(auto-fit,minmax(250px,1fr))] *:w-full">
            {

              // dummy element generation loop
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