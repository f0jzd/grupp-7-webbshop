
import type { Product } from "./types";
import GridCard from "./components/ProductGridCard";

const API_URL = "http://localhost:4000";

export default async function ProductPage() {
  const product: Product = await fetch(`${API_URL}/products/1`).then((res) =>
    res.json(),
  );

  return (
    <article className="flex flex-col items-center justify-center">
      <p>this is a primary product catalog</p>
      <input defaultValue="test"></input>
      <section>
        <h1>This should be the main shop grid:</h1>
        <div className="
        grid grid-cols-5">
        {
          // dummy element generation loop
          [...Array(30)].map((_, i) => (
            <GridCard key={i} product={product} />
          ))
        }
        </div>
      </section>

    </article>
  );
}