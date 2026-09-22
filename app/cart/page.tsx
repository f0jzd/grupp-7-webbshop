import { Product } from '@/types'
import { cookies } from 'next/headers'
import RemoveFromCartButton from './RemoveFromCartButton'

export default async function Cart() {
  const cookieStore = await cookies()
  const cartString = cookieStore.get('cart')?.value

  if(!cartString){
    return <div>Cart empty</div>
  }

  const cart:Product[] = JSON.parse(cartString);

  if(!cart.length){
    return <div>Cart empty</div>
  }

  const cartWithCount = cart.reduce<(Product & {count: number})[]>((arr, product) => {
    const existing = arr.find(v => v.id === product.id);
    if(existing){
        existing.count += 1;
    }else{
        arr.push({...product,count:1});
    }
    return arr;
  }, [])

  return (
    <div>
        <h1>
            Cart
      </h1>
      <ul>
        {cartWithCount.map((item) => <li>
            {item.thumbnail}
            {item.title}
            {item.count}
            <RemoveFromCartButton removeId={item.id}/>
        </li>)}
      </ul>
    </div>
  );
}