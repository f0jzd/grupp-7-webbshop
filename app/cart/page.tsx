import { Product } from '@/types'
import { cookies } from 'next/headers'
import RemoveFromCartButton from './RemoveFromCartButton'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import Image from 'next/image'
import CreateOrderButton from './CreateOrderButton'
import IncreaseCountButton from './IncreaseCountButton'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Cart checkout',
  description: 'View cart and order information and create order',
}

const API_URL = "http://localhost:4000";

export default async function Cart() {
  const cookieStore = await cookies()
  const cartString = cookieStore.get('cart')?.value

  const cartIds: number[] = cartString ? JSON.parse(cartString) : [];

    const products = await Promise.all(cartIds.map(id => fetch(`${API_URL}/products/${id}`).then(res => res.json())));

  const cartWithCount = products.reduce<(Product & {count: number})[]>((arr, product) => {
    const existing = arr.find(v => v.id === product.id);
    if(existing){
        existing.count += 1;
    }else{
        arr.push({...product,count:1});
    }
    return arr;
  }, []);

  return (
   <div className="max-w-150 mx-auto px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="font-bold text-xl mb-4">Your cart</h1>
      <Cart/>
</div>
  );
}