import Cart from './Cart'

export default async function CartPage() {
  return (
   <div className="m-auto max-w-150">
      <h1 className="font-bold text-xl mb-4">Your cart</h1>
      <Cart/>
</div>
  );
}