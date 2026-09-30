import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";
import ShoppingCartCounter from "./components/ShoppingCartCounter";
import { cookies } from "next/headers";
import { headers } from 'next/headers';
import { ContextProvider } from './ContextProvider';

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

const API_URL = "http://localhost:4000";

export const dynamic = "auto";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies()
    const cartString = cookieStore.get('cart')?.value;

    const headersList = await headers();
    const path = headersList.get('x-url')?.replace("http://localhost:3000","").split("?")[0];

    const shouldShowHeader = !path ? true : !["/admin-page", "/add-product", "/edit-product"].some((p => path.startsWith(p)));
  
    const cartIds: number[] = cartString ? JSON.parse(cartString) : [];

    const products = await Promise.all(cartIds.map(id => fetch(`${API_URL}/products/${id}`).then(res => res.json())));

  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${materialSymbols.variable} h-full antialiased`}
    >
        <body className="min-h-full flex flex-col">
          <ContextProvider cart={products}>
            {shouldShowHeader?
              <header className="border border-b-2 border-b-green-300 p-2">
                  <nav className="w-full flex justify-between">
                    <a href="/">Products</a>
                    <a href="/cart"><ShoppingCartCounter/></a>
                  </nav>
              </header> :
               null
            }
            <main className="m-2 mt-6 mb-6">
                {children} 
            </main>
            </ContextProvider>
        </body>
    </html>
  );
}
