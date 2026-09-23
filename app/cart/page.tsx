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

export default async function Cart() {
  const cookieStore = await cookies()
  const cartString = cookieStore.get('cart')?.value

  const cart:Product[] = cartString ? JSON.parse(cartString) : [];

  const cartWithCount = cart.reduce<(Product & {count: number})[]>((arr, product) => {
    const existing = arr.find(v => v.id === product.id);
    if(existing){
        existing.count += 1;
    }else{
        arr.push({...product,count:1});
    }
    return arr;
  }, []);

  return (
    <div className='m-auto max-w-150'>
        <h1 className='font-bold text-xl mb-4'>
            Your cart
      </h1>
      {cart.length === 0 ? <p>Cart empty</p> :
      <Table className='table-fixed w-full'>
        <TableHeader>
          <TableRow>
    <TableHead className='text-left pb-2'>Product</TableHead>
    <TableHead className='text-right pb-2'>Amount</TableHead>
  </TableRow>
        </TableHeader>
        <TableBody className='w-full'>
        {cartWithCount.map((item) => <TableRow key={item.id}>
          <TableCell className='h-12 text-left pt-2'>
            <div className='flex items-center gap-2'>
            <Image alt={item.title} width={70} height={70} src={item.thumbnail}/>
            <p>{item.title}</p>
            </div>
            </TableCell>
            <TableCell className='h-12 text-right pt-2'>
              <div className='flex justify-end items-center gap-2'>
                <p>{item.count}</p>
            <RemoveFromCartButton count={item.count} removeId={item.id}/>
            <p className='ml-4'>{item.price*item.count}$</p>
            </div>
            </TableCell>
        </TableRow>)}
        </TableBody>
      </Table>}
    </div>
  );
}