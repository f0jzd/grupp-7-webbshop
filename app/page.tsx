import type { Category, Product } from "./types";
import GridCard from "./components/ProductGridCard";
import { SearchBar } from "./components/SearchBar";

const API_URL = "http://localhost:4000";

export default async function ProductPage() {
  const product: Product = await fetch(`${API_URL}/products/1`).then((res) =>
    res.json(),
  );

  const categories: Category[] = await fetch(`${API_URL}/categories`).then(
      (res) => res.json(),
    );
  
  const stock = ["In Stock", "Low Stock", "Out of Stock"];

  return (
    <div>
      <SearchBar stock={stock} categories={categories}/>
      <GridCard product={product} />
    </div>
  );
}
