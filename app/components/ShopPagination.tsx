"use client";

import { useTransition, useOptimistic, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { buildHref, getPageRange, Filters } from "@/lib/utils";

export default function ShopPagination({
  currentPage,
  totalPages,
  filters,
  className = "",
}: {
  currentPage: number;
  totalPages: number;
  filters: Filters;
  className?: string;
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  // React 19 standard for optimistic transitions
  const [optimistic, setOptimistic] = useOptimistic(
    { page: currentPage, dir: null as "prev" | "next" | null },
    (_current, update: { page: number; dir?: "prev" | "next" | null }) => ({
      page: update.page,
      dir: update.dir ?? null,
    })
  );

  const hrefFor = (page: number) => buildHref(filters, { page });
  const range = getPageRange(currentPage, totalPages);

  // Prefetch pages so navigation is instant
  useEffect(() => {
    const pagesToPrefetch = getPageRange(currentPage, totalPages);
    pagesToPrefetch.forEach((p) => {
      if (typeof p === "number") {
        router.prefetch(buildHref(filters, { page: p }));
      }
    });
    if (currentPage > 1) router.prefetch(buildHref(filters, { page: currentPage - 1 }));
    if (currentPage < totalPages) router.prefetch(buildHref(filters, { page: currentPage + 1 }));
  }, [currentPage, totalPages, filters, router]);

  const navigateTo = (e: React.MouseEvent, page: number, dir?: "prev" | "next") => {
    e.preventDefault();
    if (page === currentPage) return;

    startTransition(() => {
      setOptimistic({ page, dir });
      router.push(hrefFor(page), { scroll: false });
    });
  };

  return (
    <Pagination className={`${className} ${isPending ? "opacity-70 transition-opacity" : ""}`}>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            href={currentPage > 1 ? hrefFor(currentPage - 1) : undefined}
            aria-disabled={currentPage <= 1 || isPending}
            isActive={optimistic.dir === "prev"}
            onClick={(e) => {
              if (currentPage > 1) navigateTo(e, currentPage - 1, "prev");
            }}
            onMouseEnter={() => {
              if (currentPage > 1) router.prefetch(hrefFor(currentPage - 1));
            }}
          />
        </PaginationItem>

        {range.map((p, idx) =>
          p === "ellipsis" ? (
            <PaginationItem key={`ellipsis-${idx}`}>
              <PaginationEllipsis />
            </PaginationItem>
          ) : (
            <PaginationItem key={p}>
              <PaginationLink
                href={hrefFor(p)}
                isActive={p === optimistic.page}
                onClick={(e) => navigateTo(e, p)}
                onMouseEnter={() => router.prefetch(hrefFor(p))}
              >
                {p}
              </PaginationLink>
            </PaginationItem>
          )
        )}

        <PaginationItem>
          <PaginationNext
            href={currentPage < totalPages ? hrefFor(currentPage + 1) : undefined}
            aria-disabled={currentPage >= totalPages || isPending}
            isActive={optimistic.dir === "next"}
            onClick={(e) => {
              if (currentPage < totalPages) navigateTo(e, currentPage + 1, "next");
            }}
            onMouseEnter={() => {
              if (currentPage < totalPages) router.prefetch(hrefFor(currentPage + 1));
            }}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}