"use client";
import { createContext } from "react";
import { Product } from "./types";

export const CartContext = createContext<{cart:Product[]; addProductToCart: (product:Product) => void;
    removeProductFromCart: (product:Product) => void}>
    ({cart:[], addProductToCart: () => null,removeProductFromCart: () => null});