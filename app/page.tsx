import type { Product } from "./types";
import GridCard from "./components/ProductGridCard";

const API_URL = "http://localhost:4000";

export default async function ProductPage() {
  const product: Product = await fetch(`${API_URL}/products/1`).then((res) =>
    res.json(),
  );

  return (
    <div>
      <GridCard product={product} />
    </div>
  );
}
