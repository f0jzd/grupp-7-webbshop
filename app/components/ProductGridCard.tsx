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
  return (
    <Card key={product.id} className="h-full">
      <Link href={`/product/${product.title}`} className="h-full">
        <CardHeader>
          <CardTitle className="line-clamp-1"><h3>{product.title}</h3></CardTitle>
          {/* <CardDescription className="line-clamp-1">
            <p>{product.brand ?? "Bengts bildoktor"}</p>
          </CardDescription> */}
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
              {product.discountPercentage! > 0 && <p className="p-2 font-semibold text-green-700 text-shadow-md">-{product.discountPercentage}%</p>}
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
                    const filled = Math.max(Math.min(1,(product.rating ?? 0)-(i)),0);
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
              </div>
            )}
        </CardContent>
      </Link>
      <CardFooter className="mt-auto w-full flex-col items-start gap-2">
        <GridCardCartControls product={product} />
        {product.discountPercentage! > 0
        ? <div className="flex flex-row flex-wrap font-semibold gap-1 text-shadow-sm">
            {/* new price */}
            <p className="text-green-700">€{product.price}</p>
            {/* old price */}
            <p className="line-through text-red-500 font-medium">€{Math.round(product.price/(1-(product.discountPercentage!/100)))}</p>
            {/* delta% */}
            {/* <p>Save {product.discountPercentage}%</p> */}
            {/* delta-flat */}
            {/* <p>Save €{Math.round(Number(product.price)*((product.discountPercentage!/100)))}</p> */}
          </div>
        : <p className="w-full font-semibold">€{product.price}</p>}
      </CardFooter>
    </Card>
  );
}
