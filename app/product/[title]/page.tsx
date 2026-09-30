import { Star, ShieldCheck, UserCircle, Package } from "lucide-react";

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
import { Category } from "@/types";
import { cookies } from "next/headers";
import { Metadata } from "next";

export const dynamic = "force-dynamic"

export async function generateMetadata(
  { params }:{params: Promise<{ title: string }>}): Promise<Metadata> {
  const title = (await params).title
 
  return {
    title: title,
    description: "View product information like title, price, description, specifications, stock, reviews, etc. and add product to cart",
  }
}

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

async function getCategory(id: number | string): Promise<Category | null> {
  const res = await fetch(`${API_URL}/categories/${id}`, { cache: "no-store" }); //
  if (!res.ok) return null; // json-server answers 404 for an unknown id
  return res.json();
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
  const category = await getCategory(product.categoryId); //grabs the relevant cateogy object found by matching active products ID

  const cookieStore = await cookies();
  const cartString = cookieStore.get("cart")?.value;
  const cartIds: number[] = cartString ? JSON.parse(cartString) : [];
  const cartCount = cartIds.filter((id) => id === product.id).length;

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
            <BreadcrumbLink
              href={category ? `/?category=${category.slug}` : "/"}
            >
              {category?.name}
            </BreadcrumbLink>
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
              alt={`${product.title}${product.brand ? ` by ${product.brand}` : ""}`}
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
            <div className="flex items-center gap-2">
              <Package className="h-4 w-4 text-primary" />
              <span>
                {product.stock != null ? (
                  <>
                    <span
                      className={
                        product.stock === 0
                          ? "font-semibold text-destructive"
                          : product.stock <= 10
                            ? "font-semibold text-amber-500"
                            : "font-semibold text-emerald-600"
                      }
                    >
                      {product.stock} in stock
                    </span>
                    {product.availabilityStatus && (
                      <span className="ml-1">
                        · {product.availabilityStatus}
                      </span>
                    )}
                  </>
                ) : (
                  (product.availabilityStatus ?? "Availability unknown")
                )}
              </span>
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

          {/* Reviews Tab */}
          <TabsContent value="reviews" className="mt-6 min-h-45">
            {!product.reviews || product.reviews.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 text-muted-foreground gap-2">
                <UserCircle className="h-10 w-10 opacity-30" />
                <p className="text-sm">No reviews yet for this product.</p>
              </div>
            ) : (
              <div className="flex flex-col gap-6 max-w-2xl">
                {/* Summary bar */}
                <div className="flex items-center gap-4 p-4 rounded-xl border bg-muted/40">
                  <div className="text-center min-w-15">
                    <p className="text-4xl font-bold leading-none">
                      {averageRating.toFixed(1)}
                    </p>
                    <div className="flex justify-center mt-1 text-amber-500">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-3.5 w-3.5 ${
                            i < Math.round(averageRating)
                              ? "fill-amber-500"
                              : "text-muted-foreground"
                          }`}
                        />
                      ))}
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      {product.reviews.length}{" "}
                      {product.reviews.length === 1 ? "review" : "reviews"}
                    </p>
                  </div>

                  <Separator orientation="vertical" className="h-14" />

                  {/* Star breakdown bars */}
                  <div className="flex flex-col gap-1 flex-1 text-xs text-muted-foreground">
                    {[5, 4, 3, 2, 1].map((star) => {
                      const count = product.reviews!.filter(
                        (r) => r.rating === star,
                      ).length;
                      const pct =
                        product.reviews!.length > 0
                          ? (count / product.reviews!.length) * 100
                          : 0;
                      return (
                        <div key={star} className="flex items-center gap-2">
                          <span className="w-3 shrink-0">{star}</span>
                          <Star className="h-3 w-3 fill-amber-500 text-amber-500 shrink-0" />
                          <div className="flex-1 h-1.5 rounded-full bg-muted overflow-hidden">
                            <div
                              className="h-full rounded-full bg-amber-400 transition-all"
                              style={{ width: `${pct}%` }}
                            />
                          </div>
                          <span className="w-4 text-right shrink-0">
                            {count}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Individual review cards */}
                {product.reviews.map((review, i) => {
                  const initials = review.reviewerName
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                    .toUpperCase()
                    .slice(0, 2);

                  const formattedDate = new Date(
                    review.date,
                  ).toLocaleDateString("en-GB", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  });

                  return (
                    <div key={i} className="flex gap-4">
                      {/* Avatar */}
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
                        {initials}
                      </div>

                      <div className="flex flex-col gap-1 flex-1">
                        <div className="flex items-center justify-between flex-wrap gap-x-2">
                          <span className="font-medium text-sm">
                            {review.reviewerName}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {formattedDate}
                          </span>
                        </div>

                        {/* Stars */}
                        <div className="flex text-amber-500">
                          {[...Array(5)].map((_, s) => (
                            <Star
                              key={s}
                              className={`h-3.5 w-3.5 ${
                                s < review.rating
                                  ? "fill-amber-500"
                                  : "text-muted-foreground"
                              }`}
                            />
                          ))}
                        </div>

                        <p className="text-sm text-muted-foreground leading-relaxed">
                          {review.comment}
                        </p>

                        {i < product.reviews!.length - 1 && (
                          <Separator className="mt-4" />
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
