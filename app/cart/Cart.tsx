"use client";

import { Product } from '@/types'
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
import { useContext, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { CartContext } from '@/ContextProvider';

export default function Cart(){
    const {cart: products, setCart: setProducts} = useContext(CartContext);

    const cartWithCount = products.reduce<(Product & {count: number})[]>((arr, product) => {
    const existing = arr.find(v => v.id === product.id);
    if(existing){
        existing.count += 1;
    }else{
        arr.push({...product,count:1});
    }
    return arr;
  }, []);

    return products.length === 0 ? (
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
                    {/* Price for small screens */}
                    <div className="flex justify-end items-center gap-1 min-md:hidden">
                      <RemoveFromCartButton removeProduct={() => setProducts((products) => {
                        const removeIdLast = products.findLastIndex(v => v.id === item.id);
                        const filtered = products.filter((_,i) => i !== removeIdLast);
                        return [...filtered];

                      })} productTitle={item.title} count={item.count} removeId={item.id} />
                      <p>{item.count}</p>
                      <IncreaseCountButton addProduct={() => {
                        setProducts((products) => ([...products, {...item}]))
                      }}/>
                      <p className="ml-4">{Number(item.price * item.count).toFixed(2)}$</p>
                    </div>

                  </TableCell>
                  {/* Price for large screens */}
                  <TableCell className="h-12 text-right pt-2 max-md:hidden">
                    <div className="flex justify-end items-center gap-1">
                      <RemoveFromCartButton removeProduct={() => setProducts((products) => {
                        const removeIdLast = products.findLastIndex(v => v.id === item.id);
                        const filtered = products.filter((_,i) => i !== removeIdLast)
                        return [...filtered];

                      })} productTitle={item.title} count={item.count} removeId={item.id} />
                      <p className='w-6 text-center'>{item.count}</p>
                      <IncreaseCountButton addProduct={() => {
                        setProducts((products) => ([...products, {...item}]))
                      }}/>
                      <div className="ml-4 w-20 text-right">{Number(item.price * item.count).toFixed(2)}$</div>
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
                {Number(products.reduce((prev, v) => prev + v.price, 0)).toFixed(2)}$
              </p>
            </div>
          </div>

          <div className="w-full flex justify-center mt-4">
            <CreateOrderButton />
          </div>
        </div>
      )
}

function RemoveFromCartButton({count,productTitle, removeProduct}: {removeId: number;count:number; productTitle: string; removeProduct: () => void}) {
  return (
    <Button variant="link" 
        className="no-underline hover:no-underline cursor-pointer"
        onClick={() => {
          if(count === 1 && !confirm("Would you like to remove " + '"'+ productTitle + '"' + " from your cart?")){
            return;
          }
          removeProduct();
    }}>
      -
    </Button>
  );
}

function IncreaseCountButton({addProduct}: {addProduct: () => void}) {
  return (
    <Button variant="link" 
        className="no-underline hover:no-underline cursor-pointer"
        onClick={() => {
        addProduct();
    }}>
      +
    </Button>
  );
}