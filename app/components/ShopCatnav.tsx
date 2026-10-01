import Link from "next/link";
import { cn } from "cn";
import type { Category } from "../types";
import { buildHref } from "../lib/utils";
import { buttonVariants } from "./ui/button";
import { ButtonGroup } from "./ui/button-group";
import { SheetClose } from "./ui/sheet";

export default function CatNav({
  categories,
  category,
  page,
  closeOnSelect = false,
  className,
}: {
  categories: Category[];
  category?: string;
  page: string;
  closeOnSelect?: boolean;
  className?: string;
}) {
  // one link renderer; inside the sheet, the link itself becomes the close button
  const navLink = (
    key: string | number,
    href: string,
    cls: string,
    label: string,
    active = false
  ) => {
    const props = {
      scroll: false,
      href,
      className: cls,
      "aria-current": active ? ("true" as const) : undefined,
    };
    return closeOnSelect ? (
      <SheetClose key={key} nativeButton={false} render={<Link {...props} />}>
        {label}
      </SheetClose>
    ) : (
      <Link key={key} {...props}>
        {label}
      </Link>
    );
  };

  return (
    <nav aria-label="Product categories">
      <ButtonGroup orientation="vertical" className={className}>
        {navLink(
          "all",
          buildHref({ page, category }, { category: undefined, page: 1 }),
          cn(
            buttonVariants({ variant: "secondary", size: "lg" }),
            "justify-start text-base font-semibold"
          ),
          "Show all products",
          !category
        )}

        {categories.map((cat) =>
          navLink(
            cat.id,
            buildHref({ page, category }, { category: cat.slug, page: 1 }),
            cn(
              buttonVariants({ variant: category === cat.slug ? "default" : "outline" }),
              "justify-start"
            ),
            cat.name,
            category === cat.slug
          )
        )}
      </ButtonGroup>
    </nav>
  );
}