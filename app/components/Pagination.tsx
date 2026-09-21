import { ProductsResponse } from "@/types";
import Link from "next/link";

type PaginationProps = Omit<ProductsResponse, "products" | "stats"> & {
  urlParams: URLSearchParams;
};

export const Pagination = ({ page, pages, urlParams }: PaginationProps) => {
  const getPageUrl = (pageNumber: number) => {
    urlParams.set("page", String(pageNumber));

    return `?${urlParams.toString()}`;
  };

  const start = Math.max(2, page - 2);
  const end = Math.min(pages - 1, page + 2);

  const visiblePages = [];

  for (let i = start; i <= end; i++) {
    visiblePages.push(i);
  }

  const buttonStyle =
    "w-10 h-10 rounded border border-gray-300 font-bold hover:bg-neutral-500 hover:text-white";

  return (
    <nav className="bg-neutral-50 py-4 flex gap-2 text-neutral-500 justify-center items-center">
      <Link
        href={page > 1 ? getPageUrl(page - 1) : "#"}
        aria-disabled={page === 1}
        className={`${buttonStyle} flex items-center justify-center bg-white${
          page === 1 ? "pointer-events-none opacity-50" : ""
        }`}
      >
        <span className="material-symbols material-symbols-filled text-3xl h-10">
          chevron_left
        </span>
      </Link>

      <div className="flex justify-center gap-2">
        <Link
          href={getPageUrl(1)}
          className={`${buttonStyle} flex items-center justify-center ${
            page === 1 ? "bg-neutral-500 text-white" : "bg-white"
          }`}
        >
          1
        </Link>

        {start > 2 && (
          <span className="flex w-2 sm:w-8 items-center justify-center">
            ...
          </span>
        )}

        {visiblePages.map((pageNr) => (
          <Link
            key={pageNr}
            href={getPageUrl(pageNr)}
            className={`${buttonStyle} items-center justify-center  sm:flex ${
              pageNr === page
                ? "bg-neutral-500 text-white flex"
                : "hidden bg-white"
            } `}
          >
            {pageNr}
          </Link>
        ))}

        {end < pages - 1 && (
          <span className="flex w-2 sm:w-8 items-center justify-center">
            ...
          </span>
        )}

        {pages > 1 && (
          <Link
            href={getPageUrl(pages)}
            className={`${buttonStyle} flex items-center justify-center ${
              page === pages ? "bg-neutral-500 text-white" : "bg-white"
            }`}
          >
            {pages}
          </Link>
        )}
      </div>

      <Link
        href={page < pages ? getPageUrl(page + 1) : "#"}
        aria-disabled={page === pages}
        className={`${buttonStyle} flex items-center justify-center bg-white ${
          page === pages ? " pointer-events-none opacity-50" : ""
        }`}
      >
        <span className="material-symbols material-symbols-filled text-3xl">
          chevron_right
        </span>
      </Link>
    </nav>
  );
};
