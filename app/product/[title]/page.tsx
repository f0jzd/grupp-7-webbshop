import { Star, ShieldCheck } from "lucide-react";

// Shadcn UI components
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Product } from "@/types";
import Image from "next/image";
import { AddToCartButton } from "@/components/AddToCartButton";

const API_URL = "http://localhost:4000";

async function getProduct(title: string): Promise<Product | null> {
  const response = await fetch(
    `${API_URL}/products?title=${encodeURIComponent(title)}`,
    { cache: "no-store" },
  );
  if (!response.ok) return null;
  const data = await response.json();

  return data.products?.[0] ?? null;
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

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ title: string }>;
}) {
  const { title } = await params;
  const productTitle = decodeURIComponent(title);
  const product = await getProduct(productTitle);

  if (!product) {
    return <div className="p-8 text-center">Product not found.</div>;
  }

  const averageRating = calculateAverageRating(product);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
      {/* 1. Breadcrumbs */}
      <Breadcrumb className="mb-6">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/">Home</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href="/shoes">Shoes</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>{product.title}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* 2. Hero Section: Added items-start to prevent left/right stretching */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
        {/* Left: Image Gallery */}
        <div className="flex flex-col gap-4 w-full min-w-0 self-start">
          <div className="relative w-full aspect-square overflow-hidden rounded-2xl border bg-muted">
            <Image
              src={product.images[0] || product.thumbnail}
              fill
              alt="Product image"
              className="h-full w-full object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
              priority
            />
          </div>
        </div>

        {/* Right: Buying Box */}
        <div className="flex flex-col gap-6 w-full min-w-0">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground">
              {product.title}
            </h1>

            {/* Rating */}
            <div className="flex items-center gap-2 mt-2">
              <div className="flex items-center text-amber-500">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-4 w-4 ${i < Math.round(averageRating) ? "fill-amber-500" : "text-muted"}`}
                  />
                ))}
              </div>
              <span className="text-sm text-muted-foreground font-medium">
                {averageRating.toFixed(1)} ({product.reviews?.length ?? 0})
              </span>
            </div>

            {/* Price */}
            <div className="mt-4 flex items-baseline gap-3">
              <span className="text-3xl font-extrabold">€{product.price}</span>
              {product.discountPercentage ? (
                <>
                  <span className="text-lg text-muted-foreground line-through">
                    €
                    {Math.round(
                      product.price / (1 - product.discountPercentage / 100),
                    )}
                  </span>
                  <span className="text-sm font-semibold text-emerald-600">
                    Save {product.discountPercentage}%
                  </span>
                </>
              ) : null}
            </div>
          </div>

          <Separator />

          {/* Action CTAs */}
          <div className="flex gap-3 pt-2">
            <AddToCartButton product={product} />
          </div>

          {/* Value Props & Shipping */}
          <div className="grid grid-cols-2 gap-4 pt-2 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-primary" />
              <span>{product.warrantyInformation}</span>
            </div>
          </div>

          <Separator />

          {/* Shipping & Returns info */}
          <div className="flex flex-col gap-4 text-sm">
            <div>
              <p className="font-medium mb-1">Shipping &amp; Delivery</p>
              <p className="text-muted-foreground">
                {product.shippingInformation}
              </p>
            </div>
            <div>
              <p className="font-medium mb-1">Return Policy</p>
              <p className="text-muted-foreground">{product.returnPolicy}</p>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Lower Section: Added min-h-[180px] to tab contents */}
      <div className="mt-16">
        <Tabs defaultValue="description">
          <TabsList className="grid w-full grid-cols-3 max-w-md">
            <TabsTrigger value="description">Description</TabsTrigger>
            <TabsTrigger value="specs">Specifications</TabsTrigger>
            <TabsTrigger value="reviews">
              Reviews ({product.reviews?.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent
            value="description"
            className="mt-6 min-h-45 text-muted-foreground leading-relaxed"
          >
            {product.description}
          </TabsContent>

          <TabsContent value="specs" className="mt-6 min-h-45">
            <div className="grid grid-cols-2 gap-y-3 gap-x-8 text-sm max-w-xl">
              {product.weight && (
                <>
                  <div className="text-muted-foreground">Weight</div>
                  <div className="font-medium">{product.weight} g</div>
                </>
              )}
              {product.dimensions &&
                Object.entries(product.dimensions).map(([key, value]) => [
                  <div
                    key={key + "-label"}
                    className="text-muted-foreground capitalize"
                  >
                    {key}
                  </div>,
                  <div key={key + "-value"} className="font-medium">
                    {value}
                  </div>,
                ])}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
