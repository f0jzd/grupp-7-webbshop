import type { Product } from "@/types";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { AspectRatio } from "./ui/aspect-ratio";
import Image from "next/image";
import Link from "next/link";
import { cookies } from "next/headers";
import { GridCardCartControls } from "./GridCardCartControls";

interface GridCardProps {
  product: Product;
}

export default async function GridCard({ product }: GridCardProps) {
  const cookieStore = await cookies();
  const cartString = cookieStore.get("cart")?.value;
  const cartIds: number[] = cartString ? JSON.parse(cartString) : [];
  const count = cartIds.filter((id) => id === product.id).length;

  return (
    <Link href={`/product/${product.title}`} className="h-full">
      <Card key={product.id} className="h-full flex flex-col">
        <CardHeader>
          <CardTitle className="line-clamp-1">{product.title}</CardTitle>
          <CardDescription className="line-clamp-1">
            {product.brand ?? "Unknown brand"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="w-full overflow-hidden rounded-t-lg bg-muted">
            <AspectRatio ratio={1}>
              {" "}
              {/* 1 = 1:1 square */}
              <Image
                src={product.thumbnail}
                alt="Product name"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
            </AspectRatio>
          </div>
          <p className="text-sm text-muted-foreground">
            {product.category?.name ?? "Uncategorized"}
          </p>
        </CardContent>
        <CardFooter className="mt-auto flex flex-col items-start gap-2">
          <p className="font-semibold">€{product.price}</p>
          <GridCardCartControls product={product} count={count} />
        </CardFooter>
      </Card>
    </Link>
  );
}
