import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";
import ShoppingCartCounter from "./components/ShoppingCartCounter";
import { cookies } from "next/headers";
import { headers } from 'next/headers';
import { ClerkProvider, Show, SignInButton, SignOutButton, SignUpButton } from '@clerk/nextjs'
import { currentUser } from '@clerk/nextjs/server'
import { Button } from "./components/ui/button";

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

const API_URL = "http://localhost:4000";

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

    const user = await currentUser();

  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${materialSymbols.variable} h-full antialiased`}
    >
        <body className="min-h-full flex flex-col">
          <ClerkProvider>
            {shouldShowHeader?
              <header className="border border-b-2 border-b-green-300 p-2">
                  <nav className="w-full flex justify-between items-center">
                    <a href="/">Products</a>
                    <div className="flex items-center gap-4">
                  <Show when="signed-out">

                  <SignInButton>
                    <Button variant="ghost">Sign in</Button>
                  </SignInButton>
                  <SignUpButton>
                    <Button >
                      Sign Up
                    </Button>
                  </SignUpButton>
                </Show>
                <div className="flex gap-4 items-center">
                <Show when="signed-in">
                  <div className="flex items-center">
                  Signed in as &nbsp; <p className="font-bold">{user?.emailAddresses[0].emailAddress}</p>
                  </div>
                  <a href="/my-pages">My pages</a>
                  <a href="/order-history">Order history</a>
                  <a href="/favorites">Favorites</a>
                </Show>
                <Show when="signed-in">
                  <SignOutButton><Button>Sign out</Button></SignOutButton>
                </Show>
                </div>
                    <a href="/cart"><ShoppingCartCounter cart={products}/></a>
                    </div>
                  </nav>
              </header> :
               null
            }
            <main className="m-2 mt-6 mb-6">
                {children} 
            </main>
            </ClerkProvider>
        </body>
    </html>
  );
}
