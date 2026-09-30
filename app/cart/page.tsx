import { Metadata } from 'next'
import Cart from './Cart';

export const metadata: Metadata = {
  title: 'Cart checkout',
  description: 'View cart and order information and create order',
}

export const dynamic = "auto";

export default async function CartPage() {
  return (
   <div className="max-w-150 mx-auto px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="font-bold text-xl mb-4">Your cart</h1>
      <Cart/>
</div>
  );
}