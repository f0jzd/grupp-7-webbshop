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
import { Star, StarHalf } from "lucide-react";

interface GridCardProps {
  product: Product;
}

function calculateAverageRating(product: Product) {
  const reviews = product?.reviews ?? [];

  if (reviews.length === 0) return 0;

  const totalRating = reviews.reduce(
    (total, review) => total + review.rating,
    0,
  );

  return totalRating / reviews.length;
}

export default async function GridCard({ product }: GridCardProps) {
  const averageRating = calculateAverageRating(product);
  return (
    <Card key={product.id} className="h-full">
      <Link href={`/product/${product.title}`} className="h-full">
        <CardHeader>
          <CardTitle className="line-clamp-1"><h3>{product.title}</h3></CardTitle>
          <CardDescription className="line-clamp-1">
            <p>{product.brand ?? "Unknown brand"}</p>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="w-full overflow-hidden rounded-t-lg bg-muted">
            <AspectRatio ratio={1}>
              {" "}
              {/* 1 = 1:1 square */}
              <Image
                src={product.thumbnail}
                alt={product.title}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
            </AspectRatio>
          </div>
          <p className="text-sm text-muted-foreground">
            {product.category?.name ?? "Uncategorized"}
          </p>
           {/* Rating */}
            {product.reviews && product.reviews.length > 0 && (
              <div className="flex items-center gap-2 mt-2">
                <div className="flex items-center text-amber-500">
                  {[...Array(5)].map((_, i) => {
                    const filled = Math.max(Math.min(1,(averageRating)-(i)),0);
                    return (
                      <div key={i} className="relative w-4 h-4">
                    <div className={`w-full`}>
                    <Star
                      key={i}
                      className={`h-4 amber-500 fill-white z-10  }`}
                    />
                    </div>
                    {filled > 0 ? filled === 1 ? 
                        <Star
                        key={i}
                        className={`h-4 fill-amber-500 absolute top-0`}
                        /> : <StarHalf key={i}
                        className={`h-4 fill-amber-500 absolute top-0`}/>
                    : null}
                    </div>
                  )})}
                </div>
                <span className="text-sm text-muted-foreground font-medium">
                  {averageRating.toFixed(2)} ({product.reviews?.length ?? 0})
                </span>
              </div>
            )}
        </CardContent>
      </Link>
      <CardFooter className="mt-auto w-full flex-col items-start gap-2">
        <p className="w-full font-semibold">€{product.price}</p>
        <GridCardCartControls product={product} />
      </CardFooter>
    </Card>
  );
}
