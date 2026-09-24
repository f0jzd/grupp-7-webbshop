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
interface GridCardProps {
  product: Product;
}

export default function GridCard({ product }: GridCardProps) {
  return (
    <Link href={`/product/${product.title}`} className="h-full">
      <Card key={product.id} className="h-full">
        <CardHeader>
          <CardTitle className="line-clamp-2">{product.title}</CardTitle>
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
        <CardFooter className="mt-auto">
          <p className="mt-2 font-semibold">€{product.price}</p>
        </CardFooter>
      </Card>
    </Link>
  );
}
