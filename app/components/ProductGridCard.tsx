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

interface GridCardProps {
  product: Product;
}

export default async function GridCard({ product }: GridCardProps) {
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
        </CardContent>
      </Link>
      <CardFooter className="mt-auto w-full flex-col items-start gap-2">
        <GridCardCartControls product={product} />
        {product.discountPercentage! > 0
        ? <div className="flex flex-row flex-wrap font-semibold ">
            <span className="pr-2 line-through text-red-500">€{product.price}</span> {/* old price */}
            <span>€{Math.round(Number(product.price)*(1-(product.discountPercentage!/100)))-0.01}</span> {/* new price */}
          </div>
        : <p className="w-full font-semibold">€{product.price}</p>}
      </CardFooter>
    </Card>
  );
}
