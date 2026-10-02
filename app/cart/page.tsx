import { Metadata } from 'next'
import Cart from './Cart';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Cart checkout',
  description: 'View cart and order information and create order',
}

export const dynamic = "auto";

export default async function CartPage() {
  return (
   <div className="max-w-150 mx-auto px-4 py-8 max-md:px-0">
      <Link href="/" className="mb-4 inline-block">
        Go to product page
      </Link>
      <h1 className="font-bold text-xl mb-4">Your cart</h1>
      <Cart/>
</div>
  );
}