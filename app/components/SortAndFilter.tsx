"use client";

import { useRef, useState, useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Modal } from "@/components/Modal";
import Link from "next/link";
import { updateFilter } from "@/utils/updateFilter";

export function SortFilter({sort, order, inStock, onSale}: {
    sort?: string; order?: string
    inStock?: string; onSale?: string
}) {
  const router = useRouter();

  const searchParams = useSearchParams();
  const params = new URLSearchParams(searchParams.toString());
  params.delete("page");

  const updateParams = (param: string, value:string, remove?: boolean) => {
    if(!remove){
        params.set(param, value);
    }else{
        params.delete(param);
    }
    router.replace(`/?${params.toString()}`);
  }

  return (
    <div
                        key={`${sort}-${order}-${inStock}-${onSale}`}
                        className="flex flex-col gap-4 pt-2 sm:flex-row sm:flex-wrap sm:items-end"
                      >
                        {/* sort by */}
                        <div className="flex flex-col gap-1.5 self-start">
                          <label htmlFor="sort" className="text-sm font-medium">
                            Sort by
                          </label>
                          <select
                            id="sort"
                            name="sort"
                            defaultValue={sort ?? ""}
                            onChange={(e) => updateParams("sort", e.target.value)}
                            className="h-8 rounded-lg border border-input bg-transparent px-2.5 text-sm"
                          >
                            <option value="">Title</option>
                            <option value="price">Price</option>
                            <option value="rating">Rating</option>
                            <option value="discountPercentage">Discount</option>
                          </select>
                        </div>
                        {/* order choice*/}
                        <fieldset className="flex flex-col gap-1.5">
                          <legend className="text-sm font-medium">Order</legend>
                          <label className="flex items-center gap-1.5">
                            <input
                              type="radio"
                              name="order"
                              value="asc"
                              defaultChecked={order !== "desc"}
                              onChange={(e) => updateParams("order", "asc")}
                              className="accent-primary"
                            />
                            Ascending
                          </label>
                          <label className="flex items-center gap-1.5">
                            <input
                              type="radio"
                              name="order"
                              value="desc"
                              defaultChecked={order === "desc"}
                              onChange={(e) => updateParams("order", "desc")}
                              className="accent-primary"
                            />
                            Descending
                          </label>
                        </fieldset>
                        {/* toggles */}
                        <fieldset className="flex flex-col gap-1.5">
                          <legend className="text-sm font-medium">
                            Show only
                          </legend>
                          <label className="flex items-center gap-1.5">
                            <input
                              type="checkbox"
                              name="inStock"
                              value="1"
                              defaultChecked={inStock === "1"}
                              onChange={(e) => updateParams("inStock", Number(e.target.checked).toString(), !e.target.checked)}
                              className="accent-primary"
                            />
                            In stock
                          </label>
                          <label className="flex items-center gap-1.5">
                            <input
                              type="checkbox"
                              name="onSale"
                              value="1"
                              defaultChecked={onSale === "1"}
                              onChange={(e) => updateParams("onSale", Number(e.target.checked).toString(), !e.target.checked)}
                              className="accent-primary"
                            />
                            On sale
                          </label>
                        </fieldset>
                      </div>
  );
}