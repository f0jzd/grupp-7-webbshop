import Cart from './Cart'
import { cookies } from 'next/headers'

const API_URL = "http://localhost:4000";

export default async function CartPage() {
  const cookieStore = await cookies()
  const cartString = cookieStore.get('cart')?.value

  const cartIds: number[] = cartString ? JSON.parse(cartString) : [];

    const products = await Promise.all(cartIds.map(id => fetch(`${API_URL}/products/${id}`).then(res => res.json())));

  return (
   <div className="m-auto max-w-150">
      <h1 className="font-bold text-xl mb-4">Your cart</h1>
      <Cart/>
</div>
  );
}