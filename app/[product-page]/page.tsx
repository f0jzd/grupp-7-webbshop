"use client";

import * as React from "react";
import { Heart, ShoppingBag, Star, Truck, ShieldCheck } from "lucide-react";

// Shadcn UI components
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { Product } from "@/types";
import { useParams, useSearchParams } from "next/navigation";
import Image from "next/image";

export default function ProductDetailPage() {
  const [selectedImage, setSelectedImage] = React.useState(0);
  const [product, setProduct] = React.useState<Product | null>(null);

  // 1. Get the title from the route parameter
  const params = useParams();
  const rawParam = params["product-page"] as string | undefined;
  const productTitle = rawParam ? decodeURIComponent(rawParam) : undefined;

  const [loading, setLoading] = React.useState(Boolean(productTitle));
  const API_URL = "http://localhost:4000";

  React.useEffect(() => {
    if (!productTitle) return;

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
    toast.success("Added to cart!", {
      action: {
        label: "View Cart",
        onClick: () => console.log("Navigate to cart"),
      },
    });
  };

  if (loading) {
    return <div className="p-8 text-center">Loading product...</div>;
  }

  if (!product) {
    return <div className="p-8 text-center">Product not found.</div>;
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
              src={product.thumbnail}
              fill
              alt="Product image"
              className="h-full w-full object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
              priority
            />
          </div>

          {/* Thumbnails */}
          {/* <div className="flex gap-3">
            {productImages.map((src, idx) => (
              <button
                key={idx}
                onClick={() => setSelectedImage(idx)}
                className={`relative w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                  selectedImage === idx
                    ? "border-primary"
                    : "border-transparent opacity-70 hover:opacity-100"
                }`}
              >
                <Image
                  src={src}
                  fill
                  alt={`Thumbnail ${idx + 1}`}
                  className="h-full w-full object-cover"
                />
              </button>
            ))}
          </div> */}
        </div>

        {/* Right: Buying Box */}
        <div className="flex flex-col gap-6 w-full min-w-0">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Badge variant="secondary">New Arrival</Badge>
              <Badge className="bg-emerald-600 hover:bg-emerald-700">
                In Stock
              </Badge>
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground">
              {product.title}
            </h1>

            {/* Rating */}
            <div className="flex items-center gap-2 mt-2">
              <div className="flex items-center text-amber-500">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-4 w-4 ${i < 4 ? "fill-amber-500" : "text-muted"}`}
                  />
                ))}
              </div>
              <span className="text-sm text-muted-foreground font-medium">
                4.2 (128 reviews)
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
            <TabsTrigger value="reviews">Reviews (128)</TabsTrigger>
          </TabsList>

          <TabsContent
            value="description"
            className="mt-6 min-h-[180px] text-muted-foreground leading-relaxed"
          >
            Engineered for lightweight performance and all-day comfort. Features
            a breathable knit upper, responsive foam cushioning, and
            high-traction rubber soles built for both roads and trails.
          </TabsContent>

          <TabsContent value="specs" className="mt-6 min-h-[180px]">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-y-3 gap-x-8 text-sm max-w-xl">
              <div className="text-muted-foreground">Upper Material</div>
              <div className="font-medium">100% Recycled Polyester Mesh</div>
              <div className="text-muted-foreground">Midsole</div>
              <div className="font-medium">EVA Foam Cushioning</div>
              <div className="text-muted-foreground">Drop</div>
              <div className="font-medium">8mm</div>
              <div className="text-muted-foreground">Weight</div>
              <div className="font-medium">265g (Size 9)</div>
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
