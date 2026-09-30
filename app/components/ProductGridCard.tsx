import type { Product } from "@/types";
import Image from "next/image";
import Link from "next/link";
import { cookies } from "next/headers";
import { GridCardCartControls } from "./GridCardCartControls";
import { Star } from "lucide-react";

interface GridCardProps {
  product: Product;
}

function calculateAverageRating(product: Product) {
  const reviews = product?.reviews ?? [];
  if (reviews.length === 0) return product.rating ?? 0;
  const totalRating = reviews.reduce(
    (total, review) => total + review.rating,
    0,
  );
  return totalRating / reviews.length;
}

export default async function GridCard({ product }: GridCardProps) {
  const cookieStore = await cookies();
  const cartString = cookieStore.get("cart")?.value;
  const cartIds: number[] = cartString ? JSON.parse(cartString) : [];
  const count = cartIds.filter((id) => id === product.id).length;

  const averageRating = calculateAverageRating(product);
  const originalPrice = product.discountPercentage
    ? Math.round(product.price / (1 - product.discountPercentage / 100))
    : null;

  return (
    <div className="group relative flex flex-col h-full overflow-hidden rounded-2xl border bg-card text-card-foreground shadow-xs transition-all duration-200 hover:shadow-md hover:border-foreground/20">
      <Link
        href={`/product/${encodeURIComponent(product.title)}`}
        className="flex flex-col flex-1"
      >
        {/* Image Container with Badges */}
        <div className="relative aspect-square w-full overflow-hidden bg-muted">
          <Image
            src={product.thumbnail || product.images?.[0]}
            alt={`${product.title}${product.brand ? ` by ${product.brand}` : ""}`}
            fill
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
          />

          {/* Badges */}
          <div className="absolute top-2.5 left-2.5 flex flex-wrap gap-1">
            {product.discountPercentage ? (
              <span className="rounded-full bg-emerald-600 px-2.5 py-0.5 text-xs font-semibold text-white shadow-xs">
                Save {Math.round(product.discountPercentage)}%
              </span>
            ) : null}
          </div>

          {product.category?.name ? (
            <div className="absolute top-2.5 right-2.5">
              <span className="rounded-full bg-background/90 backdrop-blur-xs px-2.5 py-0.5 text-xs font-medium text-foreground/80 border shadow-2xs">
                {product.category.name}
              </span>
            </div>
          ) : null}
        </div>

        {/* Content Details */}
        <div className="flex flex-col flex-1 p-4 pb-2">
          {/* Brand & Stock */}
          <div className="flex items-center justify-between text-xs text-muted-foreground mb-1 gap-2">
            <span className="font-medium truncate">{product.brand ?? "Unknown brand"}</span>
            {product.stock != null ? (
              <span
                className={
                  product.stock === 0
                    ? "font-semibold text-destructive shrink-0"
                    : product.stock <= 10
                      ? "font-semibold text-amber-500 shrink-0"
                      : "font-semibold text-emerald-600 shrink-0"
                }
              >
                {product.stock === 0
                  ? "Out of stock"
                  : `${product.stock} in stock`}
              </span>
            ) : product.availabilityStatus ? (
              <span className="text-xs text-muted-foreground shrink-0">
                {product.availabilityStatus}
              </span>
            ) : null}
          </div>

          {/* Title */}
          <h3 className="font-semibold text-foreground tracking-tight line-clamp-1 group-hover:text-primary transition-colors">
            {product.title}
          </h3>

          {/* Rating */}
          <div className="flex items-center gap-1.5 mt-1.5">
            <div className="flex items-center text-amber-500">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`h-3.5 w-3.5 ${
                    i < Math.round(averageRating)
                      ? "fill-amber-500 text-amber-500"
                      : "text-muted"
                  }`}
                />
              ))}
            </div>
            <span className="text-xs text-muted-foreground font-medium">
              {averageRating > 0 ? averageRating.toFixed(1) : "0.0"}{" "}
              ({product.reviews?.length ?? 0})
            </span>
          </div>

          {/* Price */}
          <div className="mt-auto pt-3 flex items-baseline gap-2 flex-wrap">
            <span className="text-xl font-extrabold text-foreground">
              €{product.price}
            </span>
            {originalPrice ? (
              <span className="text-xs text-muted-foreground line-through">
                €{originalPrice}
              </span>
            ) : null}
          </div>
        </div>
      </Link>

      {/* Cart Controls Footer */}
      <div className="p-4 pt-2">
        <GridCardCartControls product={product} count={count} />
      </div>
    </div>
  );
}

