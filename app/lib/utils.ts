import { Product } from "@/types";

// adapted from (2024) https://jsdev.space/snippets/debounce-ts/
export function debounce<T extends unknown[], U>(
  callback: (...args: T) => U,
  delay: number,
) {
  let timer: ReturnType<typeof setTimeout> | undefined;
  return (...args: T) => {
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => callback(...args), delay);
  };
}

export function isValidRegExp(pattern: string): boolean {
  try {
    RegExp(pattern);
  } catch {
    return false;
  }
  return true;
}

export function createUrlSearchParams(searchParams: {
  [key: string]: string | undefined;
}): URLSearchParams {
  const urlParams = new URLSearchParams();
  Object.entries(searchParams).map((entry) => {
    const [key, value] = entry;
    if (value) {
      urlParams.set(key, value);
    }
  });
  return urlParams;
}

export function addProductToCart(item: Product){
  const cart = localStorage.getItem("shopping-cart");
  const updatedCart: Product[] = cart ? JSON.parse(cart) : [];
  updatedCart.push(item);
  localStorage.setItem("shopping-cart", JSON.stringify(updatedCart));
  const event = new CustomEvent("item-added-to-cart", {detail:item});
  document.dispatchEvent(event);
}

export function removeItemFromCart(item: Product){
  const cart = localStorage.getItem("shopping-cart");
  const updatedCart: Product[] = cart ? JSON.parse(cart) : [];
  updatedCart.filter(_item => _item.id !== item.id);
  localStorage.setItem("shopping-cart", JSON.stringify(updatedCart));
  const event = new CustomEvent("item-removed-from-cart", {detail:item.id});
  document.dispatchEvent(event);
}

export function clearCart(){
  localStorage.setItem("shopping-cart", JSON.stringify([]));
  const event = new CustomEvent("clear-cart");
  document.dispatchEvent(event);
}