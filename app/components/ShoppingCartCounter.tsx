"use client"
import { Product } from '@/types';
import { useEffect, useState } from 'react';

export default function ShoppingCartCounter({cart: initialCart}: {cart:Product[]}){
    const [cart, setCart] = useState(initialCart.map(v => v.id))
    useEffect(() => {
        document.addEventListener("cart-updated", () => {
            const cartCookie =  document.cookie.split(";").map(v => v.trim()).find(v => v.startsWith("cart="))!.split("cart=")[1]
            const cart:number[] = JSON.parse(decodeURIComponent(cartCookie));
            setCart(cart)
        })
    },[])
    return <div className='flex items-center gap-1 cursor-pointer w-min'>
        <svg xmlns="http://www.w3.org/2000/svg"
     viewBox="0 0 24 24" width="24" height="24"
      fill="none" stroke="#000000" strokeWidth="2"
       strokeLinecap="round" strokeLinejoin="round">
        <circle cx="8" cy="21" r="1"/>
        <circle cx="19" cy="21" r="1"/>
        <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/>
        </svg>
        {cart.length}
        </div>
}