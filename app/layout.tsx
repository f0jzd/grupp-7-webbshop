import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";
import ShoppingCartCounter from "./components/ShoppingCartCounter";
import { cookies } from "next/headers";
import { Product } from "./types";

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

export const metadata: Metadata = {
  title: "Webshop - Admin",
  description: "Admin page for webshop app",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  const cookieStore = await cookies()
    const cartString = cookieStore.get('cart')?.value
  
    const cart:Product[] = cartString ? JSON.parse(cartString) : [];

  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${materialSymbols.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <header className="border border-b-2 border-b-green-300 p-2">
        <nav className="w-full flex justify-between">
          <a href="/">Products</a>
          <a href="/cart"><ShoppingCartCounter cart={cart}/></a>
        </nav>
      </header>
      <main className="m-4">
        {children} </main>
        </body>
    </html>
  );
}
