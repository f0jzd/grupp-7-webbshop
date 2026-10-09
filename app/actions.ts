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

  // Reset cache for both homepage and admin page
  revalidatePath("/admin-page");
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

  const productId = formdata.get("productId")?.toString();

  const title = formdata.get("title") as string;
  const price = formdata.get("price") as string;
  const description = formdata.get("description") as string;
  const thumbnail = formdata.get("thumbnail") as string;
  const categoryId = formdata.get("categoryId") as string;
  const brand = formdata.get("brand") as string;
  const stock = formdata.get("stock") as string;

  const availabilityStatus = getStockStatus(parseInt(stock, 10));

  const productData = {
    title,
    price: parseInt(price, 10),
    description,
    thumbnail,
    categoryId: parseInt(categoryId, 10),
    brand,
    stock,
    availabilityStatus,
    meta: {
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    images: thumbnail ? [thumbnail] : [],
  };

  if (productId) {
    // 1. UPDATE an existing product
    const { error } = await supabase
      .from("products")
      .update(productData)
      .eq("id", parseInt(productId, 10));
    if (error) throw new Error(`Failed to update product: ${error.message}`);
  } else {
    // 2. INSERT a brand new product
    const { error } = await supabase
      .from("products")
      .insert(productData);
  }

  // Clear cache for both pages
  revalidatePath("/admin-page");
  revalidatePath("/");
}