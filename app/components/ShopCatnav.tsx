// stock
import Link from "next/link";
import { cn } from "cn";
// inhouse
import type { Category } from "../types";
import { buildHref, type Filters } from "../lib/utils";
// shad
import { buttonVariants } from "./ui/button";
import { ButtonGroup } from "./ui/button-group";
import { SheetClose } from "./ui/sheet";
import { Fragment } from "react";

export default function CatNav({
  categories,
  category,
  groupedCategory,
  filters,
  closeOnSelect = false,
  className,
  groupedCategories
}: {
  categories: Category[];
  category?: string;
  groupedCategory?: string;
  filters: Filters;
  closeOnSelect?: boolean;
  className?: string;
  groupedCategories: { name: string; categories: Category[] }[];
}) {
  // "all" is just a category with no slug
  const items: {id: number | string; key: string | number; slug?: string; name: string }[] = [
    ...categories.map((c) => ({id: c.id, key: c.id, slug: c.slug, name: c.name })),
  ];

  const selected = category || groupedCategory || undefined; // normalise "" to undefined

  const allProductsOption = { id: "all", key: "all", slug: undefined, name: "All products" };
  const active = selected === allProductsOption.slug;
  const allProductsOptionProps = {
    scroll: false,
    "data-slot": "button",
    href: buildHref({ }, { category: allProductsOption.slug, page: 1 }),
    className: cn(
      buttonVariants({ variant: active ? "default" : "outline", size: "lg" }),
      "justify-start",
      active && "border-primary"
    ),
    "aria-current": active ? ("true" as const) : undefined,
  }

  return (
    <nav aria-label="Product categories">
      <ButtonGroup orientation="vertical" className={className}>
        {closeOnSelect ? (
              <SheetClose key={allProductsOption.key} nativeButton={false} render={<Link {...allProductsOptionProps} key={allProductsOption.key} />}>
                {allProductsOption.name}
              </SheetClose>
            ) : (
              <Link key={allProductsOption.key} {...allProductsOptionProps}>
                {allProductsOption.name}
              </Link>
            )}
        {groupedCategories.map(({ name, categories: subCategories }) => {
          const active = selected === name;

          const props = {
            scroll: false,
            "data-slot": "button",
            href: buildHref({ }, { ...filters, groupedCategory: encodeURIComponent(name), page: 1, category: "",q:"" }),
            className: cn(
              buttonVariants({ variant: active ? "default" : "outline" }),
              "justify-start",
              active && "border-primary"
            ),
            "aria-current": active ? ("true" as const) : undefined,
          }
          return <Fragment key={name}> 
          {closeOnSelect ? (
              <SheetClose key={name} nativeButton={false} render={<Link key={name} {...props} />}>
                {name}
              </SheetClose>
            ) : (
              <Link key={name} {...props}>
                {name}
              </Link>
            )
          } 
          {subCategories.map(({ id }) => {
            const category = items.find((c) => c.id == id)!;
            const { key, slug, name } = category;
            const active = selected === slug;

            const props = {
            scroll: false,
            "data-slot": "button",
            href: buildHref({ }, {...filters, category: slug, page: 1, groupedCategory:"", q:"" }),
            className: cn(
              buttonVariants({ variant: active ? "default" : "outline", size: "lg" }),
              "justify-start",
              active && "border-primary",
              "pl-6"
            ),
            "aria-current": active ? ("true" as const) : undefined,
          }

              return closeOnSelect ? (
              <SheetClose key={key} nativeButton={false} render={<Link key={key} {...props} />}>
                {name}
              </SheetClose>
            ) : (
              <Link key={key} {...props}>
                {name}
              </Link>
            )
          })}
          </Fragment>
        })}

      </ButtonGroup>
    </nav>
  );
}