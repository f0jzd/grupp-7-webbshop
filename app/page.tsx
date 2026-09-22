import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { ProductsResponse } from "./types";
import GridCard from "./components/ProductGridCard";

const API_URL = "http://localhost:4000";

export default async function ProductPage() {
  const { products }: ProductsResponse = await fetch(
    `${API_URL}/products`,
  ).then((res) => res.json());

  //   products.forEach((element) => {
  //     console.log(element.title);
  //   });

  return (
    <div className="max-w-7xl">
      <GridCard products={products} />;
    </div>
  );
}
