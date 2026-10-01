// shadcn
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
// inhouse
import { buildHref, getPageRange, Filters } from "@/lib/utils";


export default function ShopPagination({
  currentPage, totalPages, filters, className = "",
}: { currentPage: number; totalPages: number; filters: Filters; className?: string}) {
  const hrefFor = (page: number) => buildHref(filters, { page });

  return (
    <Pagination className={className}>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            href={currentPage > 1 ? hrefFor(currentPage - 1) : undefined}
            aria-disabled={currentPage <= 1}
          />
        </PaginationItem>

        {getPageRange(currentPage, totalPages).map((p, idx) =>
          p === "ellipsis" ? (
            <PaginationItem key={`ellipsis-${idx}`}>
              <PaginationEllipsis />
            </PaginationItem>
          ) : (
            <PaginationItem key={p}>
              <PaginationLink href={hrefFor(p)} isActive={p === currentPage}>
                {p}
              </PaginationLink>
            </PaginationItem>
          )
        )}

        <PaginationItem>
          <PaginationNext
            href={currentPage < totalPages ? hrefFor(currentPage + 1) : undefined}
            aria-disabled={currentPage >= totalPages}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}