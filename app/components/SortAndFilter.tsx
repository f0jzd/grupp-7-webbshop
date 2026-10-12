"use client";

import { useRouter, useSearchParams } from "next/navigation";
import {Checkbox} from "@/components/ui/checkbox";
import {Label} from "@/components/ui/label";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import { Field } from "./ui/field";

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

  const sortItems = [
  { label: "Title", value: "title" },
  { label: "Price", value: "price" },
  { label: "Rating", value: "rating" },
  { label: "Discount", value: "discountPercentage" },
]

  return (
    <div
                        key={`${sort}-${order}-${inStock}-${onSale}`}
                        className="flex flex-col items-start gap-4 pt-2 sm:flex-row sm:flex-wrap "
                      >
                        {/* sort by */}
                        <fieldset>
                          <legend className="font-medium">Sort by</legend>
                          <div className="flex flex-col mt-1.5">
                            <Select 
                              id="sort"
                              name="sort"
                              items={sortItems}
                              defaultValue={sort || "title"}
                              onValueChange={v => {
                                updateParams("sort", v!, v === "title");
                              }}>
                                  <SelectTrigger >
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectGroup>
                                    {sortItems.map((item) => (
                                      <SelectItem key={item.value} value={item.value}>
                                        {item.label}
                                      </SelectItem>
                                    ))}
                                  </SelectGroup>
                                  </SelectContent>
                            </Select>
                          </div>
                        </fieldset>

                        {/* order choice*/}
                        <fieldset>
                          <legend className="font-medium">Order</legend>
                          <div className="flex flex-col mt-1.5">
                            <RadioGroup onValueChange={(v) => updateParams("order", v)} defaultValue={order ?? "asc"} className="w-fit flex flex-col gap-2">
                            <div className="flex items-center gap-3">
                              <RadioGroupItem value="asc" id="asc" />
                              <Label htmlFor="asc">Ascending</Label>
                            </div>
                            <div className="flex items-center gap-3">
                              <RadioGroupItem value="desc" id="desc" />
                              <Label htmlFor="desc">Descending</Label>
                            </div>
                          </RadioGroup>
                          </div>
                        </fieldset>

                        {/* Show only*/}
                        <fieldset>
	<legend className="font-medium">Show only</legend>
                        <div className="flex flex-col ">
                          <div className="flex flex-col gap-2 mt-1.5">
                            <Field orientation="horizontal">
                              <Checkbox defaultChecked={inStock === "1"} onCheckedChange={(v) => updateParams("inStock", Number(v).toString(), !v)} id="in-stock-checkbox" name="in-stock-checkbox" />
                              <Label htmlFor="in-stock-checkbox">In stock</Label>
                            </Field>
                            <Field orientation="horizontal">
                              <Checkbox defaultChecked={onSale === "1"} onCheckedChange={(v) => updateParams("onSale", Number(v).toString(), !v)} id="on-sale-checkbox" name="on-sale-checkbox" />
                              <Label htmlFor="on-sale-checkbox">On sale</Label>
                            </Field>
                            </div>
                        </div>
                        </fieldset>
                      </div>
  );
}