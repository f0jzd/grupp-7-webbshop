"use server";

import { revalidatePath } from "next/cache";
import { supabase } from "./lib/supabase";

export async function deleteProduct(id: number) {
 
  //Finds the row corresponding to the passed id and deletes it.
  const{error} = await supabase 
  .from("products")
  .delete()
  .eq("id",id);// SQL: DELETE FROM products WHERE id = id


  if (error){
    return {message:`Failed to delete: ${error.message}`};
  }

  //Reset cache
  revalidatePath("/");
}

export async function addProductAction(formdata: FormData) {
  const getStockStatus = (stockNum: number): string => {
    if (stockNum <= 0) {
      return "Out of Stock";
    } else if (stockNum < 10) {
      return "Low Stock";
    }
    return "In Stock";
  };

  const PRODUCTS_URL = "http://localhost:4000/products";
  const productId = formdata.get("productId")?.toString();

  const title = formdata.get("title") as string;
  const price = formdata.get("price") as string;
  const description = formdata.get("description") as string;
  const thumbnail = formdata.get("thumbnail") as string;
  const categoryId = formdata.get("categoryId") as string;
  const brand = formdata.get("brand") as string;
  const stock = formdata.get("stock") as string;

  const availabilityStatus = getStockStatus(parseInt(stock, 10));

  const newProduct = {
    title,
    price: parseInt(price, 10),
    description,
    thumbnail,
    categoryId: parseInt(categoryId, 10),
    brand,
    stock,
    availabilityStatus,
  };

  try {
    const request = new Request(
      productId ? `${PRODUCTS_URL}/${productId}` : PRODUCTS_URL,
      {
        method: productId ? "PATCH" : "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newProduct),
      },
    );

    const response = await fetch(request);

    if (!response.ok) {
      throw new Error(`API returned ${response.status} ${response.statusText}`);
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    throw new Error(`Failed to create product: ${message}`);
  }

  revalidatePath("/");
}