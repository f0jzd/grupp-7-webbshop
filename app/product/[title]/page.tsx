"use client";

import { ShoppingBag, Star, Truck, ShieldCheck } from "lucide-react";

// Shadcn UI components
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Product } from "@/types";
import Image from "next/image";
import { addProductToCart } from "@/actions";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function ProductDetailPage() {
  const params = useParams<{ title: string }>();
  const productTitle = decodeURIComponent(params.title);

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const API_URL = "http://localhost:4000";

  useEffect(() => {
    let ignore = false;
    const loadProduct = async () => {
      setLoading(true);
      try {
        // 2. Query json-server by title
        const response = await fetch(
          `${API_URL}/products?title=${encodeURIComponent(productTitle)}`,
        );
        const data = await response.json();

        // Middleware wraps array responses in { products: [...] }
        const foundProduct = Array.isArray(data) ? data[0] : data.products?.[0];

        if (!ignore) setProduct(foundProduct || null);
      } catch (error) {
        console.error("Failed to load product:", error);
        if (!ignore) setProduct(null);
      } finally {
        if (!ignore) setLoading(false);
      }
    };

    loadProduct();
    return () => {
      ignore = true;
    };
  }, [productTitle]);

  const handleAddToCart = () => {
    if (product !== null) {
      console.log("Add to cart:", product);
      addProductToCart(product);
    }
  };

  if (loading) {
    return <div className="p-8 text-center">Loading product...</div>;
  }

  if (!product) {
    return <div className="p-8 text-center">Product not found.</div>;
  }

  function calculateAverageRating() {
    const reviews = product?.reviews ?? [];

    if (reviews.length === 0) return 0;

    const totalRating = reviews.reduce(
      (total, review) => total + review.rating,
      0,
    );

    return totalRating / reviews.length;
  }

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
                    className={`h-4 w-4 ${i < Math.round(calculateAverageRating()) ? "fill-amber-500" : "text-muted"}`}
                  />
                ))}
              </div>
              <span className="text-sm text-muted-foreground font-medium">
                {calculateAverageRating().toFixed(1)} (
                {product.reviews?.length ?? 0})
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
            <Button
              size="lg"
              className="flex-1 gap-2 text-base"
              onClick={handleAddToCart}
            >
              <ShoppingBag className="h-5 w-5" />
              Add to Cart
            </Button>
          </div>

          {/* Value Props & Shipping */}
          <div className="grid grid-cols-2 gap-4 pt-2 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Truck className="h-4 w-4 text-primary" />
              <span>Free shipping over $75</span>
            </div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-primary" />
              <span>2-year warranty included</span>
            </div>
          </div>

          <Separator />

          {/* Shipping & Returns info */}
          <div className="flex flex-col gap-4 text-sm">
            <div>
              <p className="font-medium mb-1">Shipping &amp; Delivery</p>
              <p className="text-muted-foreground">
                Orders placed before 2 PM EST ship same day. Standard delivery
                takes 3–5 business days. Express options available at checkout.
              </p>
            </div>
            <div>
              <p className="font-medium mb-1">30-Day Return Policy</p>
              <p className="text-muted-foreground">
                Return items within 30 days of receipt in original packaging and
                unworn condition for a full refund or exchange.
              </p>
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
            className="mt-6 min-h-[180px] text-muted-foreground leading-relaxed"
          >
            {product.description}
          </TabsContent>

          <TabsContent value="specs" className="mt-6 min-h-[180px]">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-y-3 gap-x-8 text-sm max-w-xl">
              <div className="text-muted-foreground">
                Weight: {product.weight}
              </div>
              <div className="font-medium">{product.dimensions}</div>
            </div>
          </TabsContent>

          <TabsContent value="reviews" className="mt-6 min-h-[180px]">
            <p className="text-sm text-muted-foreground">
              Review details and cards can be loaded here.
            </p>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
