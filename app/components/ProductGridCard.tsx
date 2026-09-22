import type { Product } from "@/types";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";

interface GridCardProps {
  products: Product[];
}

export default function GridCard({ products }: GridCardProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {products.map((product) => (
        <Card key={product.id} className="h-full">
          <CardHeader>
            <CardTitle>{product.title}</CardTitle>
            <CardDescription>
              {product.brand ?? "Unknown brand"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              {product.category?.name ?? "Uncategorized"}
            </p>
            <p className="mt-2 font-semibold">€{product.price}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
