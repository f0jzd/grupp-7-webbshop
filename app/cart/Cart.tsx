"use client";
import { Metadata } from 'next'
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
import Link from 'next/link'
import { useContext } from 'react'
import { CartContext } from '@/CartContext'
import { Button } from '@/components/ui/button'

export default function Cart() {

  const {cart: products, addProductToCart: addProduct, removeProductFromCart: removeProduct} = useContext(CartContext);

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
      {products.length === 0 ? (
        <p>Cart empty</p>
      ) : (
        <div>
          <Table className="table-fixed w-full">
            <TableHeader>
              <TableRow>
                <TableHead className="text-left pb-2 flex items-center justify-between"><p>Product</p><p >Amount</p></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className="w-full">
              {cartWithCount.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="h-24 text-left pt-2">
                    <div className="flex items-center gap-2">
                      <Link href={"/product/"+encodeURIComponent(item.title)} >
                        <Image
                          alt={item.title}
                          width={70}
                          height={70}
                          src={item.thumbnail}
                        />
                      </Link>
                      <div>
                      <Link href={"/product/"+encodeURIComponent(item.title)} >
                        <p >{item.title}</p>
                      </Link>
                        <p className='text-gray-500' >{item.sku}</p>
                        <p className='text-gray-500' >{item.shippingInformation}</p>
                      </div>
                      <div className='ml-auto'>{item.price.toFixed(2)}$</div>
                    </div>
                    <div className="flex justify-end items-center gap-1 mt-2">
                      <RemoveFromCartButton product={item} productTitle={item.title} count={item.count} removeProduct={removeProduct} />
                      <p>{item.count}</p>
                      <IncreaseCountButton addProduct={addProduct} product={item} />
                      <p className="ml-4">{(item.price * item.count).toFixed(2)}$</p>
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
                {(products.reduce((prev, v) => prev + v.price, 0)).toFixed(2)}$
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


function RemoveFromCartButton({product, count,productTitle, removeProduct}: {product: Product; count:number; productTitle: string; removeProduct: (product: Product) => void}) {
  return (
    <Button variant="link" 
        className="no-underline hover:no-underline cursor-pointer"
        onClick={() => {
          if(count === 1 && !confirm("Would you like to remove " + '"'+ productTitle + '"' + " from your cart?")){
            return;
          }
          removeProduct(product);
    }}>
      -
    </Button>
  );
}

function IncreaseCountButton({product,addProduct}: {product: Product; addProduct: (product: Product) => void}) {
  return (
    <Button variant="link" 
        className="no-underline hover:no-underline cursor-pointer"
        onClick={() => {
        addProduct(product);
    }}>
      +
    </Button>
  );
}