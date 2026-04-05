import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

type DonationPaginationProps = {
  page: number;
  totalCount: number;
  limit: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  onPageChange: (page: number) => void;
};

export function DonationPagination({
  page,
  totalCount,
  limit,
  hasNextPage,
  hasPreviousPage,
  onPageChange,
}: DonationPaginationProps) {
  const totalPages = Math.ceil(totalCount / limit);
  const start = (page - 1) * limit + 1;
  const end = Math.min(page * limit, totalCount);

  return (
    <div className="flex flex-col items-center justify-between gap-4 mt-6">
      <p className="text-sm text-muted-foreground">
        Showing <span className="font-semibold text-foreground">{start}</span> to{" "}
        <span className="font-semibold text-foreground">{end}</span> of{" "}
        <span className="font-semibold text-foreground">{totalCount}</span> donations
      </p>
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              onClick={() => hasPreviousPage && onPageChange(page - 1)}
              className={hasPreviousPage ? "cursor-pointer" : "opacity-50 cursor-not-allowed"}
            />
          </PaginationItem>
          {page > 2 && (
            <>
              <PaginationItem>
                <PaginationLink onClick={() => onPageChange(1)}>1</PaginationLink>
              </PaginationItem>
              {page > 3 && <PaginationEllipsis />}
            </>
          )}
          {page > 1 && (
            <PaginationItem>
              <PaginationLink onClick={() => onPageChange(page - 1)}>
                {page - 1}
              </PaginationLink>
            </PaginationItem>
          )}
          <PaginationItem>
            <PaginationLink isActive>{page}</PaginationLink>
          </PaginationItem>
          {page < totalPages && (
            <PaginationItem>
              <PaginationLink onClick={() => onPageChange(page + 1)}>
                {page + 1}
              </PaginationLink>
            </PaginationItem>
          )}
          {page < totalPages - 2 && <PaginationEllipsis />}
          {page < totalPages - 1 && (
            <PaginationItem>
              <PaginationLink onClick={() => onPageChange(totalPages)}>
                {totalPages}
              </PaginationLink>
            </PaginationItem>
          )}
          <PaginationItem>
            <PaginationNext
              onClick={() => hasNextPage && onPageChange(page + 1)}
              className={hasNextPage ? "cursor-pointer" : "opacity-50 cursor-not-allowed"}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
}
