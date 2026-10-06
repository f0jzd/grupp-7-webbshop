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

export default function CatNav({
  categories,
  category,
  filters,
  closeOnSelect = false,
  className,
}: {
  categories: Category[];
  category?: string;
  filters: Filters;
  closeOnSelect?: boolean;
  className?: string;
}) {
  // "all" is just a category with no slug
  const items: { key: string | number; slug?: string; name: string }[] = [
    { key: "all", slug: undefined, name: "All products" },
    ...categories.map((c) => ({ key: c.id, slug: c.slug, name: c.name })),
  ];

  const selected = category || undefined; // normalise "" to undefined

  return (
    <nav aria-label="Product categories">
      <ButtonGroup orientation="vertical" className={className}>
        {items.map(({ key, slug, name }) => {
          const active = selected === slug;

          const props = {
            scroll: false,
            "data-slot": "button",
            href: buildHref(filters, { category: slug, page: 1 }),
            className: cn(
              buttonVariants({ variant: active ? "default" : "outline", size: "lg" }),
              "justify-start",
              active && "border-primary"
            ),
            "aria-current": active ? ("true" as const) : undefined,
          }

          // inside the sheet, the link itself becomes the close button
          return closeOnSelect ? (
            <SheetClose key={key} nativeButton={false} render={<Link {...props} />}>
              {name}
            </SheetClose>
          ) : (
            <Link key={key} {...props}>
              {name}
            </Link>
          );
        })}
      </ButtonGroup>
    </nav>
  );
}