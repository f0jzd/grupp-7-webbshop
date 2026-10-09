import { Geist, Geist_Mono } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";
import ShoppingCartCounter from "./components/ShoppingCartCounter";
import { cookies } from "next/headers";
import { headers } from "next/headers";
import { ContextProvider } from "./ContextProvider";
import { Product } from "./types";
import Link from "next/link";
import Image from "next/image";
import { supabase } from "./lib/supabase";
import { groupedCategories } from "./categories";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const materialSymbols = localFont({
  src: "../fonts/material-symbols-rounded.woff2",
  weight: "100 900",
  variable: "--font-material-symbols",
});

// Change this single number to adjust the logo icon size in pixels
const LOGO_SIZE = 64;

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies();
  const cartString = cookieStore.get("cart")?.value;

  const headersList = await headers();
  const path = headersList
    .get("x-url")
    ?.replace("http://localhost:3000", "")
    .split("?")[0];

  const shouldShowHeader = !path
    ? true
    : !["/admin-page", "/add-product", "/edit-product"].some((p) =>
        path.startsWith(p),
      );

  let cartIds: number[] = [];
  if (cartString) {
    try {
      const parsed = JSON.parse(cartString);
      if (Array.isArray(parsed)) {
        cartIds = parsed;
      }
    } catch {
      cartIds = [];
    }
  }

  let products: Product[] = [];
  if (cartIds.length > 0) {
    const uniqueIds = Array.from(new Set(cartIds));
    const { data } = await supabase
      .from("products")
      .select("*")
      .in("id", uniqueIds);

    if (data) {
      const productMap = new Map(
        (data as unknown as Product[]).map((p) => [p.id, p]),
      );
      products = cartIds
        .map((id) => productMap.get(id))
        .filter((p): p is Product => Boolean(p));
    }
  }

  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${materialSymbols.variable} h-full antialiased`}
    >
        <body className="min-h-full flex flex-col">
          <ContextProvider cart={products}>
            {shouldShowHeader?
              <header className="border border-b-2 border-b-green-300 p-2">
                <nav className="w-full flex justify-between items-center max-w-375 mx-auto max-md:flex-col max-md:items-start max-md:gap-2">
                  <Link
                    href="/"
                    className="flex items-center font-semibold text-lg hover:opacity-85 transition-opacity"
                  >
                    <Image
                      src="/shop-logo.png"
                      alt="webshop icon"
                      width={LOGO_SIZE}
                      height={LOGO_SIZE}
                      className="object-contain"
                    />
                    <span>Bengts Bildoktor</span>
                  </Link>

                {/* Categories desktop */}
                  <div className="centerwrapper flex flex-row flex-nowrap gap-6 max-md:hidden">
                    {groupedCategories.map(({ name }) => (
                      <div key={name} className="relative">
                        <Link
                          href={`/?groupedCategory=${encodeURIComponent(name)}`}
                          className="font-medium"
                        >
                          {name}
                        </Link>
                      </div>
                    ))}
                  </div>

                  {/* Categories responsive */}
                  <div className="centerwrapper flex flex-col flex-nowrap md:hidden">
                    <div className="flex flex-row flex-wrap gap-4">
                        {groupedCategories.map(({ name }) => (
                          <div key={name} className="relative">
                            <Link
                              href={`/?groupedCategory=${encodeURIComponent(name)}`}
                              className="font-medium text-nowrap"
                            >
                              {name}
                            </Link>
                          </div>
                        ))}
                        </div>
                  </div>

                <Link href="/cart">
                  <ShoppingCartCounter />
                </Link>
              </nav>
            </header>
           : null}
          <main className="m-2 mt-6 mb-6">{children}</main>
        </ContextProvider>
      </body>
    </html>
  );
}
