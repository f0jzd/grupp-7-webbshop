"use client";
import { createContext, Dispatch, SetStateAction } from "react";
import { Product } from "./types";

export const CartContext = createContext<{cart:Product[]; setCart: Dispatch<SetStateAction<Product[]>>}>({cart:[], setCart: () => null});