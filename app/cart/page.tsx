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
export const dynamic = "force-dynamic"

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
   <div className="m-auto max-w-150">
      <h1 className="font-bold text-xl mb-4">Your cart</h1>
      {products.length === 0 ? (
        <p>Cart empty</p>
      ) : (
        <div>
          <Table className="table-fixed w-full">
            <TableHeader>
              <TableRow>
                <TableHead className="text-left pb-2">Product</TableHead>
                <TableHead className="text-right pb-2 max-md:hidden">Amount</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className="w-full">
              {cartWithCount.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="h-12 text-left pt-2">
                    <div className="flex items-center gap-2">
                      <Image
                        alt={item.title}
                        width={70}
                        height={70}
                        src={item.thumbnail}
                      />
                      <p className='text-wrap'>{item.title}</p>
                    </div>
                    <div className="flex justify-end items-center gap-1 min-md:hidden">
                      <RemoveFromCartButton productTitle={item.title} count={item.count} removeId={item.id} />
                      <p>{item.count}</p>
                      <IncreaseCountButton  product={item} />
                      <p className="ml-4">{item.price * item.count}$</p>
                    </div>

                  </TableCell>
                  <TableCell className="h-12 text-right pt-2 max-md:hidden">
                    <div className="flex justify-end items-center gap-1">
                      <RemoveFromCartButton productTitle={item.title} count={item.count} removeId={item.id} />
                      <p className='w-6 text-center'>{item.count}</p>
                      <IncreaseCountButton  product={item} />
                      <div className="ml-4 w-20 text-right">{item.price * item.count}$</div>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <div className="w-full flex flex-col items-end mt-4">
            <h2 className="font-bold">Order information</h2>
            <div className="flex items-center">
              <p>
                Cost:{` `}
                {Number.parseFloat(products.reduce((prev, v) => prev + v.price, 0)).toFixed(2)}$
              </p>
            </div>
          </div>

          <div className="w-full flex justify-center mt-4">
            <CreateOrderButton />
          </div>
        </div>
      )}
</div>
  );
}